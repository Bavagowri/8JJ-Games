// react-app/src/pages/admin/ChatCommunity/components/BroadcastModal.jsx

import { useState } from 'react';
import { 
  Megaphone, 
  X, 
  CheckCircle,
  MessageSquare,
  Target,
  Gamepad2,
  Star,
  Flame,
  Trophy,
  Dice5,
  Lightbulb,
  Handshake
} from 'lucide-react';
import '../../styles/shared.css';

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

export default function BroadcastModal({ channels, onSend, onClose }) {
  const [form, setForm] = useState({ channelId: '', message: '' });
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSend = async () => {
    if (!form.message.trim() || !form.channelId) return;
    setSending(true);
    try {
      await onSend(form);
      setSuccess(true);
      setTimeout(onClose, 1500);
    } catch {
      setSending(false);
    }
  };

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal-header">
          <h2 className="admin-modal-title" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Megaphone size={24} strokeWidth={2.5} />
            Broadcast Message
          </h2>
          <button className="admin-modal-close" onClick={onClose}>
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        {success ? (
          <div style={{ textAlign: 'center', padding: '32px 0' }}>
            <CheckCircle size={64} strokeWidth={2} style={{ color: 'var(--admin-success)', marginBottom: 12 }} />
            <p style={{ color: 'var(--admin-success)', fontWeight: 600 }}>
              Message broadcast successfully!
            </p>
          </div>
        ) : (
          <>
            <div className="form-group" style={{ marginBottom: 16 }}>
              <label className="form-label">Target Channel</label>
              <select
                className="admin-select"
                value={form.channelId}
                onChange={(e) => setForm({ ...form, channelId: e.target.value })}
              >
                <option value="">Select a channel...</option>
                {channels.map((c) => {
                  const iconDisplay = ICON_MAP[c.icon] ? c.icon : (c.icon || '');
                  return (
                    <option key={c.id} value={c.id}>
                      {iconDisplay} #{c.name}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 24 }}>
              <label className="form-label">System Message</label>
              <textarea
                className="admin-input"
                rows={4}
                placeholder="Type your announcement here..."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                style={{ resize: 'vertical', fontFamily: 'inherit' }}
              />
              <small style={{ color: 'var(--admin-text-secondary)', fontSize: 12 }}>
                This will appear as a system message in the selected channel.
              </small>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button
                className="admin-button admin-button-primary"
                style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                onClick={handleSend}
                disabled={sending || !form.message.trim() || !form.channelId}
              >
                <Megaphone size={16} strokeWidth={2.5} />
                {sending ? 'Sending...' : 'Broadcast'}
              </button>
              <button
                className="admin-button admin-button-secondary"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}