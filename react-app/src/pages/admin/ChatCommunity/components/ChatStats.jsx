// react-app/src/pages/admin/ChatCommunity/components/ChatStats.jsx

import { MessageSquare, Calendar, Radio, Users, Trash2, UserCheck } from 'lucide-react';
import '../../styles/shared.css';

export default function ChatStats({ stats, loading }) {
  const cards = [
    { 
      label: 'Total Messages', 
      value: stats.totalMessages ?? '—', 
      icon: MessageSquare, 
      color: 'var(--admin-primary)' 
    },
    { 
      label: 'Messages Today', 
      value: stats.messagesToday ?? '—', 
      icon: Calendar, 
      color: 'var(--admin-success)' 
    },
    { 
      label: 'Active Channels', 
      value: stats.activeChannels ?? '—', 
      icon: Radio, 
      color: 'var(--admin-secondary)' 
    },
    { 
      label: 'Online Now', 
      value: stats.onlineUsers ?? '—', 
      icon: Users, 
      color: 'var(--admin-success)' 
    },
    { 
      label: 'Deleted Messages', 
      value: stats.deletedMessages ?? '—', 
      icon: Trash2, 
      color: 'var(--admin-warning)' 
    },
    { 
      label: 'Total Users Chatted', 
      value: stats.uniqueChatters ?? '—', 
      icon: UserCheck, 
      color: 'var(--admin-primary)' 
    },
  ];

  return (
    <div className="chat-stats-grid">
      {cards.map((card) => {
        const IconComponent = card.icon;
        return (
          <div
            key={card.label}
            className="admin-card stat-card AdminStatCard"
            style={{ borderLeftColor: card.color }}
          >
            <div className="stat-card-icon">
              <IconComponent 
                size={28} 
                strokeWidth={2} 
                style={{ color: card.color }}
              />
            </div>
            <div className="stat-card-content">
              <p className="stat-card-title">{card.label}</p>
              <h2 className="stat-card-value" style={{ color: card.color }}>
                {loading ? '...' : card.value.toLocaleString?.() ?? card.value}
              </h2>
            </div>
          </div>
        );
      })}
    </div>
  );
}