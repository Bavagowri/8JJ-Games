// react-app/src/api/admin.api.js
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

export const adminAPI = {
  // User Management
  getAllUsers: async (params = {}) => {
    const safeParams = {
      page: parseInt(params.page, 10) || 1,
      limit: parseInt(params.limit, 10) || 10,
      search: params.search || '',
      role: params.role || '',
      status: params.status || '',
      verified: params.verified || ''
    };

    const query = new URLSearchParams(safeParams).toString();
    const res = await fetch(`${API_BASE}/api/admin/users?${query}`, {
      headers: getAuthHeaders()
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: 'Failed to fetch users' }));
      throw new Error(error.message || 'Failed to fetch users');
    }

    return res.json();
  },

  toggleUserStatus: async (userId) => {
    const res = await fetch(`${API_BASE}/api/admin/users/${userId}/toggle`, {
      method: 'PATCH',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to toggle user status');
    return res.json();
  },

  getUserById: async (userId) => {
    const res = await fetch(`${API_BASE}/api/admin/users/${userId}`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch user');
    return res.json();
  },

  updateUser: async (userId, data) => {
    const res = await fetch(`${API_BASE}/api/admin/users/${userId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update user');
    return res.json();
  },

  deleteUser: async (userId) => {
    const res = await fetch(`${API_BASE}/api/admin/users/${userId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete user');
    return res.json();
  },

  // Dashboard & Analytics
  getDashboardStats: async () => {
    const res = await fetch(`${API_BASE}/api/admin/stats`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch stats');
    return res.json();
  },

  getUserGrowth: async (days = 30) => {
    const res = await fetch(`${API_BASE}/api/admin/analytics/user-growth?days=${parseInt(days, 10)}`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch user growth');
    return res.json();
  },

  getProviderStats: async () => {
    const res = await fetch(`${API_BASE}/api/admin/analytics/providers`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch provider stats');
    return res.json();
  },

  // ================= POINTS RULES =================

  getAllPointRules: async () => {
    const res = await fetch(`${API_BASE}/api/admin/points/rules`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error("Failed to fetch rules");
    return res.json();
  },

  createPointRule: async (data) => {
    const res = await fetch(`${API_BASE}/api/admin/points/rules`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Failed to create rule");
    return res.json();
  },

  updatePointRule: async (id, data) => {
    const res = await fetch(`${API_BASE}/api/admin/points/rules/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Failed to update rule");
    return res.json();
  },

  deletePointRule: async (id) => {
    const res = await fetch(`${API_BASE}/api/admin/points/rules/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error("Failed to delete rule");
    return res.json();
  },

  // ================= USER POINTS =================

  getUserTransactions: async (userId) => {
    const res = await fetch(`${API_BASE}/api/admin/points/user/${userId}`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error("Failed to fetch transactions");
    return res.json();
  },

  getUserTotalPoints: async (userId) => {
    const res = await fetch(`${API_BASE}/api/admin/points/user/${userId}/total`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error("Failed to fetch total points");
    return res.json();
  },

  adjustUserPoints: async (data) => {
    const res = await fetch(`${API_BASE}/api/admin/points/adjust`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Failed to adjust points");
    return res.json();
  },

  getUsersWithPoints: async () => {
    const res = await fetch(`${API_BASE}/api/admin/points/users-with-points`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error("Failed to fetch users");
    return res.json();
  },

  bulkAdjustPoints: async (data) => {
    const res = await fetch(`${API_BASE}/api/admin/points/bulk-adjust`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message);
    }
    return res.json();
  }
};
