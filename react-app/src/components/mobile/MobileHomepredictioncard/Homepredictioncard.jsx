// react-app/src/components/mobile/MobileHomepredictioncard/Homepredictioncard.jsx
import { useState, useEffect } from "react";
import { matchesAPI } from "../../../api/matches.api";
import "./Homepredictioncard.css";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "../../../context/LanguageContext";
import { translate } from "../../../data/translations";
import PromoPopup from "../../PromoPopup/PromoPopup";

/* ── helpers ──────────────────────────────────────────────── */
function initials(n = "") { return (n || "??").slice(0, 2).toUpperCase(); }

function fmt(str) {
  if (!str) return "TBA";
  const d = new Date(String(str).replace(" ", "T"));
  if (isNaN(d)) return "TBA";
  return d.toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

function TeamLogo({ name, logo, size = 44 }) {
  const [err, setErr] = useState(false);
  return (
    <div className="hpc-logo" style={{ width: size, height: size, fontSize: size * 0.34 }}>
      {logo && !err
        ? <img src={logo} alt={name} onError={() => setErr(true)} />
        : <span>{initials(name)}</span>}
    </div>
  );
}

/* ── single match card ──────────────────────────────────── */
function MatchCard({ match, index, onRequireAuth }) {
  const { lang } = useLanguage();

  const locked  = match.prediction_open === 0 || match.prediction_open === "0";
  const isLive  = match.match_state === "live";
  const isDone  = match.status === "completed";
  const isFeat  = match.is_featured === 1;
  const navigate = useNavigate();

  // win-probability bars derived from odds
  const oddsA = match.options?.[0]?.odds ?? 1.8;
  const oddsB = match.options?.[1]?.odds ?? 2.0;
  const pctA  = Math.round((1 / oddsA / (1/oddsA + 1/oddsB)) * 100);
  const pctB  = 100 - pctA;

  const handleClick = () => {
    if (!localStorage.getItem("token")) {
      onRequireAuth();
      return;
    }
    navigate(`/predictions/${match.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className={`hpc-card${isFeat ? " hpc-featured" : ""}${isLive ? " hpc-live" : ""}`}
      style={{ animationDelay: `${index * 0.08}s`, cursor: "pointer" }}
    >
      {/* ── top row: tourney + status ── */}
      <div className="hpc-top">
        <div className="hpc-tourney">
          <span className="hpc-tourney-dot" />
          {match.tournament || "Cricket"}
        </div>
        {isLive   && <span className="hpc-pill hpc-pill-live">● {translate("pm_status_live", lang)}</span>}
        {!isLive && !isDone && !locked && <span className="hpc-pill hpc-pill-open">● {translate("pm_status_open", lang)}</span>}
        {locked  && !isDone && <span className="hpc-pill hpc-pill-locked">🔒 {translate("pm_status_locked", lang)}</span>}
        {isDone  && <span className="hpc-pill hpc-pill-done">✓ {translate("pm_status_settled", lang)}</span>}
      </div>

      {/* ── teams / score row ── */}
      <div className="hpc-match-row">

        {/* Team A */}
        <div className="hpc-team hpc-team-a">
          <TeamLogo name={match.team_a} logo={match.team_a_logo} size={56} />
          <div className="hpc-team-name">{match.team_a}</div>
        </div>

        {/* Centre: result / live / VS */}
        <div className="hpc-centre">
          {isDone && match.winner ? (
            <div className="hpc-result">
              <div className="hpc-result-label">{translate("pm_winner", lang)}</div>
              <div className="hpc-result-name">{match.winner}</div>
            </div>
          ) : isLive ? (
            <div className="hpc-vs-live">
              <span className="hpc-score">— : —</span>
              <span className="hpc-live-dot-anim" />
            </div>
          ) : (
            <div className="hpc-vs-wrap">
              <div className="hpc-vs-line" />
              <div className="hpc-vs">VS</div>
              <div className="hpc-vs-line" />
            </div>
          )}
          <div className="hpc-date">{fmt(match.starting_at)}</div>
        </div>

        {/* Team B */}
        <div className="hpc-team hpc-team-b">
          <TeamLogo name={match.team_b} logo={match.team_b_logo} size={56} />
          <div className="hpc-team-name">{match.team_b}</div>
        </div>
      </div>

      {/* ── probability bars ── */}
      <div className="hpc-bars">
        <div className="hpc-bar-row">
          <span className="hpc-bar-pct">{pctA}%</span>
          <div className="hpc-bar-track">
            <div className="hpc-bar-fill hpc-bar-a" style={{ width: `${pctA}%` }} />
          </div>
          <div className="hpc-bar-track">
            <div className="hpc-bar-fill hpc-bar-b" style={{ width: `${pctB}%` }} />
          </div>
          <span className="hpc-bar-pct hpc-bar-pct-right">{pctB}%</span>
        </div>
        <div className="hpc-bar-labels">
          <span>{translate("pm_win_prob", lang)}</span>
          <span>
            {match.stake_cost > 0
              ? `⚡ ${match.stake_cost} pts`
              : translate("pm_free", lang)}
          </span>
        </div>
      </div>

      {/* ── CTA strip ── */}
      <div className="hpc-cta">
        {locked || isDone
          ? <span className="hpc-cta-text hpc-cta-ghost">{translate("pm_view_details", lang)}</span>
          : <span className="mba-btn-primary">{translate("pm_predict_now", lang)} →</span>}
      </div>

    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   EXPORTED COMPONENT — fetches its own data
   ════════════════════════════════════════════════════════════ */
export default function HomePredictionCard({ maxCards = 3 }) {
  const { lang } = useLanguage();
  const [matches,   setMatches]  = useState([]);
  const [loading,   setLoading]  = useState(true);
  const [popupKey,  setPopupKey] = useState(0);
  const [showPopup, setShowPopup] = useState(false);

  const openRegisterPopup = () => {
    setPopupKey((k) => k + 1);
    setShowPopup(true);
  }
  useEffect(() => {
    matchesAPI.getMatches()
      .then(d => setMatches(d.matches || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // prioritise featured + upcoming, fallback to all
  const display = [
    ...matches.filter(m => m.is_featured === 1),
    ...matches.filter(m => m.status === "upcoming" && m.is_featured !== 1),
    ...matches.filter(m => m.status !== "upcoming" && m.is_featured !== 1),
  ].slice(0, maxCards);

  return (
    <div className="hpc-section">
      {showPopup && (
        <PromoPopup
          key={popupKey}
          image="/images/register-refer.png"
          title={translate("promo_popup_register_title", lang)}
          description={translate("promo_popup_register_description", lang)}
          buttonText={translate("promo_popup_register_button", lang)}
          buttonLink="/register"
          onClose={() => setShowPopup(false)}
        />
        )}

      {/* Section header */}
      <div className="hpc-header">
        <div className="hpc-header-left">
          <div className="hpc-header-accent" />
          <div>
            <div className="hpc-header-eyebrow">{translate("pm_predictions_arena", lang)}</div>
            <div className="hpc-header-title">{translate("pm_match_predictions", lang)}</div>
          </div>
        </div>
        <Link to="/predictions" className="hpc-view-all">
          {translate("pm_view_all", lang)} <span className="hpc-arrow">→</span>
        </Link>
      </div>

      {/* Cards */}
      {loading ? (
        <div className="hpc-loading">
          <div className="hpc-spinner" />
        </div>
      ) : display.length === 0 ? (
        <div className="hpc-empty">🏟️ {translate("pm_no_matches", lang)}</div>
      ) : (
        <div className="hpc-scroll">
          {display.map((m, i) => (
            <MatchCard key={m.id} match={m} index={i} onRequireAuth={openRegisterPopup} />
          ))}
        </div>
      )}

    </div>
  );
}