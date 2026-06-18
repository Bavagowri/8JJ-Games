// react-app/src/api/chatAdmin.api.js

const API_BASE = import.meta.env.VITE_API_URL;
if (!API_BASE) throw new Error('❌ VITE_API_URL is not defined');

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
};

export const chatAdminAPI = {
  // Stats
  getStats: async () => {
    const res = await fetch(`${API_BASE}/api/chat-admin/stats`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch chat stats');
    return res.json();
  },

  // Messages
  getMessages: async (params = {}) => {
    const query = new URLSearchParams({
      page: params.page || 1,
      limit: params.limit || 30,
      channel: params.channel || '',
      search: params.search || '',
    }).toString();
    const res = await fetch(`${API_BASE}/api/chat-admin/messages?${query}`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch messages');
    return res.json();
  },

  deleteMessage: async (messageId) => {
    const res = await fetch(`${API_BASE}/api/chat-admin/messages/${messageId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete message');
    return res.json();
  },

  bulkDeleteMessages: async (messageIds) => {
    const res = await fetch(`${API_BASE}/api/chat-admin/messages/bulk-delete`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ messageIds }),
    });
    if (!res.ok) throw new Error('Failed to bulk delete messages');
    return res.json();
  },

  // Channels
  getChannels: async () => {
    const res = await fetch(`${API_BASE}/api/chat-admin/channels`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch channels');
    return res.json();
  },

  updateChannel: async (channelId, data) => {
    const res = await fetch(`${API_BASE}/api/chat-admin/channels/${channelId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update channel');
    return res.json();
  },

  createChannel: async (data) => {
    const res = await fetch(`${API_BASE}/api/chat-admin/channels`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create channel');
    return res.json();
  },

  deleteChannel: async (channelId) => {
    const res = await fetch(`${API_BASE}/api/chat-admin/channels/${channelId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete channel');
    return res.json();
  },

  // Online users
  getOnlineUsers: async () => {
    const res = await fetch(`${API_BASE}/api/chat-admin/online-users`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch online users');
    return res.json();
  },

  // Broadcast system message
  broadcastMessage: async (data) => {
    const res = await fetch(`${API_BASE}/api/chat-admin/broadcast`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to broadcast message');
    return res.json();
  },
};