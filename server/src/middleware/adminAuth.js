

// server/src/middleware/adminAuth.js

import jwt from "jsonwebtoken";

export function adminAuth(req, res, next) {
  // console.log("🔐 Admin Auth Check");
  // console.log("📋 Headers:", req.headers.authorization);
  
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("❌ No token provided");
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("✅ Token decoded:", { id: decoded.id, role: decoded.role });

    if (decoded.role !== "admin") {
      // console.log(`❌ Access denied. User role: ${decoded.role}`);
      return res.status(403).json({ 
        message: "Admin access only",
        userRole: decoded.role 
      });
    }

    req.admin = decoded;
    // console.log("✅ Admin access granted");
    next();
  } catch (err) {
    // console.error("❌ Token verification failed:", err.message);
    return res.status(401).json({ 
      message: "Invalid or expired token",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
}