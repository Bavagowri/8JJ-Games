// react-app/src/api/chat.api.js

const API_BASE = import.meta.env.VITE_API_URL;
if (!API_BASE) {
  throw new Error("❌ VITE_API_URL is not defined");
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export const chatAPI = {
  // Get all active channels
  getChannels: async () => {
    const res = await fetch(`${API_BASE}/api/chat/channels`, {
      headers: getAuthHeaders()
    });

    if (!res.ok) {
      throw new Error('Failed to fetch channels');
    }

    return res.json();
  },

  // Get single channel by ID
  getChannel: async (channelId) => {
    const res = await fetch(`${API_BASE}/api/chat/channels/${channelId}`, {
      headers: getAuthHeaders()
    });

    if (!res.ok) {
      throw new Error('Failed to fetch channel');
    }

    return res.json();
  }
};