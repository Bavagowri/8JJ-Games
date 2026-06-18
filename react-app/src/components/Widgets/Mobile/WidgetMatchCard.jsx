// react-app/src/components/Widgets/Mobile/WidgetMatchCard.jsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./MobileWidgets.css";

const API_URL = import.meta.env.VITE_API_URL || "";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatMatchTime(str) {
  if (!str) return "TBA";
  const d = new Date(String(str).replace(" ", "T"));
  if (isNaN(d.getTime())) return "TBA";
  return d.toLocaleString("en-US", {
    month:  "short",
    day:    "numeric",
    hour:   "2-digit",
    minute: "2-digit",
  });
}

function deriveCountdown(startingAt) {
  if (!startingAt) return "";
  const diff = new Date(String(startingAt).replace(" ", "T")) - Date.now();
  if (diff <= 0) return "";
  const h = Math.floor(diff / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function deriveStatus(match) {
  if (match.match_state === "live")      return "live";
  if (match.match_state === "completed") return "done";
  return "open";
}

function mapMatch(match) {
  const isFreeEntry = !match.stake_cost || Number(match.stake_cost) === 0;
  const countdown   = deriveCountdown(match.starting_at);
  const isUrgent    = !!countdown && !countdown.includes("h") && parseInt(countdown) <= 30;

  const options = (match.options || []).map((opt) => ({
    label:     opt.label,
    oddsLabel: opt.odds ? `${Number(opt.odds).toFixed(1)}×` : "—",
  }));

  return {
    id:              match.id,
    tournament:      match.tournament        || "Cricket Match",
    teamA:           match.team_a            || "Team A",
    teamB:           match.team_b            || "Team B",
    matchTimeLabel:  formatMatchTime(match.starting_at),
    countdownLabel:  countdown,
    isUrgent,
    status:          deriveStatus(match),
    options,
    userPickLabel:   match.user_pick_label   || null,
    entryLabel:      isFreeEntry ? "Free"    : `${match.stake_cost} pts`,
    isFreeEntry,
  };
}

// ─── Filter tabs ──────────────────────────────────────────────────────────────

const TABS = ["All", "Live", "Completed"];

function matchesTab(match, tab) {
  if (tab === "All")       return true;
  if (tab === "Live")      return match.status === "live" || match.status === "open";
  if (tab === "Completed") return match.status === "done";
  return true;
}

// ─── Single card ──────────────────────────────────────────────────────────────

function WidgetMatchCardSingle({
  id             = null,
  tournament     = "IPL 2025",
  teamA          = "MI",
  teamB          = "CSK",
  matchTimeLabel = "Mar 8 · 7:30 PM",
  countdownLabel = "1h 45m",
  isUrgent       = false,
  status         = "open",
  options        = [
    { label: "MI",  oddsLabel: "1.9×" },
    { label: "CSK", oddsLabel: "2.0×" },
  ],
  userPickLabel  = null,
  entryLabel     = "10 pts",
  isFreeEntry    = false,
  onDetailsClick,
}) {
  const navigate = useNavigate();
  const [selectedIndex, setSelectedIndex] = useState(null);

  const badgeMap = {
    open: { cls: "open", dot: true,  text: "Open"      },
    live: { cls: "live", dot: true,  text: "Live"      },
    done: { cls: "done", dot: false, text: "Completed" },
  };
  const badge  = badgeMap[status] || badgeMap.open;
  const isDone = status === "done";

  return (
    <div className="mwm MobileWidgetMatchCard">

      {/* ── Header ────────────────────────────────────── */}
      <div className="mwm-header">
        <span className="mwm-tournament">🏆 {tournament}</span>
        <span className={`mwm-badge ${badge.cls}`}>
          {badge.dot && <span className="mwm-badge-dot" />}
          {badge.text}
        </span>
      </div>

      {/* ── Teams ─────────────────────────────────────── */}
      <div className="mwm-teams">
        <div className="mwm-team">
          <span className="mwm-team-name">{teamA}</span>
        </div>
        <div className="mwm-vs">VS</div>
        <div className="mwm-team right">
          <span className="mwm-team-name">{teamB}</span>
        </div>
      </div>

      {/* ── Time row ──────────────────────────────────── */}
      <div className="mwm-time-row">
        <span className="mwm-match-time">🗓 {matchTimeLabel}</span>
        {!isDone && countdownLabel && (
          <span className={`mwm-countdown${isUrgent ? " urgent" : ""}`}>
            ⏱ {countdownLabel}
          </span>
        )}
      </div>

      {/* ── Pick area ─────────────────────────────────── */}
      {userPickLabel ? (
        <div className="mwm-picked">
          ✅&nbsp;
          <span style={{ color: "var(--mw-text-sub)", fontWeight: 600 }}>Picked:</span>
          &nbsp;<span className="mwm-picked-team">{userPickLabel}</span>
        </div>
      ) : isDone ? (
        <div className="mwm-closed">⛔ Prediction Closed</div>
      ) : (
        <div className="mwm-options">
          {options.map((opt, i) => (
            <div
              key={i}
              className={`mwm-pick${selectedIndex === i ? " selected" : ""}`}
              onClick={() => setSelectedIndex(selectedIndex === i ? null : i)}
            >
              <span className="mwm-pick-name">{opt.label}</span>
              <span className="mwm-pick-odds">{opt.oddsLabel}</span>
            </div>
          ))}
        </div>
      )}

      {/* ── Footer ────────────────────────────────────── */}
      <div className="mwm-footer">
        <span className="mwm-entry">
          Entry:&nbsp;
          <span className={`mwm-entry-cost${isFreeEntry ? " free" : ""}`}>
            {isFreeEntry ? "Free" : `⚡ ${entryLabel}`}
          </span>
        </span>
        <button
          className="mwm-details"
          onClick={() => onDetailsClick ? onDetailsClick() : navigate(id ? `/predictions/${id}` : "/predictions")}
        >
          Details →
        </button>
      </div>

    </div>
  );
}

// ─── Grid / list view (mirrors WidgetMatchCardGrid) ───────────────────────────

function WidgetMatchCardGrid({ matches = [], title = "All Predictions", pageSize = 4 }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("All");
  const [visible,   setVisible]   = useState(pageSize);

  const filtered  = matches.filter((m) => matchesTab(m, activeTab));
  const displayed = filtered.slice(0, visible);
  const hasMore   = filtered.length > visible;

  const counts = {
    All:       matches.length,
    Live:      matches.filter((m) => m.status === "live" || m.status === "open").length,
    Completed: matches.filter((m) => m.status === "done").length,
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setVisible(pageSize);
  };

  return (
    <div style={{ padding: "0 10px" }}>
      {/* Section header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: 10,
      }}>
        <span style={{ fontSize: 13, fontWeight: 800, color: "var(--mw-text)" }}>
          {title}
          <span style={{ fontSize: 11, color: "var(--mw-text-muted)", marginLeft: 5 }}>
            ({filtered.length})
          </span>
        </span>
        <button
          onClick={() => navigate("/predictions")}
          style={{
            background: "none", border: "none", color: "var(--mw-primary)",
            fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "Barlow, sans-serif",
          }}
        >
          View All →
        </button>
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            style={{
              padding:      "5px 12px",
              borderRadius: 50,
              border:       "1px solid",
              borderColor:  activeTab === tab ? "var(--mw-primary)" : "rgba(255,255,255,0.1)",
              background:   activeTab === tab ? "rgba(79,172,254,0.12)" : "transparent",
              color:        activeTab === tab ? "var(--mw-primary)" : "var(--mw-text-muted)",
              fontSize:     11,
              fontWeight:   700,
              cursor:       "pointer",
              display:      "flex",
              alignItems:   "center",
              gap:          4,
              fontFamily:   "Barlow, sans-serif",
            }}
          >
            {tab}
            {counts[tab] > 0 && (
              <span style={{
                background:   tab === "Live" ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.07)",
                color:        tab === "Live" ? "#ef4444" : "var(--mw-text-muted)",
                borderRadius: 50,
                padding:      "0 5px",
                fontSize:     10,
              }}>
                {counts[tab]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Cards */}
      {displayed.length === 0 ? (
        <div style={{ textAlign: "center", padding: "30px 0", color: "var(--mw-text-muted)", fontSize: 13 }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>🔭</div>
          <p>No {activeTab.toLowerCase()} matches right now.</p>
        </div>
      ) : (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {displayed.map((match, i) => (
              <WidgetMatchCardSingle
                key={match.id ?? i}
                {...match}
              />
            ))}
          </div>

          {hasMore && (
            <div style={{ textAlign: "center", marginTop: 12 }}>
              <button
                onClick={() => setVisible((v) => v + pageSize)}
                style={{
                  background:   "rgba(79,172,254,0.08)",
                  border:       "1px solid rgba(79,172,254,0.2)",
                  color:        "var(--mw-primary)",
                  borderRadius: 50,
                  padding:      "9px 20px",
                  fontSize:     12,
                  fontWeight:   700,
                  cursor:       "pointer",
                  fontFamily:   "Barlow, sans-serif",
                }}
              >
                Load More ↓
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function WidgetMatchCardSkeleton() {
  return (
    <div style={{ padding: "0 10px", display: "flex", flexDirection: "column", gap: 10 }}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="mwm MobileWidgetMatchCard"
          style={{ opacity: 0.35, animationDelay: `${i * 0.08}s` }}
        >
          <div className="mwm-header">
            <div style={{ width: 80, height: 10, background: "rgba(255,255,255,0.06)", borderRadius: 4 }} />
            <div style={{ width: 44, height: 18, background: "rgba(255,255,255,0.04)", borderRadius: 50 }} />
          </div>
          <div className="mwm-teams" style={{ padding: "8px 14px" }}>
            <div style={{ width: 40, height: 16, background: "rgba(255,255,255,0.05)", borderRadius: 4 }} />
            <div style={{ width: 24, height: 20, background: "rgba(255,255,255,0.04)", borderRadius: 4 }} />
            <div style={{ width: 40, height: 16, background: "rgba(255,255,255,0.05)", borderRadius: 4 }} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Public export ────────────────────────────────────────────────────────────

export default function WidgetMatchCard({
  title    = "All Predictions",
  pageSize = 4,
}) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/predictions/matches?limit=20`)
      .then((r) => r.json())
      .then((data) => {
        const raw = data.matches || data.data || [];
        setMatches(raw.map(mapMatch));
      })
      .catch(() => setMatches([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <WidgetMatchCardSkeleton />;

  return (
    <WidgetMatchCardGrid
      matches={matches}
      title={title}
      pageSize={pageSize}
    />
  );
}