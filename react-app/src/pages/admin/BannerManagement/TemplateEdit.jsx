// react-app/src/pages/admin/BannerManagement/TemplateEdit.jsx

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, AlertCircle, Info } from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import { bannerAPI } from '../../../api/banner.api';
import './BannerManagement.css';

export default function TemplateEdit() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [template, setTemplate] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    default_config: {},
    is_active: true
  });

  const [errors, setErrors] = useState({});
  const [configJson, setConfigJson] = useState('');
  const [jsonError, setJsonError] = useState('');

  useEffect(() => {
    loadTemplate();
  }, [id]);

  const loadTemplate = async () => {
    try {
      setLoading(true);
      const data = await bannerAPI.getTemplate(id);
      
      setTemplate(data);
      setFormData({
        name: data.name || '',
        description: data.description || '',
        default_config: data.default_config || {},
        is_active: data.is_active !== undefined ? data.is_active : true
      });

      // Format JSON for display
      setConfigJson(JSON.stringify(data.default_config || {}, null, 2));
    } catch (err) {
      setError('Failed to load template: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleConfigChange = (value) => {
    setConfigJson(value);
    setJsonError('');
    
    // Try to parse JSON
    try {
      const parsed = JSON.parse(value);
      setFormData(prev => ({ ...prev, default_config: parsed }));
    } catch (err) {
      setJsonError('Invalid JSON format');
    }
  };

  const formatJson = () => {
    try {
      const parsed = JSON.parse(configJson);
      const formatted = JSON.stringify(parsed, null, 2);
      setConfigJson(formatted);
      setJsonError('');
    } catch (err) {
      setJsonError('Cannot format invalid JSON');
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Name is required';
    }

    if (jsonError) {
      newErrors.config = 'Fix JSON errors before saving';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const payload = {
        name: formData.name.trim(),
        description: formData.description?.trim() || null,
        default_config: formData.default_config,
        is_active: formData.is_active
      };

      await bannerAPI.updateTemplate(id, payload);
      navigate('/admin/banners?tab=templates');
    } catch (err) {
      setError(err.message || 'Failed to update template');
    } finally {
      setSaving(false);
    }
  };

  // Get config examples based on template type
  const getConfigExample = () => {
    if (!template) return {};

    switch (template.template_type) {
      case 'hero':
        return {
          autoplay: true,
          interval: 5000,
          showArrows: true,
          showDots: true,
          pauseOnHover: true
        };
      
      case 'hot_section':
        return {
          title: "🔥 Hot Games",
          titleColor: "#00d9ff",
          maxGames: 12,
          columns: {
            mobile: 2,
            tablet: 4,
            desktop: 6
          },
          showSkeleton: true
        };
      
      case 'top_picks':
        return {
          title: "⭐ Top Picks",
          titleColor: "#00d9ff",
          maxGames: 10,
          scrollSpeed: "normal"
        };
      
      case 'featured_carousel':
        return {
          title: "🎮 Featured Games",
          autoplay: true,
          speed: 30,
          gap: 20,
          cardWidth: 200
        };
      
      default:
        return {};
    }
  };

  const loadExample = () => {
    const example = getConfigExample();
    const formatted = JSON.stringify(example, null, 2);
    setConfigJson(formatted);
    setFormData(prev => ({ ...prev, default_config: example }));
    setJsonError('');
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="template-edit-loading">
          <div className="spinner"></div>
          <p>Loading template...</p>
        </div>
      </AdminLayout>
    );
  }

  if (!template) {
    return (
      <AdminLayout>
        <div className="template-edit-error">
          <AlertCircle size={48} />
          <h2>Template Not Found</h2>
          <button onClick={() => navigate('/admin/banners?tab=templates')}>
            Back to Templates
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="template-edit">
        {/* Header */}
        <div className="template-edit-header">
          <button 
            className="back-btn"
            onClick={() => navigate('/admin/banners?tab=templates')}
          >
            <ArrowLeft size={20} />
            Back to Templates
          </button>

          <div>
            <h1>Edit Template</h1>
            <p className="template-subtitle">
              {template.component_name} • {template.template_type}
            </p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-message">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {/* Template Info Box */}
        <div className="info-box">
          <Info size={20} />
          <div>
            <strong>About This Template</strong>
            <p>
              Template component: <code>{template.component_name}</code><br />
              Template type: <code>{template.template_type}</code><br />
              Component file and type cannot be changed after creation.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="template-form">
          
          {/* Basic Info Card */}
          <div className="form-card">
            <h3>Basic Information</h3>

            {/* Name */}
            <div className="form-group">
              <label>Template Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="e.g., Hero Banner V2"
                className={errors.name ? 'error' : ''}
              />
              {errors.name && (
                <span className="error-text">{errors.name}</span>
              )}
            </div>

            {/* Description */}
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Describe this template's purpose and features..."
                rows={3}
              />
            </div>
          </div>

          {/* Default Configuration Card */}
          <div className="form-card">
            <div className="card-header-with-action">
              <div>
                <h3>Default Configuration</h3>
                <p className="card-description">
                  JSON configuration that will be used as defaults for new banners
                </p>
              </div>
              <button
                type="button"
                className="btn-outline"
                onClick={loadExample}
              >
                Load Example
              </button>
            </div>

            <div className="json-editor-wrapper">
              <textarea
                className={`json-editor ${jsonError ? 'error' : ''}`}
                value={configJson}
                onChange={(e) => handleConfigChange(e.target.value)}
                placeholder="{}"
                rows={15}
                spellCheck={false}
              />
              
              <div className="json-editor-actions">
                <button
                  type="button"
                  className="btn-text"
                  onClick={formatJson}
                  disabled={!!jsonError}
                >
                  Format JSON
                </button>
                
                {jsonError && (
                  <span className="error-text">{jsonError}</span>
                )}
              </div>
            </div>

            {/* Config Helper */}
            <div className="config-helper">
              <strong>Common Configuration Options:</strong>
              <ul>
                {template.template_type === 'hero' && (
                  <>
                    <li><code>autoplay</code> - Auto-advance slides (boolean)</li>
                    <li><code>interval</code> - Time between slides in ms (number)</li>
                    <li><code>showArrows</code> - Show navigation arrows (boolean)</li>
                    <li><code>showDots</code> - Show dot indicators (boolean)</li>
                  </>
                )}
                
                {(template.template_type === 'hot_section' || template.template_type === 'top_picks') && (
                  <>
                    <li><code>title</code> - Section title (string)</li>
                    <li><code>titleColor</code> - Title color hex (string)</li>
                    <li><code>maxGames</code> - Maximum games to show (number)</li>
                  </>
                )}
                
                {template.template_type === 'featured_carousel' && (
                  <>
                    <li><code>autoplay</code> - Auto-scroll carousel (boolean)</li>
                    <li><code>speed</code> - Scroll speed (number)</li>
                    <li><code>gap</code> - Gap between items in px (number)</li>
                  </>
                )}
              </ul>
            </div>
          </div>

          {/* Status Card */}
          <div className="form-card">
            <h3>Status</h3>
            <p className="card-description">
              Inactive templates cannot be used when creating new banners
            </p>

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

          {/* Action Buttons */}
          <div className="form-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate('/admin/banners?tab=templates')}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn-primary"
              disabled={saving || !!jsonError}
            >
              {saving ? (
                <>
                  <div className="spinner-small"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Update Template
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}