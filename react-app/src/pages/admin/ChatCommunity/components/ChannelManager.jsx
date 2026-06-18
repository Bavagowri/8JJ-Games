// react-app/src/pages/admin/ChatCommunity/components/ChannelManager.jsx

import { useState } from 'react';
import { 
  Radio, 
  Plus, 
  Edit2, 
  Trash2, 
  AlertCircle, 
  Check,
  MessageSquare,
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

const ICON_OPTIONS = [
  { name: 'MessageSquare', component: MessageSquare },
  { name: 'Target', component: Target },
  { name: 'Gamepad2', component: Gamepad2 },
  { name: 'Star', component: Star },
  { name: 'Flame', component: Flame },
  { name: 'Trophy', component: Trophy },
  { name: 'Megaphone', component: Megaphone },
  { name: 'Dice5', component: Dice5 },
  { name: 'Lightbulb', component: Lightbulb },
  { name: 'Handshake', component: Handshake },
];

const COLOR_OPTIONS = ['#5865F2', '#57F287', '#FEE75C', '#EB459E', '#ED4245', '#00d9ff', '#FF7043'];

const defaultForm = {
  name: '',
  description: '',
  icon: 'MessageSquare',
  color: '#5865F2',
  is_active: true,
};

export default function ChannelManager({ channels, loading, onUpdate, onCreate, onDelete }) {
  const [editingId, setEditingId] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const openEdit = (channel) => {
    setEditingId(channel.id);
    setShowCreate(false);
    setForm({
      name: channel.name,
      description: channel.description || '',
      icon: channel.icon || 'MessageSquare',
      color: channel.color || '#5865F2',
      is_active: channel.is_active !== false,
    });
  };

  const openCreate = () => {
    setEditingId(null);
    setShowCreate(true);
    setForm(defaultForm);
  };

  const handleSave = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      if (showCreate) {
        await onCreate(form);
        setShowCreate(false);
      } else {
        await onUpdate(editingId, form);
        setEditingId(null);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirmDelete === id) {
      await onDelete(id);
      setConfirmDelete(null);
    } else {
      setConfirmDelete(id);
      setTimeout(() => setConfirmDelete(null), 3000);
    }
  };

  const isEditing = (id) => editingId === id;

  return (
    <div className="admin-card">
      <div className="admin-card-header" style={{ marginBottom: 20 }}>
        <h3 className="admin-card-title">
          <Radio size={20} strokeWidth={2.5} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: 8 }} />
          Channel Management
        </h3>
        <button className="admin-button admin-button-primary" onClick={openCreate} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <Plus size={16} strokeWidth={2.5} />
          New Channel
        </button>
      </div>

      {/* Create form */}
      {showCreate && (
        <ChannelForm
          form={form}
          onChange={setForm}
          onSave={handleSave}
          onCancel={() => setShowCreate(false)}
          saving={saving}
          title="Create Channel"
        />
      )}

      {/* Channel list */}
      {loading ? (
        <div className="admin-spinner" style={{ margin: '20px auto' }} />
      ) : (
        <div className="channel-manager-list">
          {channels.map((ch) => (
            <div key={ch.id} className="channel-manager-item">
              {isEditing(ch.id) ? (
                <ChannelForm
                  form={form}
                  onChange={setForm}
                  onSave={handleSave}
                  onCancel={() => setEditingId(null)}
                  saving={saving}
                  title={`Edit #${ch.name}`}
                />
              ) : (
                <div className="channel-manager-row">
                  <div className="channel-manager-left">
                    <span className="channel-manager-icon" style={{ color: ch.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {(() => {
                        const IconOption = ICON_OPTIONS.find(opt => opt.name === ch.icon);
                        if (IconOption) {
                          const IconComponent = IconOption.component;
                          return <IconComponent size={22} strokeWidth={2.5} />;
                        }
                        return ch.icon; // Fallback to string if old emoji
                      })()}
                    </span>
                    <div>
                      <div className="channel-manager-name">
                        #{ch.name}
                        {!ch.is_active && (
                          <span className="admin-badge admin-badge-warning" style={{ marginLeft: 8, fontSize: 11 }}>
                            Inactive
                          </span>
                        )}
                      </div>
                      <div className="channel-manager-desc">
                        {ch.description || 'No description'}
                      </div>
                      <div className="channel-manager-meta">
                        <span>{ch.message_count ?? 0} messages</span>
                      </div>
                    </div>
                  </div>
                  <div className="channel-manager-actions">
                    <button
                      className="admin-button admin-button-secondary user-action-btn"
                      onClick={() => openEdit(ch)}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                    >
                      <Edit2 size={14} strokeWidth={2.5} />
                      Edit
                    </button>
                    <button
                      className={`admin-button user-action-btn ${
                        confirmDelete === ch.id ? 'admin-button-danger' : 'admin-button-warning'
                      }`}
                      onClick={() => handleDelete(ch.id)}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                    >
                      {confirmDelete === ch.id ? (
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
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ChannelForm({ form, onChange, onSave, onCancel, saving, title }) {
  return (
    <div className="channel-form">
      <h4 className="channel-form-title">{title}</h4>
      <div className="channel-form-grid">
        <div className="form-group">
          <label className="form-label">Name</label>
          <input
            className="admin-input"
            value={form.name}
            onChange={(e) => onChange({ ...form, name: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
            placeholder="channel-name"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Description</label>
          <input
            className="admin-input"
            value={form.description}
            onChange={(e) => onChange({ ...form, description: e.target.value })}
            placeholder="Channel description..."
          />
        </div>
        <div className="form-group">
          <label className="form-label">Icon</label>
          <div className="icon-picker">
            {ICON_OPTIONS.map((iconOption) => {
              const IconComponent = iconOption.component;
              return (
                <button
                  key={iconOption.name}
                  type="button"
                  className={`icon-option ${form.icon === iconOption.name ? 'selected' : ''}`}
                  onClick={() => onChange({ ...form, icon: iconOption.name })}
                  title={iconOption.name}
                >
                  <IconComponent size={18} strokeWidth={2.5} />
                </button>
              );
            })}
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Color</label>
          <div className="color-picker">
            {COLOR_OPTIONS.map((c) => (
              <button
                key={c}
                type="button"
                className={`color-option ${form.color === c ? 'selected' : ''}`}
                style={{ background: c }}
                onClick={() => onChange({ ...form, color: c })}
              />
            ))}
          </div>
        </div>
        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              className="checkbox-input"
              checked={form.is_active}
              onChange={(e) => onChange({ ...form, is_active: e.target.checked })}
            />
            <span className="checkbox-text">Active</span>
          </label>
        </div>
      </div>
      <div className="channel-form-actions">
        <button 
          className="admin-button admin-button-primary" 
          onClick={onSave} 
          disabled={saving}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
        >
          <Check size={16} strokeWidth={2.5} />
          {saving ? 'Saving...' : 'Save'}
        </button>
        <button className="admin-button admin-button-secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}