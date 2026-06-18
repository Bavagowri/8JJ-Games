// server/src/controllers/prediction.controller.js
import { db } from "../db/index.js";
import crypto from "crypto";

export async function submitPrediction(req, res) {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const userId = req.user.id;
    const { match_id, option_id } = req.body;

    // 1. Get match
    const [[match]] = await connection.execute(
      `SELECT * FROM matches WHERE id = ? FOR UPDATE`,
      [match_id]
    );

    if (!match) throw new Error("Match not found");
    if (!match.prediction_open) throw new Error("Prediction closed");

    // 2. Get option
    const [[option]] = await connection.execute(
      `SELECT * FROM match_prediction_options WHERE id = ? AND is_active = 1`,
      [option_id]
    );

    if (!option) throw new Error("Invalid option");

    // 3. Stake calculation
    const baseStake = match.participation_cost || 0;

    const stake = baseStake > 0
      ? Math.round(baseStake * (match.stake_multiplier ?? 1))
      : 0;

    const reward = baseStake > 0
      ? Math.round(baseStake * option.odds)
      : 100;

    // 4. Lock user
    const [[user]] = await connection.execute(
      `SELECT points FROM users WHERE id = ? FOR UPDATE`,
      [userId]
    );

    if (!user) throw new Error("User not found");

    if (stake > 0 && user.points < stake) {
      throw new Error("Insufficient points");
    }

    // 5. Insert prediction FIRST
    const [predictionResult] = await connection.execute(
      `
      INSERT INTO user_predictions
      (user_id, match_id, option_id, stake_points, potential_reward)
      VALUES (?, ?, ?, ?, ?)
      `,
      [userId, match_id, option_id, stake, reward]
    );

    const predictionId = predictionResult.insertId;

    // 6. Deduct points
    if (stake > 0) {
      // Update users balance
      await connection.execute(
        `UPDATE users SET points = points - ? WHERE id = ?`,
        [stake, userId]
      );

      await connection.execute(
        `UPDATE user_points SET total_points = total_points - ? WHERE user_id = ?`,
        [stake, userId]
      );

      // metadata
      const metadata = {
        match_id,
        prediction_id: predictionId,
        option_id,
        stake,
        multiplier: match.stake_multiplier
      };

      // metadata hash (idempotency)
      const metadataHash = crypto
        .createHash("sha256")
        .update(JSON.stringify(metadata))
        .digest("hex");

      // 7. points_transactions (YOUR REQUIRED FORMAT)
      await connection.execute(
        `
        INSERT INTO points_transactions
        (user_id, activity_type, activity_id, points, note, metadata, metadata_hash)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
        [
          userId,
          "match_prediction_stake",
          predictionId,
          -stake,
          `Stake for match ${match_id}`,
          JSON.stringify(metadata),
          metadataHash
        ]
      );

      // 8. activity log (optional but recommended)
      await connection.execute(
        `
        INSERT INTO user_activity_log
        (user_id, activity_type, metadata, points_awarded)
        VALUES (?, ?, ?, ?)
        `,
        [
          userId,
          "match_prediction_stake",
          JSON.stringify(metadata),
          -stake
        ]
      );
    }

    await connection.commit();

    res.json({
      success: true,
      stake,
      potential_reward: reward
    });

  } catch (err) {
    await connection.rollback();

    if (err.message === "Match not found") {
      return res.status(404).json({ message: err.message });
    }

    if (
      err.message === "Prediction closed" ||
      err.message === "Invalid option" ||
      err.message === "Insufficient points"
    ) {
      return res.status(400).json({ message: err.message });
    }

    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
        message: "You already predicted this match"
      });
    }

    console.error(err);
    res.status(500).json({ message: "Prediction failed" });

  } finally {
    connection.release();
  }
}

export async function getMyPredictions(req, res) {
  try {
    const userId = req.user.id;

    const [predictions] = await db.execute(
      `
      SELECT
        up.id,
        up.match_id,
        up.option_id,
        up.stake_points AS stake_cost,
        up.potential_reward,
        up.is_correct,
        up.points_awarded,
        up.created_at,

        mpo.option_value AS user_prediction,
        mpo.odds,

        m.localteam_name AS team_a,
        m.visitorteam_name AS team_b,
        m.starting_at AS match_start_time,

        CASE
          WHEN m.winner IS NOT NULL THEN 'completed'
          WHEN m.prediction_open = 0 THEN 'closed'
          ELSE 'upcoming'
        END AS status,

        m.winner,
        'Cricket Match' AS tournament

      FROM user_predictions up
      JOIN match_prediction_options mpo ON up.option_id = mpo.id
      JOIN matches m ON up.match_id = m.id
      WHERE up.user_id = ?
      ORDER BY up.created_at DESC
      `,
      [userId]
    );

    res.json({ predictions });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch predictions" });
  }
}

// Admin: get all submissions for a specific match
export async function getMatchSubmissions(req, res) {
  try {
    const { matchId } = req.params;

    const [[match]] = await db.execute(
      `
      SELECT
        id,
        CONCAT(localteam_name, ' vs ', visitorteam_name) AS title,
        localteam_name  AS team_a,
        visitorteam_name AS team_b,
        'Cricket Match'  AS tournament,
        'win_loss'       AS prediction_type
      FROM matches WHERE id = ?
      `,
      [matchId]
    );

    if (!match) return res.status(404).json({ message: "Match not found" });

    const [submissions] = await db.execute(
      `
      SELECT
        up.id,
        up.user_id,
        up.match_id,
        up.stake_points   AS stake,
        up.potential_reward,
        up.is_correct,
        up.points_awarded,
        up.created_at,
        u.username,
        mpo.option_value  AS option_label,
        mpo.odds,
        CONCAT(m.localteam_name, ' vs ', m.visitorteam_name) AS match_title
      FROM user_predictions up
      JOIN users                    u   ON up.user_id  = u.id
      JOIN match_prediction_options mpo ON up.option_id = mpo.id
      JOIN matches                  m   ON up.match_id  = m.id
      WHERE up.match_id = ?
      ORDER BY up.created_at DESC
      `,
      [matchId]
    );

    res.json({ match, submissions });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch submissions" });
  }
}

export async function getPredictionLeaderboard(req, res) {
  try {

    const [rows] = await db.execute(`
      SELECT
        u.id,
        u.username,
        u.avatar,
        COUNT(up.id) AS predictions,
        SUM(up.is_correct) AS correct_predictions,
        ROUND(
          (SUM(up.is_correct) / COUNT(up.id)) * 100,
          2
        ) AS win_rate,
        SUM(up.points_awarded) AS total_points,
        SUM(
          CASE
            WHEN YEARWEEK(up.created_at,1) = YEARWEEK(NOW(),1)
            THEN up.points_awarded
            ELSE 0
          END
        ) AS weekly_points
      FROM user_predictions up
      JOIN users u ON up.user_id = u.id
      GROUP BY u.id
      ORDER BY total_points DESC
      LIMIT 50
    `);

    res.json({ leaderboard: rows });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch leaderboard" });
  }
}

export async function getPredictionOverview(req, res) {

  const [[featured]] = await db.execute(`
    SELECT 
    id,
    localteam_name AS team_a,
    visitorteam_name AS team_b, 
    league_id, 
    starting_at
    FROM matches
    WHERE is_featured = 1
    LIMIT 1
  `);

  const [[total]] = await db.execute(`
    SELECT COUNT(*) as total FROM matches
  `);

  const [[upcoming]] = await db.execute(`
    SELECT COUNT(*) as upcoming
    FROM match_prediction_options 
    WHERE is_active = 1
  `);

  const [[players]] = await db.execute(`
    SELECT COUNT(DISTINCT user_id) as players
    FROM user_predictions
  `);

  res.json({
    featuredMatch: featured || null,
    stats: {
      total: total.total,
      upcoming: upcoming.upcoming,
      players: players.players
    }
  });
}