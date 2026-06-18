// react-app/src/pages/admin/ChatCommunity/components/OnlineUsersPanel.jsx 

import { useNavigate } from 'react-router-dom';
import { Users, Crown, Gamepad2 } from 'lucide-react';
import { resolveAvatarUrl } from '../../../../utils/avatarUrl';
import '../../styles/shared.css';

const STATUS_COLOR = { online: '#57F287', away: '#FEE75C', busy: '#ED4245', offline: '#888' };

export default function OnlineUsersPanel({ users, loading }) {
  const navigate = useNavigate();

  const handleUserClick = (userId) => {
    navigate(`/admin/users?userId=${userId}`);
  };

  return (
    <div className="admin-card">
      <h3 className="admin-card-title">
        <Users size={20} strokeWidth={2.5} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: 8, color: 'var(--admin-success)' }} />
        Online Users
        <span className="online-count-badge">{users.length}</span>
      </h3>

      {loading ? (
        <div className="admin-spinner" style={{ margin: '20px auto' }} />
      ) : users.length === 0 ? (
        <p style={{ color: 'var(--admin-text-secondary)', textAlign: 'center', padding: 20 }}>
          No users online
        </p>
      ) : (
        <div className="online-users-list">
          {users.map((user) => (
            <div 
              key={user.id} 
              className="online-user-row"
              onClick={() => handleUserClick(user.id)}
              style={{ cursor: 'pointer' }}
              title="View user details"
            >
              <div className="online-user-avatar-wrap">
                <img
                  src={resolveAvatarUrl(user.avatar)}
                  alt={user.username}
                  className="online-user-avatar"
                />
                <span
                  className="online-status-dot"
                  style={{ background: STATUS_COLOR[user.status] || '#888' }}
                />
              </div>
              <div className="online-user-info">
                <div className="online-user-name" style={{
                  color: 'var(--admin-primary)',
                  transition: 'all 0.2s'
                }}>
                  {user.username}
                </div>
                <div className="online-user-meta" style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                  <span>Lv.{user.level}</span>
                  <span>•</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    {user.role === 'admin' ? (
                      <>
                        <Crown size={12} strokeWidth={2.5} />
                        Admin
                      </>
                    ) : (
                      <>
                        <Gamepad2 size={12} strokeWidth={2.5} />
                        Player
                      </>
                    )}
                  </span>
                  <span>•</span>
                  <span style={{ color: STATUS_COLOR[user.status] }}>{user.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .online-user-row:hover {
          background: rgba(79, 172, 254, 0.1);
          border-radius: 8px;
        }
        .online-user-row:hover .online-user-name {
          text-decoration: underline;
          opacity: 0.8;
        }
      `}</style>
    </div>
  );
}