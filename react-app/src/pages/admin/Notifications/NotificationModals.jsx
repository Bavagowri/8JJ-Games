// react-app/src/pages/admin/Notifications/NotificationModals.jsx

import { useState, useEffect } from 'react';
import { notificationAPI } from '../../../api/notification.api';
import { adminAPI } from '../../../api/admin.api';
import '../styles/Modal.css';

/* ================= QUICK SEND MODAL ================= */
export function QuickSendModal({ isOpen, onClose, onSuccess, presetData = null }) {
  const [formData, setFormData] = useState({
    userId: '',
    type: 'system',
    title: '',
    message: '',
    priority: 'normal',
    actionUrl: '',
    actionText: '',
    imageUrl: '',
    expiresAt: '',
    scheduledFor: ''
  });
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchUser, setSearchUser] = useState('');
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadUsers();
      
      // Pre-fill with preset data if provided
      if (presetData) {
        setFormData(prev => ({
          ...prev,
          type: presetData.type || 'system',
          title: presetData.title || '',
          message: presetData.message || '',
          priority: presetData.priority || 'normal',
          imageUrl: presetData.image_url || ''
        }));
      }
    } else {
      // Reset form when modal closes
      resetForm();
    }
  }, [isOpen, presetData]);

  const loadUsers = async () => {
    try {
      const data = await adminAPI.getAllUsers({ page: 1, limit: 100 });
      setUsers(data?.users || []);
    } catch (err) {
      console.error('Failed to load users:', err);
    }
  };

  const resetForm = () => {
    setFormData({
      userId: '',
      type: 'system',
      title: '',
      message: '',
      priority: 'normal',
      actionUrl: '',
      actionText: '',
      imageUrl: '',
      expiresAt: '',
      scheduledFor: ''
    });
    setSearchUser('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.userId || !formData.title || !formData.message) {
      alert('Please fill in required fields: User, Title, and Message');
      return;
    }

    try {
      setLoading(true);
      await notificationAPI.sendToUser({
        userId: parseInt(formData.userId),
        type: formData.type,
        title: formData.title,
        message: formData.message,
        priority: formData.priority,
        actionUrl: formData.actionUrl || null,
        actionText: formData.actionText || null,
        imageUrl: formData.imageUrl || null,
        expiresAt: formData.expiresAt || null,
        scheduledFor: formData.scheduledFor || null
      });

      alert(formData.scheduledFor 
        ? 'Notification scheduled successfully!' 
        : 'Notification sent successfully!'
      );
      
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error('Failed to send notification:', err);
      alert('Failed to send notification: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(searchUser.toLowerCase()) ||
    u.email.toLowerCase().includes(searchUser.toLowerCase())
  );

  const selectedUser = users.find(u => u.id === parseInt(formData.userId));

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>📤 Send Notification</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          {/* User Selection */}
          <div className="form-group">
            <label>Recipient User *</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Search by username or email..."
                value={searchUser}
                onChange={(e) => {
                  setSearchUser(e.target.value);
                  setShowUserDropdown(true);
                }}
                onFocus={() => setShowUserDropdown(true)}
                className="form-input"
                required
              />
              
              {selectedUser && (
                <div style={{
                  marginTop: '8px',
                  padding: '8px 12px',
                  background: 'rgba(79, 172, 254, 0.1)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span style={{ fontWeight: '600' }}>{selectedUser.username}</span>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                    ({selectedUser.email})
                  </span>
                </div>
              )}

              {showUserDropdown && searchUser && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  marginTop: '4px',
                  background: 'var(--card-bg)',
                  border: '1px solid var(--card-border)',
                  borderRadius: '8px',
                  maxHeight: '200px',
                  overflowY: 'auto',
                  zIndex: 1000,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }}>
                  {filteredUsers.length === 0 ? (
                    <div style={{ padding: '12px', color: 'var(--text-secondary)' }}>
                      No users found
                    </div>
                  ) : (
                    filteredUsers.map(user => (
                      <div
                        key={user.id}
                        onClick={() => {
                          setFormData(prev => ({ ...prev, userId: user.id }));
                          setSearchUser(user.username);
                          setShowUserDropdown(false);
                        }}
                        style={{
                          padding: '10px 12px',
                          cursor: 'pointer',
                          borderBottom: '1px solid var(--card-border)',
                          transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.background = 'rgba(79, 172, 254, 0.05)'}
                        onMouseLeave={(e) => e.target.style.background = 'transparent'}
                      >
                        <div style={{ fontWeight: '600', marginBottom: '2px' }}>
                          {user.username}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                          {user.email}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Type */}
          <div className="form-group">
            <label>Notification Type *</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
              className="form-input"
              required
            >
              <option value="system">System</option>
              <option value="achievement">Achievement</option>
              <option value="game_update">Game Update</option>
              <option value="new_game">New Game</option>
              <option value="level_up">Level Up</option>
              <option value="community_event">Community Event</option>
              <option value="admin_announcement">Admin Announcement</option>
              <option value="maintenance_alert">Maintenance Alert</option>
              <option value="promotional_offer">Promotional Offer</option>
              <option value="tournament_announcement">Tournament</option>
            </select>
          </div>

          {/* Priority */}
          <div className="form-group">
            <label>Priority</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
              className="form-input"
            >
              <option value="low">Low</option>
              <option value="normal">Normal</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          {/* Title */}
          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Notification title"
              className="form-input"
              required
            />
          </div>

          {/* Message */}
          <div className="form-group">
            <label>Message *</label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              placeholder="Notification message"
              className="form-input"
              rows="4"
              required
            />
          </div>

          {/* Action URL */}
          <div className="form-group">
            <label>Action URL (Optional)</label>
            <input
              type="url"
              value={formData.actionUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, actionUrl: e.target.value }))}
              placeholder="https://example.com/action"
              className="form-input"
            />
          </div>

          {/* Action Text */}
          {formData.actionUrl && (
            <div className="form-group">
              <label>Action Button Text</label>
              <input
                type="text"
                value={formData.actionText}
                onChange={(e) => setFormData(prev => ({ ...prev, actionText: e.target.value }))}
                placeholder="View Details"
                className="form-input"
              />
            </div>
          )}

          {/* Image URL */}
          <div className="form-group">
            <label>Image URL (Optional)</label>
            <input
              type="url"
              value={formData.imageUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
              placeholder="https://example.com/image.jpg"
              className="form-input"
            />
          </div>

          {/* Schedule For */}
          {/* <div className="form-group">
            <label>Schedule For (Optional)</label>
            <input
              type="datetime-local"
              value={formData.scheduledFor}
              onChange={(e) => setFormData(prev => ({ ...prev, scheduledFor: e.target.value }))}
              className="form-input"
            />
            <small style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
              Leave empty to send immediately
            </small>
          </div> */}

          {/* Expires At */}
          {/* <div className="form-group">
            <label>Expires At (Optional)</label>
            <input
              type="datetime-local"
              value={formData.expiresAt}
              onChange={(e) => setFormData(prev => ({ ...prev, expiresAt: e.target.value }))}
              className="form-input"
            />
            <small style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
              Notification will be hidden after this time
            </small>
          </div> */}

          {/* Form Actions */}
          <div className="modal-footer">
            <button
              type="button"
              onClick={onClose}
              className="admin-button admin-button-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="admin-button admin-button-primary"
              disabled={loading}
            >
              {loading ? 'Sending...' : formData.scheduledFor ? 'Schedule' : 'Send Now'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ================= TEMPLATE MODAL ================= */
export function TemplateModal({ isOpen, onClose, onSuccess, template = null }) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'system',
    category: 'info',
    title: '',
    message: '',
    variables: '',
    imageUrl: '',
    isFeatured: false
  });
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && template) {
      setFormData({
        name: template.name || '',
        type: template.type || 'system',
        category: template.category || 'info',
        title: template.title || '',
        message: template.message || '',
        variables: Array.isArray(template.variables) 
          ? template.variables.join(', ') 
          : '',
        imageUrl: template.image_url || '',
        isFeatured: template.is_featured || false
      });
    } else if (!isOpen) {
      resetForm();
    }
  }, [isOpen, template]);

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'system',
      category: 'info',
      title: '',
      message: '',
      variables: '',
      imageUrl: '',
      isFeatured: false
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      const data = {
        name: formData.name,
        type: formData.type,
        category: formData.category,
        title: formData.title,
        message: formData.message,
        variables: formData.variables 
          ? formData.variables.split(',').map(v => v.trim()).filter(Boolean)
          : [],
        image_url: formData.imageUrl || null,
        is_featured: formData.isFeatured
      };

      if (template) {
        await notificationAPI.updateTemplate(template.id, data);
        alert('Template updated successfully!');
      } else {
        await notificationAPI.createTemplate(data);
        alert('Template created successfully!');
      }
      
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error('Failed to save template:', err);
      alert('Failed to save template: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{template ? '✏️ Edit Template' : '➕ Create Template'}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-group">
            <label>Template Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., welcome_message"
              className="form-input"
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label>Type *</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                className="form-input"
                required
              >
                <option value="system">System</option>
                <option value="achievement">Achievement</option>
                <option value="game_update">Game Update</option>
                <option value="new_game">New Game</option>
                <option value="level_up">Level Up</option>
                <option value="community_event">Community Event</option>
                <option value="admin_announcement">Admin Announcement</option>
                <option value="maintenance_alert">Maintenance Alert</option>
                <option value="promotional_offer">Promotional Offer</option>
                <option value="tournament_announcement">Tournament</option>
              </select>
            </div>

            <div className="form-group">
              <label>Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="form-input"
                required
              >
                <option value="info">Info</option>
                <option value="warning">Warning</option>
                <option value="success">Success</option>
                <option value="error">Error</option>
                <option value="promotional">Promotional</option>
              </select>
            </div>

            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
                />
                Featured Template
              </label>
            </div>
          </div>

          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., Welcome to 8JJ Games!"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label>Message *</label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              placeholder="Use {{variable}} for dynamic content"
              className="form-input"
              rows="4"
              required
            />
          </div>

          <div className="form-group">
            <label>Variables (comma-separated)</label>
            <input
              type="text"
              value={formData.variables}
              onChange={(e) => setFormData(prev => ({ ...prev, variables: e.target.value }))}
              placeholder="username, game_title, points"
              className="form-input"
            />
            <small style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
              Variables that can be replaced when sending
            </small>
          </div>

          <div className="form-group">
            <label>Image URL (Optional)</label>
            <input
              type="url"
              value={formData.imageUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
              placeholder="https://example.com/image.jpg"
              className="form-input"
            />
          </div>

          <div className="modal-footer">
            <button
              type="button"
              onClick={onClose}
              className="admin-button admin-button-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="admin-button admin-button-primary"
              disabled={loading}
            >
              {loading ? 'Saving...' : template ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ================= CAMPAIGN MODAL ================= */
export function CampaignModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    targetType: 'all',
    title: '',
    message: '',
    priority: 'normal',
    actionUrl: '',
    actionText: '',
    imageUrl: '',
    scheduledAt: '',
    abTestEnabled: false,
    variantATitle: '',
    variantAMessage: '',
    variantBTitle: '',
    variantBMessage: ''
  });
  
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      const data = {
        name: formData.name,
        targetType: formData.targetType,
        segmentType: formData.targetType,
        title: formData.title,
        message: formData.message,
        priority: formData.priority,
        actionUrl: formData.actionUrl || null,
        actionText: formData.actionText || null,
        imageUrl: formData.imageUrl || null,
        scheduledAt: formData.scheduledAt || null,
        abTestEnabled: formData.abTestEnabled,
        variantATitle: formData.abTestEnabled ? formData.variantATitle : null,
        variantAMessage: formData.abTestEnabled ? formData.variantAMessage : null,
        variantBTitle: formData.abTestEnabled ? formData.variantBTitle : null,
        variantBMessage: formData.abTestEnabled ? formData.variantBMessage : null
      };

      await notificationAPI.createCampaign(data);
      alert('Campaign created successfully!');
      
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error('Failed to create campaign:', err);
      alert('Failed to create campaign: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '700px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>📢 Create Campaign</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-group">
            <label>Campaign Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., New Year Promotion"
              className="form-input"
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label>Target Audience *</label>
              <select
                value={formData.targetType}
                onChange={(e) => setFormData(prev => ({ ...prev, targetType: e.target.value }))}
                className="form-input"
                required
              >
                <option value="all">All Users</option>
                <option value="active">Active Users</option>
                <option value="inactive">Inactive Users</option>
                <option value="new">New Users (Last 7 Days)</option>
                <option value="returning">Returning Users</option>
                <option value="high_engagement">High Engagement</option>
                <option value="verified_users">Verified Users</option>
              </select>
            </div>

            <div className="form-group">
              <label>Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                className="form-input"
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Campaign title"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label>Message *</label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              placeholder="Campaign message"
              className="form-input"
              rows="4"
              required
            />
          </div>

          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="checkbox"
                checked={formData.abTestEnabled}
                onChange={(e) => setFormData(prev => ({ ...prev, abTestEnabled: e.target.checked }))}
              />
              Enable A/B Testing
            </label>
          </div>

          {formData.abTestEnabled && (
            <div style={{ 
              padding: '16px', 
              background: 'rgba(79, 172, 254, 0.05)', 
              borderRadius: '8px',
              marginBottom: '16px'
            }}>
              <h4 style={{ marginBottom: '16px', fontSize: '14px', fontWeight: '600' }}>
                🧪 A/B Test Variants
              </h4>
              
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontWeight: '600', marginBottom: '8px', display: 'block' }}>
                  Variant A
                </label>
                <input
                  type="text"
                  value={formData.variantATitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, variantATitle: e.target.value }))}
                  placeholder="Variant A Title"
                  className="form-input"
                  style={{ marginBottom: '8px' }}
                />
                <textarea
                  value={formData.variantAMessage}
                  onChange={(e) => setFormData(prev => ({ ...prev, variantAMessage: e.target.value }))}
                  placeholder="Variant A Message"
                  className="form-input"
                  rows="2"
                />
              </div>

              <div>
                <label style={{ fontWeight: '600', marginBottom: '8px', display: 'block' }}>
                  Variant B
                </label>
                <input
                  type="text"
                  value={formData.variantBTitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, variantBTitle: e.target.value }))}
                  placeholder="Variant B Title"
                  className="form-input"
                  style={{ marginBottom: '8px' }}
                />
                <textarea
                  value={formData.variantBMessage}
                  onChange={(e) => setFormData(prev => ({ ...prev, variantBMessage: e.target.value }))}
                  placeholder="Variant B Message"
                  className="form-input"
                  rows="2"
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label>Schedule For (Optional)</label>
            <input
              type="datetime-local"
              value={formData.scheduledAt}
              onChange={(e) => setFormData(prev => ({ ...prev, scheduledAt: e.target.value }))}
              className="form-input"
            />
          </div>

          <div className="modal-footer">
            <button
              type="button"
              onClick={onClose}
              className="admin-button admin-button-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="admin-button admin-button-primary"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Campaign'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}