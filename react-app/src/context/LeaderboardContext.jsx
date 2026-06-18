// import { createContext, useContext, useEffect, useState } from "react";
// import { fetchLeaderboard } from "../api/leaderboard.api";

// const LeaderboardContext = createContext();

// export function LeaderboardProvider({ children }) {
//   const [leaderboard, setLeaderboard] = useState([]);
//   const [timePeriod, setTimePeriod] = useState("weekly");
//   const [loading, setLoading] = useState(true);

//   const [activeTab, setActiveTab] = useState('global'); // global, friends, country
//     const [selectedGame, setSelectedGame] = useState('all');
//     const [leaderboardData, setLeaderboardData] = useState([]);
//     const [currentUser, setCurrentUser] = useState(null);
//     const [expandedInfo, setExpandedInfo] = useState(false);

//   async function loadLeaderboard(period = timePeriod) {
//     try {
//       setLoading(true);
//       const data = await fetchLeaderboard(period);
//       setLeaderboard(data);
//     } catch (err) {
//       console.error("Leaderboard load failed", err);
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     loadLeaderboard(timePeriod);
//   }, [timePeriod]);

//   return (
//     <LeaderboardContext.Provider value={{
//   leaderboard,
//   loading,
//   timePeriod,
//   setTimePeriod,
//   activeTab,
//   setActiveTab,
//   currentUser,
//   expandedInfo,
//   setExpandedInfo
// }}>
//       {children}
//     </LeaderboardContext.Provider>
//   );
// }

// export const useLeaderboard = () => {
//   const ctx = useContext(LeaderboardContext);
//   if (!ctx) {
//     throw new Error("useLeaderboard must be used within LeaderboardProvider");
//   }
//   return ctx;
// };
// =====================================================
// FILE: react-app/src/context/LeaderboardContext.jsx
// =====================================================

import { createContext, useContext, useEffect, useState } from "react";
import { fetchLeaderboard } from "../api/leaderboard.api";

const LeaderboardContext = createContext();

export function LeaderboardProvider({ children }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [timePeriod, setTimePeriod] = useState("weekly");
  const [activeTab, setActiveTab] = useState('global'); // global, friends, country
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [expandedInfo, setExpandedInfo] = useState(false);
  const [totalPlayers, setTotalPlayers] = useState(0);
  const [error, setError] = useState(null);

  async function loadLeaderboard() {
  try {
    setLoading(true);
    setError(null);

    // console.log(`📊 Loading leaderboard - Period: ${timePeriod}, Tab: ${activeTab}`);

    const response = await fetchLeaderboard(timePeriod, activeTab);

    // console.log("✅ Leaderboard response:", response);

    setLeaderboard(response.data ?? []);
    setCurrentUser(response.currentUser ?? null);
    setTotalPlayers(response.meta?.total ?? response.total ?? 0);

  } catch (err) {
    console.error("❌ Leaderboard load failed:", err);
    setError(err.message);
    setLeaderboard([]);
    setCurrentUser(null);
    setTotalPlayers(0);
  } finally {
    setLoading(false);
  }
}


  // Reload leaderboard when period or tab changes
  useEffect(() => {
    loadLeaderboard();
  }, [timePeriod, activeTab]);

  // Refresh leaderboard every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      loadLeaderboard();
    }, 30000);

    return () => clearInterval(interval);
  }, [timePeriod, activeTab]);

  const value = {
    leaderboard,
    loading,
    error,
    timePeriod,
    setTimePeriod,
    activeTab,
    setActiveTab,
    currentUser,
    totalPlayers,
    expandedInfo,
    setExpandedInfo,
    refresh: loadLeaderboard
  };

  return (
    <LeaderboardContext.Provider value={value}>
      {children}
    </LeaderboardContext.Provider>
  );
}

export const useLeaderboard = () => {
  const ctx = useContext(LeaderboardContext);
  if (!ctx) {
    throw new Error("useLeaderboard must be used within LeaderboardProvider");
  }
  return ctx;
};
