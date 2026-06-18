// react-app/src/api/matches.api.js

const API_BASE = import.meta.env.VITE_API_URL;

export const matchesAPI = {

  // 🏏 Get matches for prediction page
  getMatches: async () => {

    const res = await fetch(`${API_BASE}/api/matches`);

    if (!res.ok) {
      throw new Error("Failed to fetch matches");
    }

    return res.json();
  },

  // 📊 Get single match details
  getMatchDetails: async (matchId) => {

    const res = await fetch(`${API_BASE}/api/matches/${matchId}`);

    if (!res.ok) {
      throw new Error("Failed to fetch match");
    }

    return res.json();
  }

};