// react-app/src/components/Widgets/Mobile/BannerB.jsx

import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./MobileWidgets.css";

const API_URL = import.meta.env.VITE_API_URL || "";

// ─── Helpers (mirrors desktop BannerB) ───────────────────────────────────────

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

  const odds = (match.options || []).map((opt) => ({
    id:    opt.id,
    label: opt.label,
    value: opt.odds ? `${Number(opt.odds).toFixed(1)}×` : "—",
    raw:   opt.odds,
  }));

  return {
    id:              match.id,
    tournament:      match.tournament          || "Cricket Match",
    teamA:           match.team_a              || "Team A",
    teamB:           match.team_b              || "Team B",
    teamAEmoji:      match.team_a_emoji        || "⚽",
    teamBEmoji:      match.team_b_emoji        || "🔵",
    teamALogoUrl:    match.team_a_logo         || null,
    teamBLogoUrl:    match.team_b_logo         || null,
    scoreA:          match.score_a             ?? null,
    scoreB:          match.score_b             ?? null,
    kickoffLabel:    formatKickoff(match.starting_at),
    status:          deriveStatus(match),
    odds,
    votePct:         match.vote_pct != null    ? Number(match.vote_pct) : 50,
    predictionCount: match.prediction_count != null
                       ? `${Number(match.prediction_count).toLocaleString()} predictions`
                       : "0 predictions",
    entryLabel:      isFreeEntry ? "Free"      : `${match.stake_cost} pts`,
    isFreeEntry,
    userPickLabel:   match.user_pick_label     || null,
    locked:          isLocked(match),
  };
}

// ─── Single card ──────────────────────────────────────────────────────────────

function BannerBCard({
  id              = null,
  tournament      = "Cricket Match",
  teamA           = "Team A",
  teamB           = "Team B",
  teamAEmoji      = "⚽",
  teamBEmoji      = "🔵",
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
  const navigate = useNavigate();
  const [selectedOddsIndex, setSelectedOddsIndex] = useState(null);

  const statusMap = {
    upcoming:  { cls: "upcoming",  text: "Upcoming"   },
    live:      { cls: "live",      text: "🔴 Live"    },
    completed: { cls: "completed", text: "Full Time"  },
  };
  const { cls: statusCls, text: statusText } = statusMap[status] || statusMap.upcoming;

  const showScore = scoreA !== null && scoreB !== null;
  const voteRight = 100 - votePct;

  return (
    <div className="mmbCover">
      <div className="mbb MobileBannerB">

        {/* ── Top strip ─────────────────────────────────── */}
        <div className="mbb-top">
          <div className="mbb-league">
            <span className="mbb-league-dot" />
            {tournament}
          </div>
          <span className={`mbb-status ${statusCls}`}>{statusText}</span>
        </div>

        {/* ── VS / Score block ──────────────────────────── */}
        <div className="mbb-matchup">
          <div className="mbb-team">
            <div className="mbb-badge">
              {teamALogoUrl
                ? <img src={teamALogoUrl} alt={teamA} />
                : teamAEmoji}
            </div>
            <span className="mbb-team-name">{teamA}</span>
          </div>

          <div className="mbb-center">
            {showScore ? (
              <div className="mbb-score">
                <span className="mbb-score-num">{scoreA}</span>
                <span className="mbb-score-sep">:</span>
                <span className="mbb-score-num">{scoreB}</span>
              </div>
            ) : (
              <span className="mbb-vs">VS</span>
            )}
            <span className="mbb-kickoff">{kickoffLabel}</span>
          </div>

          <div className="mbb-team">
            <div className="mbb-badge">
              {teamBLogoUrl
                ? <img src={teamBLogoUrl} alt={teamB} />
                : teamBEmoji}
            </div>
            <span className="mbb-team-name">{teamB}</span>
          </div>
        </div>

        {/* ── Odds / picked / locked ───────────────────── */}
        {userPickLabel ? (
          <div className="mbb-picked">
            ✅ You picked:&nbsp;
            <span className="mbb-picked-team">{userPickLabel}</span>
          </div>
        ) : locked ? (
          <div
            className="mbb-picked"
            style={{
              borderColor: "rgba(251,191,36,0.18)",
              background:  "rgba(251,191,36,0.05)",
              color:       "#fbbf24",
            }}
          >
            🔒 Predictions Closed
          </div>
        ) : odds.length > 0 ? (
          <div className="mbb-odds-wrap">
            <p className="mbb-odds-title">Your Pick</p>
            <div className="mbb-odds-scroll">
              {odds.map((opt, i) => (
                <div
                  key={opt.id ?? i}
                  className={`mbb-odds-chip${selectedOddsIndex === i ? " selected" : ""}`}
                  onClick={() => setSelectedOddsIndex(selectedOddsIndex === i ? null : i)}
                >
                  <span className="mbb-odds-label">{opt.label}</span>
                  <span className="mbb-odds-value">{opt.value}</span>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* ── Community vote bar ────────────────────────── */}
        <div className="mbb-vote">
          <div className="mbb-vote-labels">
            <span>{teamA} {votePct}%</span>
            <span>Community</span>
            <span>{voteRight}% {teamB}</span>
          </div>
          <div className="mbb-vote-track">
            <div className="mbb-vote-fill" style={{ width: `${votePct}%` }} />
          </div>
        </div>

        {/* ── CTA ──────────────────────────────────────── */}
        <div className="mbb-cta">
          <button
            className="mba-btn-primary"
            onClick={() => navigate(id ? `/predictions/${id}` : "/predictions")}
          >
            {userPickLabel ? "View Details →" : "🏆 View Prediction"}
          </button>
          {!userPickLabel && (
            <button
              onClick={() => navigate("/predictions")}
              className="mbb-btn-outline"
            >
              All
            </button>
          )}
        </div>

        {/* ── Entry info ───────────────────────────────── */}
        <div className="mbb-entry">
          <span className={`mbb-entry-chip ${isFreeEntry ? "free" : "paid"}`}>
            {isFreeEntry ? "✓ Free Entry" : `⚡ ${entryLabel}`}
          </span>
          <span>· {predictionCount}</span>
        </div>

      </div>
    </div>
  );
}

// ─── Carousel wrapper ─────────────────────────────────────────────────────────

function BannerBCarousel({ cards, autoPlayMs = 6000 }) {
  const total = cards.length;
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

  return (
    <div
      style={{ position: "relative", overflow: "hidden" }}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "12px 14px 4px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 800, color: "var(--mw-primary)" }}>
          <span>🏏</span> Prediction Fixtures
          <span style={{
            background: "rgba(79,172,254,0.1)", border: "1px solid rgba(79,172,254,0.22)",
            borderRadius: 50, padding: "1px 7px", fontSize: 10,
          }}>{total}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, color: "var(--mw-text-muted)" }}>
          <button
            onClick={() => { setPaused(true); goTo(current - 1); }}
            style={{ background: "none", border: "none", color: "var(--mw-text-sub)", fontSize: 18, cursor: "pointer", padding: "0 2px" }}
            aria-label="Previous"
          >‹</button>
          <span><strong style={{ color: "var(--mw-text)" }}>{current + 1}</strong> / {total}</span>
          <button
            onClick={() => { setPaused(true); goTo(current + 1); }}
            style={{ background: "none", border: "none", color: "var(--mw-text-sub)", fontSize: 18, cursor: "pointer", padding: "0 2px" }}
            aria-label="Next"
          >›</button>
        </div>
      </div>

      {/* Track */}
      <div
        style={{
          display: "flex",
          transition: "transform 0.4s cubic-bezier(0.22,1,0.36,1)",
          transform: `translateX(-${current * 100}%)`,
        }}
      >
        {cards.map((props, i) => (
          <div key={props.id ?? i} style={{ minWidth: "100%", flexShrink: 0 }}>
            <BannerBCard {...props} />
          </div>
        ))}
      </div>

      {/* Dot indicators */}
      <div style={{ display: "flex", justifyContent: "center", gap: 5, paddingBottom: 6 }}>
        {cards.map((_, i) => (
          <span
            key={i}
            onClick={() => { setPaused(true); goTo(i); }}
            style={{
              width:        i === current ? 16 : 6,
              height:       6,
              borderRadius: 3,
              background:   i === current ? "var(--mw-primary)" : "rgba(255,255,255,0.2)",
              transition:   "all 0.3s ease",
              cursor:       "pointer",
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function BannerBSkeleton() {
  return (
    <div className="mmbCover">
      <div className="mbb MobileBannerB" style={{ opacity: 0.4 }}>
        <div className="mbb-top">
          <div style={{ width: 90, height: 10, background: "rgba(255,255,255,0.06)", borderRadius: 4 }} />
          <div style={{ width: 50, height: 18, background: "rgba(255,255,255,0.04)", borderRadius: 50 }} />
        </div>
        <div className="mbb-matchup" style={{ justifyContent: "center", gap: 24 }}>
          <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
          <div style={{ width: 32, height: 20, background: "rgba(255,255,255,0.04)", borderRadius: 4 }} />
          <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
        </div>
      </div>
    </div>
  );
}

// ─── Public export ────────────────────────────────────────────────────────────

export default function BannerB({ autoPlayMs = 6000 }) {
  const [cards,   setCards]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/matches`)
      .then((r) => r.json())
      .then((data) => {
        const matches = data.matches || data.data || [];
        setCards(matches.map((m) =>
          "team_a" in m ? mapMatchToCardProps(m) : m
        ));
      })
      .catch(() => setCards([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <BannerBSkeleton />;
  if (cards.length === 0) return null;
  if (cards.length === 1) return <BannerBCard {...cards[0]} />;

  return <BannerBCarousel cards={cards} autoPlayMs={autoPlayMs} />;
}