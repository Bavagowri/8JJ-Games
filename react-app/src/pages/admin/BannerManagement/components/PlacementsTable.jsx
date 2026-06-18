

// react-app/src/pages/admin/BannerManagement/components/PlacementsTable.jsx

import { useNavigate } from 'react-router-dom';
import { Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { bannerAPI } from '../../../../api/banner.api';

// Map template IDs to display names for the badges
const TEMPLATE_ID_NAMES = {
  1: 'hero',
  2: 'hot_section',
  3: 'top_picks',
  4: 'featured_carousel'
};

export default function PlacementsTable({ placements, onRefresh }) {
  const navigate = useNavigate();

  const handleToggle = async (placementId) => {
    try {
      await bannerAPI.togglePlacement(placementId);
      onRefresh();
    } catch (error) {
      console.error('Failed to toggle placement:', error);
      alert('Failed to toggle placement');
    }
  };

  const handleDelete = async (placementId) => {
    if (!window.confirm('Are you sure you want to delete this placement?')) return;

    try {
      await bannerAPI.deletePlacement(placementId);
      onRefresh();
    } catch (error) {
      console.error('Failed to delete placement:', error);
      alert(error.message || 'Failed to delete placement');
    }
  };

  return (
    <div className="admin-table-wrapper">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Placement Key</th>
            <th>Page Route</th>
            <th>Position</th>
            <th>Max Banners</th>
            <th>Allowed Templates</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {placements.map(placement => {
            //  FIX: read allowed_templates (integer IDs), not allowed_template_types
            const allowedTemplates = Array.isArray(placement.allowed_templates)
              ? placement.allowed_templates
              : (typeof placement.allowed_templates === 'string'
                ? (() => { try { return JSON.parse(placement.allowed_templates); } catch { return []; } })()
                : []);

            // Convert IDs to display names for badges
            const templateBadges = allowedTemplates.map(id =>
              TEMPLATE_ID_NAMES[id] || `template-${id}`
            );

            return (
              <tr key={placement.id}>
                <td><strong>{placement.name}</strong></td>
                <td><code className="code-badge">{placement.placement_key}</code></td>
                {/*  page_route is the correct DB column — kept */}
                <td><code className="code-badge">{placement.page_route || '—'}</code></td>
                <td>
                  <span className="badge">
                    {placement.position?.replace(/_/g, ' ') || '—'}
                  </span>
                </td>
                {/*  FIX: read max_active_banners (real DB column) */}
                <td>{placement.max_active_banners ?? placement.max_banners ?? 1}</td>
                <td>
                  <div className="badge-group">
                    {templateBadges.length > 0
                      ? templateBadges.map(name => (
                          <span key={name} className="badge badge-small">
                            {name.replace(/_/g, ' ')}
                          </span>
                        ))
                      : <span style={{ color: 'var(--admin-text-secondary)', fontSize: '12px' }}>none set</span>
                    }
                  </div>
                </td>
                <td>
                  <button
                    className={`status-badge ${placement.is_active ? 'status-active' : 'status-inactive'}`}
                    onClick={() => handleToggle(placement.id)}
                    title={placement.is_active ? 'Click to deactivate' : 'Click to activate'}
                  >
                    {placement.is_active ? <Eye size={12} /> : <EyeOff size={12} />}
                    {placement.is_active ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td>
                  <div className="table-actions">
                    <button
                      className="admin-button admin-button-small"
                      onClick={() => navigate(`/admin/banners/placements/edit/${placement.id}`)}
                      title="Edit placement"
                    >
                      <Edit size={14} />
                      Edit
                    </button>
                    <button
                      className="admin-button admin-button-small admin-button-danger"
                      onClick={() => handleDelete(placement.id)}
                      title="Delete placement"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {placements.length === 0 && (
        <div className="admin-empty" style={{ padding: '40px', textAlign: 'center' }}>
          <p>No placements found. Create your first placement to get started.</p>
        </div>
      )}
    </div>
  );
}