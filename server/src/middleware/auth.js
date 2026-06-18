// server/src/middleware/auth.js
import jwt from "jsonwebtoken";

export function auth(req, res, next) {
  const authHeader = req.headers.authorization;

  // No Authorization header
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authentication required" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // decoded = { id, iat, exp }
    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({ message: "Token expired or invalid" });
  }
}
