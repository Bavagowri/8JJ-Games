// react-app/src/pages/admin/AdminPoints/AdminPoints.jsx
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, RefreshCw, AlertTriangle, Zap, X } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import LoadingSpinner from "../components/LoadingSpinner";
import { adminAPI } from "../../../api/admin.api";
import "./AdminPoints.css";

export default function AdminPoints() {
  const [activeTab, setActiveTab] = useState("rules");
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formOpen, setFormOpen] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  const [formData, setFormData] = useState({
    activity_type: "",
    points: "",
    min_points: "",
    max_points: "",
    daily_limit: "",
    cooldown_minutes: "",
  });

  useEffect(() => {
    loadRules();
  }, []);

  // ── All original logic preserved exactly ─────────────────────────────────

  const loadRules = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getAllPointRules();
      setRules(data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const cleanedData = {
        activity_type: formData.activity_type,
        points: formData.points ? Number(formData.points) : null,
        min_points: formData.min_points ? Number(formData.min_points) : null,
        max_points: formData.max_points ? Number(formData.max_points) : null,
        daily_limit: formData.daily_limit ? Number(formData.daily_limit) : null,
        cooldown_minutes: formData.cooldown_minutes ? Number(formData.cooldown_minutes) : null,
      };

      if (editingRule) {
        await adminAPI.updatePointRule(editingRule.id, cleanedData);
      } else {
        await adminAPI.createPointRule(cleanedData);
      }

      setFormOpen(false);
      setEditingRule(null);
      setFormData({
        activity_type: "",
        points: "",
        min_points: "",
        max_points: "",
        daily_limit: "",
        cooldown_minutes: "",
      });

      loadRules();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this rule?")) return;
    await adminAPI.deletePointRule(id);
    loadRules();
  };

  const handleEdit = (rule) => {
    setEditingRule(rule);
    setFormData(rule);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditingRule(null);
    setFormData({
      activity_type: "",
      points: "",
      min_points: "",
      max_points: "",
      daily_limit: "",
      cooldown_minutes: "",
    });
  };

  // ── Render ────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <AdminLayout title="Points Management" breadcrumbs={["Admin", "Points"]}>
        <LoadingSpinner message="Loading rules..." />
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Points Management" breadcrumbs={["Admin", "Points"]}>
        <div className="admin-card error-card">
          <AlertTriangle size={32} />
          <p>{error}</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Points Management" breadcrumbs={["Admin", "Points"]}>
      <div className="admin-card">

        {/* Page Header */}
        <div className="points-page-header">
          <div className="points-page-icon">
            <Zap size={22} strokeWidth={2} color="#00d9ff" />
          </div>
          <div className="points-page-text">
            <h2>Point Rules</h2>
            <p>Define point rewards, limits, and cooldowns per activity type</p>
          </div>
        </div>

        {/* Card Header */}
        <div className="admin-card-header">
          <div /> {/* spacer */}
          <div style={{ display: "flex", gap: 10 }}>
            <button className="admin-button admin-button-secondary" onClick={loadRules}>
              <RefreshCw size={15} strokeWidth={2.5} /> Refresh
            </button>
            <button className="admin-button admin-button-primary" onClick={() => setFormOpen(true)}>
              <Plus size={15} strokeWidth={2.5} /> New Rule
            </button>
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: "auto" }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Activity</th>
                <th>Points</th>
                <th>Daily Limit</th>
                <th>Cooldown</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rules.map((rule) => (
                <tr key={rule.id}>
                  <td>
                    <span style={{ fontWeight: 600, color: "rgba(255,255,255,0.9)", fontFamily: "monospace", fontSize: 13 }}>
                      {rule.activity_type}
                    </span>
                  </td>
                  <td>
                    <span style={{ color: "#00d9ff", fontWeight: 700 }}>
                      {rule.points || `${rule.min_points ?? 0} – ${rule.max_points ?? 0}`}
                    </span>
                  </td>
                  <td>{rule.daily_limit ?? "—"}</td>
                  <td>
                    {rule.cooldown_minutes
                      ? <span style={{ color: "#ffa500" }}>{rule.cooldown_minutes} min</span>
                      : "—"
                    }
                  </td>
                  <td>
                    <span className={`admin-badge ${rule.is_active ? "admin-badge-success" : "admin-badge-danger"}`}>
                      {rule.is_active ? "Active" : "Disabled"}
                    </span>
                  </td>
                  <td>
                    <div className="admin-actions">
                      <button className="icon-btn" title="Edit" onClick={() => handleEdit(rule)}>
                        <Pencil size={15} strokeWidth={2} />
                      </button>
                      <button className="icon-btn danger" title="Delete" onClick={() => handleDelete(rule.id)}>
                        <Trash2 size={15} strokeWidth={2} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {rules.length === 0 && (
                <tr>
                  <td colSpan="6" className="admin-empty">No rules found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Modal ── */}
      {formOpen && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && closeForm()}>
          <div className="modal">

            {/* Modal Header */}
            <div className="modal-header">
              <div className="modal-title">
                <div className="modal-title-icon">
                  <Zap size={18} strokeWidth={2} color="#00d9ff" />
                </div>
                <h3>{editingRule ? "Edit Rule" : "Create Rule"}</h3>
              </div>
              <button className="modal-close-btn" onClick={closeForm}>×</button>
            </div>
            <div className="modal-divider" />

            {/* Modal Body */}
            <div className="modal-body">
              <div className="modal-field">
                <label>Activity Type</label>
                <input
                  className="admin-input"
                  placeholder="e.g. daily_login, bet_placed"
                  value={formData.activity_type}
                  disabled={!!editingRule}
                  onChange={(e) => setFormData({ ...formData, activity_type: e.target.value })}
                />
              </div>

              <div className="modal-field">
                <label>Fixed Points</label>
                <input
                  className="admin-input"
                  type="number"
                  placeholder="Leave blank to use min/max range"
                  value={formData.points || ""}
                  onChange={(e) => setFormData({ ...formData, points: e.target.value })}
                />
              </div>

              <div className="modal-field-row">
                <div className="modal-field">
                  <label>Min Points</label>
                  <input
                    className="admin-input"
                    type="number"
                    placeholder="0"
                    value={formData.min_points || ""}
                    onChange={(e) => setFormData({ ...formData, min_points: e.target.value })}
                  />
                </div>
                <div className="modal-field">
                  <label>Max Points</label>
                  <input
                    className="admin-input"
                    type="number"
                    placeholder="0"
                    value={formData.max_points || ""}
                    onChange={(e) => setFormData({ ...formData, max_points: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-field-row">
                <div className="modal-field">
                  <label>Daily Limit</label>
                  <input
                    className="admin-input"
                    type="number"
                    placeholder="Unlimited"
                    value={formData.daily_limit || ""}
                    onChange={(e) => setFormData({ ...formData, daily_limit: e.target.value })}
                  />
                </div>
                <div className="modal-field">
                  <label>Cooldown (min)</label>
                  <input
                    className="admin-input"
                    type="number"
                    placeholder="None"
                    value={formData.cooldown_minutes || ""}
                    onChange={(e) => setFormData({ ...formData, cooldown_minutes: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="modal-footer">
              <button className="admin-button admin-button-secondary" onClick={closeForm}>
                Cancel
              </button>
              <button className="admin-button admin-button-primary" onClick={handleSubmit}>
                {editingRule ? "Save Changes" : "Create Rule"}
              </button>
            </div>

          </div>
        </div>
      )}
    </AdminLayout>
  );
}