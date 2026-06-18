// react-app/src/pages/admin/UserManagement/UserManagement.jsx 

import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import UserTable from './components/UserTable';
import UserFilters from './components/UserFilters';
import UserModal from './components/UserModal';
import UserStats from './components/UserStats';
import { adminAPI } from '../../../api/admin.api';
import '../styles/shared.css';
import './UserManagement.css';

export default function UserManagement() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // State
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [notification, setNotification] = useState(null);
  
  // Filters & Pagination
  const [filters, setFilters] = useState({
    search: '',
    role: '',
    status: '',
    verified: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    verified: 0,
    admins: 0
  });

  //  NEW: Handle userId from query params (from Chat Community)
  useEffect(() => {
    const userId = searchParams.get('userId');
    if (userId) {
      handleViewUser(parseInt(userId));
      // Remove query param after opening modal
      setSearchParams({});
    }
  }, [searchParams]);

  // Load users
  useEffect(() => {
    loadUsers();
  }, [pagination.page, filters]);

  // Auto-hide notifications
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters
      };

      const data = await adminAPI.getAllUsers(params);
      
      setUsers(data.users || []);
      setPagination(prev => ({
        ...prev,
        total: data.pagination.total,
        totalPages: data.pagination.totalPages
      }));

      calculateStats(data.users || []);
    } catch (err) {
      setError(err.message);
      console.error('Load users error:', err);
      showNotification(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (userList) => {
    setStats({
      total: userList.length,
      active: userList.filter(u => u.is_active).length,
      verified: userList.filter(u => u.is_verified).length,
      admins: userList.filter(u => u.role === 'admin').length
    });
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleViewUser = async (userId) => {
    try {
      const user = await adminAPI.getUserById(userId);
      setSelectedUser(user);
      setShowModal(true);
    } catch (err) {
      showNotification(`Failed to load user details: ${err.message}`, 'error');
    }
  };

  const handleToggleStatus = async (userId) => {
    try {
      await adminAPI.toggleUserStatus(userId);
      
      setUsers(users.map(u => 
        u.id === userId ? { ...u, is_active: !u.is_active } : u
      ));
      
      calculateStats(users.map(u => 
        u.id === userId ? { ...u, is_active: !u.is_active } : u
      ));
      
      showNotification('User status updated successfully', 'success');
    } catch (err) {
      showNotification(`Failed to toggle user status: ${err.message}`, 'error');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      await adminAPI.deleteUser(userId);
      loadUsers();
      showNotification('User deleted successfully', 'success');
    } catch (err) {
      showNotification(`Failed to delete user: ${err.message}`, 'error');
    }
  };

  const handleUpdateUser = async (userId, updates) => {
    try {
      await adminAPI.updateUser(userId, updates);
      
      setShowModal(false);
      setSelectedUser(null);
      
      await loadUsers();
      
      showNotification('User updated successfully', 'success');
    } catch (err) {
      throw new Error(err.message || 'Failed to update user');
    }
  };

  return (
    <AdminLayout 
      title="User Management" 
      breadcrumbs={['Admin', 'User Management']}
    >
      {/* Notification Toast */}
      {notification && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 9999,
          padding: '16px 24px',
          borderRadius: '8px',
          background: notification.type === 'success' 
            ? 'rgba(34, 197, 94, 0.95)' 
            : 'rgba(239, 68, 68, 0.95)',
          color: '#fff',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          maxWidth: '400px',
          animation: 'slideIn 0.3s ease-out'
        }}>
          <span style={{ fontSize: '20px' }}>
            {notification.type === 'success' ? '' : '⚠️'}
          </span>
          <span style={{ fontSize: '14px', fontWeight: '500' }}>
            {notification.message}
          </span>
          <button
            onClick={() => setNotification(null)}
            style={{
              background: 'none',
              border: 'none',
              color: '#fff',
              fontSize: '20px',
              cursor: 'pointer',
              marginLeft: 'auto',
              padding: '0 4px'
            }}
          >
            ×
          </button>
        </div>
      )}

      {/* Stats Section */}
      <UserStats stats={stats} pagination={pagination} />

      {/* Filters */}
      <UserFilters 
        filters={filters} 
        onFilterChange={handleFilterChange}
        onReset={() => {
          setFilters({ search: '', role: '', status: '', verified: '' });
        }}
      />

      {/* Main Content */}
      {loading && <LoadingSpinner message="Loading users..." />}
      
      {error && (
        <div className="admin-card" style={{ 
          textAlign: 'center', 
          padding: '40px',
          marginTop: '24px'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
          <h2 style={{ color: 'var(--admin-danger)', marginBottom: '8px' }}>
            Error Loading Users
          </h2>
          <p style={{ color: 'var(--admin-text-secondary)' }}>{error}</p>
          <button 
            onClick={loadUsers}
            className="admin-button admin-button-primary"
            style={{ marginTop: '20px' }}
          >
            🔄 Retry
          </button>
        </div>
      )}

      {!loading && !error && (
        <UserTable
          users={users}
          pagination={pagination}
          onPageChange={handlePageChange}
          onViewUser={handleViewUser}
          onToggleStatus={handleToggleStatus}
          onDeleteUser={handleDeleteUser}
        />
      )}

      {/* User Detail/Edit Modal */}
      {showModal && selectedUser && (
        <UserModal
          user={selectedUser}
          onClose={() => {
            setShowModal(false);
            setSelectedUser(null);
          }}
          onUpdate={handleUpdateUser}
        />
      )}

      {/* Animation for notification */}
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </AdminLayout>
  );
}