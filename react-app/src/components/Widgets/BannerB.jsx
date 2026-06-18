// react-app/src/components/Widgets/BannerB.jsx

import { useState, useEffect, useCallback } from "react";
import "./WidgetsComponent.css";
import "./BannerB.css";
import { useNavigate } from "react-router-dom";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatKickoff(str) {
  if (!str) return "TBA";
  const d = new Date(String(str).replace(" ", "T"));
  if (isNaN(d.getTime())) return "TBA";
  return d.toLocaleString("en-US", {
    weekday: "short",
    month:   "short",
    day:     "numeric",
    hour:    "2-digit",
    minute:  "2-digit",
  });
}

function deriveStatus(match) {
  if (match.match_state === "live")      return "live";
  if (match.match_state === "completed") return "completed";
  return "upcoming";
}

function isLocked(match) {
  return match.prediction_open === 0 || match.prediction_open === "0";
}


function mapMatchToCardProps(match) {
  const isFreeEntry = !match.stake_cost || Number(match.stake_cost) === 0;

  // Build odds chips directly from the options array the API already provides
  const odds = (match.options || []).map((opt) => ({
    id:    opt.id,
    label: opt.label,
    value: opt.odds ? `${Number(opt.odds).toFixed(1)}×` : "—",
    raw:   opt.odds,
  }));

  return {
    id:              match.id,
    tournament:      match.tournament   || "Cricket Match",
    teamA:           match.team_a       || "Team A",
    teamB:           match.team_b       || "Team B",
    teamALogoUrl:    match.team_a_logo  || null,
    teamBLogoUrl:    match.team_b_logo  || null,
    scoreA:          match.score_a      ?? null,
    scoreB:          match.score_b      ?? null,
    kickoffLabel:    formatKickoff(match.starting_at),
    status:          deriveStatus(match),
    odds,
    votePct:         match.vote_pct         != null ? Number(match.vote_pct) : 50,
    predictionCount: match.prediction_count != null
                       ? `${Number(match.prediction_count).toLocaleString()} predictions`
                       : "0 predictions",
    entryLabel:      isFreeEntry ? "Free" : `${match.stake_cost} pts`,
    isFreeEntry,
    userPickLabel:   match.user_pick_label || null,
    locked:          isLocked(match),
  };
}

// ─── Single card ──────────────────────────────────────────────────────────────

function BannerBCard({
  id              = null,
  tournament      = "Cricket Match",
  teamA           = "Team A",
  teamB           = "Team B",
  teamALogoUrl    = null,
  teamBLogoUrl    = null,
  scoreA          = null,
  scoreB          = null,
  kickoffLabel    = "TBA",
  status          = "upcoming",
  odds            = [],
  votePct         = 50,
  predictionCount = "0 predictions",
  entryLabel      = "Free",
  isFreeEntry     = true,
  userPickLabel   = null,
  locked          = false,
}) {
  const [selectedOddsIndex, setSelectedOddsIndex] = useState(null);
  const navigate = useNavigate();

  const statusMap = {
    upcoming:  { cls: "upcoming",  label: "Upcoming"  },
    live:      { cls: "live",      label: "🔴 Live"   },
    completed: { cls: "completed", label: "Full Time" },
  };
  const { cls: statusCls, label: statusText } =
    statusMap[status] || statusMap.upcoming;

  const showScore = scoreA !== null && scoreB !== null;
  const voteRight = 100 - votePct;

  return (
    <div className="banner-b BannerB">

      {/* ── Top strip */}
      <div className="banner-b-top">
        <div className="banner-b-league">
          <span className="banner-b-league-dot" />
          {tournament}
        </div>
        <span className={`banner-b-status-badge ${statusCls}`}>
          {statusText}
        </span>
      </div>

      {/* ── VS Block */}
      <div className="banner-b-matchup">

        {/* Team A */}
        <div className="banner-b-team">
          <div className="banner-b-team-badge">
            {teamALogoUrl
              ? <img src={teamALogoUrl} alt={teamA} />
              : teamA.slice(0, 2).toUpperCase()}
          </div>
          <span className="banner-b-team-name">{teamA}</span>
        </div>

        {/* Center */}
        <div className="banner-b-center">
          {showScore ? (
            <div className="banner-b-score-block">
              <span className="banner-b-score-num">{scoreA}</span>
              <span className="banner-b-score-sep">:</span>
              <span className="banner-b-score-num">{scoreB}</span>
            </div>
          ) : (
            <span className="banner-b-vs-text">VS</span>
          )}
          <span className="banner-b-kickoff">{kickoffLabel}</span>
        </div>

        {/* Team B */}
        <div className="banner-b-team">
          <div className="banner-b-team-badge">
            {teamBLogoUrl
              ? <img src={teamBLogoUrl} alt={teamB} />
              : teamB.slice(0, 2).toUpperCase()}
          </div>
          <span className="banner-b-team-name">{teamB}</span>
        </div>

      </div>

      {/* ── Odds / picked / locked */}
      {userPickLabel ? (
        <div className="banner-b-predicted">
          ✅ You picked:{" "}
          <span className="banner-b-predicted-team">{userPickLabel}</span>
        </div>
      ) : locked ? (
        <div
          className="banner-b-predicted"
          style={{
            borderColor: "rgba(251,191,36,0.18)",
            background:  "rgba(251,191,36,0.05)",
            color:       "#fbbf24",
          }}
        >
          🔒 Predictions Closed
        </div>
      ) : odds.length > 0 ? (
        <div className="banner-b-odds-section">
          <p className="banner-b-odds-title">Your Pick</p>
          <div className="banner-b-odds-row">
            {odds.map((opt, i) => (
              <div
                key={opt.id ?? i}
                className={`banner-b-odds-chip${selectedOddsIndex === i ? " selected" : ""}`}
                onClick={() =>
                  setSelectedOddsIndex(selectedOddsIndex === i ? null : i)
                }
              >
                <span className="banner-b-odds-label">{opt.label}</span>
                <span className="banner-b-odds-value">{opt.value}</span>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* ── Community vote bar */}
      <div className="banner-b-vote">
        <div className="banner-b-vote-labels">
          <span>{teamA} {votePct}%</span>
          <span>Community Votes</span>
          <span>{voteRight}% {teamB}</span>
        </div>
        <div className="banner-b-vote-track">
          <div className="banner-b-vote-fill" style={{ width: `${votePct}%` }} />
        </div>
      </div>

      {/* ── CTA */}
      <div className="banner-b-cta">
        <button
          className="banner-a-btn-primary"
          onClick={() => navigate(id ? `/predictions/${id}` : "/predictions")}
        >
          {userPickLabel ? "View Details →" : "🏏 Predict Now"}
        </button>
        {!userPickLabel && (
          <button
            onClick={() => navigate("/predictions/leaderboard")}
            className="banner-b-btn-outline"
          >
            🏆 Leaderboard
          </button>
        )}
      </div>

      {/* ── Entry info */}
      <div className="banner-b-entry-row">
        <span className={`banner-b-entry-chip ${isFreeEntry ? "free" : "paid"}`}>
          {isFreeEntry ? "✓ Free Entry" : `⚡ ${entryLabel}`}
        </span>
        <span>· {predictionCount}</span>
      </div>

    </div>
  );
}

// ─── Carousel wrapper ─────────────────────────────────────────────────────────

function BannerBCarousel({ matches, autoPlayMs = 6000 }) {
  const total = matches.length;
  const [current, setCurrent] = useState(0);
  const [paused,  setPaused]  = useState(false);

  const goTo = useCallback(
    (idx) => setCurrent(((idx % total) + total) % total),
    [total]
  );

  useEffect(() => {
    if (total <= 1 || paused) return;
    const t = setInterval(() => setCurrent((c) => (c + 1) % total), autoPlayMs);
    return () => clearInterval(t);
  }, [total, paused, autoPlayMs]);

  const handleNav = (dir) => {
    setPaused(true);
    goTo(current + dir);
  };

  return (
    <div
      className="bnb-carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Header */}
      <div className="bnb-header">
        <div className="bnb-header-title">
          <span className="bnb-header-icon">🏏</span>
          Predictions Fixtures
          <span className="bnb-header-count">{total}</span>
        </div>
        <div className="bnb-nav">
          <button className="bnb-nav-btn" onClick={() => handleNav(-1)} aria-label="Previous">
            ‹
          </button>
          <span className="bnb-nav-counter">
            <strong>{current + 1}</strong> / {total}
          </span>
          <button className="bnb-nav-btn" onClick={() => handleNav(1)} aria-label="Next">
            ›
          </button>
        </div>
      </div>

      {/* Track */}
      <div className="bnb-track-wrap">
        <div
          className="bnb-track"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {matches.map((cardProps, i) => (
            <div key={cardProps.id ?? i} className="bnb-slide">
              <BannerBCard {...cardProps} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Public export ────────────────────────────────────────────────────────────

export default function BannerB(props) {
  if (props.matches && Array.isArray(props.matches)) {
    const cardPropsList = props.matches.map((m) =>
      "team_a" in m ? mapMatchToCardProps(m) : m
    );

    if (cardPropsList.length === 0) return null;
    if (cardPropsList.length === 1) return <BannerBCard {...cardPropsList[0]} />;

    return (
      <BannerBCarousel
        matches={cardPropsList}
        autoPlayMs={props.autoPlayMs}
      />
    );
  }

  if ("team_a" in props) return <BannerBCard {...mapMatchToCardProps(props)} />;

  return <BannerBCard {...props} />;
}