// react-app/src/components/Chat/OnlineUsersList.jsx

import { resolveAvatarUrl } from '../../utils/avatarUrl';
import './OnlineUsersList.css';

export default function OnlineUsersList({ users, currentUserId }) {
  const sortedUsers = [...users].sort((a, b) => {
    if (a.id === currentUserId) return -1;
    if (b.id === currentUserId) return 1;
    const statusOrder = { online: 0, away: 1, busy: 2 };
    return statusOrder[a.status] - statusOrder[b.status];
  });

  return (
    <div className="user-list">
      <div className="user-list-header">
        <h3>
          Online — {users.length}
        </h3>
      </div>

      <div className="user-items">
        {sortedUsers.map(user => (
          <div
            key={user.id}
            className={`user-item ${user.id === currentUserId ? 'current-user' : ''}`}
          >
            <div className="user-avatar-wrapper">
              <img
                src={resolveAvatarUrl(user.avatar)}
                alt={user.username}
                className="user-avatar"
              />
              <div className={`user-status ${user.status}`}></div>
            </div>

            <div className="user-info">
              <div className="user-name">
                {user.username}
                {user.id === currentUserId && ' (You)'}
              </div>
              <div className="user-level">
                Level {user.level} • {user.role === 'admin' ? '👑 Admin' : '🎮 Player'}
              </div>
            </div>
          </div>
        ))}

        {users.length === 0 && (
          <div className="no-users">
            <p>No one else online right now</p>
          </div>
        )}
      </div>
    </div>
  );
}