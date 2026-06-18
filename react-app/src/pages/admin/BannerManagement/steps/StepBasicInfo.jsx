// react-app/src/pages/admin/BannerManagement/steps/StepBasicInfo.jsx

import { useState, useEffect } from 'react';
import './Steps.css';

export default function StepBasicInfo({ formData, onChange, errors = {} }) {
  const [localData, setLocalData] = useState({
    name: formData.name || '',
    subtitle: formData.subtitle || '',
    priority: formData.priority || 0,
    start_date: formData.start_date || '',
    end_date: formData.end_date || '',
    is_active: formData.is_active !== undefined ? formData.is_active : true
  });

  // Update parent when local data changes
  useEffect(() => {
    onChange(localData);
  }, [localData]);

  const handleChange = (field, value) => {
    setLocalData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="step-container">
      <div className="step-header">
        <h3>Basic Information</h3>
        <p>Enter the basic details for your banner</p>
      </div>

      <div className="step-content">
        {/* Banner Name */}
        <div className="form-group">
          <label htmlFor="banner-name">
            Banner Name <span className="required">*</span>
          </label>
          <input
            id="banner-name"
            type="text"
            className={`form-input ${errors.name ? 'error' : ''}`}
            placeholder="e.g., Summer Sale Hero Banner"
            value={localData.name}
            onChange={(e) => handleChange('name', e.target.value)}
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
          <span className="form-hint">
            Choose a descriptive name to identify this banner in the admin panel
          </span>
        </div>

        {/* Subtitle (Optional) */}
        <div className="form-group">
          <label htmlFor="banner-subtitle">
            Subtitle <span className="optional">(Optional)</span>
          </label>
          <input
            id="banner-subtitle"
            type="text"
            className="form-input"
            placeholder="e.g., Limited time offer - 50% off"
            value={localData.subtitle}
            onChange={(e) => handleChange('subtitle', e.target.value)}
          />
          <span className="form-hint">
            Optional subtitle that appears below the main title
          </span>
        </div>

        {/* Priority */}
        <div className="form-group">
          <label htmlFor="banner-priority">
            Priority <span className="required">*</span>
          </label>
          <input
            id="banner-priority"
            type="number"
            className={`form-input ${errors.priority ? 'error' : ''}`}
            placeholder="0"
            min="0"
            max="999"
            value={localData.priority}
            onChange={(e) => handleChange('priority', parseInt(e.target.value) || 0)}
          />
          {errors.priority && <span className="error-message">{errors.priority}</span>}
          <span className="form-hint">
            Higher priority banners are shown first when multiple banners exist for the same placement (0-999)
          </span>
        </div>

        {/* Date Range */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="start-date">
              Start Date <span className="optional">(Optional)</span>
            </label>
            <input
              id="start-date"
              type="datetime-local"
              className="form-input"
              value={localData.start_date}
              onChange={(e) => handleChange('start_date', e.target.value)}
            />
            <span className="form-hint">
              When this banner becomes active
            </span>
          </div>

          <div className="form-group">
            <label htmlFor="end-date">
              End Date <span className="optional">(Optional)</span>
            </label>
            <input
              id="end-date"
              type="datetime-local"
              className="form-input"
              value={localData.end_date}
              onChange={(e) => handleChange('end_date', e.target.value)}
              min={localData.start_date || undefined}
            />
            <span className="form-hint">
              When this banner expires
            </span>
          </div>
        </div>

        {/* Active Status */}
        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={localData.is_active}
              onChange={(e) => handleChange('is_active', e.target.checked)}
            />
            <span className="checkbox-text">
              <strong>Active</strong>
              <span className="checkbox-hint">
                Banner will be displayed on the website immediately (if within date range)
              </span>
            </span>
          </label>
        </div>

        {/* Info Box */}
        <div className="info-box">
          <svg className="info-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 16V12M12 8H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div className="info-content">
            <strong>Scheduling Tips:</strong>
            <ul>
              <li>Leave dates empty to make banner permanent</li>
              <li>Use start date for future promotions</li>
              <li>Use end date for limited-time campaigns</li>
              <li>Banner must be active AND within date range to display</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}