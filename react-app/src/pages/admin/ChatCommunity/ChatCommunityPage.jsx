// react-app/src/pages/admin/ChatCommunity/ChatCommunityPage.jsx

import { useState, useEffect, useCallback } from 'react';
import { BarChart3, MessageSquare, Radio, RefreshCw, Megaphone, Trash2 } from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import ChatStats from './components/ChatStats';
import MessageTable from './components/MessageTable';
import ChannelManager from './components/ChannelManager';
import OnlineUsersPanel from './components/OnlineUsersPanel';
import BroadcastModal from './components/BroadcastModal';
import { chatAdminAPI } from '../../../api/chatAdmin.api';
import '../styles/shared.css';
import './ChatCommunity.css';

const TABS = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'messages', label: 'Messages', icon: MessageSquare },
  { id: 'channels', label: 'Channels', icon: Radio },
];

export default function ChatCommunityPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({});
  const [messages, setMessages] = useState([]);
  const [channels, setChannels] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [loading, setLoading] = useState({ stats: true, messages: true, channels: true, online: true });
  const [selected, setSelected] = useState([]);
  const [showBroadcast, setShowBroadcast] = useState(false);
  const [filters, setFilters] = useState({ channel: '', search: '' });
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [error, setError] = useState(null);

  // ─── Loaders ───────────────────────────────────────
  const loadStats = useCallback(async () => {
    try {
      setLoading((l) => ({ ...l, stats: true }));
      const data = await chatAdminAPI.getStats();
      setStats(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading((l) => ({ ...l, stats: false }));
    }
  }, []);

  const loadMessages = useCallback(async (page = 1) => {
    try {
      setLoading((l) => ({ ...l, messages: true }));
      const data = await chatAdminAPI.getMessages({ page, ...filters });
      setMessages(data.messages);
      setPagination(data.pagination);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading((l) => ({ ...l, messages: false }));
    }
  }, [filters]);

  const loadChannels = useCallback(async () => {
    try {
      setLoading((l) => ({ ...l, channels: true }));
      const data = await chatAdminAPI.getChannels();
      setChannels(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading((l) => ({ ...l, channels: false }));
    }
  }, []);

  const loadOnlineUsers = useCallback(async () => {
    try {
      setLoading((l) => ({ ...l, online: true }));
      const data = await chatAdminAPI.getOnlineUsers();
      setOnlineUsers(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading((l) => ({ ...l, online: false }));
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadStats();
    loadChannels();
    loadOnlineUsers();
  }, [loadStats, loadChannels, loadOnlineUsers]);

  // Load messages when tab is active or filters change
  useEffect(() => {
    if (activeTab === 'messages' || activeTab === 'overview') {
      loadMessages(1);
    }
  }, [activeTab, filters, loadMessages]);

  // Auto-refresh online users every 30 seconds
  useEffect(() => {
    const interval = setInterval(loadOnlineUsers, 30000);
    return () => clearInterval(interval);
  }, [loadOnlineUsers]);

  // ─── Actions ───────────────────────────────────────
  const handleDeleteMessage = async (id) => {
    await chatAdminAPI.deleteMessage(id);
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, is_deleted: true } : m))
    );
    loadStats();
  };

  const handleBulkDelete = async () => {
    if (!selected.length) return;
    await chatAdminAPI.bulkDeleteMessages(selected);
    setMessages((prev) =>
      prev.map((m) => (selected.includes(m.id) ? { ...m, is_deleted: true } : m))
    );
    setSelected([]);
    loadStats();
  };

  const handleSelect = (id, checked) => {
    setSelected((prev) => (checked ? [...prev, id] : prev.filter((s) => s !== id)));
  };

  const handleSelectAll = (checked) => {
    setSelected(checked ? messages.filter((m) => !m.is_deleted).map((m) => m.id) : []);
  };

  const handleBroadcast = async (data) => {
    await chatAdminAPI.broadcastMessage(data);
  };

  const handleCreateChannel = async (data) => {
    await chatAdminAPI.createChannel(data);
    loadChannels();
    loadStats();
  };

  const handleUpdateChannel = async (id, data) => {
    await chatAdminAPI.updateChannel(id, data);
    loadChannels();
  };

  const handleDeleteChannel = async (id) => {
    await chatAdminAPI.deleteChannel(id);
    loadChannels();
    loadStats();
  };

  // ─── Render ────────────────────────────────────────
  return (
    <AdminLayout title="Chat Community" breadcrumbs={['Admin', 'Chat Community']}>

      {/* Top toolbar */}
      <div className="chat-admin-toolbar">
        <div className="chat-admin-tabs">
          {TABS.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                className={`chat-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <IconComponent size={18} strokeWidth={2.5} className="tab-icon" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="chat-admin-actions">
          {selected.length > 0 && (
            <button className="admin-button admin-button-danger" onClick={handleBulkDelete}>
              <Trash2 size={16} strokeWidth={2.5} />
              Delete Selected ({selected.length})
            </button>
          )}
          <button
            className="admin-button admin-button-secondary"
            onClick={() => { loadStats(); loadChannels(); loadOnlineUsers(); loadMessages(1); }}
          >
            <RefreshCw size={16} strokeWidth={2.5} />
            Refresh
          </button>
          <button
            className="admin-button admin-button-primary"
            onClick={() => setShowBroadcast(true)}
          >
            <Megaphone size={16} strokeWidth={2.5} />
            Broadcast
          </button>
        </div>
      </div>

      {error && (
        <div className="admin-card" style={{ borderColor: 'var(--admin-danger)', marginBottom: 24 }}>
          <p style={{ color: 'var(--admin-danger)', margin: 0 }}>⚠️ {error}</p>
          <button
            className="admin-button admin-button-secondary"
            style={{ marginTop: 8 }}
            onClick={() => setError(null)}
          >
            Dismiss
          </button>
        </div>
      )}

      {/* ── Overview tab ── */}
      {activeTab === 'overview' && (
        <>
          <ChatStats stats={stats} loading={loading.stats} />

          <div className="chat-overview-grid">
            {/* Recent messages */}
            <div style={{ flex: 2 }}>
              <MessageTable
                messages={messages.slice(0, 10)}
                loading={loading.messages}
                selected={selected}
                onSelect={handleSelect}
                onSelectAll={handleSelectAll}
                onDelete={handleDeleteMessage}
                channels={channels}
                filters={filters}
                onFilterChange={setFilters}
                pagination={null}
                onPageChange={() => {}}
              />
            </div>

            {/* Online users sidebar */}
            <div style={{ flex: 1, minWidth: 240 }}>
              <OnlineUsersPanel users={onlineUsers} loading={loading.online} />
            </div>
          </div>
        </>
      )}

      {/* ── Messages tab ── */}
      {activeTab === 'messages' && (
        <MessageTable
          messages={messages}
          loading={loading.messages}
          selected={selected}
          onSelect={handleSelect}
          onSelectAll={handleSelectAll}
          onDelete={handleDeleteMessage}
          channels={channels}
          filters={filters}
          onFilterChange={(f) => { setFilters(f); setSelected([]); }}
          pagination={pagination}
          onPageChange={(p) => loadMessages(p)}
        />
      )}

      {/* ── Channels tab ── */}
      {activeTab === 'channels' && (
        <div className="chat-channels-grid">
          <div style={{ flex: 2 }}>
            <ChannelManager
              channels={channels}
              loading={loading.channels}
              onUpdate={handleUpdateChannel}
              onCreate={handleCreateChannel}
              onDelete={handleDeleteChannel}
            />
          </div>
          <div style={{ flex: 1, minWidth: 240 }}>
            <OnlineUsersPanel users={onlineUsers} loading={loading.online} />
          </div>
        </div>
      )}

      {/* Broadcast modal */}
      {showBroadcast && (
        <BroadcastModal
          channels={channels}
          onSend={handleBroadcast}
          onClose={() => setShowBroadcast(false)}
        />
      )}
    </AdminLayout>
  );
}