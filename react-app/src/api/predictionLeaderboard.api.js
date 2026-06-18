// react-app/src/api/predictionLeaderboard.api.jss
const API_BASE = import.meta.env.VITE_API_URL;

export const leaderboardAPI = {

  getLeaderboard: async () => {

    const res = await fetch(`${API_BASE}/api/predictions/leaderboard`);

    if (!res.ok) {
      throw new Error("Failed to load leaderboard");
    }

    return res.json();
  }

};