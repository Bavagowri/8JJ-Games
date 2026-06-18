// react-app/src/components/Widgets/WidgetLeaderboard.jsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { leaderboardAPI } from "../../api/predictionLeaderboard.api";
import "./WidgetsComponent.css";

const API_URL = import.meta.env.VITE_API_URL || "";

// Mirrors the Avatar component in PredictionLeaderboard
function Avatar({ src, fallback }) {
  const [err, setErr] = useState(false);
  if (!err && src) {
    return (
      <img
        src={`${API_URL}${src}`}
        alt={fallback}
        onError={() => setErr(true)}
        style={{
          width: "100%", height: "100%",
          objectFit: "cover", borderRadius: "50%", display: "block",
        }}
      />
    );
  }
  return <span>{(fallback || "?")[0].toUpperCase()}</span>;
}

const RANK_EMOJI = { 1: "👑", 2: "🥈", 3: "🥉" };
const RANK_CLASS = { 1: "gold", 2: "silver", 3: "bronze" };

export default function WidgetLeaderboard({
  showBonus   = true,
  limit       = 5,
}) {
  const navigate     = useNavigate();
  const { user }     = useAuth();
  const MY_USERNAME  = user?.username || "";

  const [leaderboard, setLeaderboard] = useState([]);
  const [tab,         setTab]         = useState("weekly");
  const [loading,     setLoading]     = useState(true);

  useEffect(() => {
    leaderboardAPI
      .getLeaderboard()
      .then((data) => setLeaderboard(data.leaderboard || []))
      .catch((err) => console.error("WidgetLeaderboard fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  // Sort + rank identically to PredictionLeaderboard
  const sorted = [...leaderboard]
    .sort((a, b) =>
      tab === "weekly"
        ? b.weekly_points - a.weekly_points
        : b.total_points  - a.total_points
    )
    .map((row, i) => ({ ...row, rank: i + 1 }));

  const visible = sorted.slice(0, limit);
  const myRow   = sorted.find((r) => r.username === MY_USERNAME);
  const pts     = (row) =>
    tab === "weekly"
      ? (row.weekly_points || 0)
      : (row.total_points  || 0);

  const myRankLabel = myRow
    ? `#${myRow.rank} of ${sorted.length.toLocaleString()}`
    : "—";

  return (
    <div className="widget-lb CommomTheme-Section">

      {/* ── Header ────────────────────────────────────── */}
      <div className="wlb-header">
        <div className="wlb-title-group">
          <div className="wlb-icon">🏆</div>
          <span className="wlb-title">Leaderboard</span>
        </div>

        <div className="wlb-tabs">
          <button
            className={`wlb-tab${tab === "weekly"  ? " active" : ""}`}
            onClick={() => setTab("weekly")}
          >
            Week
          </button>
          <button
            className={`wlb-tab${tab === "alltime" ? " active" : ""}`}
            onClick={() => setTab("alltime")}
          >
            All Time
          </button>
        </div>
      </div>

      {/* ── Rows ──────────────────────────────────────── */}
      <div className="wlb-list">
        {loading ? (
          // Skeleton rows while fetching
          Array.from({ length: limit }).map((_, i) => (
            <div key={i} className="wlb-row" style={{ opacity: 0.4 }}>
              <div className="wlb-rank">—</div>
              <div className="wlb-user">
                <div className="wlb-avatar" style={{ display: "flex" }}>?</div>
                <div>
                  <div className="wlb-name" style={{ width: 80, background: "rgba(255,255,255,0.06)", borderRadius: 4, height: 12 }} />
                  <div className="wlb-sub"  style={{ width: 50, background: "rgba(255,255,255,0.04)", borderRadius: 4, height: 10, marginTop: 4 }} />
                </div>
              </div>
              <div className="wlb-pts">—</div>
            </div>
          ))
        ) : visible.length === 0 ? (
          <div style={{ padding: "16px", textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: 12 }}>
            No data yet
          </div>
        ) : (
          visible.map((row) => {
            const isPodium = row.rank <= 3;
            const isMe     = row.username === MY_USERNAME;

            return (
              <div
                key={row.rank}
                className={`wlb-row${isPodium ? " podium" : ""}${isMe ? " is-me" : ""}`}
              >
                {/* Rank */}
                <div className={`wlb-rank ${RANK_CLASS[row.rank] || ""}`}>
                  {RANK_EMOJI[row.rank] || `#${row.rank}`}
                </div>

                {/* User */}
                <div className="wlb-user">
                  <div className="wlb-avatar" style={{ display: "flex" }}>
                    <Avatar src={row.avatar} fallback={row.username} />
                  </div>
                  <div>
                    <div className="wlb-name">
                      {row.username}
                      {isMe && <span className="wlb-me-tag">you</span>}
                    </div>
                    <div className="wlb-sub">
                      {row.predictions || 0} picks ·{" "}
                      {Number(row.win_rate || 0).toFixed(0)}% correct
                    </div>
                  </div>
                </div>

                {/* Points */}
                <div className="wlb-pts">
                  {pts(row).toLocaleString()}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ── Footer ────────────────────────────────────── */}
      <div className="wlb-footer">
        <span className="wlb-my-rank">
          Your rank: <strong>{loading ? "…" : myRankLabel}</strong>
        </span>
        <button
          className="wlb-view-all"
          onClick={() => navigate("/predictions/leaderboard")}
        >
          Full Board →
        </button>
      </div>

    </div>
  );
}