// react-app/src/api/prediction.api.js

const API_BASE = import.meta.env.VITE_API_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  };
};

export const predictionAPI = {

  // 🎯 Submit prediction
  submitPrediction: async (matchId, optionId) => {

    const res = await fetch(`${API_BASE}/api/predictions/predict`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        match_id: matchId,
        option_id: optionId
      })
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message);
    }

    return res.json();
  },

  // 📊 Get my predictions
  getMyPredictions: async () => {

    const res = await fetch(`${API_BASE}/api/predictions/my`, {
      headers: getAuthHeaders()
    });

    if (!res.ok) {
      throw new Error("Failed to fetch predictions");
    }

    return res.json();
  },

  getOverview: async () => {
    const res = await fetch(`${API_BASE}/api/predictions/overview`);

    if (!res.ok) throw new Error("Failed to fetch overview");

    return res.json();
  }

};