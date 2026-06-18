// react-app/src/api/share.api.js

const API_BASE = import.meta.env.VITE_API_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  };
};

export const shareAPI = {

  // Generate tracked WhatsApp link
  generatedShareLink: async (gameId, platform) => {
    const res = await fetch(`${API_BASE}/api/share/generated-link`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ 
        game_id: gameId,
        platform
      })
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message);
    }

    return res.json();
  }

};