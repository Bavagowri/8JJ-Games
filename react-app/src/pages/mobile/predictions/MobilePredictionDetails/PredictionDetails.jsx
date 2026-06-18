// react-app/src/pages/mobile/predictions/MobilePredictionDetails/PredictionDetails.jsx
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { matchesAPI }    from "../../../../api/matches.api";
import { predictionAPI } from "../../../../api/prediction.api";
import MobileBottomNav   from "../../../../components/mobile/MobileBottomNav/MobileBottomNav";
import toast from "react-hot-toast";
import { TeamLogo, fmt, fmtLong } from "../MobilePredictionShared";
import "./PredictionDetails.css";

import { useLanguage } from "../../../../context/LanguageContext";
import { translate }   from "../../../../data/translations";



// ── SEO ──────────────────────────────────────────────────────────────────────
import SEO from "../../../../components/SEO/SEO";
import { generateKeywords } from "../../../../config/seoKeywords";



// ── Lifecycle steps ───────────────────────────────────────
const STEP_KEYS = ["mpd_step_open", "mpd_step_locked", "mpd_step_settled"];


function getStep(matchState, predOpen) {
  if (matchState === "completed") return 3;
  if (matchState === "live") return 2;
  if (predOpen === 0) return 1;
  return 0;
}

function Lifecycle({ matchState, predOpen }) {
  const { lang } = useLanguage();

  const cur = getStep(matchState, predOpen);

  return (
    <div className="mpd-lifecycle" role="list">
      {STEP_KEYS.map((key, i) => (
        <div key={key} className={`mpd-step-wrap ${i < cur ? "done" : ""}`}>
          <div
            className={`mpd-step${i === cur ? " active" : ""}${i < cur ? " done" : ""}`}
          >
            <div className="mpd-step-dot" />
            <div className="mpd-step-label">{translate(key, lang)}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
// ── Countdown ─────────────────────────────────────────────
function Countdown({ closeTime }) {
  const { lang } = useLanguage();
  const [left, setLeft] = useState("");
  useEffect(() => {
    const tick = () => {
      const diff = new Date(closeTime) - Date.now();
      if (diff <= 0) { setLeft(translate("mpd_countdown_closed", lang)); return; }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setLeft(h > 0 ? `${h}h ${m}m` : `${m}m ${s}s`);
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [closeTime, lang]);
  return <span className="mpd-countdown" aria-live="polite" aria-label={`Time remaining: ${left}`}>⏱ {left}</span>;
}

// ── Option card ───────────────────────────────────────────
function OptionCard({ opt, selected, isWinner, canSelect, isDone, alreadyPicked, onSelect, stakeCost }) {
  const { lang }   = useLanguage();
  const isSelected = selected === opt.label || alreadyPicked === opt.label;
  const reward     = stakeCost > 0 ? Math.round(stakeCost * opt.odds) : null;

  return (
    <div
      role="radio"
      aria-checked={isSelected}
      aria-disabled={!canSelect}
      tabIndex={canSelect ? 0 : -1}
      onKeyDown={(e) => {
        if (canSelect && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onSelect(opt.label);
        }
      }}
      className={`mpd-option${isSelected ? " selected" : ""}${isWinner ? " winner" : ""}${!canSelect ? " disabled" : ""}`}
      onClick={() => canSelect && onSelect(opt.label)}
      aria-label={`${opt.label}${reward ? ` — potential reward: ${reward} points` : ""}${isWinner ? " — winner" : ""}`}
    >
      <div className="mpd-option-bar" aria-hidden="true" />
      <div className="mpd-option-body">
        <div className="mpd-option-label">
          {isWinner && <span className="mpd-trophy" aria-hidden="true">🏆 </span>}
          {opt.label}
          {isSelected && alreadyPicked && (
            <span className="mpd-your-pick"> · {translate("mpd_your_pick", lang)}</span>
          )}
        </div>
        {reward && (
          <div className="mpd-option-reward">
            {translate("mpd_win_reward", lang, { pts: reward })}
          </div>
        )}
      </div>
      <div className="mpd-option-right">
        <div className="mpd-odds" aria-label={`Odds: ${opt.odds}x`}>{opt.odds}×</div>
        <div className={`mpd-check${isSelected ? " on" : ""}`} aria-hidden="true">
          {isSelected && (
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
              <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// MAIN
// ════════════════════════════════════════════════════════════
export default function MobilePredictionDetails() {
  const { id }      = useParams();
  const navigate    = useNavigate();
  const { lang }    = useLanguage();
  const [match,       setMatch]       = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(null);
  const [selected,    setSelected]    = useState(null);
  const [submitting,  setSubmitting]  = useState(false);

  useEffect(() => {
    matchesAPI.getMatchDetails(id)
      .then(d => setMatch(d.match))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  // ── JSON-LD Schema ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!match) return;

    const matchTitle  = match.title || `${match.team_a} vs ${match.team_b}`;
    const isCompleted = match.status === "completed";

    const sportsEventSchema = {
      "@context": "https://schema.org",
      "@type":    "SportsEvent",
      "name":     matchTitle,
      "description": `Predict the winner of ${matchTitle} in ${match.tournament || "Cricket"}. Make your free prediction on 8JJ Games and earn points.`,
      "url":       `https://8jjgames.com/predictions/${match.id}`,
      "startDate": match.starting_at || match.match_start_time,
      "sport":     "Cricket",
      "organizer": { "@type": "Organization", "name": match.tournament || "Cricket Tournament" },
      "competitor": [
        { "@type": "SportsTeam", "name": match.team_a, ...(match.team_a_logo && { "image": match.team_a_logo }) },
        { "@type": "SportsTeam", "name": match.team_b, ...(match.team_b_logo && { "image": match.team_b_logo }) },
      ],
      ...(isCompleted && match.winner && {
        "winner": { "@type": "SportsTeam", "name": match.winner },
      }),
    };

    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type":    "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home",             "item": "https://8jjgames.com" },
        { "@type": "ListItem", "position": 2, "name": "Prediction Arena", "item": "https://8jjgames.com/predictions" },
        { "@type": "ListItem", "position": 3, "name": matchTitle,         "item": `https://8jjgames.com/predictions/${match.id}` },
      ],
    };

    const predictionGameSchema = {
      "@context":    "https://schema.org",
      "@type":       "Game",
      "name":        `Predict: ${matchTitle}`,
      "description": `Who will win ${matchTitle}? Make your free prediction on 8JJ Games and earn points.`,
      "url":         `https://8jjgames.com/predictions/${match.id}`,
      "gamePlatform": "Web Browser",
      "genre":        "Sports Prediction",
      "publisher":    { "@type": "Organization", "name": "8JJ Games", "url": "https://8jjgames.com" },
    };

    const existing = document.getElementById("mpd-schema");
    if (existing) document.head.removeChild(existing);

    const s = document.createElement("script");
    s.type = "application/ld+json";
    s.id   = "mpd-schema";
    s.text = JSON.stringify([sportsEventSchema, breadcrumbSchema, predictionGameSchema]);
    document.head.appendChild(s);

    return () => {
      const el = document.getElementById("mpd-schema");
      if (el) document.head.removeChild(el);
    };
  }, [match]);

  // ── Derived values ──────────────────────────────────────────────────────
  const matchTitle = match ? (match.title || `${match.team_a} vs ${match.team_b}`) : "Match Prediction";

  // ── Loading state ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <>
        <SEO
          title="Loading Match Prediction | 8JJ Games"
          description="Loading cricket match prediction details on 8JJ Games."
          keywords={generateKeywords("pages", "predictions")}
          url={`/predictions/${id}`}
          type="website"
        />
        <div className="mpd-page">
          <div className="mpd-loading" role="status" aria-live="polite">
            <div className="mpd-loading-spinner" aria-hidden="true" />
            <p>{translate("mpd_loading", lang)}</p>
          </div>
        </div>
      </>
    );
  }

  // ── Error state ──────────────────────────────────────────────────────────
  if (error || !match) {
    return (
      <>
        <SEO
          title="Match Not Found | 8JJ Games Predictions"
          description="The cricket match prediction you are looking for could not be found. Browse other open matches on 8JJ Games."
          keywords={generateKeywords("pages", "predictions")}
          url={`/predictions/${id}`}
          type="website"
        />
        <div className="mpd-page">
          <div className="mpd-loading" role="alert">
            <div style={{ fontSize: 42, marginBottom: 12 }} aria-hidden="true">🏏</div>
            <p>{translate("mpd_not_found", lang)}</p>
            <Link to="/predictions" className="mpd-back-link">
              ← {translate("plb_back_predictions", lang)}
            </Link>
          </div>
        </div>
      </>
    );
  }

  const isLive = match.match_state === "live";
  const isCompleted = match.match_state === "completed";

  // ✅ OPEN = prediction open + not completed
  const isOpen =
    match.prediction_open === 1 &&
    match.match_state !== "completed";
  const alreadyPicked = match.user_prediction || null;
  const stakeCost     = match.stake_cost || 0;
  const isFree        = stakeCost === 0 || match.zero_cost_enabled;

  const selectedOpt     = match.options?.find(o => o.label === selected);
  const potentialReward = selectedOpt && stakeCost > 0 ? Math.round(stakeCost * selectedOpt.odds) : null;

  const handleSubmit = async () => {
    if (!selected) { toast.error(translate("mpd_toast_pick_first", lang)); return; }
    const opt = match.options?.find(o => o.label === selected);
    if (!opt) { toast.error(translate("mpd_toast_invalid", lang)); return; }
    setSubmitting(true);
    try {
      await predictionAPI.submitPrediction(match.id, opt.id);
      setMatch(prev => ({ ...prev, user_prediction: selected }));
      toast.success(`✅ ${translate("mpd_toast_locked", lang)}${potentialReward ? ` +${potentialReward} pts` : ""}`);
    } catch (e) {
      toast.error(e.message || translate("mpd_toast_failed", lang));
    } finally {
      setSubmitting(false);
    }
  };

  const typeLabel =
    match.prediction_type === "win_loss"             ? translate("pc_type_win_loss", lang)
    : match.prediction_type === "score_range"        ? translate("pc_type_score_range", lang)
    : match.prediction_type === "player_performance" ? translate("pc_type_player_perf", lang)
    : match.prediction_type || translate("pc_type_win_loss", lang);

  return (
    <>
      {/* ── SEO Meta Tags ── */}
      <SEO
        title={`Predict: ${matchTitle} | ${match.tournament || "Cricket"} | 8JJ Games`}
        description={`${isCompleted
          ? `Match result: ${match.winner || "TBC"}. `
          : isOpen ? "Predictions open! " : "Predictions locked. "
        }Predict ${matchTitle} in ${match.tournament || "Cricket"} on 8JJ Games. ${
          isFree ? "Free entry." : `${stakeCost} pts entry.`
        }`}
        keywords={generateKeywords("pages", "predictions")}
        url={`/predictions/${id}`}
        type="website"
      />

      <div className="mpd-page">

        {/* ── Hero banner ── */}
        <article
          className="mpd-hero"
          itemScope
          itemType="https://schema.org/SportsEvent"
          aria-label={`Match: ${matchTitle}`}
        >
          <meta itemProp="name"    content={matchTitle} />
          <meta itemProp="url"     content={`https://8jjgames.com/predictions/${match.id}`} />
          <meta itemProp="sport"   content="Cricket" />
          {match.starting_at && <meta itemProp="startDate" content={match.starting_at} />}

          <div className="mpd-hero-bg" aria-hidden="true" />
          <div className="mpd-hero-content">

            {/* Back + tournament */}
            <div className="mpd-hero-toprow">
              <button
                className="mpd-back-btn"
                onClick={() => navigate("/predictions")}
                aria-label="Back to Prediction Arena"
              >
                ←
              </button>
              <span className="mpd-hero-tourney">{match.tournament || translate("pc_cricket", lang)}</span>
              <div className="mpd-hero-status-wrap" role="status" aria-live="polite">
                {isLive      && <span className="mpd-badge-live">● {translate("pc_status_live", lang)}</span>}
                {isOpen      && <span className="mpd-badge-open">● {translate("pm_status_open", lang)}</span>}
                {isCompleted && <span className="mpd-badge-done">✓ {translate("pc_status_completed", lang)}</span>}
                {!isOpen && !isLive && !isCompleted && (
                  <span className="mpd-badge-locked">🔒 {translate("pc_status_closed", lang)}</span>
                )}
              </div>
            </div>

            {/* Teams */}
            <div className="mpd-hero-teams">
              <div
                className="mpd-hero-team"
                itemProp="competitor"
                itemScope
                itemType="https://schema.org/SportsTeam"
              >
                <div className="mpd-hero-logo-wrap">
                  <TeamLogo name={match.team_a} logo={match.team_a_logo} size={72} />
                </div>
                <div className="mpd-hero-team-name" itemProp="name">{match.team_a}</div>
              </div>

              <div className="mpd-hero-centre">
                {isCompleted && match.winner ? (
                  <div
                    className="mpd-score-box"
                    itemProp="winner"
                    itemScope
                    itemType="https://schema.org/SportsTeam"
                  >
                    <div className="mpd-score-label">{translate("pc_winner", lang)}</div>
                    <div className="mpd-score-winner" itemProp="name">{match.winner}</div>
                  </div>
                ) : isLive ? (
                  <div className="mpd-score-box">
                    <div className="mpd-score-live" role="status">{translate("pc_status_live", lang)}</div>
                  </div>
                ) : (
                  <div className="mpd-vs-block" aria-hidden="true">
                    <div className="mpd-vs-line" />
                    <div className="mpd-vs-text">VS</div>
                    <div className="mpd-vs-line" />
                  </div>
                )}
              </div>

              <div
                className="mpd-hero-team mpd-hero-team-right"
                itemProp="competitor"
                itemScope
                itemType="https://schema.org/SportsTeam"
              >
                <div className="mpd-hero-logo-wrap">
                  <TeamLogo name={match.team_b} logo={match.team_b_logo} size={72} />
                </div>
                <div className="mpd-hero-team-name" itemProp="name">{match.team_b}</div>
              </div>
            </div>

            {/* Time + countdown */}
            <div className="mpd-hero-meta">
              <time
                className="mpd-hero-time"
                dateTime={match.starting_at}
                itemProp="startDate"
              >
                🗓 {fmtLong(match.starting_at)}
              </time>
              {match.prediction_close_time && isOpen && (
                <Countdown closeTime={match.prediction_close_time} />
              )}
            </div>
          </div>
        </article>

        {/* ── Lifecycle strip ── */}
        <Lifecycle status={match.status} predOpen={match.prediction_open} />

        {/* ── Body ── */}
        <main className="mpd-body">

          {/* Stake info row */}
          <div className="mpd-info-strip" aria-label="Match prediction details">
            <div className="mpd-info-item">
              <div className="mpd-info-label">{translate("pc_entry_cost", lang)}</div>
              <div className={`mpd-info-val${isFree ? " free" : ""}`}>
                {isFree ? translate("pc_free", lang) : `${stakeCost} pts`}
              </div>
            </div>
            <div className="mpd-info-sep" aria-hidden="true" />
            <div className="mpd-info-item">
              <div className="mpd-info-label">{translate("mpd_info_type", lang)}</div>
              <div className="mpd-info-val mpd-info-type">{typeLabel}</div>
            </div>
            {potentialReward && (
              <>
                <div className="mpd-info-sep" aria-hidden="true" />
                <div className="mpd-info-item">
                  <div className="mpd-info-label">{translate("mpd_if_correct", lang)}</div>
                  <div className="mpd-info-val mpd-info-reward">🎯 {potentialReward} pts</div>
                </div>
              </>
            )}
          </div>

          {/* Result banner */}
          {isCompleted && alreadyPicked && (
            <div
              className={`mpd-result-banner${alreadyPicked === match.winner ? " won" : " lost"}`}
              role="status"
              aria-live="polite"
            >
              {alreadyPicked === match.winner
                ? <><span className="mpd-result-icon" aria-hidden="true">🎉</span> {translate("mpd_result_won", lang)} <strong>+{match.points_awarded || stakeCost} pts</strong></>
                : <><span className="mpd-result-icon" aria-hidden="true">😔</span> {translate("mpd_result_lost", lang)} <strong>{match.winner}</strong></>
              }
            </div>
          )}

          {/* Closed notice */}
          {!isOpen && !isCompleted && !alreadyPicked && (
            <div className="mpd-closed-notice" role="status">
              🔒 {translate("pc_prediction_closed", lang)}
            </div>
          )}

          {/* ── Options ── */}
          <section aria-labelledby="mpd-options-heading">
            <h2 id="mpd-options-heading" className="mpd-section-title">
              {alreadyPicked
                ? translate("pc_you_picked", lang)
                : translate("mpd_make_your_pick", lang)}
            </h2>

            <div
              className="mpd-options"
              role="radiogroup"
              aria-labelledby="mpd-options-heading"
            >
              {(match.options || []).map(opt => (
                <OptionCard
                  key={opt.id}
                  opt={opt}
                  selected={selected}
                  isWinner={isCompleted && match.winner === opt.label}
                  canSelect={isOpen && !alreadyPicked}
                  isDone={isCompleted}
                  alreadyPicked={alreadyPicked}
                  onSelect={setSelected}
                  stakeCost={stakeCost}
                />
              ))}
            </div>
          </section>

          {/* Submit / locked / predicted */}
          {isOpen && !alreadyPicked && (
            <div className="mpd-submit-wrap">
              {selected && (
                <div className="mpd-selected-preview" role="status" aria-live="polite">
                  {translate("mpd_predicting", lang)}: <strong>{selected}</strong>
                  {potentialReward && <span> · {translate("mpd_win_reward", lang, { pts: potentialReward })}</span>}
                </div>
              )}
              <button
                className={`mpd-submit-btn${!selected ? " disabled" : ""}`}
                onClick={handleSubmit}
                disabled={!selected || submitting}
                aria-busy={submitting}
                aria-label={selected
                  ? `Submit prediction for ${selected}`
                  : "Select a team to submit your prediction"}
              >
                {submitting
                  ? translate("mpd_submitting", lang)
                  : stakeCost > 0
                    ? `${translate("mpd_confirm", lang)} — ${stakeCost} pts`
                    : translate("mpd_confirm_free", lang)}
              </button>
            </div>
          )}

          {alreadyPicked && !isCompleted && (
            <div className="mpd-locked-in" role="status">
              ✅ {translate("mpd_locked_in", lang)} — <strong>{alreadyPicked}</strong>
            </div>
          )}

          {/* ── SEO: Hidden content for crawlers ── */}
          <div className="sr-only">
            <h2>Match Details</h2>
            <p>
              {matchTitle} — {match.tournament || "Cricket"}.
              Teams: {match.team_a} and {match.team_b}.
              {match.starting_at && ` Match starts: ${new Date(match.starting_at).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}.`}
              {isFree ? " Free entry prediction." : ` Entry costs ${stakeCost} points.`}
              {isCompleted && match.winner ? ` Result: ${match.winner} won.` : ""}
            </p>
          </div>

        </main>

        <MobileBottomNav />
      </div>
    </>
  );
}