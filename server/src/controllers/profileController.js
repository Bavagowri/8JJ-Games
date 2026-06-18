// server/src/controllers/profileController.js

import { db } from "../db/index.js";
import bcrypt from "bcrypt";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for avatar uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "../../uploads/avatars");
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `avatar-${req.user.id}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const fileFilter = (req, file, cb) => {
  // Accept images only
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

export const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: fileFilter
});

// ================= GET PROFILE =================
export async function getProfile(req, res) {
  try {
    const userId = req.user.id;

    const [rows] = await db.execute(
      `SELECT 
        id,
        username,
        email,
        about_me,
        interests,
        avatar,
        provider,
        points,
        level,
        tier,
        referral_code,
        country
      FROM users
      WHERE id = ?`,
      [userId]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "User not found" });
    }

    const [[gamesPlayed]] = await db.execute(
      `SELECT COUNT(*) AS total
      FROM user_activity_log
      WHERE user_id = ?
        AND activity_type = 'play_game'`,
      [userId]
    );

    const gamesPlayedCount = gamesPlayed.total;

    const [[playtime]] = await db.execute(
      `
      SELECT COALESCE(SUM(duration_seconds), 0) AS total
      FROM user_activity_log
      WHERE user_id = ?
        AND activity_type = 'play_game'
      `,
      [userId]
    );


    const totalHours = (playtime.total / 3600).toFixed(1);

    const profile = rows[0];

    // Parse interests if it's a JSON string
    if (profile.interests) {
      try {
        profile.interests = JSON.parse(profile.interests);
      } catch (e) {
        profile.interests = [];
      }
    } else {
      profile.interests = [];
    }

    // Get user stats (for future implementation)
    profile.stats = {
      points: profile.points,
      level: profile.level,
      tier: profile.tier,
      wins: 0,
      playtime: totalHours,
      gamesPlayed: gamesPlayedCount,
      highScore: 0,
      streak: 0
    };
    console.log(`✅ Profile fetched controller log | user ${userId} | level ${profile.level} | tier ${profile.tier} | games played: ${profile.stats.gamesPlayed} | profile.stats.playtime = ${profile.stats.playtime} hrs` );
    res.json(profile);

  } catch (err) {
    console.error("GET PROFILE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
}

// ================= UPDATE PROFILE =================
// export async function updateProfile(req, res) {
//   try {
//     const userId = req.user.id;
//     const { username, about_me, interests, country } = req.body;

//     console.log(`📝 Updating profile for user ${userId}`);
//     console.log("Request body:", { username, about_me, interests });

//     // Get current user data
//     const [currentUser] = await db.execute(
//       "SELECT provider, email FROM users WHERE id = ?",
//       [userId]
//     );

//     if (!currentUser.length) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const updateFields = [];
//     const params = [];

//     // Username validation and update
//     if (username !== undefined && username.trim()) {
//       const cleanUsername = username.trim().toLowerCase();
      
//       if (cleanUsername.length < 3 || cleanUsername.length > 50) {
//         return res.status(400).json({ 
//           message: "Username must be between 3 and 50 characters" 
//         });
//       }

//       // Check if username is taken by another user
//       const [existingUser] = await db.execute(
//         "SELECT id FROM users WHERE username = ? AND id != ?",
//         [cleanUsername, userId]
//       );

//       if (existingUser.length) {
//         return res.status(409).json({ 
//           message: "Username already taken" 
//         });
//       }

//       updateFields.push("username = ?");
//       params.push(cleanUsername);
//     }

//     // About me
//     if (about_me !== undefined) {
//       const cleanAboutMe = about_me.trim();
      
//       if (cleanAboutMe.length > 500) {
//         return res.status(400).json({ 
//           message: "Bio must be less than 500 characters" 
//         });
//       }

//       updateFields.push("about_me = ?");
//       params.push(cleanAboutMe || null);
//     }

//     // Interests
//     if (interests !== undefined) {
//       let interestsArray = [];
      
//       if (typeof interests === 'string') {
//         try {
//           interestsArray = JSON.parse(interests);
//         } catch (e) {
//           return res.status(400).json({ message: "Invalid interests format" });
//         }
//       } else if (Array.isArray(interests)) {
//         interestsArray = interests;
//       }

//       // Validate interests
//       if (interestsArray.length > 10) {
//         return res.status(400).json({ 
//           message: "Maximum 10 interests allowed" 
//         });
//       }

//       updateFields.push("interests = ?");
//       params.push(JSON.stringify(interestsArray));
//     }

//     // Handle avatar upload
//     if (req.file) {
//       const avatarUrl = `/uploads/avatars/${req.file.filename}`;
//       updateFields.push("avatar = ?");
//       params.push(avatarUrl);

//       // Delete old avatar if exists
//       const [oldAvatar] = await db.execute(
//         "SELECT avatar FROM users WHERE id = ?",
//         [userId]
//       );

//       if (oldAvatar[0]?.avatar) {
//         const oldPath = path.join(__dirname, "../../", oldAvatar[0].avatar);
//         if (fs.existsSync(oldPath)) {
//           fs.unlinkSync(oldPath);
//         }
//       }

//       console.log(`📸 Avatar uploaded: ${avatarUrl}`);
//     }

//     if (updateFields.length === 0) {
//       return res.status(400).json({ message: "No fields to update" });
//     }

//     // Perform update
//     params.push(userId);
//     await db.execute(
//       `UPDATE users SET ${updateFields.join(", ")} WHERE id = ?`,
//       params
//     );

//     console.log(`✅ Profile updated for user ${userId}`);
//     res.json({ 
//       message: "Profile updated successfully",
//       success: true 
//     });

//   } catch (err) {
//     console.error("UPDATE PROFILE ERROR:", err);
    
//     // Clean up uploaded file if error occurs
//     if (req.file && fs.existsSync(req.file.path)) {
//       fs.unlinkSync(req.file.path);
//     }
    
//     res.status(500).json({ message: "Server error" });
//   }
// }
export async function updateProfile(req, res) {
  try {
    const userId = req.user.id;
    const { username, about_me, interests, country } = req.body;

     // console.log(`📝 Updating profile for user ${userId}`);

    const updateFields = [];
    const params = [];

    // ───────────────── Username ─────────────────
    if (username !== undefined && username.trim()) {
      const cleanUsername = username.trim();

      if (cleanUsername.length < 3 || cleanUsername.length > 50) {
        return res.status(400).json({ message: "Username must be 3–50 chars" });
      }

      const [existing] = await db.execute(
        "SELECT id FROM users WHERE username = ? AND id != ?",
        [cleanUsername, userId]
      );

      if (existing.length) {
        return res.status(409).json({ message: "Username already taken" });
      }

      updateFields.push("username = ?");
      params.push(cleanUsername);
    }

    // ───────────────── Bio ─────────────────
    if (about_me !== undefined) {
      if (about_me.length > 500) {
        return res.status(400).json({ message: "Bio too long" });
      }
      updateFields.push("about_me = ?");
      params.push(about_me.trim() || null);
    }

    // ───────────────── Interests ─────────────────
    if (interests !== undefined) {
      let parsed = [];

      try {
        parsed = typeof interests === "string"
          ? JSON.parse(interests)
          : interests;
      } catch {
        return res.status(400).json({ message: "Invalid interests format" });
      }

      if (!Array.isArray(parsed) || parsed.length > 10) {
        return res.status(400).json({ message: "Max 10 interests allowed" });
      }

      updateFields.push("interests = ?");
      params.push(JSON.stringify(parsed));
    }

    // ───────────────── Country (NEW) ─────────────────
    if (country !== undefined) {
      if (country && !/^[A-Z]{2}$/.test(country)) {
        return res.status(400).json({ message: "Invalid country code" });
      }

      updateFields.push("country = ?");
      params.push(country || null);
    }

    // ───────────────── Avatar ─────────────────
    if (req.file) {
      const avatar = user?.avatar
      ? `${import.meta.env.VITE_API_URL}${user.avatar}`
      : "/default-avatar.png";
      updateFields.push("avatar = ?");
      params.push(avatarUrl);
    }

    if (!updateFields.length) {
      return res.status(400).json({ message: "Nothing to update" });
    }

    params.push(userId);

    await db.execute(
      `UPDATE users SET ${updateFields.join(", ")} WHERE id = ?`,
      params
    );

//     console.log(`✅ Profile updated for user ${userId}`);
//     console.log("UPDATE PROFILE BODY:", req.body);
// console.log("COUNTRY RECEIVED:", country);

    res.json({ success: true });

  } catch (err) {
    console.error("UPDATE PROFILE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
}


// ================= CHANGE PASSWORD =================
export async function changePassword(req, res) {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    // console.log(`🔑 Password change request for user ${userId}`);

    // Validation
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        message: "Current and new passwords are required" 
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ 
        message: "New password must be at least 8 characters" 
      });
    }

    // Get user
    const [users] = await db.execute(
      "SELECT id, password_hash, provider FROM users WHERE id = ?",
      [userId]
    );

    if (!users.length) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = users[0];

    // Check if user is using OAuth
    if (user.provider !== 'local') {
      return res.status(403).json({ 
        message: "Cannot change password for OAuth accounts" 
      });
    }

    // Verify current password
    const validPassword = await bcrypt.compare(currentPassword, user.password_hash);

    if (!validPassword) {
      return res.status(401).json({ 
        message: "Current password is incorrect" 
      });
    }

    // Check if new password is same as old
    const sameAsOld = await bcrypt.compare(newPassword, user.password_hash);
    if (sameAsOld) {
      return res.status(400).json({ 
        message: "New password must be different from current password" 
      });
    }

    // Hash new password
    const newHash = await bcrypt.hash(newPassword, 10);

    // Update password and reset any locks
    await db.execute(
      `UPDATE users 
       SET password_hash = ?, 
           failed_login_attempts = 0, 
           lock_until = NULL 
       WHERE id = ?`,
      [newHash, userId]
    );

    // console.log(`✅ Password changed successfully for user ${userId}`);
    res.json({ 
      message: "Password changed successfully",
      success: true 
    });

  } catch (err) {
    console.error("CHANGE PASSWORD ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
}

// ================= DEACTIVATE ACCOUNT =================
export async function deactivateAccount(req, res) {
  try {
    const userId = req.user.id;

    // console.log(`⚠️ Account deactivation request for user ${userId}`);

    await db.execute(
      "UPDATE users SET is_active = FALSE WHERE id = ?",
      [userId]
    );

    // console.log(`✅ Account deactivated for user ${userId}`);
    res.json({ 
      message: "Account deactivated successfully. You can reactivate by logging in again.",
      success: true 
    });

  } catch (err) {
    console.error("DEACTIVATE ACCOUNT ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
}

// ================= DELETE ACCOUNT =================
export async function deleteAccount(req, res) {
  try {
    const userId = req.user.id;

    // console.log(`❌ Account deletion request for user ${userId}`);

    // Get user avatar to delete file
    const [user] = await db.execute(
      "SELECT avatar FROM users WHERE id = ?",
      [userId]
    );

    // Delete avatar file if exists
    if (user[0]?.avatar) {
      const avatarPath = path.join(__dirname, "../../", user[0].avatar);
      if (fs.existsSync(avatarPath)) {
        fs.unlinkSync(avatarPath);
      }
    }

    // Delete user (CASCADE will delete related records)
    await db.execute("DELETE FROM users WHERE id = ?", [userId]);

    // console.log(`✅ Account permanently deleted for user ${userId}`);
    res.json({ 
      message: "Account permanently deleted",
      success: true 
    });

  } catch (err) {
    console.error("DELETE ACCOUNT ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
}