// react-app/src/api/admin.matches.api.js

const API_BASE = import.meta.env.VITE_API_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  };
};

export const adminMatchesAPI = {

  // Sync matches from external API
  syncMatches: async () => {
    const res = await fetch(`${API_BASE}/api/admin/matches/sync-matches`, {
      method: "POST",
      headers: getAuthHeaders()
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message);
    }
    return res.json();
  },

  // Get all synced fixtures (for dropdown in create form)
  getFixtures: async () => {
    const res = await fetch(`${API_BASE}/api/admin/matches/fixtures`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error("Failed to fetch fixtures");
    return res.json();
  },

  // Get all matches (for admin management table)
  getMatches: async () => {
    const res = await fetch(`${API_BASE}/api/admin/matches`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error("Failed to fetch matches");
    return res.json();
  },

  // Create a prediction match
  createMatch: async (payload) => {
    const res = await fetch(`${API_BASE}/api/admin/matches/create`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Failed to create match");
    }
    return res.json();
  },

  // Set match winner
  setWinner: async (matchId, winner) => {
    const res = await fetch(`${API_BASE}/api/admin/matches/${matchId}/winner`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ winner })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Failed to set winner");
    }
    return res.json();
  },

  // Lock predictions for a match
  lockMatch: async (matchId) => {
    const res = await fetch(`${API_BASE}/api/admin/matches/${matchId}/lock`, {
      method: "POST",
      headers: getAuthHeaders()
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Failed to lock match");
    }

    return res.json();
  },

  // Unlock predictions
  unlockMatch: async (matchId) => {
    const res = await fetch(`${API_BASE}/api/admin/matches/${matchId}/unlock`, {
      method: "POST",
      headers: getAuthHeaders()
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Failed to unlock match");
    }

    return res.json();
  },

  featureMatch: async (matchId) => {
    const res = await fetch(`${API_BASE}/api/admin/matches/${matchId}/feature`, {
      method: "POST",
      headers: getAuthHeaders()
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Failed to set featured match");
    }

    return res.json();
  },

  getMatchDetails: async (matchId) => {
    const res = await fetch(`${API_BASE}/api/admin/matches/${matchId}`, {
      method: "GET",
      headers: getAuthHeaders()
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Failed to fetch match details");
    }

    return res.json();
  },

  updateMatch: async (matchId, data) => {
    const res = await fetch(`${API_BASE}/api/admin/matches/${matchId}`, {
      method: "PUT",
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Failed to update match");
    }

    return res.json();
  },

  deleteMatch: async (matchId) => {
    const res = await fetch(`${API_BASE}/api/admin/matches/${matchId}`, {
      method: "DELETE",
      headers: getAuthHeaders()
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Failed to delete match");
    }

    return res.json();
  },

};