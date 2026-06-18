// server/src/routes/admin.games.routes.js
import express from "express";
import { db } from "../db/index.js";
import { adminAuth } from "../middleware/adminAuth.js";
import { getAdminGames } from "../controllers/games.controller.js";

const router = express.Router();

// 🔐 Protect all
router.use(adminAuth);

/* ================= TOGGLE HOT ================= */
router.put("/hot/:id", adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { is_hot } = req.body;

    await db.execute(
      `UPDATE games SET is_hot = ? WHERE id = ?`,
      [is_hot ? 1 : 0, id]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("HOT UPDATE ERROR:", err);
    res.status(500).json({ success: false });
  }
});


/* ================= TOGGLE FEATURED ================= */
router.put("/featured/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { is_featured } = req.body;

    await db.execute(
      `UPDATE games SET is_featured = ? WHERE id = ?`,
      [is_featured ? 1 : 0, id]
    );

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

router.get("/", getAdminGames);

/* ================= TOGGLE TOP PICK ================= */
router.put("/top-pick/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { is_top_pick } = req.body;

    await db.execute(
      `UPDATE games SET is_top_pick = ? WHERE id = ?`,
      [is_top_pick ? 1 : 0, id]
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

/* ================= UPDATE TOP PICK ORDER ================= */
router.put("/top-pick/order/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { top_pick_order } = req.body;

    await db.execute(
      `UPDATE games SET top_pick_order = ? WHERE id = ?`,
      [Number(top_pick_order) || 0, id]
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});



export default router;