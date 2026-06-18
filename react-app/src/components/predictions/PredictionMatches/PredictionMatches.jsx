//react-app/src/components/predictions/PredictionMatches/PredictionMatches.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./PredictionMatches.css";
import { useLanguage } from "../../../context/LanguageContext";
import { translate } from "../../../data/translations";
import PromoPopup from "../../PromoPopup/PromoPopup";  


function formatDate(str) {
  if (!str) return "TBA";
  const d = new Date(String(str).replace(" ", "T"));
  if (isNaN(d.getTime())) return "TBA";
  return d.toLocaleString("en-US", {
    month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function initials(name = "") {
  return name.slice(0, 2).toUpperCase();
}

function TeamAvatar({ name, logo }) {
  const [imgErr, setImgErr] = useState(false);
  return (
    <div className="pm-team-avatar">
      {logo && !imgErr ? (
        <img src={logo} alt={name} onError={() => setImgErr(true)} />
      ) : (
        initials(name)
      )}
    </div>
  );
}

function StatusBadge({ match }) {
  const { lang } = useLanguage();
  if (match.match_state === "live")
    return <span className="pm-status live">● {translate("pm_status_live", lang)}</span>;
  if (match.prediction_open === 0 || match.prediction_open === "0")
    return <span className="pm-status locked">🔒 {translate("pm_status_locked", lang)}</span>;
  return <span className="pm-status open">● {translate("pm_status_open", lang)}</span>;
}

function cardClass(match) {
  if (match.match_state === "live") return "pm-card-shell live-card";
  if (match.is_featured)            return "pm-card-shell featured-card";
  return "pm-card-shell";
}

export default function PredictionMatches({ matches = [] }) {
  const visible  = matches.slice(0, 3);
  const isLocked = (m) => m.prediction_open === 0 || m.prediction_open === "0";
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  const [popupKey, setPopupKey] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const openRegisterPopup = () => {
    setPopupKey((k) => k + 1);
    setShowPopup(true);
  };

  const handleCardClick = (matchId) => {
    if (!isLoggedIn) {
      openRegisterPopup();
      return;
    }
    navigate(`/predictions/${matchId}`);
  };

  return (
    <>
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
    <section className="pm-section pm-section-predictions">
      <div className="pm-inner">

        {/* Header */}
        <div className="pm-header">
          <div className="pm-header-left">
            <div className="pm-header-accent" />
            <div className="pm-header-text">
              <p className="pm-header-eyebrow">{translate("pm_predictions_arena", lang)}</p>
              <h2 className="pm-header-title">{translate("pm_match_predictions", lang)}</h2>
            </div>
          </div>
          <Link to="/predictions" className="pm-view-all">
            {translate("pm_view_all", lang)} <span className="pm-view-all-arrow">→</span>
          </Link>
        </div>

        {/* Grid */}
        <div className="pm-grid">

          {visible.length === 0 && (
            <div className="pm-empty">
              <div className="pm-empty-icon">🏟️</div>
              No prediction matches available right now
            </div>
          )}

          {visible.map((match) => (
            <div
              key={match.id}
              className={cardClass(match)}
              style={{ cursor: "pointer" }}
              onClick={() => handleCardClick(match.id)}
            >
              <div className="pm-card">

                {/* Top row */}
                <div className="pm-card-top">
                  <div className="pm-tournament">
                    <span className="pm-tournament-dot" />
                    {match.tournament || "Cricket Match"}
                  </div>
                  <StatusBadge match={match} />
                </div>

                {/* Teams */}
                <div className="pm-teams">
                  <div className="pm-team">
                    <TeamAvatar name={match.team_a} logo={match.team_a_logo} />
                    <div className="pm-team-name">{match.team_a}</div>
                  </div>

                  <div className="pm-vs-col">
                    <div className="pm-score-divider" />
                    <div className="pm-vs">VS</div>
                    <div className="pm-score-divider" />
                  </div>

                  <div className="pm-team">
                    <TeamAvatar name={match.team_b} logo={match.team_b_logo} />
                    <div className="pm-team-name">{match.team_b}</div>
                  </div>
                </div>

                <div className="pm-divider" />

                {/* Meta */}
                <div className="pm-meta">
                  <div className="pm-meta-item">
                    <span className="pm-meta-icon">🗓</span>
                    {formatDate(match.starting_at)}
                  </div>
                  {match.stake_cost > 0
                    ? <span className="pm-entry-cost">⚡ {translate("pm_free", lang, match.stake_cost)}</span>
                    : <span className="pm-entry-free">✦ {translate("pm_free", lang)}</span>
                  }
                </div>

                {/* CTA */}
                {isLocked(match) ? (
                  <span className="pm-cta locked-cta">
                    <span className="pm-cta-icon">🔒</span>
                    {translate("pm_predictions_closed", lang)}
                  </span>
                ) : (
                  <button
                    className="pm-cta"
                    onClick={(e) => { e.stopPropagation(); handleCardClick(match.id); }}
                  >
                    <span className="pm-cta-icon">🏏</span>
                    {translate("pm_predict_now", lang)}
                  </button>
                )}

              </div>
            </div>
          ))}

        </div>
      </div>
    </section>
    </>
  );
}