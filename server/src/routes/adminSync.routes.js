import express from "express";
import { adminAuth } from "../middleware/adminAuth.js";
import { syncH5Games } from "../services/syncH5Games.js";
import { syncSelfHostedGames } from "../services/syncSelfHostedGames.js";

const router = express.Router();

// 🔐 Protect this route
router.post("/sync-h5", adminAuth, async (req, res) => {
  try {
    // console.log("🔄 Admin triggered H5 sync");

    await syncH5Games();

    res.status(200).json({
      success: true,
      message: "H5 games synced successfully"
    });

  } catch (error) {
    // console.error("❌ Sync error:", error);
    res.status(500).json({
      success: false,
      error: "Sync failed"
    });
  }
});


router.post("/sync-self", async (req, res) => {
  try {
    await syncSelfHostedGames();
    res.json({ success: true, message: "Self games synced" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});


export default router;
