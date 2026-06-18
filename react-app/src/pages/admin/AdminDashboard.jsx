// react-app/src/pages/admin/AdminDashboard.jsx

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, UserCheck, TrendingUp, CheckCircle, RefreshCw, AlertTriangle, User } from 'lucide-react';
import AdminLayout from './components/AdminLayout';
import StatCard from './components/StatCard';
import LoadingSpinner from './components/LoadingSpinner';
import { adminAPI } from '../../api/admin.api';
import './styles/shared.css';
import './styles/AdminDashboard.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch dashboard stats
      const statsData = await adminAPI.getDashboardStats();
      setStats(statsData || {});

      // Fetch recent users
      const usersData = await adminAPI.getAllUsers({ page: 1, limit: 5 });
      setRecentUsers(usersData?.users || []);

      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard');
      console.error('Dashboard Load Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date)) return 'Invalid Date';
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <AdminLayout title="Dashboard" breadcrumbs={['Admin', 'Dashboard']}>
        <LoadingSpinner message="Loading dashboard..." />
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Dashboard" breadcrumbs={['Admin', 'Dashboard']}>
        <div className="admin-card" style={{ textAlign: 'center', padding: '40px' }}>
          <AlertTriangle size={48} strokeWidth={2} style={{ color: 'var(--admin-danger)', marginBottom: '16px' }} />
          <h2 style={{ color: 'var(--admin-danger)', marginBottom: '8px' }}>
            Error Loading Dashboard
          </h2>
          <p style={{ color: 'var(--admin-text-secondary)' }}>{error}</p>
          <button
            onClick={loadDashboardData}
            className="admin-button admin-button-primary"
            style={{ marginTop: '20px', display: 'inline-flex', alignItems: 'center', gap: 8 }}
          >
            <RefreshCw size={16} strokeWidth={2.5} />
            Retry
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Dashboard" breadcrumbs={['Admin', 'Dashboard']}>
      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        <StatCard 
          title="Total Users" 
          value={stats.totalUsers || 0} 
          icon={<Users size={28} strokeWidth={2} />} 
          color="primary" 
        />
        <StatCard 
          title="Active Users" 
          value={stats.activeUsers || 0} 
          icon={<UserCheck size={28} strokeWidth={2} />} 
          color="success" 
        />
        <StatCard 
          title="New This Week" 
          value={stats.newThisWeek || 0} 
          icon={<TrendingUp size={28} strokeWidth={2} />} 
          color="secondary" 
          trend={parseFloat(stats.growthRate || 0)} 
        />
        <StatCard 
          title="Verified Users" 
          value={stats.verifiedUsers || 0} 
          icon={<CheckCircle size={28} strokeWidth={2} />} 
          color="success" 
        />
      </div>

      {/* Recent Users Table */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h3 className='admin-card-title' style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <User size={20} strokeWidth={2.5} />
            Recent Users
          </h3>
          <button 
            onClick={() => navigate('/admin/users')} 
            className="admin-button admin-button-secondary"
          >
            View All →
          </button>
        </div>

        {recentUsers.length === 0 ? (
          <p className="admin-empty">No users found</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Verified Status</th>
                  <th>Active Status</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.map(user => (
                  <tr key={user.id}>
                    <td>
                      <div className="admin-user-info">
                        <div className="admin-user-avatar">{user.username?.charAt(0).toUpperCase() || '?'}</div>
                        <span>{user.username}</span>
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`admin-badge admin-badge-${user.role === 'admin' ? 'danger' : 'info'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        {user.is_verified ? (
                          <span className="admin-badge admin-badge-success" title="Verified">
                            <CheckCircle size={12} strokeWidth={2.5} style={{ display: 'inline-block', verticalAlign: 'middle' }} />
                          </span>
                        ) : (
                          <span className="admin-badge admin-badge-danger" title="Not Verified">
                            <AlertTriangle size={12} strokeWidth={2.5} style={{ display: 'inline-block', verticalAlign: 'middle' }} />
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        {user.is_active ? (
                          <span className="admin-badge admin-badge-success" title="Active">
                            Active
                          </span>
                        ) : (
                          <span className="admin-badge admin-badge-danger" title="Inactive">
                            Inactive
                          </span>
                        )}
                      </div>
                    </td>
                    <td>{formatDate(user.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="admin-card admin-card-footer Margin-TOP-24">
        <div className="admin-footer-left">
          <p>Last updated: {new Date().toLocaleString()}</p>
        </div>
        <button 
          onClick={loadDashboardData} 
          className="admin-button Refresh-btn admin-button-secondary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
        >
          <RefreshCw size={16} strokeWidth={2.5} />
          Refresh Data
        </button>
      </div>
    </AdminLayout>
  );
}