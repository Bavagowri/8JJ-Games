// react-app/src/components/Widgets/WidgetMatchCard.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./WidgetsComponent.css";
import "./WidgetMatchCard.css";

// ─── Single card (unchanged public API) ──────────────────────────────────────
export function WidgetMatchCardSingle({
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
  selectedIndex: selectedIndexProp = null,
  userPickLabel  = null,
  entryLabel     = "10 pts",
  isFreeEntry    = false,
  onDetailsClick,
}) {
  const [selectedIndex, setSelectedIndex] = useState(selectedIndexProp);

  const badgeMap = {
    open: { cls: "live", dot: true,  text: "Live"      },
    live: { cls: "live", dot: true,  text: "Live"      },
    done: { cls: "done", dot: false, text: "Completed" },
  };
  const badge  = badgeMap[status] || badgeMap.live;
  const isDone = status === "done";

  return (
    <div className="widget-match">

      {/* ── Header ────────────────────────────────────── */}
      <div className="wm-header">
        <span className="wm-tournament">🏆 {tournament}</span>
        <span className={`wm-badge ${badge.cls}`}>
          {badge.dot && <span className="wm-badge-dot" />}
          {badge.text}
        </span>
      </div>

      {/* ── Teams ─────────────────────────────────────── */}
      <div className="wm-teams">
        <div className="wm-team">
          <span className="wm-team-name">{teamA}</span>
        </div>
        <div className="wm-vs">VS</div>
        <div className="wm-team right">
          <span className="wm-team-name">{teamB}</span>
        </div>
      </div>

      {/* ── Time row ──────────────────────────────────── */}
      <div className="wm-time-row">
        <span className="wm-match-time">🗓 {matchTimeLabel}</span>
        {!isDone && (
          <span className={`wm-countdown${isUrgent ? " urgent" : ""}`}>
            ⏱ {countdownLabel}
          </span>
        )}
      </div>

      {/* ── Pick area ─────────────────────────────────── */}
      {userPickLabel ? (
        <div className="wm-picked">
          ✅{" "}
          <span style={{ color: "var(--c-text-sub)", fontWeight: 600 }}>
            Picked:
          </span>
          &nbsp;
          <span className="wm-picked-team">{userPickLabel}</span>
        </div>
      ) : isDone ? (
        <div className="wm-closed">⛔ Prediction Closed</div>
      ) : (
        <div className="wm-options">
          {options.map((opt, i) => (
            <div
              key={i}
              className={`wm-pick-btn${selectedIndex === i ? " selected" : ""}`}
              onClick={() => setSelectedIndex(selectedIndex === i ? null : i)}
            >
              <span className="wm-pick-name">{opt.label}</span>
              <span className="wm-pick-odds">{opt.oddsLabel}</span>
            </div>
          ))}
        </div>
      )}

      {/* ── Footer ────────────────────────────────────── */}
      <div className="wm-footer">
        <span className="wm-entry-label">
          Entry:&nbsp;
          <span className={`wm-entry-cost${isFreeEntry ? " free" : ""}`}>
            {isFreeEntry ? "Free" : `⚡ ${entryLabel}`}
          </span>
        </span>
        <button
          className="wm-details-btn"
          onClick={onDetailsClick}
        >
          Details →
        </button>
      </div>

    </div>
  );
}

// ─── Filter tabs config ───────────────────────────────────────────────────────
const TABS = ["All", "Live", "Completed"];

function matchesTab(match, tab) {
  if (tab === "All")       return true;
  if (tab === "Live")      return match.status === "live" || match.status === "open";
  if (tab === "Completed") return match.status === "done";
  return true;
}

// ─── Grid / carousel multi-match view ────────────────────────────────────────
export function WidgetMatchCardGrid({
  matches = [],
  title = "All Predictions",
  pageSize = 6,
  onDetailsClick,
}) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab]   = useState("All");
  const [visible,   setVisible]     = useState(pageSize);

  const filtered  = matches.filter((m) => matchesTab(m, activeTab));
  const displayed = filtered.slice(0, visible);
  const hasMore   = filtered.length > visible;

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setVisible(pageSize);
  };

  // Count helpers for badges
  const counts = {
    All:       matches.length,
    Live:      matches.filter((m) => m.status === "live" || m.status === "open").length,
    Completed: matches.filter((m) => m.status === "done").length,
  };

  return (
    <div className="wmc-grid-root">

      {/* ── Section header ──────────────────────────── */}
      <div className="wmc-grid-header">
        <h3 className="wmc-grid-title">
          {title}
          <span className="wmc-grid-total">({filtered.length})</span>
        </h3>

        {/* Filter tabs */}
        <div className="wmc-tabs" role="tablist">
          {TABS.map((tab) => (
            <button
              key={tab}
              role="tab"
              aria-selected={activeTab === tab}
              className={`wmc-tab${activeTab === tab ? " wmc-tab--active" : ""}`}
              onClick={() => handleTabChange(tab)}
            >
              {tab}
              {counts[tab] > 0 && (
                <span className={`wmc-tab-badge${tab === "Live" ? " live" : ""}`}>
                  {counts[tab]}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Cards ───────────────────────────────────── */}
      {displayed.length === 0 ? (
        <div className="wmc-empty">
          <div className="wmc-empty-icon">🔭</div>
          <p>No {activeTab.toLowerCase()} matches right now.</p>
        </div>
      ) : (
        <>
          {/* Horizontal scroll on mobile, grid on desktop */}
          <div className="wmc-scroll-wrap">
            <div className="wmc-cards-row">
              {displayed.map((match, i) => (
                <div
                  key={match.id ?? i}
                  className="wmc-card-slot"
                  onClick={() => navigate("/predictions")}
                  style={{ animationDelay: `${i * 0.055}s`, cursor: "pointer" }}
                >
                  <WidgetMatchCardSingle
                    {...match}
                    onDetailsClick={() => onDetailsClick?.(match)}
                  />
                </div>
              ))}
            </div>
          </div>

          {hasMore && (
            <div className="wmc-load-more-row">
              <button
                className="wmc-load-more-btn"
                onClick={() => setVisible((v) => v + pageSize)}
              >
                Load More Matches ↓
              </button>
            </div>
          )}
        </>
      )}

    </div>
  );
}

// ─── Default export — backward-compatible ────────────────────────────────────
// Pass `matches` array  → renders the grid
// Pass individual props → renders single card (original behaviour)
export default function WidgetMatchCard(props) {
  if (props.matches && Array.isArray(props.matches)) {
    return (
      <WidgetMatchCardGrid
        matches={props.matches}
        title={props.title}
        pageSize={props.pageSize}
        onDetailsClick={props.onDetailsClick}
      />
    );
  }
  return <WidgetMatchCardSingle {...props} />;
}