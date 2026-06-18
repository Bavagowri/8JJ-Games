// react-app/src/api/banner.api.js
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

export const bannerAPI = {
  /* ================= PUBLIC API ================= */
  
  // Get banner by placement key (matches backend: /api/banners/placement/:placementKey)
  getByPlacement: async (placementKey) => {
    const res = await fetch(`${API_BASE}/api/banners/placement/${placementKey}`);
    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: 'Failed to fetch banner' }));
      throw new Error(error.message || 'Failed to fetch banner');
    }
    return res.json();
  },

  // Track impression
  trackImpression: async (bannerId, slideId = null) => {
    const headers = { 'Content-Type': 'application/json' };
    const token = localStorage.getItem('token');
    if (token) headers['Authorization'] = `Bearer ${token}`;
    
    const res = await fetch(`${API_BASE}/api/banners/track`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ 
        banner_id: bannerId, 
        slide_id: slideId,
        event_type: 'impression',
        page_url: window.location.href,
        device_type: /mobile/i.test(navigator.userAgent) ? 'mobile' : 'desktop'
      })
    });
    
    if (!res.ok) throw new Error('Failed to track impression');
    return res.json();
  },

  // Track click
  trackClick: async (bannerId, slideId = null) => {
    const headers = { 'Content-Type': 'application/json' };
    const token = localStorage.getItem('token');
    if (token) headers['Authorization'] = `Bearer ${token}`;
    
    const res = await fetch(`${API_BASE}/api/banners/track`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ 
        banner_id: bannerId, 
        slide_id: slideId,
        event_type: 'click',
        page_url: window.location.href,
        device_type: /mobile/i.test(navigator.userAgent) ? 'mobile' : 'desktop'
      })
    });
    
    if (!res.ok) throw new Error('Failed to track click');
    return res.json();
  },

  /* ================= ADMIN API - TEMPLATES ================= */
  
  getTemplates: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/api/banners/admin/templates${query ? '?' + query : ''}`, {
      headers: getAuthHeaders()
    });
    
    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: 'Failed to fetch templates' }));
      throw new Error(error.message || 'Failed to fetch templates');
    }
    
    return res.json();
  },

  getTemplate: async (templateId) => {
    const res = await fetch(`${API_BASE}/api/banners/admin/templates/${templateId}`, {
      headers: getAuthHeaders()
    });
    
    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: 'Failed to fetch template' }));
      throw new Error(error.message || 'Failed to fetch template');
    }
    
    return res.json();
  },

  updateTemplate: async (templateId, data) => {
    const res = await fetch(`${API_BASE}/api/banners/admin/templates/${templateId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    
    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: 'Failed to update template' }));
      throw new Error(error.message || 'Failed to update template');
    }
    
    return res.json();
  },

  toggleTemplate: async (templateId) => {
    const res = await fetch(`${API_BASE}/api/banners/admin/templates/${templateId}/toggle`, {
      method: 'PATCH',
      headers: getAuthHeaders()
    });
    
    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: 'Failed to toggle template' }));
      throw new Error(error.message || 'Failed to toggle template');
    }
    
    return res.json();
  },

  /* ================= ADMIN API - PLACEMENTS ================= */
  
  getPlacements: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/api/banners/admin/placements${query ? '?' + query : ''}`, {
      headers: getAuthHeaders()
    });
    
    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: 'Failed to fetch placements' }));
      throw new Error(error.message || 'Failed to fetch placements');
    }
    
    return res.json();
  },

  getPlacement: async (placementId) => {
    const res = await fetch(`${API_BASE}/api/banners/admin/placements/${placementId}`, {
      headers: getAuthHeaders()
    });
    
    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: 'Failed to fetch placement' }));
      throw new Error(error.message || 'Failed to fetch placement');
    }
    
    return res.json();
  },

  createPlacement: async (data) => {
    const res = await fetch(`${API_BASE}/api/banners/admin/placements`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    
    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: 'Failed to create placement' }));
      throw new Error(error.message || 'Failed to create placement');
    }
    
    return res.json();
  },

  updatePlacement: async (placementId, data) => {
    const res = await fetch(`${API_BASE}/api/banners/admin/placements/${placementId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    
    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: 'Failed to update placement' }));
      throw new Error(error.message || 'Failed to update placement');
    }
    
    return res.json();
  },

  deletePlacement: async (placementId) => {
    const res = await fetch(`${API_BASE}/api/banners/admin/placements/${placementId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    
    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: 'Failed to delete placement' }));
      throw new Error(error.message || 'Failed to delete placement');
    }
    
    return res.json();
  },

  togglePlacement: async (placementId) => {
    const res = await fetch(`${API_BASE}/api/banners/admin/placements/${placementId}/toggle`, {
      method: 'PATCH',
      headers: getAuthHeaders()
    });
    
    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: 'Failed to toggle placement' }));
      throw new Error(error.message || 'Failed to toggle placement');
    }
    
    return res.json();
  },

  /* ================= ADMIN API - BANNERS ================= */
  
  getBanners: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/api/banners/admin/banners${query ? '?' + query : ''}`, {
      headers: getAuthHeaders()
    });
    
    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: 'Failed to fetch banners' }));
      throw new Error(error.message || 'Failed to fetch banners');
    }
    
    return res.json();
  },

  getBanner: async (bannerId) => {
    const res = await fetch(`${API_BASE}/api/banners/admin/banners/${bannerId}`, {
      headers: getAuthHeaders()
    });
    
    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: 'Failed to fetch banner' }));
      throw new Error(error.message || 'Failed to fetch banner');
    }
    
    return res.json();
  },

  createBanner: async (data) => {
    const res = await fetch(`${API_BASE}/api/banners/admin/banners`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    
    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: 'Failed to create banner' }));
      throw new Error(error.message || 'Failed to create banner');
    }
    
    return res.json();
  },

  updateBanner: async (bannerId, data) => {
    const res = await fetch(`${API_BASE}/api/banners/admin/banners/${bannerId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    
    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: 'Failed to update banner' }));
      throw new Error(error.message || 'Failed to update banner');
    }
    
    return res.json();
  },

  deleteBanner: async (bannerId) => {
    const res = await fetch(`${API_BASE}/api/banners/admin/banners/${bannerId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    
    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: 'Failed to delete banner' }));
      throw new Error(error.message || 'Failed to delete banner');
    }
    
    return res.json();
  },

  toggleBanner: async (bannerId) => {
    const res = await fetch(`${API_BASE}/api/banners/admin/banners/${bannerId}/toggle`, {
      method: 'PATCH',
      headers: getAuthHeaders()
    });
    
    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: 'Failed to toggle banner' }));
      throw new Error(error.message || 'Failed to toggle banner');
    }
    
    return res.json();
  },

  getBannerAnalytics: async (bannerId, days = 30) => {
    const res = await fetch(`${API_BASE}/api/banners/admin/banners/${bannerId}/analytics?days=${days}`, {
      headers: getAuthHeaders()
    });
    
    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: 'Failed to fetch analytics' }));
      throw new Error(error.message || 'Failed to fetch analytics');
    }
    
    return res.json();
  },

  /* ================= ADMIN API - SLIDES ================= */
  
  addSlide: async (bannerId, data) => {
    const res = await fetch(`${API_BASE}/api/banners/admin/banners/${bannerId}/slides`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    
    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: 'Failed to add slide' }));
      throw new Error(error.message || 'Failed to add slide');
    }
    
    return res.json();
  },

  updateSlide: async (slideId, data) => {
    const res = await fetch(`${API_BASE}/api/banners/admin/slides/${slideId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    
    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: 'Failed to update slide' }));
      throw new Error(error.message || 'Failed to update slide');
    }
    
    return res.json();
  },

  deleteSlide: async (slideId) => {
    const res = await fetch(`${API_BASE}/api/banners/admin/slides/${slideId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    
    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: 'Failed to delete slide' }));
      throw new Error(error.message || 'Failed to delete slide');
    }
    
    return res.json();
  },

  reorderSlides: async (bannerId, slides) => {
    const res = await fetch(`${API_BASE}/api/banners/admin/banners/${bannerId}/slides/reorder`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ slides })
    });
    
    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: 'Failed to reorder slides' }));
      throw new Error(error.message || 'Failed to reorder slides');
    }
    
    return res.json();
  },

  /* ================= ADMIN API - GAMES ================= */
  
  addGame: async (bannerId, data) => {
    const res = await fetch(`${API_BASE}/api/banners/admin/banners/${bannerId}/games`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    
    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: 'Failed to add game' }));
      throw new Error(error.message || 'Failed to add game');
    }
    
    return res.json();
  },

  updateGame: async (gameId, data) => {
    const res = await fetch(`${API_BASE}/api/banners/admin/games/${gameId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    
    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: 'Failed to update game' }));
      throw new Error(error.message || 'Failed to update game');
    }
    
    return res.json();
  },

  removeGame: async (gameId) => {
    const res = await fetch(`${API_BASE}/api/banners/admin/games/${gameId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    
    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: 'Failed to remove game' }));
      throw new Error(error.message || 'Failed to remove game');
    }
    
    return res.json();
  },

  /* ================= ALIASES FOR COMPATIBILITY ================= */
  
  getAllBanners: async function(params = {}) {
    return this.getBanners(params);
  },

  getAllPlacements: async function(params = {}) {
    return this.getPlacements(params);
  },

  getAllTemplates: async function(params = {}) {
    return this.getTemplates(params);
  }
};