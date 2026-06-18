// react-app/src/components/predictions/PredictionCard.jsx
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import PredictionCountdown from "./PredictionCountdown";
import toast from "react-hot-toast";
import "./Predictions.css";
import { predictionAPI } from "../../api/prediction.api";
import { useLanguage } from "../../context/LanguageContext";
import { translate } from "../../data/translations";

// ── Helpers ───────────────────────────────────────────────────────────────────

function parseDate(str) {
  if (!str) return null;
  const d = new Date(String(str).replace(" ", "T"));
  return isNaN(d.getTime()) ? null : d;
}

function formatDate(str) {
  const d = parseDate(str);
  if (!d) return "TBC";
  return d.toLocaleString("en-US", {
    month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function resolveStatus(match) {
  if (match.winner) return "completed";
  if (match.prediction_open === 1) return "open";
  return "closed";
}

function TeamAvatar({ name, logo }) {
  const [err, setErr] = useState(false);
  const initials = (name || "??").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  if (logo && !err) {
    return (
      <img
        src={logo}
        alt={name}
        className="pc-avatar-img"
        onError={() => setErr(true)}
      />
    );
  }
  return <div className="pc-avatar-fallback">{initials}</div>;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function PredictionCard({ match, onPredict, onRequireAuth }) {
  const navigate = useNavigate();
  const { lang } = useLanguage();

  const status = resolveStatus(match);
  const stakeCost = match.stake_cost || 0;
  const isFree = stakeCost === 0 || match.zero_cost_enabled;
  const matchTime = match.starting_at || match.match_start_time;
  const closeTime = match.prediction_close_time || match.starting_at;
  const hasOptions = (match.options || []).length > 0;

  const accentClass = {
  open:      "pc-accent-live",   // keep same styling
  completed: "pc-accent-done",
  closed:    "pc-accent-closed",
}[status];

  const handleCardClick = () => {
    if (!localStorage.getItem("token")) { onRequireAuth?.(); return; }
    navigate(`/predictions/${match.id}`);
  };

  const handlePredict = async (e, option) => {
    e.stopPropagation();
    if (!localStorage.getItem("token")) { onRequireAuth?.(); return; }
    try {
      const result = await predictionAPI.submitPrediction(match.id, option.id);
      toast.success(`Prediction submitted! Potential ${result.potential_reward} pts`);
      if (onPredict) onPredict(match.id, option.id);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const winnerOption = match.winner
    ? match.options?.find(o => o.label === match.winner)
    : null;
  const userOption = match.user_prediction
    ? match.options?.find(o => o.label === match.user_prediction)
    : null;

  return (
    <article
      className={`pc-card ${accentClass}`}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => { if (e.key === "Enter" || e.key === " ") handleCardClick(); }}
      aria-label={`${match.team_a} vs ${match.team_b} — ${status}`}
    >
      {/* Live animated top bar — shown when predictions are open */}
      {status === "open" && <div className="pc-live-bar" aria-hidden="true" />}

      {/* ── Header ── */}
      <div className="pc-header">
        <div className="pc-header-left">
          {match.tournament && <span className="pc-tournament">{match.tournament}</span>}
          {match.prediction_type && (
            <span className="pc-type-chip">
              {{ win_loss: "W/L", score_range: "Score", player_performance: "Player" }[match.prediction_type] || match.prediction_type}
            </span>
          )}
        </div>
        <div className="pc-header-right">
          {isFree
            ? <span className="pc-entry-free">FREE</span>
            : <span className="pc-entry-cost">⚡ {stakeCost} pts</span>
          }
          <span className={`pc-status-badge pc-status-${status}`}>
            {status === "open" && <span className="pc-pulse-dot" aria-hidden="true" />}
            
            {status === "open" && "Open"}
            {status === "closed" && "Closed"}
            {status === "completed" && "Completed"}
          </span>
        </div>
      </div>

      {/* ── Battle Zone ── */}
      <div className="pc-battle-zone">

        {/* Team A */}
        <div className="pc-team pc-team-a">
          <div className={`pc-avatar-wrap${status === "completed" && match.winner === match.team_a ? " pc-avatar-winner" : ""}`}>
            <TeamAvatar name={match.team_a} logo={match.team_a_logo} />
          </div>
          <span className="pc-team-name">{match.team_a}</span>
          <div className="pc-team-meta-row">
            {hasOptions && match.options[0] && (
              <span className="pc-odds-chip">{match.options[0].odds}×</span>
            )}
            {status === "completed" && match.winner === match.team_a && (
              <span className="pc-winner-label">🏆 Winner</span>
            )}
          </div>
        </div>

        {/* VS orb */}
        <div className="pc-vs-orb" aria-hidden="true">VS</div>

        {/* Team B */}
        <div className="pc-team pc-team-b">
          <div className={`pc-avatar-wrap${status === "completed" && match.winner === match.team_b ? " pc-avatar-winner" : ""}`}>
            <TeamAvatar name={match.team_b} logo={match.team_b_logo} />
          </div>
          <span className="pc-team-name">{match.team_b}</span>
          <div className="pc-team-meta-row">
            {hasOptions && match.options[1] && (
              <span className="pc-odds-chip">{match.options[1].odds}×</span>
            )}
            {status === "completed" && match.winner === match.team_b && (
              <span className="pc-winner-label">🏆 Winner</span>
            )}
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="pc-footer">
        <div className="pc-meta-row">
          <span className="pc-match-time">🗓 {formatDate(matchTime)}</span>
          {status === "open" && (
            <PredictionCountdown closeTime={closeTime} />
          )}
        </div>

        {/* Action area */}
        <div className="pc-action-area" onClick={e => e.stopPropagation()}>

          {/* COMPLETED */}
          {status === "completed" && match.winner && (
            <div className="pc-result-band">
              <span className="pc-result-winner">{match.winner} won</span>
              {match.user_prediction && (
                <span className={`pc-user-result ${match.user_prediction === match.winner ? "won" : "lost"}`}>
                  {match.user_prediction === match.winner
                    ? `✓ +${Math.round(stakeCost * (userOption?.odds || 1))} pts`
                    : `✗ −${stakeCost} pts`}
                </span>
              )}
            </div>
          )}

          {/* ALREADY PREDICTED (non-complete) */}
          {status !== "completed" && match.user_prediction && (
            <div className="pc-predicted-band">
              <span>✅</span>
              <span>{translate("pc_you_picked", lang)}</span>
              <span className="pc-predicted-team">{match.user_prediction}</span>
            </div>
          )}

          {/* CLOSED or OPEN with no pick yet */}
          {(status === "closed" || (status === "open" && !match.user_prediction)) && (
            <div className={`pc-closed-band ${status === "open" ? "pc-closed-band-open" : ""}`}>
              {status === "open"
                ? <><span className="pc-open-dot" aria-hidden="true" /><span>Open — Tap to predict</span></>
                : <><span className="pc-lock-icon" aria-hidden="true">🔒</span><span>Predictions Closed</span></>
              }
            </div>
          )}

        </div>
      </div>
       {/* Live animated top bar — shown when predictions are open */}
      {status === "open" && <div className="pc-live-bar PC_LIVE_BOTTOM" aria-hidden="true" />}
    </article>
  );
}