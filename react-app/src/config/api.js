// react-app/src/config/api.js
export const API_BASE = import.meta.env.VITE_API_URL;

export const API = {
  COLLECTION: `${API_BASE}/api/collection`,
  AUTH: `${API_BASE}/api/auth`,
  PROFILE: `${API_BASE}/api/profile`,
  LEADERBOARD: `${API_BASE}/api/leaderboard`,
  COMMENT: `${API_BASE}/api/comments`,
  ACTIVITY: `${API_BASE}/api/activity`
};
