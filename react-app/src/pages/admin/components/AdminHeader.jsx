// react-app/src/pages/admin/components/AdminHeader.jsx



import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/shared.css';

export default function AdminHeader({ title, breadcrumbs = [] }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div style={{
      background: 'var(--admin-card-bg)',
      borderBottom: '1px solid var(--admin-border)',
      padding: '20px 32px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div>
        {breadcrumbs.length > 0 && (
          <div style={{ 
            display: 'flex', 
            gap: '8px', 
            fontSize: '13px',
            color: 'var(--admin-text-secondary)',
            marginBottom: '8px'
          }}>
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <span>/</span>}
                <span style={{ 
                  color: idx === breadcrumbs.length - 1 
                    ? 'var(--admin-primary)' 
                    : 'var(--admin-text-secondary)'
                }}>
                  {crumb}
                </span>
              </React.Fragment>
            ))}
          </div>
        )}
        
        <h1 style={{
          fontSize: '28px',
          fontWeight: '700',
          background: 'linear-gradient(135deg, var(--admin-primary), var(--admin-secondary))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          margin: 0
        }}>
          {title}
        </h1>
      </div>

      {/* <button 
        onClick={handleLogout}
        className="admin-button admin-button-danger"
      >
        🚪 Logout
      </button> */}
    </div>
  );
}