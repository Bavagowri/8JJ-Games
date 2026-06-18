// react-app/src/pages/admin/PredictionManagement/PredictionManagement.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Trophy, Plus, Users, CheckCircle, Clock, XCircle, Search, RefreshCw, Lock } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import { adminMatchesAPI } from "../../../api/admin.matches.api";
import toast from "react-hot-toast";
import "./PredictionManagement.css";
import "../styles/shared.css";

const TYPE_LABELS = {
  win_loss:           { label: "Win / Loss",   color: "#4facfe" },
  score_range:        { label: "Score Range",  color: "#a78bfa" },
  player_performance: { label: "Player Perf.", color: "#fb923c" },
};

const STATUS_BADGE = {
  upcoming:  { cls: "admin-badge-info",    label: "Upcoming"  },
  closed:    { cls: "admin-badge-warning", label: "Closed"    },
  completed: { cls: "admin-badge-success", label: "Completed" },
};

function parseDate(str) {
  if (!str) return null;
  const d = new Date(String(str).replace(" ", "T"));
  return isNaN(d.getTime()) ? null : d;
}

// ── Winner Modal ──────────────────────────────────────────
function WinnerModal({ match, onConfirm, onClose, saving }) {
  const [selected, setSelected] = useState(null);

  const options = match.options?.length > 0
    ? match.options
    : [
        { id: "a", label: match.team_a, odds: "" },
        { id: "b", label: match.team_b, odds: "" },
      ];

  return (
    <div className="winner-modal-overlay" onClick={onClose}>
      <div className="winner-modal" onClick={(e) => e.stopPropagation()}>
        <h3>Set Match Winner</h3>
        <p style={{ color: "var(--admin-text-secondary)", fontSize: 14, margin: "8px 0 20px" }}>
          <strong style={{ color: "var(--admin-text)" }}>{match.team_a} vs {match.team_b}</strong>
          <br />Selecting a winner will settle all predictions and award points automatically.
        </p>
        <div className="winner-options">
          {options.map((opt) => (
            <button
              key={opt.id}
              className={`winner-option-btn${selected === opt.label ? " selected" : ""}`}
              onClick={() => setSelected(opt.label)}
            >
              <Trophy size={14} strokeWidth={2} />
              <span>{opt.label}</span>
              {opt.odds && (
                <span style={{ marginLeft: "auto", fontSize: 11, opacity: 0.7 }}>{opt.odds}×</span>
              )}
            </button>
          ))}
        </div>
        <div className="winner-modal-footer">
          <button className="admin-button admin-button-secondary" onClick={onClose}>Cancel</button>
          <button
            className="admin-button admin-button-primary"
            onClick={() => selected && onConfirm(match.id, selected)}
            disabled={!selected || saving}
          >
            {saving ? "Saving..." : "Confirm & Award Points"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────
export default function PredictionManagement() {
  const navigate = useNavigate();
  const [matches, setMatches]           = useState([]);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [winnerModal, setWinnerModal]   = useState(null);
  const [settling, setSettling]         = useState(false);
  const [locking, setLocking]           = useState(null);
  const [unlocking, setUnlocking] = useState(null);

  const loadMatches = async () => {
    try {
      setLoading(true);
      const data = await adminMatchesAPI.getMatches();
      setMatches(data.matches || []);
    } catch (err) {
      toast.error("Failed to load matches");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadMatches(); }, []);

  const handleSetWinner = async (matchId, winner) => {
    setSettling(true);
    try {
      const result = await adminMatchesAPI.setWinner(matchId, winner);
      const settled = result?.settled ?? "";
      const awarded = result?.awarded ?? "";
      toast.success(
        `🏆 Winner: ${winner}${settled ? ` · ${settled} predictions settled` : ""}${awarded ? ` · ${awarded} pts awarded` : ""}`
      );
      setWinnerModal(null);
      await loadMatches();
    } catch (err) {
      toast.error(err.message || "Failed to set winner");
    } finally {
      setSettling(false);
    }
  };

  const handleLock = async (matchId) => {
    setLocking(matchId);
    try {
      await adminMatchesAPI.lockMatch(matchId);
      toast.success("🔒 Predictions locked — users can no longer submit");
      await loadMatches();
    } catch (err) {
      toast.error(err.message || "Failed to lock match");
    } finally {
      setLocking(null);
    }
  };

  const handleUnlock = async (matchId) => {
    setUnlocking(matchId);
    try {
      await adminMatchesAPI.unlockMatch(matchId);
      toast.success("🔓 Predictions reopened");
      await loadMatches();
    } catch (err) {
      toast.error(err.message || "Failed to unlock match");
    } finally {
      setUnlocking(null);
    }
  };

  const handleDelete = async (matchId) => {
    if (!confirm("Are you sure you want to delete this prediction match?")) return;

    try {
      await adminMatchesAPI.deleteMatch(matchId);
      toast.success("Prediction deleted successfully");
      await loadMatches();
    } catch (err) {
      toast.error(err.message || "Failed to delete match");
    }
  };

  const filtered = matches.filter((m) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      m.team_a.toLowerCase().includes(q) ||
      m.team_b.toLowerCase().includes(q) ||
      (m.tournament || "").toLowerCase().includes(q);
    const matchesStatus = filterStatus === "all" || m.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const total       = matches.length;
  const upcoming    = matches.filter((m) => m.status === "upcoming").length;
  const completed   = matches.filter((m) => m.status === "completed").length;
  const needsSettle = matches.filter((m) => m.status !== "completed" && !m.winner).length;
  const openCount   = matches.filter((m) => m.prediction_open === 1).length;

  return (
    <AdminLayout title="Prediction Manager" breadcrumbs={["Admin", "Predictions"]}>

      <div className="prediction-mgmt-header">
        <div className="prediction-mgmt-icon">
          <Trophy size={24} strokeWidth={2.5} color="#fff" />
        </div>
        <div>
          <h1 className="prediction-mgmt-title">Prediction Manager</h1>
          <p className="prediction-mgmt-subtitle">
            Create match events, set prediction odds, and settle results.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="prediction-stats-row">
        <div className="pred-stat-card">
          <div className="pred-stat-icon blue"><Trophy size={18} strokeWidth={2} /></div>
          <div>
            <div className="pred-stat-value">{total}</div>
            <div className="pred-stat-label">Total Matches</div>
          </div>
        </div>
        <div className="pred-stat-card">
          <div className="pred-stat-icon amber"><Clock size={18} strokeWidth={2} /></div>
          <div>
            <div className="pred-stat-value">{upcoming}</div>
            <div className="pred-stat-label">Upcoming</div>
          </div>
        </div>
        <div className="pred-stat-card">
          <div className="pred-stat-icon green"><CheckCircle size={18} strokeWidth={2} /></div>
          <div>
            <div className="pred-stat-value">{completed}</div>
            <div className="pred-stat-label">Completed</div>
          </div>
        </div>
        <div className="pred-stat-card">
          <div className="pred-stat-icon red"><XCircle size={18} strokeWidth={2} /></div>
          <div>
            <div className="pred-stat-value">{needsSettle}</div>
            <div className="pred-stat-label">Needs Settlement</div>
          </div>
        </div>
        <div className="pred-stat-card">
          <div className="pred-stat-icon" style={{ background: "rgba(34,197,94,0.12)", color: "#22c55e" }}>
            <Lock size={18} strokeWidth={2} />
          </div>
          <div>
            <div className="pred-stat-value">{openCount}</div>
            <div className="pred-stat-label">Predictions Open</div>
          </div>
        </div>
      </div>

      <div className="admin-card">
        <div className="prediction-toolbar">
          <div className="prediction-toolbar-left">
            <div className="prediction-search">
              <Search size={14} color="var(--admin-text-secondary)" />
              <input
                placeholder="Search matches, teams, tournaments..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              className="prediction-filter-select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="upcoming">Upcoming</option>
              <option value="closed">Closed</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              className="admin-button admin-button-secondary"
              onClick={loadMatches}
              disabled={loading}
              style={{ display: "flex", alignItems: "center", gap: 6 }}
            >
              <RefreshCw
                size={13}
                strokeWidth={2.5}
                style={{ animation: loading ? "spin 1s linear infinite" : "none" }}
              />
              Refresh
            </button>
            <button
              className="admin-button admin-button-primary"
              onClick={() => navigate("/admin/predictions/create")}
              style={{ display: "flex", alignItems: "center", gap: 6 }}
            >
              <Plus size={13} strokeWidth={2.5} /> Create Match
            </button>
          </div>
        </div>

        <div className="prediction-table-wrap">
          {loading ? (
            <div style={{ padding: "60px", textAlign: "center", color: "var(--admin-text-secondary)" }}>
              <p>Loading matches...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: "60px", textAlign: "center", color: "var(--admin-text-secondary)" }}>
              <Trophy size={36} strokeWidth={1.5} style={{ marginBottom: 12, opacity: 0.25 }} />
              <p style={{ margin: 0 }}>No matches found.</p>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Match</th>
                  <th>Type</th>
                  <th>Tournament</th>
                  <th>Start Time</th>
                  <th>Entry</th>
                  <th>Status</th>
                  <th>Winner</th>
                  <th>Actions</th>
                  <th>Status</th>
                  <th>Featured</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((match, idx) => {
                  const badge         = STATUS_BADGE[match.status] || STATUS_BADGE.upcoming;
                  const typeInfo      = TYPE_LABELS[match.prediction_type] || {
                    label: match.prediction_type || "Win / Loss",
                    color: "#94a3b8",
                  };
                  const startD        = parseDate(match.match_start_time);
                  const isLocked      = Number(match.prediction_open) === 0;
                  const isCompleted   = match.status === "completed";
                  const isBeingLocked = locking === match.id;

                  return (
                    <tr key={match.id}>
                      <td style={{ color: "var(--admin-text-secondary)", fontSize: 13 }}>
                        {idx + 1}
                      </td>

                      <td>
                        <div style={{ fontWeight: 700, color: "var(--admin-text)", fontSize: 14 }}>
                          {match.team_a}{" "}
                          <span style={{ opacity: 0.35 }}>vs</span>{" "}
                          {match.team_b}
                        </div>
                        <div style={{ fontSize: 11, color: "var(--admin-text-secondary)", marginTop: 2 }}>
                          {match.sport_type || "cricket"}
                        </div>
                      </td>

                      <td>
                        <span style={{
                          fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 6,
                          background: `${typeInfo.color}18`, color: typeInfo.color,
                          border: `1px solid ${typeInfo.color}30`,
                        }}>
                          {typeInfo.label}
                        </span>
                      </td>

                      <td style={{ fontSize: 13, color: "var(--admin-text-secondary)" }}>
                        {match.tournament || "—"}
                      </td>

                      <td style={{ fontSize: 13, color: "var(--admin-text-secondary)" }}>
                        {startD
                          ? startD.toLocaleString("en-US", {
                              month: "short", day: "numeric",
                              hour: "2-digit", minute: "2-digit",
                            })
                          : "TBC"}
                      </td>

                      <td>
                        {match.stake_cost > 0
                          ? <span style={{ fontSize: 13, fontWeight: 700, color: "#fbbf24" }}>
                              ⚡ {match.stake_cost} pts
                            </span>
                          : <span style={{ fontSize: 12, fontWeight: 700, color: "#22c55e" }}>Free</span>
                        }
                      </td>

                      {/* Status + Open/Locked pill */}
                      <td>
                        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                          <span className={`admin-badge ${badge.cls}`}>{badge.label}</span>
                          {!isCompleted && (
                            isLocked
                              ? <span style={{
                                  fontSize: 10, fontWeight: 700, color: "#ef4444",
                                  display: "flex", alignItems: "center", gap: 3,
                                }}>
                                  <Lock size={9} strokeWidth={3} /> Locked
                                </span>
                              : <span style={{
                                  fontSize: 10, fontWeight: 700, color: "#22c55e",
                                  display: "flex", alignItems: "center", gap: 3,
                                }}>
                                  ● Open
                                </span>
                          )}
                        </div>
                      </td>

                      <td>
                        {match.winner
                          ? <span style={{ fontWeight: 700, color: "#22c55e", fontSize: 13 }}>
                              🏆 {match.winner}
                            </span>
                          : <span style={{ color: "var(--admin-text-secondary)", fontSize: 12 }}>—</span>
                        }
                      </td>

                      {/* Actions */}
                      <td>
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>

                          <button
                            className="admin-button admin-button-secondary"
                            style={{ padding: "5px 10px", fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}
                            onClick={() => navigate(`/admin/predictions/${match.id}/submissions`)}
                          >
                            <Users size={11} strokeWidth={2.5} /> Entries
                          </button>

                          {/* Lock button — only when predictions still open and match not completed */}
                          {/* {!isLocked && !isCompleted && (
                            <button
                              className="admin-button admin-button-secondary"
                              style={{
                                padding: "5px 10px", fontSize: 12,
                                display: "flex", alignItems: "center", gap: 4,
                                color: "#f59e0b",
                                borderColor: "rgba(245,158,11,0.35)",
                                opacity: isBeingLocked ? 0.6 : 1,
                              }}
                              onClick={() => handleLock(match.id)}
                              disabled={isBeingLocked}
                            >
                              <Lock size={11} strokeWidth={2.5} />
                              {isBeingLocked ? "Locking..." : "Lock"}
                            </button>
                          )} */}

                          {/* Settle button — only when not completed */}
                          {!isCompleted && (
                            <button
                              className="admin-button admin-button-primary"
                              style={{ padding: "5px 10px", fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}
                              onClick={() => setWinnerModal(match)}
                            >
                              <Trophy size={11} strokeWidth={2.5} /> Settle
                            </button>
                          )}

                          <button
                            className="admin-button admin-button-secondary"
                            disabled={match.status === "completed"}
                            style={{
                              padding: "5px 10px",
                              fontSize: 12,
                              display: "flex",
                              alignItems: "center",
                              gap: 4
                            }}
                            onClick={() => navigate(`/admin/predictions/edit/${match.id}`)}
                          >
                            ✏️ Edit
                          </button>

                          <button
                            className="admin-button admin-button-secondary"
                            style={{
                              padding: "5px 10px",
                              fontSize: 12,
                              display: "flex",
                              alignItems: "center",
                              gap: 4,
                              color: "#ef4444",
                              borderColor: "rgba(239,68,68,0.3)"
                            }}
                            onClick={() => handleDelete(match.id)}
                          >
                            🗑 Delete
                          </button>

                        </div>
                      </td>
                      <td>
                         {!isCompleted && (
                            isLocked ? (
                              <button
                                className="admin-button admin-button-secondary"
                                style={{ color: "#22c55e", borderColor: "rgba(34,197,94,0.35)" }}
                                onClick={() => handleUnlock(match.id)}
                                disabled={unlocking === match.id}
                              >
                                {unlocking === match.id ? "Unlocking..." : "🔓 Unlock"}
                              </button>
                            ) : (
                               <button
                              className="admin-button admin-button-secondary"
                              style={{
                                padding: "5px 10px", fontSize: 12,
                                display: "flex", alignItems: "center", gap: 4,
                                color: "#f59e0b",
                                borderColor: "rgba(245,158,11,0.35)",
                                opacity: isBeingLocked ? 0.6 : 1,
                              }}
                              onClick={() => handleLock(match.id)}
                              disabled={isBeingLocked}
                            >
                              <Lock size={11} strokeWidth={2.5} />
                              {isBeingLocked ? "Locking..." : "Lock"}
                            </button>
                            )
                          )}
                      </td>

                      <td>
                        <label className="feature-toggle">
                          <input
                            type="checkbox"
                            checked={Number(match.is_featured) === 1}
                            onChange={async () => {
                              try {
                                await adminMatchesAPI.featureMatch(match.id);

                                // update local state
                                setMatches((prev) =>
                                  prev.map((m) =>
                                    m.id === match.id
                                      ? { ...m, is_featured: m.is_featured ? 0 : 1 }
                                      : { ...m, is_featured: 0 } // only one featured
                                  )
                                );

                                toast.success("Featured match updated");

                              } catch (err) {
                                toast.error("Failed to update featured match");
                              }
                            }}
                          />
                          <span className="slider"></span>
                        </label>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {winnerModal && (
        <WinnerModal
          match={winnerModal}
          onConfirm={handleSetWinner}
          onClose={() => setWinnerModal(null)}
          saving={settling}
        />
      )}
    </AdminLayout>
  );
}