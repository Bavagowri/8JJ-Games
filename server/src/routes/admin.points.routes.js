//server/src/routes/admin.points.routes.js
import express from "express";
import { adminAuth } from "../middleware/adminAuth.js";
import {
  getAllRules,
  createRule,
  updateRule,
  deleteRule,
  getUserTransactions,
  getUserTotalPoints,
  adjustUserPoints,
  bulkAdjustPoints,
  getAllUsersWithPoints
} from "../controllers/admin.points.controller.js";

const router = express.Router();

/* 🔐 Protect all routes */
router.use(adminAuth);

/* ================= RULE MANAGEMENT ================= */
router.get("/rules", getAllRules);
router.post("/rules", createRule);
router.put("/rules/:id", updateRule);
router.delete("/rules/:id", deleteRule);

/* ================= USER POINTS ================= */
router.get("/user/:userId", getUserTransactions);
router.get("/user/:userId/total", getUserTotalPoints);
router.post("/adjust", adjustUserPoints);

router.post("/bulk-adjust", bulkAdjustPoints);
router.get("/users-with-points", getAllUsersWithPoints);

export default router;
