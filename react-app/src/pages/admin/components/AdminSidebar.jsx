// react-app/src/pages/admin/components/AdminSidebar.jsx - UPDATED

import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  BarChart3, 
  Users, 
  Bell, 
  Star,
  Coins,
  MessageSquare, 
  TrendingUp, 
  Gamepad2, 
  Settings,
  FolderSync,
  Layout,
  Trophy,  // ← ADD THIS IMPORT
} from 'lucide-react';
import '../styles/shared.css';

export default function AdminSidebar() {
  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: BarChart3, exact: true },
    { path: '/admin/users', label: 'User Management', icon: Users },
    { path: '/admin/banners', label: 'Banner Management', icon: Layout },  
    { path: '/admin/notifications', label: 'Notifications', icon: Bell },
    // { path: '/admin/chat', label: 'Chat Community', icon: MessageSquare },
    { path: '/admin/points', label: 'Points Rule Management', icon: Star },
    { path: '/admin/user-points', label: 'User Points Management', icon: Coins },
    { path: '/admin/analytics', label: 'Analytics', icon: TrendingUp, disabled: true },
    { path: '/admin/games', label: 'Games', icon: Gamepad2, disabled: true },
    { path: '/admin/settings', label: 'Settings', icon: Settings, disabled: true },
    { path: '/admin/sync', label: 'Sync H5 games', icon: FolderSync },
    { path: '/admin/game-manager', label: 'Game Manager', icon: Gamepad2 },
    { path: '/admin/matches/sync', label: 'Sync SportsMonk Matches', icon: FolderSync },
    { path: '/admin/predictions', label: 'Prediction Management', icon: Trophy },



  ];

  return (
    <div style={{
      width: '260px',
      background: 'var(--admin-card-bg)',
      borderRight: '1px solid var(--admin-border)',
      height: '100vh',
      position: 'sticky',
      top: 0,
      padding: '24px 0'
    }}>
      <div style={{ padding: '0 20px', marginBottom: '32px' }}>
        <h2 style={{
          fontSize: '24px',
          fontWeight: '900',
          background: 'linear-gradient(135deg, var(--admin-primary), var(--admin-secondary))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          margin: 0
        }}>
          8JJ Admin
        </h2>
      </div>

      <nav>
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          return item.disabled ? (
            <div
              key={item.path}
              style={{
                padding: '12px 20px',
                color: 'var(--admin-text-secondary)',
                opacity: 0.4,
                cursor: 'not-allowed',
                fontSize: '15px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              <IconComponent size={18} strokeWidth={2} />
              {item.label} <span style={{ fontSize: '11px' }}>(Soon)</span>
            </div>
          ) : (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 20px',
                color: isActive ? 'var(--admin-primary)' : 'var(--admin-text-secondary)',
                textDecoration: 'none',
                fontSize: '15px',
                fontWeight: isActive ? '600' : '400',
                background: isActive ? 'rgba(0, 217, 255, 0.1)' : 'transparent',
                borderLeft: isActive ? '3px solid var(--admin-primary)' : '3px solid transparent',
                transition: 'all 0.2s ease'
              })}
            >
              {({ isActive }) => (
                <>
                  <IconComponent 
                    size={18} 
                    strokeWidth={isActive ? 2.5 : 2} 
                  />
                  {item.label}
                </>
              )}
            </NavLink>
          )
        })}
      </nav>

      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        right: '20px',
        padding: '16px',
        background: 'rgba(0, 217, 255, 0.05)',
        borderRadius: '8px',
        border: '1px solid var(--admin-border)'
      }}>
        <p style={{ fontSize: '12px', color: 'var(--admin-text-secondary)', margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Gamepad2 size={14} strokeWidth={2} />
          8JJ Games Admin Panel
        </p>
        <p style={{ fontSize: '11px', color: 'var(--admin-text-secondary)', margin: '4px 0 0 0', opacity: 0.6 }}>
          v1.0.0
        </p>
      </div>
    </div>
  );
}