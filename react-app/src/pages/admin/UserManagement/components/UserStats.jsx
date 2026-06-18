// react-app/src/pages/admin/UserManagement/components/UserStats.jsx


import React from 'react';
import StatCard from '../../components/StatCard';
import '../../styles/shared.css';
import '../../styles/UserManagement.css';

export default function UserStats({ stats, pagination }) {
  return (
    <div className='user-stats-wrapper'>
      <StatCard
        title="Total Users"
        value={pagination.total}
        icon="👥"
        color="primary"
      />

      <StatCard
        title="On This Page"
        value={stats.total}
        icon="📄"
        color="secondary"
      />

      <StatCard
        title="Active"
        value={stats.active}
        icon="🟢"
        color="success"
      />

      <StatCard
        title="Verified"
        value={stats.verified}
        icon="✅"
        color="success"
      />

      <StatCard
        title="Admins"
        value={stats.admins}
        icon="👑"
        color="warning"
      />
    </div>
  );
}