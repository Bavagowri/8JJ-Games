import express from "express";
import { recalcUserLevel } from "../services/points.service.js";

const router = express.Router();

router.post("/recalc-level/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    await recalcUserLevel(userId);

    res.json({ success: true, userId });
  } catch (err) {
    console.error("DEV RECALC ERROR:", err);
    res.status(500).json({ error: "Failed to recalc level" });
  }
});

export default router;
