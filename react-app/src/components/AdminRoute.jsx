// react-app/src/components/AdminRoute.jsx

import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function AdminRoute({ children }) {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  
  if (!token) {
    console.log("❌ No token found, redirecting to login");
    return <Navigate to="/login" />;
  }

  try {
    const payload = jwtDecode(token);
    // console.log("🔑 Token payload:", payload);
    
    if (payload.role !== "admin") {
      console.log("❌ Not admin role, redirecting to home");
      return <Navigate to="/" />;
    }
    
    console.log("✅ Admin access granted");
  } catch (error) {
    console.error("❌ Token decode error:", error);
    return <Navigate to="/login" />;
  }

  return children;
}