// react-app/src/pages/admin/UserManagement/components/UserFilters.jsx

import React, { useState } from 'react';
import '../../styles/shared.css';
import '../../styles/UserManagement.css';

export default function UserFilters({ filters, onFilterChange, onReset }) {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const emptyFilters = { search: '', role: '', status: '', verified: '' };
    setLocalFilters(emptyFilters);
    onReset();
  };

  return (
    <div className="admin-card filters-card">
      <div className="filters-header">
        <h3 className="filters-title">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="18" 
            height="18" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="filters-icon"
          >
            <path d="m21 21-4.34-4.34"/>
            <circle cx="11" cy="11" r="8"/>
          </svg>
          Filters
        </h3>
        
        <button 
          onClick={handleReset}
          className="admin-button admin-button-secondary filters-reset-btn"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="reset-icon"
          >
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
            <path d="M21 3v5h-5"/>
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
            <path d="M8 16H3v5"/>
          </svg>
          Reset
        </button>
      </div>

      <div className="filters-grid">
        {/* Search */}
        <div className="filter-group">
          <label className="filter-label">Search</label>
          <input
            type="text"
            className="admin-input"
            placeholder="Username or email..."
            value={localFilters.search}
            onChange={(e) => handleChange('search', e.target.value)}
          />
        </div>

        {/* Role Filter */}
        <div className="filter-group">
          <label className="filter-label">Role</label>
          <select
            className="admin-select"
            value={localFilters.role}
            onChange={(e) => handleChange('role', e.target.value)}
          >
            <option value="">All Roles</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="filter-group">
          <label className="filter-label">Status</label>
          <select
            className="admin-select"
            value={localFilters.status}
            onChange={(e) => handleChange('status', e.target.value)}
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Verified Filter */}
        <div className="filter-group">
          <label className="filter-label">Verification</label>
          <select
            className="admin-select"
            value={localFilters.verified}
            onChange={(e) => handleChange('verified', e.target.value)}
          >
            <option value="">All</option>
            <option value="true">Verified</option>
            <option value="false">Unverified</option>
          </select>
        </div>
      </div>
    </div>
  );
}