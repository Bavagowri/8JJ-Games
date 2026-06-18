// react-app/src/pages/admin/components/AdminLayout.jsx



import React from 'react';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import '../styles/shared.css';

export default function AdminLayout({ children, title, breadcrumbs }) {
  return (



    <div className="admin-container-wrapper">
      <div className="admin-container" style={{ display: 'flex' }}>

      
      <AdminSidebar />
      
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <AdminHeader title={title} breadcrumbs={breadcrumbs} />
        
        <main style={{ 
          flex: 1, 
          padding: '32px',
          background: 'var(--admin-bg-light)',
          minHeight: 'calc(100vh - 80px)',
          overflowY: 'auto'
        }}>
          {children}
        </main>
      </div>

    </div>
    </div>




  );
}