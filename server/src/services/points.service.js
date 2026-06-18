// server/src/services/points.service.js
import { db } from "../db/index.js";
import crypto from "crypto";

function hashMetadata(metadata) {
  if (!metadata) return null;
  const str = JSON.stringify(metadata);
  return crypto.createHash("sha256").update(str).digest("hex");
}

function calcTier(totalPoints) {
  if (totalPoints >= 2000) return "Diamond";
  if (totalPoints >= 1500) return "Platinum";
  if (totalPoints >= 1000) return "Gold";
  if (totalPoints >= 500) return "Silver";
  return "Bronze";
}

// Unified award engine

export async function awardPoints({
  userId,
  activityType,
  gameId = null,
  metadata = null,
  activityId = null,
  note = null,
  customPoints=null
}) {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    /* 1️⃣ Get rule */
    const [rules] = await connection.execute(
      `SELECT * FROM points_rules 
       WHERE activity_type = ? 
         AND is_active = TRUE`,
      [activityType]
    );

    if (!rules.length) {
      await connection.rollback();
      return { awarded: false, reason: "Rule not active" };
    }

    const rule = rules[0];

    /* 2️⃣ Daily limit */
    if (rule.daily_limit) {
      const [[dailyCount]] = await connection.execute(
        `
        SELECT COUNT(*) as count
        FROM points_transactions
        WHERE user_id = ?
          AND activity_type = ?
          AND DATE(created_at) = CURDATE()
        `,
        [userId, activityType]
      );

      if (dailyCount.count >= rule.daily_limit) {
        await connection.rollback();
        return { awarded: false, reason: "Daily limit reached" };
      }
    }

    /* 3️⃣ Cooldown */
    if (rule.cooldown_minutes) {
      const [lastActivity] = await connection.execute(
        `
        SELECT created_at
        FROM points_transactions
        WHERE user_id = ?
          AND activity_type = ?
        ORDER BY created_at DESC
        LIMIT 1
        `,
        [userId, activityType]
      );

      if (lastActivity.length) {
        const lastTime = new Date(lastActivity[0].created_at);
        const diffMinutes =
          (Date.now() - lastTime.getTime()) / 60000;

        if (diffMinutes < rule.cooldown_minutes) {
          await connection.rollback();
          return { awarded: false, reason: "Cooldown active" };
        }
      }
    }

    /* 4️⃣ Calculate points */
    let pointsToAward = 0;

    // Prediction / manual override
    if (customPoints !== null) {
      pointsToAward = customPoints;
    }

    // Fixed rule
    else if (rule.points !== null) {
      pointsToAward = rule.points;
    }

    // Random rule
    else if (rule.min_points !== null && rule.max_points !== null) {
      pointsToAward =
        Math.floor(
          Math.random() * (rule.max_points - rule.min_points + 1)
        ) + rule.min_points;
    }

    if (!pointsToAward || pointsToAward <= 0) {
      await connection.rollback();
      return { awarded: false, reason: "Zero points rule" };
    }

    /* 5️⃣ Insert transaction (DB-level protection) */
    // try {
    //   const metadataHash = hashMetadata(metadata);

    //   await connection.execute(
    //     `
    //     INSERT INTO points_transactions
    //     (user_id, activity_type, activity_id, points, metadata, metadata_hash, note)
    //     VALUES (?, ?, ?, ?, ?, ?, ?)
    //     `,
    //     [
    //       userId,
    //       activityType,
    //       activityId,
    //       pointsToAward,
    //       metadata ? JSON.stringify(metadata) : null,
    //       metadataHash,
    //       note ?? null
    //     ]
    //   );
    // } catch (err) {
    //   if (err.code === "ER_DUP_ENTRY") {
    //     // Already claimed today
    //     await connection.rollback();
    //     return { awarded: false, reason: "Already claimed today" };
    //   }
    //   throw err;
    // }

    // Share anti-abuse hash
    const metadataHash = hashMetadata(metadata);

     // 5️⃣ Insert transaction (DB does uniqueness protection)
    let transactionId = null;
    try {
      const [tx] = await connection.execute(
        `
          INSERT INTO points_transactions
            (user_id, activity_type, activity_id, points, note, metadata, metadata_hash)
          VALUES
            (?, ?, ?, ?, ?, ?, ?)
        `,
        [
          userId,
          activityType,
          activityId,
          pointsToAward,
          note ?? null,
          metadata ? JSON.stringify(metadata) : null,
          metadataHash
        ]
      );
      transactionId = tx.insertId;
    } catch (err) {
      if (err.code === "ER_DUP_ENTRY") {
        await connection.rollback();
        return { awarded: false, reason: "Duplicate / already claimed" };
      }
      throw err;
    }


    /* 6️⃣ Update user_points wallet */
    await connection.execute(
      `
      INSERT INTO user_points (user_id, total_points)
      VALUES (?, ?)
      ON DUPLICATE KEY UPDATE
      total_points = total_points + VALUES(total_points)
      `,
      [userId, pointsToAward]
    );

    /* 7️⃣ Get new total */
    const [[wallet]] = await connection.execute(
      `SELECT total_points FROM user_points WHERE user_id = ?`,
      [userId]
    );

    const totalPoints = wallet.total_points;

    /* 8️⃣ Recalculate level */
    const newLevel = Math.floor(totalPoints / 250) + 1;

    /* 9️⃣ Recalculate tier */
    const newTier = calcTier(totalPoints);

    await connection.execute(
      `
      UPDATE user_points
      SET current_level = ?,
          current_tier = ?
      WHERE user_id = ?
      `,
      [newLevel, newTier, userId]
    );

    /* 🔁 Sync users table (legacy columns) */
    await connection.execute(
      `
      UPDATE users
      SET points = ?,
          level = ?,
          tier = ?
      WHERE id = ?
      `,
      [totalPoints, newLevel, newTier, userId]
    );


    /* 🔟 Update activity log */
    /* Insert activity log only if points awarded */
    if (activityId && pointsToAward > 0) {
      await connection.execute(
        `
        UPDATE user_activity_log
        SET points_awarded = ?
        WHERE id = ?
        `,
        [pointsToAward, activityId]
      );
    }


    await connection.commit();

    return {
      awarded: true,
      points: pointsToAward,
      totalPoints,
      level: newLevel,
      tier: newTier,
      transactionId
    };

  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
}


/* ================= LOGIN POINTS ================= */
export async function awardLoginPoints(userId) {
  return awardPoints({
    userId,
    activityType: "daily_login"
  });
}

/* ================= REFERRAL SIGNUP ================= */
export async function awardReferralSignup(userId, metadata = null) {
  return awardPoints({
    userId,
    activityType: "referral_signup",
    metadata
  });
}

/* ================= NEW USER REFERRAL BONUS ================= */
export async function awardReferralBonusNewUser(userId) {
  return awardPoints({
    userId,
    activityType: "referral_bonus_new_user"
  });
}

/* ================= REGISTRATION BONUS ================= */
export async function awardRegistrationBonus(userId) {
  return awardPoints({
    userId,
    activityType: "user_registration",
    metadata: { source: "signup" }
  });
}