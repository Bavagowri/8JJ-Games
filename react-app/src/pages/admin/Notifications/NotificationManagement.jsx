

// react-app/src/pages/admin/Notifications/NotificationManagement.jsx

import { useState, useEffect } from 'react';
import { notificationAPI } from '../../../api/notification.api';
import { QuickSendModal, TemplateModal, CampaignModal } from './NotificationModals';
import AdminLayout from '../components/AdminLayout';
import '../styles/shared.css';
import '../styles/AdminDashboard.css';
import '../styles/Modal.css';

export default function NotificationManagement() {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({});
  const [templates, setTemplates] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [presets, setPresets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showQuickSendModal, setShowQuickSendModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [selectedPreset, setSelectedPreset] = useState(null);

  // Filter states
  const [templateFilter, setTemplateFilter] = useState('all');
  const [campaignFilter, setCampaignFilter] = useState('all');

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    try {
      setLoading(true);

      if (activeTab === 'overview') {
        const [statsData, categoriesData] = await Promise.all([
          notificationAPI.getStats(),
          notificationAPI.getCategories?.() || Promise.resolve([])
        ]);
        setStats(statsData);
        setCategories(categoriesData);
      } else if (activeTab === 'templates') {
        const templatesData = await notificationAPI.getTemplates();
        setTemplates(templatesData);
      } else if (activeTab === 'campaigns') {
        const campaignsData = await notificationAPI.getCampaigns();
        setCampaigns(campaignsData);
      } else if (activeTab === 'quick-send') {
        const presetsData = await notificationAPI.getPresets?.() || [];
        setPresets(presetsData);
      }
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickSendFromPreset = (preset) => {
    setSelectedPreset(preset);
    setShowQuickSendModal(true);
  };

  const renderOverview = () => (
    <div>
      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '24px',
        marginBottom: '32px'
      }}>
        <StatCard
          icon="📊"
          value={stats.totalNotifications || 0}
          label="Total Notifications"
          color="var(--primary)"
        />
        <StatCard
          icon="📬"
          value={stats.unreadNotifications || 0}
          label="Unread"
          color="#f39c12"
        />
        <StatCard
          icon="📤"
          value={stats.sentToday || 0}
          label="Sent Today"
          color="#2ecc71"
        />
        <StatCard
          icon="⏰"
          value={stats.scheduledNotifications || 0}
          label="Scheduled"
          color="#9b59b6"
        />
      </div>

      {/* Engagement Metrics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '24px',
        marginBottom: '32px'
      }}>
        <div className="admin-card" style={{ padding: '24px' }}>
          <h4 style={{ fontSize: '16px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>📈</span> Engagement Metrics
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <MetricBar
              label="Average Open Rate"
              value={stats.engagement?.averageOpenRate || 0}
              color="#2ecc71"
            />
            <MetricBar
              label="Average Click Rate"
              value={stats.engagement?.averageClickRate || 0}
              color="#3498db"
            />
          </div>
        </div>

        <div className="admin-card" style={{ padding: '24px' }}>
          <h4 style={{ fontSize: '16px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>📢</span> Campaign Overview
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Total Campaigns</span>
              <span style={{ fontSize: '20px', fontWeight: '700' }}>{stats.totalCampaigns || 0}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Active</span>
              <span style={{ fontSize: '20px', fontWeight: '700', color: '#f39c12' }}>{stats.activeCampaigns || 0}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Completed</span>
              <span style={{ fontSize: '20px', fontWeight: '700', color: '#2ecc71' }}>{stats.completedCampaigns || 0}</span>
            </div>
          </div>
        </div>

        {/* Recent Activity Chart */}
        {stats.recentActivity && stats.recentActivity.length > 0 && (
          <div className="admin-card" style={{ padding: '24px' }}>
            <h4 style={{ fontSize: '16px', marginBottom: '20px' }}>📊 Recent Activity (Last 7 Days)</h4>
            <div style={{  display: 'flex', alignItems: 'flex-end', gap: '12px' }}>
              {stats.recentActivity.map((day, idx) => {
                const maxCount = Math.max(...stats.recentActivity.map(d => d.count));
                const height = (day.count / maxCount) * 100;
                return (
                  <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-primary)' }}>
                      {day.count}
                    </div>
                    <div style={{
                      width: '100%',
                      height: `${height}%`,
                      background: 'linear-gradient(180deg, #00d9ff 0%, #4facfe 100%)',
                      borderRadius: '8px 8px 0 0',
                      minHeight: '20px'
                    }} />
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                      {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>



      {/* Notifications by Type */}
      <div className="admin-card">
        <h3 className="admin-card-title">Notifications by Type</h3>
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Count</th>
                <th>Percentage</th>
              </tr>
            </thead>
            <tbody>
              {(stats.notificationsByType || []).map(item => {
                const percentage = stats.totalNotifications > 0
                  ? ((item.count / stats.totalNotifications) * 100).toFixed(1)
                  : 0;
                return (
                  <tr key={item.type}>
                    <td><span className="admin-badge admin-badge-info">{item.type}</span></td>
                    <td>{item.count}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          flex: 1,
                          height: '8px',
                          background: 'rgba(79, 172, 254, 0.1)',
                          borderRadius: '4px',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            width: `${percentage}%`,
                            height: '100%',
                            background: 'var(--primary-gradient)',
                            transition: 'width 0.3s ease'
                          }} />
                        </div>
                        <span style={{ minWidth: '45px', textAlign: 'right' }}>{percentage}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderTemplates = () => (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <h3 className="admin-card-title" style={{ margin: 0 }}>Notification Templates</h3>
          <select
            value={templateFilter}
            onChange={(e) => setTemplateFilter(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid var(--card-border)',
              background: 'var(--card-bg)',
              color: 'var(--text-primary)'
            }}
          >
            <option value="all">All Categories</option>
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="success">Success</option>
            <option value="error">Error</option>
            <option value="promotional">Promotional</option>
          </select>
        </div>
        <button
          className="admin-button admin-button-primary"
          onClick={() => {
            setEditingTemplate(null);
            setShowTemplateModal(true);
          }}
        >
          + Create Template
        </button>
      </div>

      <div className="admin-card">
        {templates.length === 0 ? (
          <p className="admin-empty">No templates found</p>
        ) : (
          <div style={{ display: 'grid', gap: '16px' }}>
            {templates
              .filter(t => templateFilter === 'all' || t.category === templateFilter)
              .map(template => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  onEdit={() => {
                    setEditingTemplate(template);
                    setShowTemplateModal(true);
                  }}
                  onDelete={async () => {
                    if (window.confirm('Delete this template?')) {
                      await notificationAPI.deleteTemplate(template.id);
                      loadData();
                    }
                  }}
                />
              ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderCampaigns = () => (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <h3 className="admin-card-title" style={{ margin: 0 }}>Notification Campaigns</h3>
          <select
            value={campaignFilter}
            onChange={(e) => setCampaignFilter(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid var(--card-border)',
              background: 'var(--card-bg)',
              color: 'var(--text-primary)'
            }}
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
            <option value="sending">Sending</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>
        </div>
        <button
          className="admin-button admin-button-primary"
          onClick={() => setShowCampaignModal(true)}
        >
          + Create Campaign
        </button>
      </div>

      <div className="admin-card">
        {campaigns.length === 0 ? (
          <p className="admin-empty">No campaigns found</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Target</th>
                  <th>Status</th>
                  <th>Recipients</th>
                  <th>Sent/Failed</th>
                  <th>Open Rate</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {campaigns
                  .filter(c => campaignFilter === 'all' || c.status === campaignFilter)
                  .map(campaign => (
                    <tr key={campaign.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {campaign.ab_test_enabled && (
                            <span title="A/B Testing Enabled" style={{ fontSize: '16px' }}>🧪</span>
                          )}
                          <span>{campaign.name}</span>
                        </div>
                      </td>
                      <td><span className="admin-badge admin-badge-info">{campaign.segment_type || campaign.target_type}</span></td>
                      <td>
                        <span className={`admin-badge admin-badge-${campaign.status === 'completed' ? 'success' :
                            campaign.status === 'failed' ? 'danger' :
                              campaign.status === 'sending' ? 'warning' : 'secondary'
                          }`}>
                          {campaign.status}
                        </span>
                      </td>
                      <td>{campaign.total_recipients || 0}</td>
                      <td>{campaign.sent_count || 0} / {campaign.failed_count || 0}</td>
                      <td>{campaign.open_rate ? `${campaign.open_rate}%` : '-'}</td>
                      <td>{new Date(campaign.created_at).toLocaleDateString()}</td>
                      <td>
                        {campaign.status === 'draft' && (
                          <button
                            className="admin-button admin-button-primary"
                            style={{ padding: '6px 12px', fontSize: '13px' }}
                            onClick={async () => {
                              if (window.confirm('Send this campaign?')) {
                                try {
                                  await notificationAPI.sendCampaign(campaign.id);
                                  alert('Campaign sent successfully!');
                                  loadData();
                                } catch (err) {
                                  alert('Failed to send campaign: ' + err.message);
                                }
                              }
                            }}
                          >
                            Send
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

  const renderQuickSend = () => (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h3 className="admin-card-title">Quick Send</h3>
        <button
          className="admin-button admin-button-primary"
          onClick={() => {
            setSelectedPreset(null);
            setShowQuickSendModal(true);
          }}
        >
          📤 Send Notification
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {presets.map(preset => (
          <div
            key={preset.id}
            className="admin-card"
            style={{
              padding: '20px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onClick={() => handleQuickSendFromPreset(preset)}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <h4 style={{ fontSize: '16px', fontWeight: '600', margin: 0 }}>{preset.name}</h4>
              <span className={`admin-badge admin-badge-${preset.priority === 'urgent' ? 'danger' : preset.priority === 'high' ? 'warning' : 'info'}`}>
                {preset.priority}
              </span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '12px' }}>
              {preset.description}
            </p>
            <div style={{ padding: '12px', background: 'rgba(79, 172, 254, 0.05)', borderRadius: '8px', fontSize: '14px' }}>
              <strong>{preset.title}</strong>
              <p style={{ margin: '8px 0 0 0', color: 'var(--text-secondary)' }}>{preset.message}</p>
            </div>
            <div style={{ marginTop: '12px', fontSize: '12px', color: 'var(--text-secondary)' }}>
              Used {preset.usage_count || 0} times
            </div>
          </div>
        ))}
      </div>

      {presets.length === 0 && (
        <div className="admin-card" style={{ padding: '60px', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
          <h3 style={{ marginBottom: '8px' }}>No Presets Available</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
            Create notification presets for quick sending
          </p>
          <button
            className="admin-button admin-button-primary"
            onClick={() => setShowQuickSendModal(true)}
          >
            Send Custom Notification
          </button>
        </div>
      )}
    </div>
  );

  return (
    <AdminLayout title="Notification Management" breadcrumbs={['Admin', 'Notifications']}>
      <div style={{ marginBottom: '32px' }}>
        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', borderBottom: '2px solid var(--card-border)', flexWrap: 'wrap' }}>
          {[
            { id: 'overview', label: '📊 Overview' },
            { id: 'quick-send', label: '⚡ Quick Send' },
            // { id: 'templates', label: '📝 Templates' },
            // { id: 'campaigns', label: '📢 Campaigns' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '12px 24px',
                background: activeTab === tab.id ? 'var(--primary-gradient)' : 'transparent',
                color: activeTab === tab.id ? 'white' : 'var(--text-secondary)',
                border: 'none',
                borderRadius: '8px 8px 0 0',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '15px',
                transition: 'all 0.2s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <div className="loading-spinner" style={{ margin: '0 auto 20px' }}></div>
            <p style={{ color: 'var(--text-secondary)' }}>Loading...</p>
          </div>
        ) : (
          <>
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'templates' && renderTemplates()}
            {activeTab === 'campaigns' && renderCampaigns()}
            {activeTab === 'quick-send' && renderQuickSend()}
          </>
        )}
      </div>

      {/* Modals */}
      <QuickSendModal
        isOpen={showQuickSendModal}
        onClose={() => {
          setShowQuickSendModal(false);
          setSelectedPreset(null);
        }}
        onSuccess={loadData}
        presetData={selectedPreset}
      />

      <TemplateModal
        isOpen={showTemplateModal}
        onClose={() => {
          setShowTemplateModal(false);
          setEditingTemplate(null);
        }}
        onSuccess={loadData}
        template={editingTemplate}
      />

      <CampaignModal
        isOpen={showCampaignModal}
        onClose={() => setShowCampaignModal(false)}
        onSuccess={loadData}
      />
    </AdminLayout>
  );
}

// Helper Components
function StatCard({ icon, value, label, color }) {
  return (
    <div className="admin-card" style={{ padding: '24px' }}>
      <div style={{ fontSize: '36px', marginBottom: '8px' }}>{icon}</div>
      <div style={{ fontSize: '32px', fontWeight: '700', color, marginBottom: '4px' }}>
        {value.toLocaleString()}
      </div>
      <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>{label}</div>
    </div>
  );
}

function MetricBar({ label, value, color }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{label}</span>
        <span style={{ fontSize: '14px', fontWeight: '600' }}>{value}%</span>
      </div>
      <div style={{
        height: '8px',
        background: 'rgba(79, 172, 254, 0.1)',
        borderRadius: '4px',
        overflow: 'hidden'
      }}>
        <div style={{
          width: `${value}%`,
          height: '100%',
          background: color,
          transition: 'width 0.3s ease'
        }} />
      </div>
    </div>
  );
}

function TemplateCard({ template, onEdit, onDelete }) {
  return (
    <div style={{
      padding: '20px',
      background: 'var(--card-bg)',
      border: '1px solid var(--card-border)',
      borderRadius: '12px',
      display: 'flex',
      gap: '20px'
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <h4 style={{ fontSize: '16px', fontWeight: '600', margin: 0 }}>{template.name}</h4>
          {template.is_featured && (
            <span style={{
              padding: '4px 8px',
              background: 'rgba(255, 193, 7, 0.1)',
              color: '#ffc107',
              borderRadius: '4px',
              fontSize: '11px',
              fontWeight: '600'
            }}>
              ⭐ Featured
            </span>
          )}
          <span className={`admin-badge admin-badge-${template.category === 'warning' ? 'warning' : template.category === 'error' ? 'danger' : 'info'}`}>
            {template.type}
          </span>
        </div>
        <div style={{ marginBottom: '12px' }}>
          <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>{template.title}</div>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{template.message}</div>
        </div>
        {template.variables && template.variables.length > 0 && (
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '12px' }}>
            {template.variables.map((v, i) => (
              <span key={i} style={{
                padding: '4px 8px',
                background: 'rgba(79, 172, 254, 0.1)',
                color: '#4facfe',
                borderRadius: '4px',
                fontSize: '12px'
              }}>
                {v}
              </span>
            ))}
          </div>
        )}
        <div style={{ marginTop: '12px', fontSize: '12px', color: 'var(--text-secondary)' }}>
          Used {template.usage_count || 0} times
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <button
          className="admin-button admin-button-secondary"
          style={{ padding: '6px 12px', fontSize: '13px' }}
          onClick={onEdit}
        >
          Edit
        </button>
        <button
          className="admin-button admin-button-danger"
          style={{ padding: '6px 12px', fontSize: '13px' }}
          onClick={onDelete}
        >
          Delete
        </button>
      </div>
    </div>
  );
}