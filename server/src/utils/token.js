// server/src/utils/token.js

import jwt from "jsonwebtoken";
import crypto from "crypto";

/*  JWT for login */
export function generateJwt(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d",
      algorithm: "HS256"
     }
  );
}

/*  Random token for email verification / reset */
export function generateEmailToken() {
  return crypto.randomBytes(32).toString("hex");
}
