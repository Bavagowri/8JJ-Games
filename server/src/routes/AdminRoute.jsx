// server/src/routes/AdminRoute.jsx

import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function AdminRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" />;

  try {
    const payload = jwtDecode(token);
    if (payload.role !== "admin") return <Navigate to="/" />;
  } catch {
    return <Navigate to="/login" />;
  }

  return children;
}
