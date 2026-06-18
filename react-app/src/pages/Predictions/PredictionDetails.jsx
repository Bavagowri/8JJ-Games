// react-app/src/pages/Predictions/PredictionDetails.jsx
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { matchesAPI } from "../../api/matches.api";
import { predictionAPI } from "../../api/prediction.api";
import PredictionCountdown from "../../components/predictions/PredictionCountdown";
import toast from "react-hot-toast";
import "../../components/predictions/Predictions.css";
import "./PredictionDetails.css";
import { useLanguage } from "../../context/LanguageContext";
import { translate } from "../../data/translations";

// ── SEO ──────────────────────────────────────────────────────────────────────
import SEO from "../../components/SEO/SEO";
import { generateKeywords } from "../../config/seoKeywords";

const LIFECYCLE_STEPS = [
  "pd_lifecycle_open",        // 0
  "pd_lifecycle_locked",      // 1
  "pd_lifecycle_settled",     // 2
];

function getLifecycleIndex(status) {
  if (status === "completed") return 3; // settled
  if (status === "closed") return 1;    // locked
  if (status === "open") return 0;      // open
  return 0;
}

function PdTeamAvatar({ name, logo }) {
  const [imgErr, setImgErr] = useState(false);
  return (
    <div className="pd-avatar">
      {logo && !imgErr
        ? <img src={logo} alt={name} onError={() => setImgErr(true)} />
        : (name || "").slice(0, 2).toUpperCase()
      }
    </div>
  );
}

function BreadcrumbBar({ handleBack, lang, matchTitle }) {
  return (
    <div className="predictions-breadcrumb-bar">
      <div className="BackBTNcontainer">
        <button
          onClick={handleBack}
          className="premium-back-buttonzzz game-back-button"
          aria-label="Go back"
        >
          <span className="back-arrow">←</span>
        </button>
      </div>
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/" className="breadcrumb-link">{translate("home", lang)}</Link>
        <span className="breadcrumb-separator">/</span>
        <Link to="/predictions" className="breadcrumb-link">
          {translate("ph_prediction_arena", lang)}
        </Link>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-current">{matchTitle}</span>
      </nav>
    </div>
  );
}

export default function PredictionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const handleBack = () => navigate(-1);
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const { lang } = useLanguage();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await matchesAPI.getMatchDetails(id);
        console.log("API RESPONSE:", data); // ✅ check actual data
        setMatch(data.match);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  // ── JSON-LD Schema ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!match) return;

    const matchTitle = match.title || `${match.team_a} vs ${match.team_b}`;
    const isCompleted = match.status === "completed";

    // SportsEvent schema
    const sportsEventSchema = {
      "@context": "https://schema.org",
      "@type": "SportsEvent",
      "name": matchTitle,
      "description": `Predict the winner of ${matchTitle} in ${match.tournament || "Cricket"}. Make your prediction on 8JJ Games and earn points.`,
      "url": `https://8jjgames.com/predictions/${match.id}`,
      "startDate": match.starting_at || match.match_start_time,
      "sport": "Cricket",
      "eventStatus": isCompleted
        ? "https://schema.org/EventScheduled"
        : "https://schema.org/EventScheduled",
      "organizer": {
        "@type": "Organization",
        "name": match.tournament || "Cricket Tournament",
      },
      "competitor": [
        {
          "@type": "SportsTeam",
          "name": match.team_a,
          ...(match.team_a_logo && { "image": match.team_a_logo }),
        },
        {
          "@type": "SportsTeam",
          "name": match.team_b,
          ...(match.team_b_logo && { "image": match.team_b_logo }),
        },
      ],
      ...(isCompleted && match.winner && {
        "winner": {
          "@type": "SportsTeam",
          "name": match.winner,
        },
      }),
    };

    // BreadcrumbList schema
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://8jjgames.com" },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Prediction Arena",
          "item": "https://8jjgames.com/predictions",
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": matchTitle,
          "item": `https://8jjgames.com/predictions/${match.id}`,
        },
      ],
    };

    // Game/Quiz schema for the prediction mechanic
    const predictionGameSchema = {
      "@context": "https://schema.org",
      "@type": "Game",
      "name": `Predict: ${matchTitle}`,
      "description": `Who will win ${matchTitle}? Make your free prediction on 8JJ Games and earn up to ${
        match.options
          ? Math.max(...match.options.map((o) => Math.round((match.stake_cost || 0) * o.odds)))
          : 0
      } points.`,
      "url": `https://8jjgames.com/predictions/${match.id}`,
      "gamePlatform": "Web Browser",
      "genre": "Sports Prediction",
      "publisher": {
        "@type": "Organization",
        "name": "8JJ Games",
        "url": "https://8jjgames.com",
      },
    };

    // Remove existing schema
    const existing = document.getElementById("prediction-details-schema");
    if (existing) document.head.removeChild(existing);

    const schemaScript = document.createElement("script");
    schemaScript.type = "application/ld+json";
    schemaScript.id = "prediction-details-schema";
    schemaScript.text = JSON.stringify([sportsEventSchema, breadcrumbSchema, predictionGameSchema]);
    document.head.appendChild(schemaScript);

    return () => {
      const s = document.getElementById("prediction-details-schema");
      if (s) document.head.removeChild(s);
    };
  }, [match]);

  // ── Derived values ──────────────────────────────────────────────────────
  const matchTitle = match ? (match.title || `${match.team_a} vs ${match.team_b}`) : "Match Prediction";
  const isCompleted = match?.status === "completed";
  const isOpen = match?.status === "open";
  const alreadyPredicted = Boolean(match?.user_prediction);
  const stakeCost = match?.stake_cost || 0;
  const isFree = stakeCost === 0 || match?.zero_cost_enabled;
  const lifecycleIdx = match ? getLifecycleIndex(match.status) : 0;
  const selectedOption = match?.options?.find((o) => o.label === selected);
  const potentialReward = selectedOption && stakeCost > 0
    ? Math.round(stakeCost * selectedOption.odds) : null;

  const handleSubmit = async () => {
    if (!selected) { toast.error(translate("pd_select_option_first", lang)); return; }
    const option = match.options?.find((o) => o.label === selected);
    if (!option) { toast.error(translate("pd_invalid_option", lang)); return; }
    setSubmitting(true);
    try {
      await predictionAPI.submitPrediction(match.id, option.id);
      setMatch((prev) => ({ ...prev, user_prediction: selected }));
      const reward = potentialReward ? `+${potentialReward} ${translate("pc_pts", lang)}` : "";
      toast.success(`✅ ${translate("pd_prediction_locked", lang)} ${reward}`);
    } catch (err) {
      toast.error(err.message || translate("pd_failed_submit", lang));
    } finally {
      setSubmitting(false);
    }
  };

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
        <div className="prediction-details-page">
          <BreadcrumbBar handleBack={handleBack} lang={lang} matchTitle="Loading..." />
          <div style={{ textAlign: "center", padding: "80px 0", color: "rgba(255,255,255,0.4)" }}>
            <p style={{ fontSize: 32, marginBottom: 16 }}>⏳</p>
            <p>{translate("pd_loading_match", lang)}</p>
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
        <div className="prediction-details-page">
          <BreadcrumbBar handleBack={handleBack} lang={lang} matchTitle={translate("pd_match_not_found", lang)} />
          <div style={{ textAlign: "center", padding: "80px 0", color: "rgba(255,255,255,0.4)" }}>
            <p style={{ fontSize: 48, marginBottom: 16 }}>🏏</p>
            <h3 style={{ color: "#fff", marginBottom: 8 }}>{translate("pd_match_not_found", lang)}</h3>
            {error && <p style={{ fontSize: 13 }}>{error}</p>}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* ── SEO Meta Tags ── */}
      <SEO
        title={`Predict: ${matchTitle} | ${match.tournament || "Cricket"} | 8JJ Games`}
        description={`${isCompleted
          ? `Match result: ${match.winner || "TBC"}. `
          : isOpen
            ? `Predictions open! `
            : `Predictions locked. `
          }Predict ${matchTitle} in ${match.tournament || "Cricket"} on 8JJ Games. ${
          isFree ? "Free entry." : `${stakeCost} pts entry.`
        } Win up to ${
          match.options
            ? Math.max(...match.options.map((o) => Math.round(stakeCost * o.odds)))
            : 0
        } points.`}
        keywords={generateKeywords("pages", "predictions")}
        url={`/predictions/${id}`}
        type="website"
      />

      <div className="prediction-details-page">

        <BreadcrumbBar
          handleBack={handleBack}
          lang={lang}
          matchTitle={matchTitle}
        />

        {/* ── Split panel hero ── */}
        <article
          itemScope
          itemType="https://schema.org/SportsEvent"
          aria-label={`Match: ${matchTitle}`}
        >
          <meta itemProp="name" content={matchTitle} />
          <meta itemProp="url" content={`https://8jjgames.com/predictions/${match.id}`} />
          {match.starting_at && <meta itemProp="startDate" content={match.starting_at} />}
          <meta itemProp="sport" content="Cricket" />

          <div className="pd-hero">
            <div className="pd-hero-topline" />
            <div className="pd-hero-header">
              <span className="pd-hero-tournament">
                🏆 {match.title || "Cricket Match"}
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <PredictionCountdown closeTime={match.prediction_close_time} />
                <span className={`status-badge ${match.status}`}>{match.status}</span>
              </div>
            </div>

            <div className="pd-panels">
              <div
                className="pd-panel-left"
                style={{
  backgroundImage: `
    linear-gradient(135deg, rgba(8,24,60,0.78), rgba(12,32,75,0.65)),
    url(${match.team_a_logo || ''})
  `,
  backgroundSize: match.team_a_logo ? '140%, cover' : 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
}}
              >
                <PdTeamAvatar name={match.team_a} logo={match.team_a_logo} />
                <span className="pd-team-name" itemProp="competitor" itemScope itemType="https://schema.org/SportsTeam">
                  <span itemProp="name">{match.team_a}</span>
                </span>
              </div>
              <div
                className="pd-panel-right"
                style={match.team_b_logo ? {
                  backgroundImage: `linear-gradient(225deg, rgba(8,24,60,0.82) 0%, rgba(12,32,75,0.68) 100%), url(${match.team_b_logo})`,
                  backgroundSize: "160%, cover",
                  backgroundPosition: "center",
                } : {}}
              >
                <PdTeamAvatar name={match.team_b} logo={match.team_b_logo} />
                <span className="pd-team-name" itemProp="competitor" itemScope itemType="https://schema.org/SportsTeam">
                  <span itemProp="name">{match.team_b}</span>
                </span>
              </div>
              <div className="pd-vs-circle" aria-hidden="true">VS</div>
            </div>

            <div className="pd-hero-footer">
              <div className="pd-hero-meta">
                <time
                  dateTime={match.starting_at || match.match_start_time}
                  itemProp="startDate"
                >
                  🗓 {new Date(match.starting_at || match.match_start_time).toLocaleString("en-US", {
                    weekday: "short", month: "short", day: "numeric",
                    hour: "2-digit", minute: "2-digit",
                  })}
                </time>
                {match.prediction_close_time && (<>
                  <span className="pd-meta-dot">·</span>
                  <span>🔒 {new Date(match.prediction_close_time).toLocaleString("en-US", {
                    month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
                  })}</span>
                </>)}
                <span className="pd-meta-dot">·</span>
                {isFree
                  ? <span style={{ color: "var(--pred-success)", fontWeight: 700 }}>✓ {translate("phome_free_entry", lang)}</span>
                  : <span style={{ color: "var(--pred-warning)", fontWeight: 700 }}>⚡ {stakeCost} pts</span>
                }
              </div>
            </div>
          </div>

          <div className="pd-content-card">

            {/* ── Lifecycle segmented bar ── */}
            <div className="pd-lifecycle" role="list" aria-label="Match lifecycle stages">
              {LIFECYCLE_STEPS.map((step, i) => (
                <div
                  key={step}
                  role="listitem"
                  aria-current={i === lifecycleIdx ? "step" : undefined}
                  className={`pd-lc-step${i === lifecycleIdx ? " active" : ""}${i < lifecycleIdx ? " done" : ""}`}
                >
                  <span className="pd-lc-dot" aria-hidden="true" />
                  {translate(step, lang)}
                </div>
              ))}
            </div>

            {/* ── Stat pills ── */}
            <div className="pd-stats-row">
              <div className="pd-stat-pill">
                <span className="pd-stat-label">{translate("pd_entry_cost", lang)}</span>
                <span className={`pd-stat-value${isFree ? " free" : ""}`}>
                  {isFree ? "FREE" : `${stakeCost} pts`}
                </span>
              </div>
              <div className="pd-stat-pill">
                <span className="pd-stat-label">{translate("pd_prediction_type", lang)}</span>
                <span className="pd-stat-value" style={{ color: "var(--pred-primary)", fontSize: 13 }}>
                  {translate(`pc_type_${match.prediction_type}`, lang)}
                </span>
              </div>
              {isCompleted && match.winner && (
                <div className="pd-stat-pill pd-stat-pill--result">
                  <span className="pd-stat-label pd-stat-label--result">Result</span>
                  <span className="pd-stat-value" style={{ color: "var(--pred-success)", fontSize: 13 }}>
                    🏆 <span itemProp="winner" itemScope itemType="https://schema.org/SportsTeam">
                      <span itemProp="name">{match.winner}</span>
                    </span>
                    {alreadyPredicted && (
                      <span
                        className={`result-badge ${match.user_prediction === match.winner ? "won" : "lost"}`}
                        style={{ marginLeft: 8, verticalAlign: "middle" }}
                      >
                        {match.user_prediction === match.winner
                          ? translate("pd_you_won", lang)
                          : translate("pd_you_lost", lang)}
                      </span>
                    )}
                  </span>
                </div>
              )}
              {potentialReward && (
                <div className="pd-stat-pill">
                  <span className="pd-stat-label">{translate("pd_potential_reward", lang)}</span>
                  <span className="pd-stat-value">🎯 {potentialReward} pts</span>
                </div>
              )}
            </div>

            {/* ── Closed banner ── */}
            {!isOpen && !isCompleted && !alreadyPredicted && (
              <div className="pd-closed-banner" role="status" aria-live="polite">
                🔒 {translate("pd_predictions_closed", lang)}
              </div>
            )}

            {/* ── Options ── */}
            <section className="details-options-section" aria-labelledby="options-heading">
              <h2 id="options-heading" className="details-options-title">
                {alreadyPredicted
                  ? translate("pd_your_prediction", lang)
                  : translate("pd_select_prediction", lang)}
              </h2>
              <div
                className="details-options-grid"
                role="radiogroup"
                aria-labelledby="options-heading"
              >
                {(match.options || []).map((opt) => {
                  const isSelected = selected === opt.label || match.user_prediction === opt.label;
                  const isWinner = isCompleted && match.winner === opt.label;
                  const canSelect = isOpen && !alreadyPredicted;
                  const reward = stakeCost > 0 ? Math.round(stakeCost * opt.odds) : null;
                  return (
                    <div
                      key={opt.id}
                      role="radio"
                      aria-checked={isSelected}
                      aria-disabled={!canSelect}
                      tabIndex={canSelect ? 0 : -1}
                      onKeyDown={(e) => {
                        if (canSelect && (e.key === "Enter" || e.key === " ")) {
                          e.preventDefault();
                          setSelected(opt.label);
                        }
                      }}
                      className={`details-option${isSelected ? " selected-option" : ""}${!canSelect ? " disabled-option" : ""}`}
                      onClick={() => canSelect && setSelected(opt.label)}
                    >
                      <div className="option-left">
                        <span className="option-label">
                          {isWinner && "🏆 "}{opt.label}
                          {isSelected && alreadyPredicted && (
                            <span style={{ fontSize: 11, color: "rgba(79,172,254,0.7)", marginLeft: 8 }}>
                              {translate("pc_you_picked", lang)} ✓
                            </span>
                          )}
                        </span>
                        {reward && (
                          <span className="option-potential-reward">
                            {translate("pd_potential_reward", lang)}: {reward} pts
                          </span>
                        )}
                      </div>
                      <div className="option-right">
                        <span className="option-odds-badge">{opt.odds}×</span>
                        <div className="option-check" aria-hidden="true">
                          {isSelected && (
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                              <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="2"
                                strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* ── Submit / locked ── */}
            {isOpen && !alreadyPredicted ? (
              <div className="details-submit-area">
                <button
                  className="details-submit-btn"
                  onClick={handleSubmit}
                  disabled={!selected || submitting}
                  aria-busy={submitting}
                  aria-label={selected
                    ? `Submit prediction for ${selected}`
                    : "Select a team to submit your prediction"}
                >
                  {submitting
                    ? translate("pd_submitting", lang)
                    : stakeCost > 0
                      ? translate("pd_submit_spend", lang, { points: stakeCost })
                      : translate("pd_submit_free", lang)}
                </button>
              </div>
            ) : alreadyPredicted && !isCompleted ? (
              <div className="details-submit-area">
                <div className="predicted-info" style={{ justifyContent: "center", fontSize: 14 }} role="status">
                  ✅ {translate("pd_prediction_locked", lang)} —{" "}
                  <span className="predicted-team">{match.user_prediction}</span>
                </div>
              </div>
            ) : null}

          </div>
        </article>

        {/* ── SEO: Hidden content for crawlers ── */}
        <div className="sr-only">
          <h2>How to Predict This Match</h2>
          <p>
            Select your predicted winner from the options above and submit your prediction before
            the deadline. {isFree
              ? "Entry is completely free."
              : `Entry costs ${stakeCost} points.`
            } Correct predictions earn you points multiplied by the odds. All predictions are
            locked once the match starts.
          </p>
          <p>
            Match: {matchTitle}. Tournament: {match.tournament || "Cricket"}.
            Teams: {match.team_a} and {match.team_b}.
            {isCompleted && match.winner ? ` Result: ${match.winner} won.` : ""}
          </p>
        </div>

      </div>
    </>
  );
}