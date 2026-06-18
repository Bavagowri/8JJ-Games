// server/src/routes/activity.routes.js
import express from "express";
import { logActivity, endGameSession } from "../controllers/activity.controller.js";
import { auth } from "../middleware/auth.js"; 
import { db } from '../db/index.js';

const router = express.Router();

router.post("/", auth, logActivity);

router.get("/points-log", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await db.execute(
      `
      SELECT 
        id,
        activity_type,
        game_id,
        points_awarded,
        created_at
      FROM user_activity_log
      WHERE user_id = ?
        AND points_awarded > 0
      ORDER BY created_at DESC
      LIMIT 50
      `,
      [userId]
    );

    res.json(rows); //  always array
  } catch (err) {
    console.error("❌ points-log error:", err);
    res.status(500).json([]); // IMPORTANT
  }
});

router.post("/end-game", auth, endGameSession);


export default router;
