//react-app/src/context/AuthContext.jsx

import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();
const API_BASE = import.meta.env.VITE_API_URL;
if (!API_BASE && typeof window !== 'undefined') {
  throw new Error("❌ VITE_API_URL is not defined");
}

export function AuthProvider({ children }) {
  // const [token, setToken] = useState(localStorage.getItem("token"));
  const [token, setToken] = useState(
  typeof window !== 'undefined' ? localStorage.getItem("token") : null
);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode(token);

      if (decoded.exp * 1000 < Date.now()) {
        logout();
      } else {
        setUser({
          id: decoded.id,
          email: decoded.email,
          username: decoded.username,
          role: decoded.role || "user",
          avatar: decoded.avatar || "👤" // Add avatar support
        });
      }
    } catch {
      logout();
    }

    setLoading(false);
  }, [token]);

//  useEffect(() => {
//   if (!token) return;

//   const awardDailyLogin = async () => {
//     try {
//       await fetch(`${API_BASE}/api/activity`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${token}`
//         },
//         body: JSON.stringify({
//           activity_type: "daily_login"
//         })
//       });
//     } catch (err) {
//       console.error("Daily login failed:", err);
//     }
//   };

//   awardDailyLogin();

// }, [token]);


  useEffect(() => {
  const awardDailyLogin = async () => {
    if (!token) return;

    const res = await fetch(`${API_BASE}/api/activity`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        activity_type: "daily_login"
      })
    });

    const data = await res.json();

  if (data?.awarded && typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent("wallet-update", { detail: data })
    );
  }
  };

  awardDailyLogin();
}, [token]);

const login = (newToken) => {
  if (typeof window !== 'undefined') localStorage.setItem("token", newToken);
  setToken(newToken);
};

const logout = () => {
  if (typeof window !== 'undefined') localStorage.removeItem("token");
  setToken(null);
  setUser(null);
};

  // Calculate isAuthenticated based on user state
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        token, 
        isAuthenticated,  
        login, 
        logout, 
        loading 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);