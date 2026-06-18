// react-app/src/context/ProfileContext.jsx

// import { createContext, useContext, useEffect, useState } from "react";
// import { useAuth } from "./AuthContext";


// const ProfileContext = createContext();
// const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5050";

// export function ProfileProvider({ children }) {
//   console.log("🆕 ProfileProvider mounted");

//   const { user } = useAuth(); 
//   const [profile, setProfile] = useState(null);
//   const [activityLogs, setActivityLogs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   async function fetchProfile() {
//     const token = localStorage.getItem("token");
//     if (!token) return;

//     try {
//       setLoading(true);
//       const res = await fetch(`${API_BASE}/api/profile`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       if (!res.ok) throw new Error("Failed to fetch profile");
//       const data = await res.json();
//       setProfile(data);
//     } catch (err) {
//       setError(err.message);
//       setProfile(null);
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function fetchPointsLog() {
//     const token = localStorage.getItem("token");
//     if (!token) return;

//     const res = await fetch(`${API_BASE}/api/activity/points-log`, {
//       headers: { Authorization: `Bearer ${token}` }
//     });

//     const data = await res.json();
//     setActivityLogs(Array.isArray(data) ? data : []);
//   }

//     const refreshProfile = async () => {
//   await fetchProfile();
//   await fetchPointsLog();
// };

// useEffect(() => {
//     if (user) {
//       fetchProfile();
//       fetchPointsLog();
//     } else {
//       // logout → clear immediately
//       setProfile(null);
//       setActivityLogs([]);
//       setLoading(false);
//     }
//   }, [user]); 

//   return (
//     <ProfileContext.Provider
//       value={{ profile, activityLogs, loading, error, refreshProfile }}
//     >
//       {children}
//     </ProfileContext.Provider>
//   );
// }

// export function useProfile() {
//   return useContext(ProfileContext);
// }

import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const ProfileContext = createContext();
const API_BASE = import.meta.env.VITE_API_URL;
if (!API_BASE) {
  throw new Error("❌ VITE_API_URL is not defined");
}

export function ProfileProvider({ children }) {
  const { user, token } = useAuth();

  const [profile, setProfile] = useState(null);
  const [activityLogs, setActivityLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProfile = async () => {
    if (!token) return;

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) throw new Error("Profile fetch failed");
      setProfile(await res.json());
    } catch (e) {
      setError(e.message);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchPointsLog = async () => {
    if (!token) return;

    const res = await fetch(`${API_BASE}/api/activity/points-log`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();
    setActivityLogs(Array.isArray(data) ? data : []);
  };

  const refreshProfile = async () => {
    await fetchProfile();
    await fetchPointsLog();
  };

  useEffect(() => {
    if (user) {
      refreshProfile();
    } else {
      setProfile(null);
      setActivityLogs([]);
    }
  }, [user, token]);


  useEffect(() => {
    const handleWalletUpdate = async (event) => {
      const wallet = event.detail;

      setProfile((prev) => ({
        ...prev,
        points: wallet.totalPoints,
        level: wallet.level,
        tier: wallet.tier
      }));
      await fetchPointsLog(); 
    };

    window.addEventListener("wallet-update", handleWalletUpdate);

    return () => {
      window.removeEventListener("wallet-update", handleWalletUpdate);
    };
  }, []);



  return (
    <ProfileContext.Provider
      value={{
        profile,
        activityLogs,
        loading,
        error,
        refreshProfile
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export const useProfile = () => useContext(ProfileContext);
