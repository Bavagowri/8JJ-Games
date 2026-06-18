import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Not logged in → redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Logged in → allow access
  return <Outlet />;
}