
// react-app/src/pages/admin/BannerManagement/PlacementCreate.jsx


import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import { bannerAPI } from '../../../api/banner.api';
import './BannerManagement.css';

export default function PlacementCreate() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    placement_key: '',
    name: '',
    description: '',
    page_route: '/',           
    position: '',
    allowed_templates: [],
    max_active_banners: 1,    
    is_active: true
  });

  const [errors, setErrors] = useState({});

  // Template options (must match IDs in banner_templates table)
  const TEMPLATE_OPTIONS = [
    { id: 1, name: 'Hero Banner V2', type: 'hero' },
    { id: 2, name: 'Hot Section V2', type: 'hot_section' },
    { id: 3, name: 'Top Picks Section V2', type: 'top_picks' },
    { id: 4, name: 'Featured Carousel V2', type: 'featured_carousel' }
  ];

  //  FIX: PAGE_OPTIONS now use real route strings to match page_route column
  const PAGE_OPTIONS = [
    { value: '/', label: 'Home Page' },
    { value: '/all-games', label: 'All Games Page' },
    { value: '/categories/:id', label: 'Category Page' },
    { value: '/game/:id', label: 'Game Detail Page' },
    { value: '/profile', label: 'Profile Page' }
  ];

  useEffect(() => {
    if (isEditing) {
      loadPlacement();
    }
  }, [id]);

  const loadPlacement = async () => {
    try {
      setLoading(true);
      const data = await bannerAPI.getPlacement(id);

      setFormData({
        placement_key: data.placement_key || '',
        name: data.name || '',
        description: data.description || '',
        page_route: data.page_route || '/',         //  FIX: read page_route
        position: data.position || '',
        allowed_templates: data.allowed_templates || [],
        max_active_banners: data.max_active_banners ?? 1,
        is_active: data.is_active !== undefined ? data.is_active : true
      });
    } catch (err) {
      setError('Failed to load placement: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }

    // Auto-generate placement_key from page_route + position
    if (field === 'page_route' || field === 'position') {
      const newPage = field === 'page_route' ? value : formData.page_route;
      const newPosition = field === 'position' ? value : formData.position;

      if (newPage && newPosition && !isEditing) {
        // Convert "/" → "home", "/all-games" → "all_games", etc.
        const pageSlug = newPage
          .replace(/^\//, '')
          .replace(/[/:]/g, '_')
          .replace(/^_/, '') || 'home';
        const autoKey = `${pageSlug}_${newPosition}`
          .toLowerCase()
          .replace(/\s+/g, '_');
        setFormData(prev => ({ ...prev, placement_key: autoKey }));
      }
    }
  };

  const toggleTemplate = (templateId) => {
    setFormData(prev => {
      const allowed = prev.allowed_templates || [];
      const newAllowed = allowed.includes(templateId)
        ? allowed.filter(id => id !== templateId)
        : [...allowed, templateId];
      return { ...prev, allowed_templates: newAllowed };
    });
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.placement_key?.trim()) {
      newErrors.placement_key = 'Placement key is required';
    } else if (!/^[a-z0-9_]+$/.test(formData.placement_key)) {
      newErrors.placement_key = 'Only lowercase letters, numbers, and underscores allowed';
    }

    if (!formData.name?.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.page_route) {
      newErrors.page_route = 'Page route is required';
    }

    if (!formData.position?.trim()) {
      newErrors.position = 'Position is required';
    }

    if (!formData.allowed_templates || formData.allowed_templates.length === 0) {
      newErrors.allowed_templates = 'Select at least one allowed template';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setSaving(true);
      setError(null);


      const payload = {
        placement_key: formData.placement_key.trim(),
        name: formData.name.trim(),
        description: formData.description?.trim() || null,
        page_route: formData.page_route,          //  correct field name
        position: formData.position.trim(),
        allowed_templates: formData.allowed_templates,
        allowed_template_types: [],               // send empty — not used for filtering
        max_active_banners: formData.max_active_banners || 1,
        is_active: formData.is_active
      };

      if (isEditing) {
        await bannerAPI.updatePlacement(id, payload);
      } else {
        await bannerAPI.createPlacement(payload);
      }

      navigate('/admin/banners?tab=placements');
    } catch (err) {
      setError(err.message || 'Failed to save placement');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="placement-create-loading">
          <div className="spinner"></div>
          <p>Loading placement...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="placement-create">
        {/* Header */}
        <div className="placement-create-header">
          <button
            className="back-btn"
            onClick={() => navigate('/admin/banners?tab=placements')}
          >
            <ArrowLeft size={20} />
            Back to Placements
          </button>
          <h1>{isEditing ? 'Edit Placement' : 'Create New Placement'}</h1>
        </div>

        {error && (
          <div className="error-message">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="placement-form">

          {/* Basic Info */}
          <div className="form-card">
            <h3>Basic Information</h3>

            <div className="form-group">
              <label>
                Placement Key *
                <span className="label-hint">Unique identifier (e.g., home_hero)</span>
              </label>
              <input
                type="text"
                value={formData.placement_key}
                onChange={(e) => handleChange('placement_key', e.target.value.toLowerCase())}
                placeholder="e.g., home_hero"
                className={errors.placement_key ? 'error' : ''}
                disabled={isEditing}
              />
              {errors.placement_key && (
                <span className="error-text">{errors.placement_key}</span>
              )}
            </div>

            <div className="form-group">
              <label>Display Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="e.g., Homepage Hero Banner"
                className={errors.name ? 'error' : ''}
              />
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Describe where this placement appears..."
                rows={3}
              />
            </div>
          </div>

          {/* Location */}
          <div className="form-card">
            <h3>Placement Location</h3>

            {/*  FIX: field is now page_route */}
            <div className="form-group">
              <label>Page Route *</label>
              <select
                value={formData.page_route}
                onChange={(e) => handleChange('page_route', e.target.value)}
                className={errors.page_route ? 'error' : ''}
              >
                <option value="">Select a page</option>
                {PAGE_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label} ({opt.value})
                  </option>
                ))}
              </select>
              {errors.page_route && (
                <span className="error-text">{errors.page_route}</span>
              )}
            </div>

            <div className="form-group">
              <label>
                Position *
                <span className="label-hint">Section identifier (e.g., hero, section_1)</span>
              </label>
              <input
                type="text"
                value={formData.position}
                onChange={(e) => handleChange('position', e.target.value.toLowerCase())}
                placeholder="e.g., hero"
                className={errors.position ? 'error' : ''}
              />
              {errors.position && (
                <span className="error-text">{errors.position}</span>
              )}
            </div>
          </div>

          {/* Allowed Templates */}
          <div className="form-card">
            <h3>Allowed Templates *</h3>
            <p className="card-description">
              Select which banner templates can be used in this placement
            </p>

            <div className="template-selection-grid">
              {TEMPLATE_OPTIONS.map(template => (
                <div
                  key={template.id}
                  className={`template-option ${
                    formData.allowed_templates.includes(template.id) ? 'selected' : ''
                  }`}
                  onClick={() => toggleTemplate(template.id)}
                >
                  <div className="template-checkbox">
                    {formData.allowed_templates.includes(template.id) && (
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path
                          d="M13.5 4L6 11.5L2.5 8"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="template-info">
                    <div className="template-name">{template.name}</div>
                    <div className="template-type">{template.type}</div>
                  </div>
                </div>
              ))}
            </div>

            {errors.allowed_templates && (
              <span className="error-text">{errors.allowed_templates}</span>
            )}
          </div>

          {/* Settings */}
          <div className="form-card">
            <h3>Settings</h3>

            {/*  FIX: max_active_banners instead of max_width/max_height */}
            <div className="form-group">
              <label>
                Max Active Banners
                <span className="label-hint">Maximum concurrent active banners for this placement</span>
              </label>
              <input
                type="number"
                value={formData.max_active_banners}
                onChange={(e) => handleChange('max_active_banners', parseInt(e.target.value) || 1)}
                min="1"
                max="10"
              />
            </div>
          </div>

          {/* Status */}
          <div className="form-card">
            <h3>Status</h3>
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => handleChange('is_active', e.target.checked)}
              />
              <span className="toggle-slider"></span>
              <span className="toggle-text">
                {formData.is_active ? 'Active' : 'Inactive'}
              </span>
            </label>
          </div>

          {/* Actions */}
          <div className="form-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate('/admin/banners?tab=placements')}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={saving}
            >
              {saving ? (
                <>
                  <div className="spinner-small"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save size={20} />
                  {isEditing ? 'Update Placement' : 'Create Placement'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}