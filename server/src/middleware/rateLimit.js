  // server/src/middleware/rateLimit.js

import rateLimit from "express-rate-limit";

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,                  // 20 requests per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many login attempts. Try again later. Try again after 15 minutes" }
});

export const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many password reset attempts. Please try again later."
  }
});