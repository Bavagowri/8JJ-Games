// src/controllers/activity.controller.js
import { db } from "../db/index.js";
import { awardPoints, awardLoginPoints } from "../services/points.service.js";

// export const logActivity = async (req, res) => {
//   const userId = req.user.id;
//   const { activity_type, game_id, metadata } = req.body;

//   try {
//     // 1️⃣ Insert activity row
//     const [result] = await db.execute(
//       `
//       INSERT INTO user_activity_log
//       (user_id, activity_type, game_id, metadata)
//       VALUES (?, ?, ?, ?)
//       `,
//       [
//         userId,
//         activity_type,
//         game_id || null,
//         metadata ? JSON.stringify(metadata) : null
//       ]
//     );

//     const activityId = result.insertId; // ✅ DEFINE IT HERE

//     // 2️⃣ Only award instantly for non-play activities
//     if (activity_type !== "play_game") {
//       const awardResult = await awardPoints({
//         userId,
//         activityType: activity_type,
//         gameId: game_id,
//         metadata,
//         activityId
//       });

//       if (awardResult.awarded) {
//         await db.execute(
//           `
//           UPDATE user_activity_log
//           SET points_awarded = ?
//           WHERE id = ?
//           `,
//           [awardResult.points, activityId]
//         );
//       }

//       return res.json({
//         success: true,
//         activityId,
//         ...awardResult
//       });
//     }

//     // 3️⃣ If play_game → DO NOT award yet
//     return res.json({
//       success: true,
//       activityId: result.insertId
//     });

//   } catch (err) {
//     console.error("ACTIVITY ERROR:", err);
//     res.status(500).json({ message: "Failed to log activity" });
//   }
// };

export const logActivity = async (req, res) => {
  const userId = req.user.id;
  const { activity_type, activityId, game_id, metadata } = req.body;

  try {
    // play_game: session tracking only (award later if you want)
    if (activity_type === "play_game") {
      const [r] = await db.execute(
        `
          INSERT INTO user_activity_log (user_id, activity_type, game_id, metadata)
          VALUES (?, ?, ?, ?)
        `,
        [userId, activity_type, game_id || null, metadata ? JSON.stringify(metadata) : null]
      );

      return res.json({ success: true, activityId: r.insertId });
    }

    
    // 1) Award first
    const awardResult = await awardPoints({
      userId,
      activityType: activity_type,
      gameId: game_id,
      metadata,
      activityId
    });

    // if not awarded, do not insert activity log
    if (!awardResult.awarded || awardResult.points <= 0) {
      return res.json({ success: true, ...awardResult });
    }

    // 2) Insert activity log only if awarded
    const [log] = await db.execute(
      `
        INSERT INTO user_activity_log (user_id, activity_type, game_id, metadata, points_awarded)
        VALUES (?, ?, ?, ?, ?)
      `,
      [
        userId,
        activity_type,
        game_id || null,
        metadata ? JSON.stringify(metadata) : null,
        awardResult.points
      ]
    );

    activityId = log.insertId;

    // 3) map transaction -> activity log
    if (awardResult.transactionId) {
      await db.execute(
        `UPDATE points_transactions SET activity_id = ? WHERE id = ?`,
        [activityId, awardResult.transactionId]
      );
    }

    res.json({
      success: true,
      activityId,
      ...awardResult
    });
  } catch (err) {
    console.error("ACTIVITY ERROR:", err);
    res.status(500).json({ message: "Failed to log activity" });
  }
};

export async function endGameSession(req, res) {
  const userId = req.user.id;
  const { activityId } = req.body;

  try {
    /* 1️⃣ Get duration first */
    const [rows] = await db.execute(
      `
      SELECT 
        id,
        game_id,
        TIMESTAMPDIFF(SECOND, created_at, NOW()) AS duration
      FROM user_activity_log
      WHERE id = ?
        AND user_id = ?
      `,
      [activityId, userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Session not found" });
    }

    const { duration, game_id } = rows[0];

    /* 2️⃣ Update duration in log */
    await db.execute(
      `
      UPDATE user_activity_log
      SET duration_seconds = ?
      WHERE id = ?
      `,
      [duration, activityId]
    );

    /* 3️⃣ If played ≥ 30 sec → increment total_plays */
    if (duration >= 30 && game_id) {
      await db.execute(
        `
        UPDATE games
        SET total_plays = total_plays + 1,
            total_time_played = total_time_played + ?
        WHERE provider_id = ?
        `,
        [duration, game_id]
      );
    }

    //  Prevent duplicate rewards
    const [[existingReward]] = await db.execute(
      `
      SELECT points_awarded
      FROM user_activity_log
      WHERE id = ?
      `,
      [activityId]
    );

    if (existingReward.points_awarded > 0) {
      return res.json({
        success: true,
        duration,
        message: "Already rewarded",
        pointsAwarded: 0
      });
    }

    /* 4️⃣ If played ≥ 60 sec → award points */
    let pointsAwarded = 0;

    if (duration >= 60) {
      const awardResult = await awardPoints({
        userId,
        activityType: "random_game_reward",
        gameId: game_id,
        activityId
      });

      // console.log("Award Result:", awardResult);
      if (awardResult.awarded) {
        pointsAwarded = awardResult.points;

        await db.execute(
          `
          UPDATE user_activity_log
          SET points_awarded = ?
          WHERE id = ?
          `,
          [pointsAwarded, activityId]
        );
      }
    }

    res.json({
      success: true,
      duration,
      countedAsPlay: duration >= 30,
      pointsAwarded
    });

  } catch (err) {
    console.error("END SESSION ERROR:", err);
    res.status(500).json({ message: "Failed to end session" });
  }
}