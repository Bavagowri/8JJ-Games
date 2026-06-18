// react-app/src/pages/admin/ChatCommunity/components/MessageTable.jsx 

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MessageSquare, 
  Search, 
  Trash2, 
  AlertCircle, 
  Crown,
  Target,
  Gamepad2,
  Star,
  Flame,
  Trophy,
  Megaphone,
  Dice5,
  Lightbulb,
  Handshake
} from 'lucide-react';
import '../../styles/shared.css';
import '../../styles/UserManagement.css';

// Icon mapping for channel icons
const ICON_MAP = {
  MessageSquare,
  Target,
  Gamepad2,
  Star,
  Flame,
  Trophy,
  Megaphone,
  Dice5,
  Lightbulb,
  Handshake,
};

const CHANNEL_COLORS = {
  general: '#5865F2',
  'gaming-tips': '#57F287',
  'game-requests': '#FEE75C',
  'off-topic': '#EB459E',
};

export default function MessageTable({
  messages,
  loading,
  selected,
  onSelect,
  onSelectAll,
  onDelete,
  channels,
  filters,
  onFilterChange,
  pagination,
  onPageChange,
}) {
  const navigate = useNavigate();
  const [confirmId, setConfirmId] = useState(null);

  const allSelected =
    messages.length > 0 && messages.every((m) => selected.includes(m.id));

  const handleDelete = (id) => {
    if (confirmId === id) {
      onDelete(id);
      setConfirmId(null);
    } else {
      setConfirmId(id);
      setTimeout(() => setConfirmId(null), 3000);
    }
  };

  const handleUserClick = (userId, e) => {
    e.stopPropagation();
    navigate(`/admin/users?userId=${userId}`);
  };

  const formatDate = (d) =>
    new Date(d).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <div className="admin-card">
      {/* Filters row */}
      <div className="chat-filters-row">
        <h3 className="user-table-title">
          <MessageSquare size={20} strokeWidth={2.5} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: 8 }} />
          Message Moderation
        </h3>
        <div className="chat-filters">
          <select
            className="admin-select chat-filter-select"
            value={filters.channel}
            onChange={(e) => onFilterChange({ ...filters, channel: e.target.value })}
          >
            <option value="">All Channels</option>
            {channels.map((c) => {
              // Try to get Lucide icon, fallback to string icon (emoji)
              const IconComponent = ICON_MAP[c.icon];
              const iconDisplay = IconComponent ? c.icon : (c.icon || '');
              return (
                <option key={c.id} value={c.id}>
                  {iconDisplay} {c.name}
                </option>
              );
            })}
          </select>

          <div style={{ position: 'relative', display: 'inline-block' }}>
            {/* <Search 
              size={16} 
              strokeWidth={2.5}
              style={{ 
                position: 'absolute', 
                left: 12, 
                top: '50%', 
                transform: 'translateY(-50%)',
                color: 'var(--admin-text-secondary)',
                pointerEvents: 'none'
              }} 
            /> */}
            <input
              className="admin-input chat-filter-input"
              placeholder="Search messages..."
              value={filters.search}
              onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
              style={{ paddingLeft: 36 }}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="user-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: 40 }}>
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={(e) => onSelectAll(e.target.checked)}
                />
              </th>
              <th>User</th>
              <th>Message</th>
              <th>Channel</th>
              <th>Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: 40 }}>
                  <div className="admin-spinner" style={{ margin: '0 auto' }} />
                </td>
              </tr>
            ) : messages.length === 0 ? (
              <tr>
                <td colSpan={7}>
                  <div className="user-table-empty">
                    <div className="empty-icon">
                      <MessageSquare size={48} strokeWidth={1.5} style={{ color: 'var(--admin-text-secondary)', opacity: 0.5 }} />
                    </div>
                    <p className="empty-title">No messages found</p>
                  </div>
                </td>
              </tr>
            ) : (
              messages.map((msg) => (
                <tr key={msg.id} className={selected.includes(msg.id) ? 'selected-row' : ''}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selected.includes(msg.id)}
                      onChange={(e) => onSelect(msg.id, e.target.checked)}
                    />
                  </td>
                  <td>
                    <div 
                      className="user-info"
                      onClick={(e) => handleUserClick(msg.user_id, e)}
                      style={{ cursor: 'pointer' }}
                      title="View user details"
                    >
                      <div>
                        <div className="user-username" style={{ 
                          color: 'var(--admin-primary)',
                          textDecoration: 'none',
                          transition: 'all 0.2s'
                        }}>
                          {msg.username}
                        </div>
                        {msg.role === 'admin' && (
                          <span className="admin-badge admin-badge-danger" style={{ fontSize: 10, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                            <Crown size={10} strokeWidth={2.5} />
                            Admin
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="chat-message-cell">
                      {msg.reply_to_message_id && (
                        <span className="chat-reply-tag">↩ reply</span>
                      )}
                      <span className={msg.is_deleted ? 'deleted-msg-text' : ''}>
                        {msg.is_deleted ? '[deleted]' : msg.content}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span
                      className="channel-badge"
                      style={{
                        background: `${CHANNEL_COLORS[msg.channel_name] || '#5865F2'}22`,
                        color: CHANNEL_COLORS[msg.channel_name] || '#5865F2',
                        border: `1px solid ${CHANNEL_COLORS[msg.channel_name] || '#5865F2'}55`,
                      }}
                    >
                      #{msg.channel_name}
                    </span>
                  </td>
                  <td className="user-date-cell">{formatDate(msg.created_at)}</td>
                  <td>
                    {msg.is_deleted ? (
                      <span className="admin-badge admin-badge-warning">Deleted</span>
                    ) : (
                      <span className="admin-badge admin-badge-success">Active</span>
                    )}
                  </td>
                  <td>
                    {!msg.is_deleted && (
                      <button
                        className={`admin-button user-action-btn ${
                          confirmId === msg.id ? 'admin-button-danger' : 'admin-button-warning'
                        }`}
                        onClick={() => handleDelete(msg.id)}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                      >
                        {confirmId === msg.id ? (
                          <>
                            <AlertCircle size={14} strokeWidth={2.5} />
                            Confirm
                          </>
                        ) : (
                          <>
                            <Trash2 size={14} strokeWidth={2.5} />
                            Delete
                          </>
                        )}
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="admin-pagination">
          <button
            disabled={pagination.page <= 1}
            onClick={() => onPageChange(pagination.page - 1)}
          >
            ← Prev
          </button>
          {Array.from({ length: Math.min(pagination.totalPages, 7) }, (_, i) => i + 1).map(
            (p) => (
              <button
                key={p}
                className={p === pagination.page ? 'active' : ''}
                onClick={() => onPageChange(p)}
              >
                {p}
              </button>
            )
          )}
          <button
            disabled={pagination.page >= pagination.totalPages}
            onClick={() => onPageChange(pagination.page + 1)}
          >
            Next →
          </button>
          <span style={{ color: 'var(--admin-text-secondary)', fontSize: 13, marginLeft: 8 }}>
            {pagination.total} total
          </span>
        </div>
      )}

      <style>{`
        .user-info:hover .user-username {
          text-decoration: underline;
          opacity: 0.8;
        }
      `}</style>
    </div>
  );
}