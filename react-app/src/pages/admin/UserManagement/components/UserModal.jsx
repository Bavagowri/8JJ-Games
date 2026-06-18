
// react-app/src/pages/admin/UserManagement/components/UserModal.jsx

import { useState, useEffect } from 'react';
import '../../styles/shared.css';
import '../../styles/UserManagement.css';

export default function UserModal({ user, onClose, onUpdate }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    role: 'user',
    is_verified: false,
    is_active: true,
    about_me: ''
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (user) {
      const initialData = {
        username: user.username || '',
        email: user.email || '',
        role: user.role || 'user',
        is_verified: user.is_verified || false,
        is_active: user.is_active !== undefined ? user.is_active : true,
        about_me: user.about_me || ''
      };
      setFormData(initialData);
    }
  }, [user]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
    setError(null);
  };

  const validateForm = () => {
    if (!formData.username || formData.username.trim().length < 3) {
      return 'Username must be at least 3 characters long';
    }
    if (formData.username.length > 50) {
      return 'Username cannot exceed 50 characters';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      return 'Please enter a valid email address';
    }

    if (formData.about_me && formData.about_me.length > 500) {
      return 'About me cannot exceed 500 characters';
    }

    return null;
  };

  const handleSubmit = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);
    setError(null);
    
    try {
      await onUpdate(user.id, formData);
      setSuccess(true);
      setIsDirty(false);
      
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err) {
      console.error('Update error:', err);
      setError(err.message || 'Failed to update user. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    if (isDirty && !success) {
      if (confirm('You have unsaved changes. Are you sure you want to close?')) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isOAuthUser = user.provider === 'google';

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">👤 User Details</h2>
          <button className="modal-close-btn" onClick={handleClose}>×</button>
        </div>

        <div className="modal-body">
          {/* Success Message */}
          {success && (
            <div className="alert alert-success">
              <span>✅</span>
              <span>User updated successfully!</span>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="alert alert-error">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* User Info Section */}
          <div className="user-info-section">
            <div className="user-info-grid">
              <div className="info-item">
                <span className="info-label">User ID:</span>
                <strong className="info-value info-value-primary">#{user.id}</strong>
              </div>
              
              <div className="info-item">
                <span className="info-label">Role:</span>
                <strong className="info-value">
                  {user.role}
                </strong>
              </div>
              
              <div className="info-item">
                <span className="info-label">Joined:</span>
                <strong className="info-value info-date">{formatDate(user.created_at)}</strong>
              </div>
              
              <div className="info-item">
                <span className="info-label">Last Updated:</span>
                <strong className="info-value info-date">{formatDate(user.updated_at)}</strong>
              </div>
            </div>
            {/* {user.stats && (
              <div style={{ 
                display: 'flex',
                gap: '16px',
                marginTop: '16px',
                paddingTop: '16px',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <div>
                  <span style={{ color: '#888', fontSize: '12px' }}>Collections:</span>
                  <strong style={{ 
                    marginLeft: '8px',
                    color: '#00d9ff',
                    fontSize: '16px'
                  }}>
                    {user.stats.collections || 0}
                  </strong>
                </div>
                <div>
                  <span style={{ color: '#888', fontSize: '12px' }}>Activities:</span>
                  <strong style={{ 
                    marginLeft: '8px',
                    color: '#22c55e',
                    fontSize: '16px'
                  }}>
                    {user.stats.activities || 0}
                  </strong>
                </div>
              </div>
            )} */}
          </div>

          {/* OAuth Warning */}
          {isOAuthUser && (
            <div className="alert alert-warning">
              <span>ℹ️</span>
              <span>This is a Google authenticated user. Email cannot be changed.</span>
            </div>
          )}

          {/* Edit Form */}
          <div className="form-fields">
            {/* Username */}
            <div className="form-group">
              <label className="form-label">Username *</label>
              <input
                type="text"
                className="form-input"
                value={formData.username}
                onChange={(e) => handleChange('username', e.target.value)}
                minLength={3}
                maxLength={50}
              />
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="form-label">Email *</label>
              <input
                type="email"
                className={`form-input ${isOAuthUser ? 'form-input-disabled' : ''}`}
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                disabled
              />
            </div>

            {/* Role */}
            <div className="form-group">
              <label className="form-label">Role</label>
              <select
                className="form-select"
                value={formData.role}
                onChange={(e) => handleChange('role', e.target.value)}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* About Me */}
            <div className="form-group">
              <div className="form-label-row">
                <label className="form-label">About Me</label>
                <span className="char-counter">{formData.about_me.length}/500</span>
              </div>
              <textarea
                className="form-textarea"
                rows={3}
                value={formData.about_me}
                onChange={(e) => handleChange('about_me', e.target.value)}
                maxLength={500}
                placeholder="User bio..."
              />
            </div>

            {/* Checkboxes */}
            <div className="checkbox-grid">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  className="checkbox-input"
                  checked={formData.is_verified}
                  onChange={(e) => handleChange('is_verified', e.target.checked)}
                />
                <span className="checkbox-text">✅ Email Verified</span>
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  className="checkbox-input"
                  checked={formData.is_active}
                  onChange={(e) => handleChange('is_active', e.target.checked)}
                />
                <span className="checkbox-text">🟢 Account Active</span>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="modal-actions">
            <button
              onClick={handleSubmit}
              disabled={saving || success}
              className={`action-btn action-btn-primary ${success ? 'action-btn-success' : ''} ${saving ? 'action-btn-saving' : ''}`}
            >
              {success ? '✅ Saved!' : (saving ? '💾 Saving...' : '💾 Save Changes')}
            </button>
            
            <button
              onClick={handleClose}
              disabled={saving}
              className="action-btn action-btn-secondary"
            >
              ❌ Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}