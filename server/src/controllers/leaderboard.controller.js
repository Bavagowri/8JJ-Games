// server/src/controllers/leaderboard.controller.js

import { db } from "../db/index.js";

export async function getLeaderboard(req, res) {
  try {
    const { period = "weekly" } = req.query;

    let dateFilter = "";
    if (period === "daily") {
      dateFilter = "AND ual.created_at >= NOW() - INTERVAL 1 DAY";
    } else if (period === "weekly") {
      dateFilter = "AND ual.created_at >= NOW() - INTERVAL 7 DAY";
    } else if (period === "monthly") {
      dateFilter = "AND ual.created_at >= NOW() - INTERVAL 30 DAY";
    }

    const [rows] = await db.execute(
      `
      SELECT 
        u.id AS userId,
        u.username,
        u.avatar,
        u.level,
        u.tier,
        u.points,
        COALESCE(SUM(ual.points_awarded), 0) AS score
      FROM users u
      LEFT JOIN user_activity_log ual
        ON u.id = ual.user_id
        ${period === "daily" ? "AND ual.created_at >= NOW() - INTERVAL 1 DAY" : ""}
        ${period === "weekly" ? "AND ual.created_at >= NOW() - INTERVAL 7 DAY" : ""}
        ${period === "monthly" ? "AND ual.created_at >= NOW() - INTERVAL 30 DAY" : ""}
      GROUP BY u.id
      ORDER BY score DESC
      LIMIT 100
      `
    );

    res.json({
      success: true,
      data: rows.map((u, index) => ({
        ...u,
        rank: index + 1,
        score: Number(u.score)
      }))
    });

  } catch (err) {
    console.error("LEADERBOARD ERROR:", err);
    res.status(500).json({ message: "Failed to load leaderboard" });
  }
}
