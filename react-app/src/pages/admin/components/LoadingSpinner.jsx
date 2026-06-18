// react-app/src/pages/admin/components/LoadingSpinner.jsx



import React from 'react';
import '../styles/shared.css';

export default function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div style={{ textAlign: 'center', padding: '40px' }}>
      <div className="admin-spinner"></div>
      <p style={{ marginTop: '20px', color: 'var(--admin-text-secondary)' }}>
        {message}
      </p>
    </div>
  );
}