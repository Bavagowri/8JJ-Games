// react-app/src/components/Widgets/BannerA.jsx
import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { matchesAPI } from "../../api/matches.api";
import "./WidgetsComponent.css";
import "./BannerA.css";

import { useLanguage } from "../../context/LanguageContext"; 
import { translate } from "../../data/translations";
import PromoPopup from "../PromoPopup/PromoPopup";

const FALLBACK_IMAGE = "/images/PreBan01.jpg";

const R2_BASE =
  import.meta.env.VITE_ASSETS_BASE_URL ||
  "https://assets.8jjgames.com";


const SLIDE_CREATIVE = [
  {
    headlineLine1Key: "banner_slide_big_clash",
    headlineLine2Key: "banner_slide_make_prediction",
    subTextKey: "banner_slide_predict_points",
    sportEmoji: "🏏",
    athleteImageUrl: `${R2_BASE}/images/rr-csk.webp`,
  },
  {
    headlineLine1Key: "banner_slide_rivalry_match",
    headlineLine2Key: "banner_slide_who_takes_it",
    subTextKey: "banner_slide_powerhouses",
    sportEmoji: "🏏",
    athleteImageUrl: `${R2_BASE}/images/sh-rcb.jpg`,
  },
  {
    headlineLine1Key: "banner_slide_tomorrow_battle",
    headlineLine2Key: "banner_slide_call_winner",
    subTextKey: "banner_slide_free_prediction",
    sportEmoji: "🏏",
    athleteImageUrl: `${R2_BASE}/images/MI-KR.webp`,
  },
];


// ─── Fallback slides shown when API returns nothing ───────────────────────────
const FALLBACK_SLIDES = [
  {
    id:         "ba-1",
    tournament: "IPL 2026 · Big Clash",
    teamA:      "Mumbai Indians",
    teamB:      "Chennai Super Kings",
    stakeLabel: "10 pts",
    isLive:     false,
    isUrgent:   false,
    ...SLIDE_CREATIVE[0],
  },
  {
    id:         "ba-2",
    tournament: "IPL 2026 · Rivalry Match",
    teamA:      "Royal Challengers Bengaluru",
    teamB:      "Kolkata Knight Riders",
    stakeLabel: "25 pts",
    isLive:     true,
    isUrgent:   true,
    ...SLIDE_CREATIVE[1],
  },
  {
    id:         "ba-3",
    tournament: "IPL 2026 · Tomorrow",
    teamA:      "Rajasthan Royals",
    teamB:      "Delhi Capitals",
    stakeLabel: "Free",
    isLive:     false,
    isUrgent:   false,
    ...SLIDE_CREATIVE[2],
  },
];

// ─── Map a real DB match → slide props ───────────────────────────────────────
function mapMatch(match, index) {
  const isFreeEntry = !match.stake_cost || Number(match.stake_cost) === 0;
  const isLive      = match.match_state === "live";
  const creative    = SLIDE_CREATIVE[index] || SLIDE_CREATIVE[0];

  return {
    id:         match.id,
    tournament: match.tournament || "Cricket Match",
    teamA:      match.team_a     || "Team A",
    teamB:      match.team_b     || "Team B",
    stakeLabelKey: isFreeEntry ? "banner_match_free" : "banner_match_points",
    stakeVars: isFreeEntry ? {} : { points: match.stake_cost },
    isLive,
    isUrgent:   isLive,
    ...creative,
  };
}

// ─── Prioritise matches — same logic as HomePredictionCard ────────────────────
function prioritise(matches, max = 3) {
  return [
    ...matches.filter(m => m.is_featured === 1),
    ...matches.filter(m => m.status === "upcoming" && m.is_featured !== 1),
    ...matches.filter(m => m.status !== "upcoming" && m.is_featured !== 1),
  ].slice(0, max);
}

// ─── Single slide ─────────────────────────────────────────────────────────────
function BannerASlide({ match, isActive, onRequireAuth }) {
  const navigate    = useNavigate();
  const resolvedSrc = match.athleteImageUrl || FALLBACK_IMAGE;
  const [imgFailed, setImgFailed] = useState(false);
  const { lang } = useLanguage();

  return (
    <div className={`banner-a${isActive ? " banner-a--active" : ""}`}>
      <div className="banner-a-glow" />

      {/* ── Athlete Panel ───────────────────────────────── */}
      <div className="banner-a-athlete">
        {match.isLive && (
          <div className="banner-a-live-badge">
            <span className="banner-a-live-dot" />
            Live Now
          </div>
        )}

        {match.sportEmoji && (
          <div className="banner-a-sport-pip">{match.sportEmoji}</div>
        )}

        {!imgFailed ? (
          <img
            className="banner-a-athlete-img"
            src={resolvedSrc}
            alt="Featured athlete"
            draggable={false}
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div className="banner-a-athlete-placeholder">
            <div className="banner-a-athlete-silhouette">
              {match.sportEmoji || "🏏"} {translate("banner_predict_now", lang)}
            </div>
          </div>
        )}
      </div>

      {/* ── Content Panel ──────────────────────────────── */}
      <div className="banner-a-content">
        <p className="banner-a-eyebrow"> 🏆 {translate(match.tournamentKey, lang)}</p>

        <h2 className="banner-a-headline">
          {translate(match.headlineLine1Key, lang)}<br />
          <em>{translate(match.headlineLine2Key, lang)}</em>
        </h2>

        <p className="banner-a-sub">
          {translate(match.subTextKey, lang, {
            teamA: match.teamA,
            teamB: match.teamB
          })}
        </p>

        {/* Match info row — real team names + real stake */}
        <div className="banner-a-match-row">
          <div className="banner-a-teams">
            <span className="banner-a-team-name">{match.teamA}</span>
            <span className="banner-a-vs">VS</span>
            <span className="banner-a-team-name">{match.teamB}</span>
          </div>

          {match.stakeLabel && (
            <span className="banner-a-stake">⚡ {match.stakeLabel}</span>
          )}
        </div>

        {/* CTA */}
        <div className="banner-a-cta">
          <button
            onClick={() => {
              if (!localStorage.getItem("token")) {
                onRequireAuth();
                return;
              }
              navigate(match.id ? `/predictions/${match.id}` : "/predictions");
            }}
            className="banner-a-btn-primary"
          >
            {match.sportEmoji || "🏏"} {translate("banner_match_make_prediction", lang)}
          </button>
          <button
            onClick={() => navigate("/predictions/leaderboard")}
            className="banner-a-btn-ghost"
          >
            🏆 {translate("leaderboard", lang)}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function BannerASkeleton() {
  return (
    <div className="bna-shell BannerA" style={{ opacity: 0.4, minHeight: 260 }}>
      <div className="banner-a">
        <div className="banner-a-athlete" style={{ background: "rgba(255,255,255,0.04)" }} />
        <div className="banner-a-content" style={{ gap: 12 }}>
          <div style={{ width: 100, height: 10, background: "rgba(255,255,255,0.06)", borderRadius: 4 }} />
          <div style={{ width: "70%", height: 36, background: "rgba(255,255,255,0.06)", borderRadius: 6 }} />
          <div style={{ width: "55%", height: 12, background: "rgba(255,255,255,0.04)", borderRadius: 4 }} />
        </div>
      </div>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function BannerA({ autoPlayMs = 5000 }) {
  const [slides,   setSlides]   = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [current,  setCurrent]  = useState(0);
  const [paused,   setPaused]   = useState(false);
  const [popupKey, setPopupKey] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const timerRef = useRef(null);
  const { lang } = useLanguage();

  const openRegisterPopup = () => {
    setPopupKey((k) => k + 1);
    setShowPopup(true);
  };
  useEffect(() => {
    matchesAPI.getMatches()
      .then((data) => {
        const raw    = data.matches || [];
        const picked = prioritise(raw, 3);
        setSlides(
          picked.length > 0
            ? picked.map(mapMatch)
            : FALLBACK_SLIDES
        );
      })
      .catch(() => setSlides(FALLBACK_SLIDES))
      .finally(() => setLoading(false));
  }, []);

  const total = slides?.length ?? 0;

  const goTo = useCallback(
    (idx) => setCurrent(((idx % total) + total) % total),
    [total]
  );

  useEffect(() => {
    if (total <= 1 || paused) return;
    timerRef.current = setInterval(() => setCurrent((c) => (c + 1) % total), autoPlayMs);
    return () => clearInterval(timerRef.current);
  }, [total, paused, autoPlayMs]);

  const handleNav = (dir) => { setPaused(true); goTo(current + dir); };

  if (loading || slides === null) return <BannerASkeleton />;

  const popup = showPopup && (
    <PromoPopup
      key={popupKey}
      image="/images/register-refer.png"
      title={translate("promo_popup_register_title", lang)}
      description={translate("promo_popup_register_description", lang)}
      buttonText={translate("promo_popup_register_button", lang)}
      buttonLink="/register"
      onClose={() => setShowPopup(false)}
    />
  );

  // ── Single slide ──
  if (total === 1) {
    return (
      <>
        {popup}
        <div className="bna-shell BannerA">
          <BannerASlide match={slides[0]} isActive onRequireAuth={openRegisterPopup} />
        </div>
      </>
    );
  }

  // ── Carousel ────────────────────────────────────────────────────────────────
  return (
    <>
    {popup}
     <div
      className="bna-shell bna-carousel BannerA"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="bna-track-wrap">
        <div
          className="bna-track"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {slides.map((m, i) => (
            <div key={m.id ?? i} className="bna-slide">
              <BannerASlide match={m} isActive={i === current} onRequireAuth={openRegisterPopup} />
            </div>
          ))}
        </div>
      </div>

      <button className="bna-arrow bna-arrow--prev" onClick={() => handleNav(-1)} aria-label="Previous">‹</button>
      <button className="bna-arrow bna-arrow--next" onClick={() => handleNav(1)}  aria-label="Next">›</button>
    </div>
    </>
  );
}