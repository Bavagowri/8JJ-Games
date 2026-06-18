// react-app/src/api/liveScores.api.js

const API_BASE = import.meta.env.VITE_API_URL || "";

export const matchesPreviewAPI = {
  getMatchPreview: async (page = 1, limit = 14) => {
    const res = await fetch(
      `${API_BASE}/api/match-preview?page=${page}&limit=${limit}`
    );

    if (!res.ok) {
      throw new Error("Failed to fetch match preview");
    }

    const data = await res.json();

    //  Correct logs
    console.log("LIVE:", data.live);
    console.log("UPCOMING:", data.upcoming?.data);
    console.log("RECENT:", data.recent?.data);

    // Correct mapping
    return {
      live: data.live || [],

      upcoming: data.upcoming?.data || [],
      upcomingPagination: data.upcoming?.pagination || {},

      recent: data.recent?.data || [],
      recentPagination: data.recent?.pagination || {}
    };
  },

  // Fetch only upcoming matches — independent page + limit
  getUpcoming: async (page = 1, limit = 8) => {
    const res = await fetch(
      `${API_BASE}/api/match-preview?upcomingPage=${page}&upcomingLimit=${limit}&recentLimit=0`
    );
    if (!res.ok) throw new Error("Failed to fetch upcoming matches");
    const data = await res.json();
    return {
      upcoming: data.upcoming?.data || [],
      upcomingPagination: data.upcoming?.pagination || {},
    };
  },

  // Fetch only recent matches — independent page + limit
  getRecent: async (page = 1, limit = 8) => {
    const res = await fetch(
      `${API_BASE}/api/match-preview?recentPage=${page}&recentLimit=${limit}&upcomingLimit=0`
    );
    if (!res.ok) throw new Error("Failed to fetch recent matches");
    const data = await res.json();
    return {
      recent: data.recent?.data || [],
      recentPagination: data.recent?.pagination || {},
    };
  },
};