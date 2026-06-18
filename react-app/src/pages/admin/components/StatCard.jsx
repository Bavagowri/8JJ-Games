// react-app/src/pages/admin/components/StatCard.jsx

import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import '../styles/shared.css';
import '../styles/AdminDashboard.css';

export default function StatCard({ title, value, icon, color = 'primary', trend }) {
  const colors = {
    primary: 'var(--admin-primary)',
    success: 'var(--admin-success)',
    warning: 'var(--admin-warning)',
    danger: 'var(--admin-danger)',
    secondary: 'var(--admin-secondary)'
  };

  const selectedColor = colors[color] || colors.primary;

  return (
    <div 
      className="admin-card stat-card AdminStatCard" 
      style={{ borderLeftColor: selectedColor }}
    >
      <div className="stat-card-icon" style={{ color: selectedColor }}>
        {icon}
      </div>
      
      <div className="stat-card-content">
        <p className="stat-card-title">
          {title}
        </p>
        
        <h2 
          className="stat-card-value" 
          style={{ color: selectedColor }}
        >
          {value}
        </h2>

        {trend !== undefined && trend !== null && (
          <p className={`stat-card-trend ${trend > 0 ? 'stat-card-trend-up' : 'stat-card-trend-down'}`}>
            <span className="trend-arrow" style={{ display: 'inline-flex', alignItems: 'center' }}>
              {trend > 0 ? (
                <TrendingUp size={14} strokeWidth={2.5} />
              ) : (
                <TrendingDown size={14} strokeWidth={2.5} />
              )}
            </span>
            <span className="trend-textz TEXT">{Math.abs(trend)}% from last week</span>
          </p>
        )}
      </div>
    </div>
  );
}