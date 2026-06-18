// react-app/src/components/Header/NotificationsDropdown.jsx

import { useState, useEffect } from "react";
import { notificationAPI } from "../../api/notification.api";
import { useLanguage } from "../../context/LanguageContext";
import { translate } from "../../data/translations";
import { 
  Bell, 
  Settings, 
  Loader2, 
  AlertCircle, 
  Inbox, 
  CheckCheck,
  Trash2,
  RefreshCw
} from "lucide-react";
import "./HeaderDropdowns.css";

export default function NotificationsDropdown({ isOpen, onClose }) {
  const { lang } = useLanguage();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
      loadUnreadCount();
    }
  }, [isOpen, filter]);

  useEffect(() => {
    if (!isOpen) return;
    
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        loadUnreadCount();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        loadUnreadCount();
      }
    }, 120000);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(interval);
    };
  }, [isOpen]);

  const loadUnreadCount = async () => {
    try {
      const data = await notificationAPI.getUnreadCount();
      setUnreadCount(data.count || 0);
    } catch (err) {
      console.error('Failed to load unread count:', err);
    }
  };

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await notificationAPI.getNotifications({
        page: 1,
        limit: 20,
        type: filter,
        unreadOnly: filter === 'unread'
      });

      setNotifications(data.notifications || []);
    } catch (err) {
      console.error('❌ Failed to load notifications:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    const previousNotifications = [...notifications];
    const previousUnreadCount = unreadCount;
    
    setNotifications(notifications.map(n =>
      n.id === notificationId ? { ...n, is_read: true, read_at: new Date() } : n
    ));
    setUnreadCount(prev => Math.max(0, prev - 1));
    
    try {
      await notificationAPI.markAsRead(notificationId);
    } catch (err) {
      console.error('Failed to mark as read:', err);
      setNotifications(previousNotifications);
      setUnreadCount(previousUnreadCount);
    }
  };

  const markAllAsRead = async () => {
    const previousNotifications = [...notifications];
    const previousUnreadCount = unreadCount;
    
    setNotifications(notifications.map(n => ({ ...n, is_read: true, read_at: new Date() })));
    setUnreadCount(0);
    
    try {
      await notificationAPI.markAllAsRead();
    } catch (err) {
      console.error('Failed to mark all as read:', err);
      setNotifications(previousNotifications);
      setUnreadCount(previousUnreadCount);
    }
  };

  const clearAll = async () => {
    if (!window.confirm(translate("clearAll", lang) + "?")) return;

    const previousNotifications = [...notifications];
    
    setNotifications([]);
    setUnreadCount(0);

    try {
      await notificationAPI.clearAll();
    } catch (err) {
      console.error('Failed to clear notifications:', err);
      setNotifications(previousNotifications);
    }
  };

  const getNotificationColor = (type, priority) => {
    if (priority === 'urgent') return '#e74c3c';
    if (priority === 'high') return '#f39c12';

    const colors = {
      'achievement': '#2ecc71',
      'promotional_offer': '#9b59b6',
      'maintenance_alert': '#e67e22',
      'tournament_announcement': '#3498db'
    };
    return colors[type] || '#00d9ff';
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';

    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return translate("justNow", lang) || 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.is_read) await markAsRead(notification.id);
    if (notification.action_url) window.location.href = notification.action_url;
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="dropdown-overlay" onClick={onClose}></div>
      <div className="header-dropdown notifications-dropdown">
        <div className="dropdown-header">
          <div className="dropdown-title">
            <Bell className="dropdown-icon-lucide" size={22} strokeWidth={2.5} />
            <h3>{translate("notificationsTitle", lang)}</h3>
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}
          </div>

          <div className="dropdown-header-actions">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="dropdown-select"
            >
              <option value="all">{translate("allOption", lang)}</option>
              <option value="unread">{translate("unreadOption", lang)}</option>
              <option value="system">{translate("systemOption", lang)}</option>
              <option value="achievement">{translate("achievementsOption", lang)}</option>
              <option value="game_update">{translate("gameUpdatesOption", lang)}</option>
              <option value="promotional_offer">{translate("offersOption", lang)}</option>
              <option value="tournament_announcement">{translate("tournamentsOption", lang)}</option>
            </select>

            <button
              className="dropdown-settings-btn"
              title={translate("notificationSettings", lang)}
              onClick={() => window.location.href = '/profile?tab=notifications'}
            >
              <Settings size={16} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        <div className="dropdown-content">
          {loading ? (
            <div className="loading-state">
              <Loader2 className="loading-spinner-icon" size={40} strokeWidth={2.5} />
              <p>{translate("loadingText", lang)}</p>
            </div>
          ) : error ? (
            <div className="empty-state">
              <AlertCircle className="empty-icon-lucide" size={48} strokeWidth={2} />
              <h4>{translate("errorTitle", lang)}</h4>
              <p>{error}</p>
              <button onClick={loadNotifications} className="retry-btn">
                {translate("retryBtn", lang)}
              </button>
            </div>
          ) : notifications.length === 0 ? (
            <div className="empty-state">
              <Inbox className="empty-icon-lucide" size={48} strokeWidth={2} />
              <h4>
                {translate("noNotifications", lang)}
                {filter !== 'all' && ` (${filter})`}
              </h4>
              <p>{translate("noNotificationsMessage", lang)}</p>
            </div>
          ) : (
            <>
              {unreadCount > 0 && (
                <div className="notifications-actions">
                  <button className="text-btn" onClick={markAllAsRead}>
                    <CheckCheck size={14} strokeWidth={2.5} />
                    <span>{translate("markAllAsRead", lang)}</span>
                  </button>
                  <button className="text-btn text-btn-danger" onClick={clearAll}>
                    <Trash2 size={14} strokeWidth={2.5} />
                    <span>{translate("clearAll", lang)}</span>
                  </button>
                </div>
              )}

              <div className="notifications-list">
                {notifications.map((notif) => {
                  const bgColor = getNotificationColor(notif.type, notif.priority);

                  return (
                    <div
                      key={notif.id}
                      className={`notification-item ${!notif.is_read ? 'unread' : ''} ${notif.action_url ? 'clickable' : ''}`}
                      onClick={() => handleNotificationClick(notif)}
                      style={{
                        borderLeft: !notif.is_read ? `3px solid ${bgColor}` : '3px solid transparent'
                      }}
                    >
                      <div className="notification-content">
                        <div className="notification-header">
                          <p className="notification-title">{notif.title}</p>
                          {notif.priority === 'urgent' && (
                            <span className="priority-badge urgent">URGENT</span>
                          )}
                          {notif.priority === 'high' && (
                            <span className="priority-badge high">HIGH</span>
                          )}
                        </div>

                        <p className="notification-message">{notif.message}</p>

                        <div className="notification-meta">
                          <span className="notification-time">{formatTime(notif.created_at)}</span>
                          {notif.type && (
                            <span 
                              className="notification-type"
                              style={{
                                background: `${bgColor}15`,
                                color: bgColor
                              }}
                            >
                              {notif.type.replace(/_/g, ' ')}
                            </span>
                          )}
                        </div>

                        {notif.action_text && (
                          <button 
                            className="notification-action-btn" 
                            style={{ background: bgColor }}
                          >
                            {notif.action_text} →
                          </button>
                        )}
                      </div>

                      {!notif.is_read && (
                        <div className="unread-dot" style={{ background: bgColor }}></div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {notifications.length > 0 && (
          <div className="dropdown-footer">
            <span className="footer-count">
              {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
              {unreadCount > 0 && ` · ${unreadCount} unread`}
            </span>
            <button onClick={loadNotifications} className="footer-refresh-btn">
              <RefreshCw size={14} strokeWidth={2.5} />
              <span>{translate("refresh", lang)}</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
}