// react-app/src/pages/Auth/AuthPage/verify-email.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL;
if (!API_BASE) {
  throw new Error("❌ VITE_API_URL is not defined");
}

export default function VerifyEmail() {
  const navigate = useNavigate();
  const token = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("token") : null;

  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Invalid verification link.");
      return;
    }

    fetch(`${API_BASE}/api/auth/verify-email?token=${token}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setStatus("success");
        setMessage(data.message);
        setTimeout(() => navigate("/login"), 3000);
      })
      .catch((err) => {
        setStatus("error");
        setMessage(err.message || "Verification failed");
      });
  }, [token]);

  return (
    <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      {status === "loading" && <p>Verifying your email…</p>}
      {status === "success" && <p style={{ color: "green" }}>{message}</p>}
      {status === "error" && <p style={{ color: "red" }}>{message}</p>}
    </div>
  );
}
