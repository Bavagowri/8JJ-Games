

// react-app/src/pages/admin/BannerManagement/components/BannerCard.jsx

import { Eye, EyeOff, Edit, Trash2, Copy, BarChart2 } from 'lucide-react';

export default function BannerCard({ banner, templates, placements, onToggle, onEdit, onDelete, onDuplicate }) {
  const template = templates.find(t => t.id === banner.template_id);
  const placement = placements.find(p => p.id === banner.placement_id);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const calculateCTR = () => {
    if (!banner.impression_count || banner.impression_count === 0) return '0.00';
    return ((banner.click_count / banner.impression_count) * 100).toFixed(2);
  };

  return (
    <div className={`banner-card ${!banner.is_active ? 'banner-card-inactive' : ''}`}>
      {/* Header */}
      <div className="banner-card-header">
        <div className="banner-card-status">
          <span className={`status-badge ${banner.is_active ? 'status-active' : 'status-inactive'}`}>
            {banner.is_active ? 'Active' : 'Inactive'}
          </span>
          <span className="banner-card-priority">Priority: {banner.priority}</span>
        </div>

        <div className="banner-card-actions">
          <button
            className="banner-action-btn"
            onClick={onToggle}
            title={banner.is_active ? 'Deactivate' : 'Activate'}
          >
            {banner.is_active ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
          <button className="banner-action-btn" onClick={onEdit} title="Edit">
            <Edit size={16} />
          </button>
          <button className="banner-action-btn" onClick={onDuplicate} title="Duplicate">
            <Copy size={16} />
          </button>
          <button
            className="banner-action-btn banner-action-delete"
            onClick={onDelete}
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="banner-card-content">
        <h3 className="banner-card-title">{banner.name}</h3>

        <div className="banner-card-info">
          <div className="banner-info-item">
            <span className="banner-info-label">Template:</span>
            <span className="banner-info-value">{template?.name || 'Unknown'}</span>
          </div>
          <div className="banner-info-item">
            <span className="banner-info-label">Placement:</span>
            <span className="banner-info-value">{placement?.name || 'Unknown'}</span>
          </div>
          <div className="banner-info-item">
            <span className="banner-info-label">Page:</span>
            {/*  FIX: page_route is the DB column; placement_key as fallback */}
            <span className="banner-info-value">
              {placement?.page_route || placement?.placement_key || 'N/A'}
            </span>
          </div>
        </div>

        {/* Schedule */}
        {(banner.start_date || banner.end_date) && (
          <div className="banner-card-schedule">
            {banner.start_date && (
              <span>Start: {formatDate(banner.start_date)}</span>
            )}
            {banner.end_date && (
              <span>End: {formatDate(banner.end_date)}</span>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="banner-card-stats">
          <div className="banner-stat">
            <span className="banner-stat-label">Impressions</span>
            <span className="banner-stat-value">{banner.impression_count || 0}</span>
          </div>
          <div className="banner-stat">
            <span className="banner-stat-label">Clicks</span>
            <span className="banner-stat-value">{banner.click_count || 0}</span>
          </div>
          <div className="banner-stat">
            <span className="banner-stat-label">CTR</span>
            <span className="banner-stat-value">{calculateCTR()}%</span>
          </div>
        </div>

        {/* Analytics Button */}
        <button
          className="banner-view-analytics"
          onClick={(e) => {
            e.stopPropagation();
            alert('Analytics feature coming soon!');
          }}
          title="View detailed analytics"
        >
          <BarChart2 size={14} />
          View Analytics
        </button>
      </div>
    </div>
  );
}