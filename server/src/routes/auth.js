// server/src/routes/auth.js

import express from "express";
import { loginLimiter, forgotPasswordLimiter, } from "../middleware/rateLimit.js";

import {
  register,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
  googleLogin,
  appleLogin,
  resendVerification
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", loginLimiter, login);
router.get("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPasswordLimiter, forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/google", googleLogin);
router.post("/resend-verification", resendVerification);
router.post("/apple", appleLogin);


export default router;
