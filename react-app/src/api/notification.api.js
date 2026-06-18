// react-app/src/api/notification.api.js


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

export const notificationAPI = {
  /* ================= USER API ================= */

  // Get user notifications
  getNotifications: async (params = {}) => {
    const query = new URLSearchParams({
      page: params.page || 1,
      limit: params.limit || 20,
      type: params.type || 'all',
      unread_only: params.unreadOnly || false
    }).toString();

    const res = await fetch(`${API_BASE}/api/notifications?${query}`, {
      headers: getAuthHeaders()
    });

    if (!res.ok) {
      throw new Error('Failed to fetch notifications');
    }

    return res.json();
  },

  // Get unread count
  getUnreadCount: async () => {
    const res = await fetch(`${API_BASE}/api/notifications/unread-count`, {
      headers: getAuthHeaders()
    });

    if (!res.ok) {
      throw new Error('Failed to fetch unread count');
    }

    return res.json();
  },

  // Mark as read
  markAsRead: async (notificationId) => {
    const res = await fetch(`${API_BASE}/api/notifications/${notificationId}/read`, {
      method: 'PATCH',
      headers: getAuthHeaders()
    });

    if (!res.ok) {
      throw new Error('Failed to mark as read');
    }

    return res.json();
  },

  // Mark all as read
  markAllAsRead: async () => {
    const res = await fetch(`${API_BASE}/api/notifications/read-all`, {
      method: 'PATCH',
      headers: getAuthHeaders()
    });

    if (!res.ok) {
      throw new Error('Failed to mark all as read');
    }

    return res.json();
  },

  // Delete notification
  deleteNotification: async (notificationId) => {
    const res = await fetch(`${API_BASE}/api/notifications/${notificationId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    if (!res.ok) {
      throw new Error('Failed to delete notification');
    }

    return res.json();
  },

  // Clear all notifications
  clearAll: async () => {
    const res = await fetch(`${API_BASE}/api/notifications`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    if (!res.ok) {
      throw new Error('Failed to clear notifications');
    }

    return res.json();
  },

  // Get preferences
  getPreferences: async () => {
    const res = await fetch(`${API_BASE}/api/notifications/preferences`, {
      headers: getAuthHeaders()
    });

    if (!res.ok) {
      throw new Error('Failed to fetch preferences');
    }

    return res.json();
  },

  // Update preferences
  updatePreferences: async (preferences) => {
    const res = await fetch(`${API_BASE}/api/notifications/preferences`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(preferences)
    });

    if (!res.ok) {
      throw new Error('Failed to update preferences');
    }

    return res.json();
  },

  /* ================= ADMIN API ================= */

  // Get notification stats (enhanced)
  getStats: async () => {
    const res = await fetch(`${API_BASE}/api/notifications/admin/stats`, {
      headers: getAuthHeaders()
    });

    if (!res.ok) {
      throw new Error('Failed to fetch stats');
    }

    return res.json();
  },

  // Get categories
  getCategories: async () => {
    const res = await fetch(`${API_BASE}/api/notifications/admin/categories`, {
      headers: getAuthHeaders()
    });

    if (!res.ok) {
      throw new Error('Failed to fetch categories');
    }

    return res.json();
  },

  // Template management
  getTemplates: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.category) query.append('category', params.category);
    if (params.featured) query.append('featured', params.featured);
    
    const queryString = query.toString();
    const url = queryString 
      ? `${API_BASE}/api/notifications/admin/templates?${queryString}`
      : `${API_BASE}/api/notifications/admin/templates`;

    const res = await fetch(url, {
      headers: getAuthHeaders()
    });

    if (!res.ok) {
      throw new Error('Failed to fetch templates');
    }

    return res.json();
  },

  createTemplate: async (template) => {
    const res = await fetch(`${API_BASE}/api/notifications/admin/templates`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(template)
    });

    if (!res.ok) {
      throw new Error('Failed to create template');
    }

    return res.json();
  },

  updateTemplate: async (templateId, template) => {
    const res = await fetch(`${API_BASE}/api/notifications/admin/templates/${templateId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(template)
    });

    if (!res.ok) {
      throw new Error('Failed to update template');
    }

    return res.json();
  },

  deleteTemplate: async (templateId) => {
    const res = await fetch(`${API_BASE}/api/notifications/admin/templates/${templateId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    if (!res.ok) {
      throw new Error('Failed to delete template');
    }

    return res.json();
  },

  // Presets management
  getPresets: async () => {
    const res = await fetch(`${API_BASE}/api/notifications/admin/presets`, {
      headers: getAuthHeaders()
    });

    if (!res.ok) {
      throw new Error('Failed to fetch presets');
    }

    return res.json();
  },

  // Send notification to single user
  sendToUser: async (notification) => {
    const res = await fetch(`${API_BASE}/api/notifications/admin/send`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(notification)
    });

    if (!res.ok) {
      throw new Error('Failed to send notification');
    }

    return res.json();
  },

  // Bulk send to multiple users
  bulkSend: async (notification) => {
    const res = await fetch(`${API_BASE}/api/notifications/admin/bulk-send`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(notification)
    });

    if (!res.ok) {
      throw new Error('Failed to bulk send notifications');
    }

    return res.json();
  },

  // Campaign management
  getCampaigns: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.status) query.append('status', params.status);
    if (params.segment_type) query.append('segment_type', params.segment_type);
    
    const queryString = query.toString();
    const url = queryString 
      ? `${API_BASE}/api/notifications/admin/campaigns?${queryString}`
      : `${API_BASE}/api/notifications/admin/campaigns`;

    const res = await fetch(url, {
      headers: getAuthHeaders()
    });

    if (!res.ok) {
      throw new Error('Failed to fetch campaigns');
    }

    return res.json();
  },

  createCampaign: async (campaign) => {
    const res = await fetch(`${API_BASE}/api/notifications/admin/campaigns`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(campaign)
    });

    if (!res.ok) {
      throw new Error('Failed to create campaign');
    }

    return res.json();
  },

  sendCampaign: async (campaignId) => {
    const res = await fetch(`${API_BASE}/api/notifications/admin/campaigns/${campaignId}/send`, {
      method: 'POST',
      headers: getAuthHeaders()
    });

    if (!res.ok) {
      throw new Error('Failed to send campaign');
    }

    return res.json();
  },

  /* ================= UTILITY FUNCTIONS ================= */

  // Test notification (for development)
  testNotification: async () => {
    const testData = {
      userId: 1, // You can change this
      type: 'system',
      title: 'Test Notification',
      message: 'This is a test notification from the enhanced system!',
      priority: 'normal'
    };

    return notificationAPI.sendToUser(testData);
  }
};