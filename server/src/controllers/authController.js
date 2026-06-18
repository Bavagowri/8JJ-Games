
// server/src/controllers/authController.js

import bcrypt from "bcrypt";
import crypto from "crypto";
import axios from "axios";
import { OAuth2Client } from "google-auth-library";
import { db } from "../db/index.js";
import { generateJwt, generateEmailToken } from "../utils/token.js";
import { sendVerificationEmail } from "../utils/email.js";
import { sendResetPasswordEmail } from "../utils/email.js";
import { awardRegistrationBonus, awardPoints, awardReferralSignup } from "../services/points.service.js";
import { generateReferralCode } from "../utils/referralCode.js";


import appleSigninAuth from "apple-signin-auth";
import jwt from "jsonwebtoken";

/* ================= REGISTER ================= */
export async function register(req, res) {
  const { username, email, password, referralCode, country } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const cleanEmail = email.toLowerCase().trim();
  const cleanUsername = username;
  
  // 1️⃣ Check referrer
  let referredBy = null;
  if (referralCode) {
    const [ref] = await db.execute(
      "SELECT id FROM users WHERE referral_code = ?",
      [referralCode]
    );
    if (ref.length) referredBy = ref[0].id;
  }

  try {
    /* Check existing */
    const [existing] = await db.execute(
      "SELECT id FROM users WHERE email = ? OR username = ?",
      [cleanEmail, cleanUsername]
    );

    if (existing.length) {
      return res.status(409).json({ message: "User already exists" });
    }

    /* Hash password */
    const hash = await bcrypt.hash(password, 10);
    const myReferralCode = generateReferralCode(cleanUsername);

    /* Insert user */
   const [result] = await db.execute(
    `INSERT INTO users
     (username, email, password_hash, is_verified, referral_code, referred_by, country, provider)
     VALUES (?, ?, ?, FALSE, ?, ?, ?, ?)`,
    [cleanUsername, cleanEmail, hash, myReferralCode, referredBy, country || null, 'local']
  );

  const newUserId = result.insertId;

  // registration bonus
  const [log] = await db.execute(
    `
    INSERT INTO user_activity_log
    (user_id, activity_type, metadata)
    VALUES (?, ?, ?)
    `,
    [newUserId, "user_registration", JSON.stringify({ source: "signup" })]
  );

  /* Award registration points */
  await awardPoints({
    userId: newUserId,
    activityType: "user_registration",
    activityId: log.insertId
  });


  // 3️⃣ Award referral points (AFTER insert)
  if (referredBy) {
    // await awardPoints({
    //   userId: referredBy,
    //   activityType: "referral_signup",
    //   metadata: { email: cleanEmail }
    // });

    // await awardPoints({
    //   userId: newUserId,
    //   activityType: "referral_bonus_new_user"
    // });

    await awardReferralSignup(referredBy, { email: cleanEmail });
    await awardReferralBonusNewUser(newUserId);


    await db.execute(
      "UPDATE users SET referral_count = referral_count + 1 WHERE id = ?",
      [referredBy]
    );
  }

    /* Create email verification token */
    const token = generateEmailToken();
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

    await db.execute(
      `INSERT INTO email_verifications (user_id, token, expires_at)
       VALUES (?, ?, ?)`,
      [result.insertId, token, expires]
    );

    /* Send email */
    const link = `${process.env.BACKEND_URL}/api/auth/verify-email?token=${token}`;
    await sendVerificationEmail(cleanEmail, link);

    res.status(201).json({
      message: "Registration successful. Please verify your email."
    });

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
}

/* ================= GOOGLE LOGIN ================= */
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// export async function googleLogin(req, res) {
//   try {
//     const { accessToken, referralCode } = req.body;
//     console.log("Referral code:", referralCode);


//     if (!accessToken) {
//       return res.status(400).json({ message: "Missing access token" });
//     }

//     // Get Google user info
//     const googleRes = await axios.get(
//       "https://www.googleapis.com/oauth2/v3/userinfo",
//       {
//         headers: {
//           Authorization: `Bearer ${accessToken}`
//         }
//       }
//     );

//     const { email, name } = googleRes.data;

//     // Find or create user
//     const [rows] = await db.execute(
//       "SELECT * FROM users WHERE email = ?",
//       [email]
//     );

//     let user;

//     if (!rows.length) {
//       const username = name.replace(/\s+/g, "").toLowerCase();

//       let referredBy = null;

//       if (referralCode) {
//         const [ref] = await db.execute(
//           "SELECT id FROM users WHERE referral_code = ?",
//           [referralCode]
//         );
//         if (ref.length) referredBy = ref[0].id;
//       }

//       const myReferralCode = generateReferralCode(username);

//       const [result] = await db.execute(
//         `INSERT INTO users
//         (username, email, provider, is_verified, is_active, role, referral_code, referred_by)
//         VALUES (?, ?, 'google', TRUE, TRUE, 'user', ?, ?)`,
//         [username, email, myReferralCode, referredBy]
//       );
//       user = { id: result.insertId, email, role: "user", is_active: true };

//       // 🎁 Award referral ONCE
//       if (referredBy) {
//   await awardReferralSignup(referredBy, email);
// }



//       user = { id: result.insertId, email, role: "user" };
//     } else {
//       user = {
//         id: rows[0].id,
//         email: rows[0].email,
//         role: rows[0].role || "user"
//       };
//     }

//     const token = generateJwt(user);
//     res.json({ token });

//   } catch (err) {
//     console.error("GOOGLE LOGIN ERROR:", err);
//     res.status(401).json({ message: "Google authentication failed" });
//   }
// }
export async function googleLogin(req, res) {
  try {
    const { accessToken, referralCode } = req.body;
    // console.log("📥 Google signup referral code:", referralCode);

    if (!accessToken) {
      return res.status(400).json({ message: "Missing access token" });
    }

    /* ================= GOOGLE USER INFO ================= */
    const googleRes = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: { Authorization: `Bearer ${accessToken}` }
      }
    );

    const { email, name } = googleRes.data;

    /* ================= CHECK EXISTING USER ================= */
    const [existingUsers] = await db.execute(
      "SELECT id, role FROM users WHERE email = ?",
      [email]
    );

    // 🔁 LOGIN FLOW (already exists)
    if (existingUsers.length) {
      const user = {
        id: existingUsers[0].id,
        email,
        role: existingUsers[0].role || "user"
      };

      const token = generateJwt(user);
      return res.json({ token });
    }

    /* ================= NEW USER SIGNUP ================= */
    const username = name.replace(/\s+/g, "").toLowerCase();
    const myReferralCode = generateReferralCode(username);

    let referredBy = null;

    if (referralCode) {
      const [ref] = await db.execute(
        "SELECT id FROM users WHERE referral_code = ?",
        [referralCode]
      );

      if (ref.length) {
        referredBy = ref[0].id;
        // console.log("✅ Valid referrer found:", referredBy);
      } else {
        // console.log("❌ Invalid referral code");
      }
    }

    const [insertResult] = await db.execute(
      `
      INSERT INTO users
      (username, email, provider, is_verified, is_active, role, referral_code, referred_by)
      VALUES (?, ?, 'google', TRUE, TRUE, 'user', ?, ?)
      `,
      [username, email, myReferralCode, referredBy]
    );

    const userId = insertResult.insertId;

    // registration bonus
    const [log] = await db.execute(
      `
      INSERT INTO user_activity_log
      (user_id, activity_type, metadata)
      VALUES (?, ?, ?)
      `,
      [userId, "user_registration", JSON.stringify({ source: "signup" })]
    );

    /* Award registration points */
    await awardPoints({
      userId: userId,
      activityType: "user_registration",
      activityId: log.insertId
    });

    /* ================= REFERRAL REWARD ================= */
    if (referredBy) {
      // console.log("🎁 Awarding referral signup points");
      // await awardReferralSignup(referredBy, email);
      await awardReferralSignup(referredBy, { email });

    }

    /* ================= ISSUE JWT ================= */
    const token = generateJwt({
      id: userId,
      email,
      role: "user"
    });

    res.json({ token });

  } catch (err) {
    console.error("❌ GOOGLE LOGIN ERROR:", err);
    res.status(401).json({ message: "Google authentication failed" });
  }
}

/* ================= APPLE LOGIN ================= */
// export async function appleLogin(req, res) {
//   console.log("🍎 Apple login hit");
//   try {
//     const { idToken, referralCode } = req.body;

//     const appleUser = await appleSigninAuth.verifyIdToken(idToken, {
//       audience: process.env.APPLE_CLIENT_ID,
//       ignoreExpiration: false
//     });

//     const { email, sub: appleId } = appleUser;

//     // 1️⃣ Check by apple_id first
//     const [existing] = await db.execute(
//       "SELECT id, email, apple_id, role FROM users WHERE apple_id = ?",
//       [appleId]
//     );

//     if (existing.length) {
//       const token = generateJwt({
//         id: existing[0].id,
//         email: existing[0].email,
//         role: existing[0].role || "user"
//       });
//       return res.json({ token });
//     }

//     // 2️⃣ If email exists but apple_id not linked
//     if (email) {
//       const [emailUser] = await db.execute(
//         "SELECT id, apple_id, role FROM users WHERE email = ?",
//         [email]
//       );

//       if (emailUser.length) {
//         await db.execute(
//           "UPDATE users SET apple_id = ?, provider = 'apple' WHERE id = ?",
//           [appleId, emailUser[0].id]
//         );

//         const token = generateJwt({
//           id: emailUser[0].id,
//           email,
//           role: emailUser[0].role || "user"
//         });

//         return res.json({ token });
//       }
//     }

//     // 3️⃣ Create new user
//     const username = email
//       ? email.split("@")[0]
//       : `apple_${appleId.slice(0, 8)}`;

//     const myReferralCode = generateReferralCode(username);

//     let referredBy = null;
//     if (referralCode) {
//       const [ref] = await db.execute(
//         "SELECT id FROM users WHERE referral_code = ?",
//         [referralCode]
//       );
//       if (ref.length) referredBy = ref[0].id;
//     }

//     const [result] = await db.execute(
//       `
//       INSERT INTO users
//       (username, email, provider, apple_id, is_verified, is_active, role, referral_code, referred_by)
//       VALUES (?, ?, 'apple', ?, TRUE, TRUE, 'user', ?, ?)
//       `,
//       [username, email || null, appleId, myReferralCode, referredBy]
//     );

//     if (referredBy) {
//       await awardReferralSignup(referredBy, email);
//     }

//     const token = generateJwt({
//       id: result.insertId,
//       email,
//       role: "user"
//     });

//     res.json({ token });

//   } catch (err) {
//     console.error("🍎 APPLE LOGIN ERROR:", err);
//     res.status(401).json({ message: "Apple authentication failed" });
//   }
// }

/* ================= APPLE LOGIN - SUPPORTS BOTH WEB & MOBILE ================= */
export async function appleLogin(req, res) {
  // console.log("🍎 Apple login hit");
  try {
    const { idToken, referralCode } = req.body;

    if (!idToken) {
      return res.status(400).json({ message: "Missing Apple token" });
    }

    let appleUser = null;

    // Try web audience first (your original one)
    try {
      appleUser = await appleSigninAuth.verifyIdToken(idToken, {
        audience: process.env.APPLE_WEB_CLIENT_ID,
        ignoreExpiration: false
      });
      // console.log("✅ Validated with WEB audience:", process.env.APPLE_WEB_CLIENT_ID);
    } catch (webErr) {
      // console.log(`Web audience failed: ${webErr.message}`);
    }

    // If web failed, try mobile audience
    if (!appleUser && process.env.APPLE_IOS_CLIENT_ID) {
      try {
        appleUser = await appleSigninAuth.verifyIdToken(idToken, {
          audience: process.env.APPLE_IOS_CLIENT_ID,
          ignoreExpiration: false
        });
        // console.log("✅ Validated with MOBILE audience:", process.env.APPLE_IOS_CLIENT_ID);
      } catch (iosErr) {
        // console.log(`Mobile audience failed: ${iosErr.message}`);
      }
    }

    // If neither audience worked, fail
    if (!appleUser) {
      throw new Error("Invalid token - no matching audience found");
    }

    const { email, sub: appleId } = appleUser;

    //  Check by apple_id first
    const [existing] = await db.execute(
      "SELECT id, email, apple_id, role FROM users WHERE apple_id = ?",
      [appleId]
    );

    if (existing.length) {
      const token = generateJwt({
        id: existing[0].id,
        email: existing[0].email,
        role: existing[0].role || "user"
      });
      return res.json({ token });
    }

    // 2️⃣ If email exists but apple_id not linked
    if (email) {
      const [emailUser] = await db.execute(
        "SELECT id, apple_id, role FROM users WHERE email = ?",
        [email]
      );
      if (emailUser.length) {
        await db.execute(
          "UPDATE users SET apple_id = ?, provider = 'apple' WHERE id = ?",
          [appleId, emailUser[0].id]
        );
        const token = generateJwt({
          id: emailUser[0].id,
          email,
          role: emailUser[0].role || "user"
        });
        return res.json({ token });
      }
    }

    // 3️⃣ Create new user
    const username = email
      ? email.split("@")[0]
      : `apple_${appleId.slice(0, 8)}`;
    const myReferralCode = generateReferralCode(username);
    let referredBy = null;
    if (referralCode) {
      const [ref] = await db.execute(
        "SELECT id FROM users WHERE referral_code = ?",
        [referralCode]
      );
      if (ref.length) referredBy = ref[0].id;
    }
    const [result] = await db.execute(
      `
      INSERT INTO users
      (username, email, provider, apple_id, is_verified, is_active, role, referral_code, referred_by)
      VALUES (?, ?, 'apple', ?, TRUE, TRUE, 'user', ?, ?)
      `,
      [username, email || null, appleId, myReferralCode, referredBy]
    );

    if (referredBy) {
      // await awardReferralSignup(referredBy, email);
      await awardReferralSignup(referredBy, { email });
    }

    const token = generateJwt({
      id: result.insertId,
      email,
      role: "user"
    });

    res.json({ token });

  } catch (err) {
    console.error("🍎 APPLE LOGIN ERROR:", err.message, err.stack);
    res.status(401).json({ message: `Apple authentication failed:  ${err.message}` });
  }
}



/* ================= LOGIN ================= */
const MAX_ATTEMPTS = 5;
const LOCK_MINUTES = 15;

export async function login(req, res) {
  const { email, password } = req.body;
  const cleanEmail = (email || "").toLowerCase().trim();

  try {
    const [rows] = await db.execute(
      "SELECT * FROM users WHERE email = ?",
      [cleanEmail]
    );

    // Do not reveal if user exists
    if (!rows.length) {
      return res.status(401).json({ message: "Invalid login credentials" });
    }

    const user = rows[0];

    /* BLOCK GOOGLE USERS */
    if (user.provider === "google") {
      return res.status(403).json({
        message: "This account uses Google sign-in. Please use the Google login button.",
        code: "GOOGLE_ACCOUNT"
      });
    }

    /*  CHECK IF ACCOUNT IS ACTIVE - BEFORE EVERYTHING ELSE */
    if (!user.is_active) {
      // console.log(`❌ Login attempt by inactive user: ${cleanEmail}`);
      return res.status(403).json({
        message: "Your account has been deactivated. Please contact support.",
        code: "ACCOUNT_INACTIVE"
      });
    }

    /* EMAIL VERIFICATION CHECK */
    if (!user.is_verified) {
      return res.status(403).json({
        message: "Please verify your email first",
        code: "EMAIL_NOT_VERIFIED"
      });
    }

    /* ACCOUNT LOCK CHECK */
    if (user.lock_until && new Date(user.lock_until) > new Date()) {
      return res.status(429).json({
        message: "Too many failed login attempts. Please try again later.",
        code: "ACCOUNT_LOCKED"
      });
    }

    /* PASSWORD CHECK */
    const valid = await bcrypt.compare(password, user.password_hash);

    if (!valid) {
      const nextAttempts = (user.failed_login_attempts || 0) + 1;

      if (nextAttempts >= MAX_ATTEMPTS) {
        await db.execute(
          `UPDATE users
           SET failed_login_attempts = ?, 
               lock_until = DATE_ADD(NOW(), INTERVAL ? MINUTE)
           WHERE id = ?`,
          [nextAttempts, LOCK_MINUTES, user.id]
        );

        return res.status(429).json({
          message: "Too many failed attempts. Account temporarily locked.",
          code: "ACCOUNT_LOCKED"
        });
      }

      await db.execute(
        "UPDATE users SET failed_login_attempts = ? WHERE id = ?",
        [nextAttempts, user.id]
      );

      return res.status(401).json({ 
        message: "Invalid login credentials",
        remainingAttempts: MAX_ATTEMPTS - nextAttempts
      });
    }

    /* SUCCESS — RESET COUNTERS */
    await db.execute(
      "UPDATE users SET failed_login_attempts = 0, lock_until = NULL WHERE id = ?",
      [user.id]
    );

    /* ISSUE JWT */
    const token = generateJwt(user);

    // ADD LOGIN POINTS
    // await awardLoginPoints(user.id);

    // console.log(`✅ Successful login + points: ${cleanEmail}`);
        
    res.json({ 
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    // console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error during login" });
  }
}

/* ================= VERIFY EMAIL ================= */
export async function verifyEmail(req, res) {
  const { token } = req.query;

  try {
    const [rows] = await db.execute(
      `SELECT * FROM email_verifications
       WHERE token = ? AND expires_at > NOW()`,
      [token]
    );

    if (!rows.length) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const { user_id } = rows[0];

    await db.execute(
      "UPDATE users SET is_verified = TRUE WHERE id = ?",
      [user_id]
    );

    await db.execute(
      "DELETE FROM email_verifications WHERE user_id = ?",
      [user_id]
    );

    // Redirect to frontend success page
    res.redirect(`${process.env.FRONTEND_URL}/email-verified`);

  } catch (err) {
    console.error("VERIFY EMAIL ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
}

/* ================= FORGOT PASSWORD ================= */
// export async function forgotPassword(req, res) {
//   const { email } = req.body;

//   try {
//     const [users] = await db.execute(
//       "SELECT id, is_active FROM users WHERE email = ?",
//       [email.toLowerCase()]
//     );

//     // IMPORTANT: don't reveal if user exists or if account is inactive
//     if (!users.length) {
//       return res.json({ message: "If the email exists, a reset link was sent." });
//     }

//     // Don't send reset emails to inactive accounts, but don't reveal this
//     if (!users[0].is_active) {
//       console.log(`⚠️ Password reset attempted for inactive account: ${email}`);
//       return res.json({ message: "If the email exists, a reset link was sent." });
//     }

//     const userId = users[0].id;
//     const token = generateEmailToken();
//     const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

//     await db.execute(
//       "INSERT INTO password_resets (user_id, token, expires_at) VALUES (?, ?, ?)",
//       [userId, token, expiresAt]
//     );

//     const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
//     await sendResetPasswordEmail(email, resetLink);

//     res.json({ message: "If the email exists, a reset link was sent." });
//   } catch (err) {
//     console.error("FORGOT PASSWORD ERROR:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// }

export async function forgotPassword(req, res) {
  try {
    const { email } = req.body;

    // Always return same message (anti-enumeration)
    const genericResponse = {
      message: "If the email exists, a reset link has been sent."
    };

    if (!email) {
      return res.json(genericResponse);
    }

    const cleanEmail = email.toLowerCase().trim();

    const [users] = await db.execute(
      "SELECT id, email FROM users WHERE email = ?",
      [cleanEmail]
    );

    if (!users.length) {
      return res.json(genericResponse);
    }

    const user = users[0];

    // 🔐 Generate secure token
    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    // ⏰ Token expiry (1 hour)
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    // 🧹 Invalidate old tokens
    await db.execute(
      "UPDATE password_resets SET used = 1 WHERE user_id = ?",
      [user.id]
    );

    // 💾 Store hashed token
    await db.execute(
      `INSERT INTO password_resets (user_id, token, expires_at)
       VALUES (?, ?, ?)`,
      [user.id, tokenHash, expiresAt]
    );

    // 🔗 Reset link (raw token sent to user)
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${rawToken}`;

    await sendResetPasswordEmail(user.email, resetLink);

    return res.json(genericResponse);

  } catch (err) {
    // console.error("FORGOT PASSWORD ERROR:", err);
    return res.json({
      message: "If the email exists, a reset link has been sent."
    });
  }
}


/* ================= RESET PASSWORD ================= */
// export async function resetPassword(req, res) {
//   const { token, password } = req.body;

//   try {
//     const [rows] = await db.execute(
//       "SELECT * FROM password_resets WHERE token = ? AND expires_at > NOW()",
//       [token]
//     );

//     if (!rows.length) {
//       return res.status(400).json({ message: "Invalid or expired token" });
//     }

//     const reset = rows[0];

//     //  Check if user account is still active
//     const [users] = await db.execute(
//       "SELECT is_active FROM users WHERE id = ?",
//       [reset.user_id]
//     );

//     if (!users.length || !users[0].is_active) {
//       return res.status(403).json({ 
//         message: "Account is not active. Please contact support.",
//         code: "ACCOUNT_INACTIVE"
//       });
//     }

//     const hash = await bcrypt.hash(password, 10);

//     await db.execute(
//       "UPDATE users SET password_hash = ?, failed_login_attempts = 0, lock_until = NULL WHERE id = ?",
//       [hash, reset.user_id]
//     );

//     // Invalidate token
//     await db.execute(
//       "DELETE FROM password_resets WHERE user_id = ?",
//       [reset.user_id]
//     );

//     console.log(`✅ Password reset successful for user ID: ${reset.user_id}`);

//     res.json({ message: "Password reset successful. You can now login." });
//   } catch (err) {
//     console.error("RESET PASSWORD ERROR:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// }
export async function resetPassword(req, res) {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        message: "Invalid or expired reset token"
      });
    }

    // 🔐 HASH incoming token (CRITICAL FIX)
    const tokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // 🔎 Find valid token
    const [rows] = await db.execute(
      `
      SELECT pr.id, pr.user_id
      FROM password_resets pr
      WHERE pr.token = ?
        AND pr.used = 0
        AND pr.expires_at > NOW()
      `,
      [tokenHash]
    );

    if (!rows.length) {
      return res.status(400).json({
        message: "Invalid or expired reset token"
      });
    }

    const resetRecord = rows[0];

    // 🔐 Hash new password
    const passwordHash = await bcrypt.hash(password, 10);

    // 🔄 Update user password
    await db.execute(
      "UPDATE users SET password_hash = ? WHERE id = ?",
      [passwordHash, resetRecord.user_id]
    );

    // 🚫 Mark token as used
    await db.execute(
      "UPDATE password_resets SET used = 1 WHERE id = ?",
      [resetRecord.id]
    );

    return res.json({
      message: "Password updated successfully"
    });

  } catch (err) {
    console.error("RESET PASSWORD ERROR:", err);
    return res.status(500).json({
      message: "Unable to reset password. Please try again."
    });
  }
}


/* ================= RESEND EMAIL VERIFICATION ================= */
export async function resendVerification(req, res) {
  const { email } = req.body;
  const cleanEmail = email.toLowerCase().trim();

  // Always return same message (anti-enumeration)
  const genericResponse = {
    message: "If this email exists, a verification link has been sent."
  };

  try {
    const [users] = await db.execute(
      "SELECT id, is_verified, is_active FROM users WHERE email = ?",
      [cleanEmail]
    );

    if (!users.length) {
      return res.json(genericResponse);
    }

    const user = users[0];

    if (user.is_verified) {
      return res.json(genericResponse);
    }

    //  Don't send verification to inactive accounts
    if (!user.is_active) {
      // console.log(`⚠️ Verification resend attempted for inactive account: ${cleanEmail}`);
      return res.json(genericResponse);
    }

    // Rate limit check
    const [recent] = await db.execute(
      `SELECT id FROM email_verifications 
       WHERE user_id = ? AND created_at > DATE_SUB(NOW(), INTERVAL 15 MINUTE)`,
      [user.id]
    );

    if (recent.length >= 3) {
      return res.status(429).json({
        message: "Too many requests. Please try again later."
      });
    }

    // Remove old tokens
    await db.execute(
      "DELETE FROM email_verifications WHERE user_id = ?",
      [user.id]
    );

    // Create new token
    const token = generateEmailToken();
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await db.execute(
      "INSERT INTO email_verifications (user_id, token, expires_at) VALUES (?, ?, ?)",
      [user.id, token, expires]
    );

    const link = `${process.env.BACKEND_URL}/api/auth/verify-email?token=${token}`;
    await sendVerificationEmail(cleanEmail, link);

    return res.json(genericResponse);
  } catch (err) {
    // console.error("RESEND VERIFICATION ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
}