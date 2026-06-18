// server/src/routes/share.routes.js
import express from "express";
import { auth } from "../middleware/auth.js";
import { shareActivity, handleShareRedirect, generatedShareLink } from "../controllers/share.controller.js";
import rateLimit from "express-rate-limit";

const router = express.Router();

const shareLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 share attempts per minute
  message: { message: "Too many share attempts" }
});


/* ================= SHARE ROUTES ================= */

// Share platform / game / referral
router.post("/", auth, shareLimiter, shareActivity);

//  NEW: Generate tracked WhatsApp link
router.post("/generated-link", auth, generatedShareLink);

// Public redirect route (NO auth)
router.get("/s/:code", handleShareRedirect);

export default router;