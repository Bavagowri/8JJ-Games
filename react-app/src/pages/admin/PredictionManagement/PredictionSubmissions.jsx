// react-app/src/pages/admin/PredictionManagement/PredictionSubmissions.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Users, ArrowLeft, Search, CheckCircle, XCircle, Clock } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import "./PredictionManagement.css";
import "../styles/shared.css";

const API_BASE = import.meta.env.VITE_API_URL;

const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`
});

export default function PredictionSubmissions() {
  const navigate = useNavigate();
  const { id: matchId } = useParams();

  const [matchInfo,    setMatchInfo]    = useState(null);
  const [submissions,  setSubmissions]  = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [search,       setSearch]       = useState("");
  const [filterResult, setFilterResult] = useState("all");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res  = await fetch(`${API_BASE}/api/predictions/match/${matchId}`, {
          headers: getAuthHeaders()
        });
        const data = await res.json();
        setMatchInfo(data.match        || null);
        setSubmissions(data.submissions || []);
      } catch (err) {
        console.error("Failed to load submissions:", err);
      } finally {
        setLoading(false);
      }
    };
    if (matchId) load();
  }, [matchId]);

  const filtered = submissions.filter((s) => {
    const q = search.toLowerCase();
    const matchesSearch = !q ||
      (s.username    || "").toLowerCase().includes(q) ||
      (s.match_title || "").toLowerCase().includes(q) ||
      (s.option_label|| "").toLowerCase().includes(q);
    const resultFilter =
      filterResult === "all"       ? true :
      filterResult === "correct"   ? s.is_correct === 1    :
      filterResult === "incorrect" ? s.is_correct === 0    :
      filterResult === "pending"   ? s.is_correct === null : true;
    return matchesSearch && resultFilter;
  });

  const total           = submissions.length;
  const correct         = submissions.filter((s) => s.is_correct === 1).length;
  const incorrect       = submissions.filter((s) => s.is_correct === 0).length;
  const pending         = submissions.filter((s) => s.is_correct === null).length;
  const totalPtsAwarded = submissions.reduce((acc, s) => acc + (s.points_awarded || 0), 0);
  const totalStaked     = submissions.reduce((acc, s) => acc + (s.stake || 0), 0);

  const getResultBadge = (s) => {
    if (s.is_correct === 1) return { cls: "admin-badge-success", icon: <CheckCircle size={11} strokeWidth={2.5} />, label: "Correct"   };
    if (s.is_correct === 0) return { cls: "admin-badge-danger",  icon: <XCircle     size={11} strokeWidth={2.5} />, label: "Incorrect" };
    return                         { cls: "admin-badge-warning", icon: <Clock        size={11} strokeWidth={2.5} />, label: "Pending"   };
  };

  return (
    <AdminLayout
      title={matchInfo ? `Entries: ${matchInfo.team_a} vs ${matchInfo.team_b}` : "Prediction Entries"}
      breadcrumbs={["Admin", "Predictions", "Entries"]}
    >
      <div className="prediction-mgmt-header">
        <div className="prediction-mgmt-icon" style={{ background: "linear-gradient(135deg, #a78bfa, #7c3aed)" }}>
          <Users size={24} strokeWidth={2.5} color="#fff" />
        </div>
        <div>
          <h1 className="prediction-mgmt-title">
            {matchInfo ? `${matchInfo.team_a} vs ${matchInfo.team_b}` : "All Entries"}
          </h1>
          <p className="prediction-mgmt-subtitle">
            {matchInfo
              ? `${matchInfo.tournament} · ${matchInfo.prediction_type?.replace("_", " ")}`
              : "User predictions across all matches"
            }
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="prediction-stats-row">
        <div className="pred-stat-card">
          <div className="pred-stat-icon blue"><Users size={18} strokeWidth={2} /></div>
          <div><div className="pred-stat-value">{total}</div><div className="pred-stat-label">Total Entries</div></div>
        </div>
        <div className="pred-stat-card">
          <div className="pred-stat-icon green"><CheckCircle size={18} strokeWidth={2} /></div>
          <div><div className="pred-stat-value">{correct}</div><div className="pred-stat-label">Correct</div></div>
        </div>
        <div className="pred-stat-card">
          <div className="pred-stat-icon red"><XCircle size={18} strokeWidth={2} /></div>
          <div><div className="pred-stat-value">{incorrect}</div><div className="pred-stat-label">Incorrect</div></div>
        </div>
        <div className="pred-stat-card">
          <div className="pred-stat-icon amber"><Clock size={18} strokeWidth={2} /></div>
          <div><div className="pred-stat-value">{pending}</div><div className="pred-stat-label">Pending</div></div>
        </div>
        <div className="pred-stat-card">
          <div className="pred-stat-icon blue" style={{ background: "rgba(251,191,36,0.12)", color: "#fbbf24" }}>⚡</div>
          <div><div className="pred-stat-value">{totalStaked}</div><div className="pred-stat-label">Pts Staked</div></div>
        </div>
        <div className="pred-stat-card">
          <div className="pred-stat-icon green">🎯</div>
          <div><div className="pred-stat-value">{totalPtsAwarded}</div><div className="pred-stat-label">Pts Awarded</div></div>
        </div>
      </div>

      <div className="admin-card">
        <div className="prediction-toolbar">
          <div className="prediction-toolbar-left">
            <div className="prediction-search">
              <Search size={14} color="var(--admin-text-secondary)" />
              <input
                placeholder="Search user, option..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              className="prediction-filter-select"
              value={filterResult}
              onChange={(e) => setFilterResult(e.target.value)}
            >
              <option value="all">All Results</option>
              <option value="correct">Correct</option>
              <option value="incorrect">Incorrect</option>
              <option value="pending">Pending</option>
            </select>
          </div>
          <button
            className="admin-button admin-button-secondary"
            onClick={() => navigate("/admin/predictions")}
            style={{ display: "flex", alignItems: "center", gap: 6 }}
          >
            <ArrowLeft size={13} strokeWidth={2.5} /> Back
          </button>
        </div>

        <div className="prediction-table-wrap">
          {loading ? (
            <div style={{ padding: "60px", textAlign: "center", color: "var(--admin-text-secondary)" }}>
              <p>Loading entries...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: "60px", textAlign: "center", color: "var(--admin-text-secondary)" }}>
              <Users size={36} strokeWidth={1.5} style={{ marginBottom: 12, opacity: 0.25 }} />
              <p style={{ margin: 0 }}>No entries found.</p>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>User</th>
                  <th>Pick</th>
                  <th>Odds</th>
                  <th>Staked</th>
                  <th>Potential</th>
                  <th>Submitted</th>
                  <th>Result</th>
                  <th>Awarded</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s, idx) => {
                  const badge     = getResultBadge(s);
                  const potential = s.potential_reward || (s.stake && s.odds ? Math.round(s.stake * s.odds) : 0);
                  return (
                    <tr key={s.id}>
                      <td style={{ color: "var(--admin-text-secondary)", fontSize: 13 }}>{idx + 1}</td>
                      <td>
                        <div className="admin-user-info">
                          <div className="admin-user-avatar">
                            {(s.username || "?").charAt(0).toUpperCase()}
                          </div>
                          <span style={{ fontWeight: 600, fontSize: 14 }}>
                            {s.username || `User #${s.user_id}`}
                          </span>
                        </div>
                      </td>
                      <td>
                        <span style={{ fontWeight: 700, fontSize: 13, color: "var(--admin-primary)" }}>
                          {s.option_label}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontSize: 13, fontWeight: 800, color: "#fbbf24", padding: "2px 8px", background: "rgba(251,191,36,0.1)", borderRadius: 6 }}>
                          {s.odds}×
                        </span>
                      </td>
                      <td style={{ fontSize: 13, color: "var(--admin-text-secondary)" }}>
                        {s.stake > 0
                          ? <span>⚡ {s.stake} pts</span>
                          : <span style={{ color: "#22c55e" }}>Free</span>
                        }
                      </td>
                      <td style={{ fontSize: 13, color: "#fbbf24" }}>
                        {potential > 0 ? `🎯 ${potential} pts` : "—"}
                      </td>
                      <td style={{ fontSize: 12, color: "var(--admin-text-secondary)" }}>
                        {new Date(s.created_at).toLocaleString("en-US", {
                          month: "short", day: "numeric",
                          hour: "2-digit", minute: "2-digit",
                        })}
                      </td>
                      <td>
                        <span className={`admin-badge ${badge.cls}`} style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                          {badge.icon}{badge.label}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontWeight: 700, fontSize: 13, color: s.points_awarded > 0 ? "#22c55e" : "var(--admin-text-secondary)" }}>
                          {s.points_awarded > 0 ? `+${s.points_awarded}` : "—"}
                        </div>
                        {s.is_correct === null && potential > 0 && (
                          <div style={{ fontSize: 11, color: "#fbbf24", opacity: 0.7 }}>up to +{potential}</div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}