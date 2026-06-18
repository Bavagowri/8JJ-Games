// react-app/src/components/Widgets/Mobile/BannerA.jsx

import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { matchesAPI } from "../../../api/matches.api";
import "./MobileWidgets.css";
import PromoPopup from "../../PromoPopup/PromoPopup";

import { useLanguage } from "../../../context/LanguageContext";
import { translate } from "../../../data/translations";

const FALLBACK_IMAGE = "/images/PreBan01.jpg";

const R2_BASE =
  import.meta.env.VITE_ASSETS_BASE_URL ||
  "https://assets.8jjgames.com";


// ─── Hardcoded creative content — one entry per slide position ───────────────
// Uses the same translation keys as the desktop BannerA component.
const SLIDE_CREATIVE = [
  {
    headlineLine1Key: "banner_slide_big_clash",
    headlineLine2Key: "banner_slide_make_prediction",
    subTextKey:       "banner_slide_predict_points",
    sportEmoji:       "🏏",
    athleteImageUrl: `${R2_BASE}/images/rr-csk.webp`,
  },
  {
    headlineLine1Key: "banner_slide_rivalry_match",
    headlineLine2Key: "banner_slide_who_takes_it",
    subTextKey:       "banner_slide_powerhouses",
    sportEmoji:       "🏏",
   athleteImageUrl: `${R2_BASE}/images/sh-rcb.jpg`,
  },
  {
    headlineLine1Key: "banner_slide_tomorrow_battle",
    headlineLine2Key: "banner_slide_call_winner",
    subTextKey:       "banner_slide_free_prediction",
    sportEmoji:       "🏏",
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
    id:            match.id,
    tournament:    match.tournament || "Cricket Match",
    teamA:         match.team_a     || "Team A",
    teamB:         match.team_b     || "Team B",
    stakeLabelKey: isFreeEntry ? "banner_match_free" : "banner_match_points",
    stakeVars:     isFreeEntry ? {} : { points: match.stake_cost },
    isLive,
    isUrgent:      isLive,
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
function BannerASlide({ slide, isActive, onRequireAuth }) {
  const navigate    = useNavigate();
  const resolvedSrc = slide.athleteImageUrl || FALLBACK_IMAGE;
  const [imgFailed, setImgFailed] = useState(false);
  const { lang }    = useLanguage();

  // Resolve the stake label: fallback slides carry a plain `stakeLabel`,
  // API-mapped slides carry `stakeLabelKey` + `stakeVars`.
  const stakeText = slide.stakeLabelKey
    ? translate(slide.stakeLabelKey, lang, slide.stakeVars)
    : slide.stakeLabel;

  return (
    <div className={`mba MobileBannerA${isActive ? " mba--active" : ""}`}>
      <div className="mba-glow" />

      {/* ── Athlete / match image ──────────────────────── */}
      <div className="mba-image">
        {slide.isLive && (
          <div className="mba-live">
            <span className="mba-live-dot" />
            {translate("banner_live_now", lang)}
          </div>
        )}

        {slide.sportEmoji && (
          <div className="mba-sport-pip">{slide.sportEmoji}</div>
        )}

        {!imgFailed ? (
          <img
            src={resolvedSrc}
            alt="Featured match"
            draggable={false}
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div className="mba-image-placeholder">
            <div className="mba-image-icon">
              {slide.sportEmoji || "🏏"} {translate("banner_predict_now", lang)}
            </div>
          </div>
        )}
      </div>

      {/* ── Content ────────────────────────────────────── */}
      <div className="mba-body">
        <span className="mba-eyebrow">🏆 {slide.tournament}</span>

        <h2 className="mba-headline">
          {translate(slide.headlineLine1Key, lang)}<br />
          <em>{translate(slide.headlineLine2Key, lang)}</em>
        </h2>

        <p className="mba-sub">
          {translate(slide.subTextKey, lang, {
            teamA: slide.teamA,
            teamB: slide.teamB,
          })}
        </p>

        {/* Match pill — real team names + real stake */}
        <div className="mba-match-pill">
          <div className="mba-teams">
            <span className="mba-team-name">{slide.teamA}</span>
            <span className="mba-vs">VS</span>
            <span className="mba-team-name">{slide.teamB}</span>
          </div>

          {stakeText && (
            <span className="mba-stake">⚡ {stakeText}</span>
          )}
        </div>

        {/* CTA */}
        <div className="mba-cta">
         <button
            className="mba-btn-primary"
            onClick={() => {
              if (!localStorage.getItem("token")) {
                onRequireAuth?.();
                return;
              }
              navigate(slide.id ? `/predictions/${slide.id}` : "/predictions");
            }}
          >
            {slide.sportEmoji || "🏏"} {translate("banner_match_make_prediction", lang)}
          </button>
          <button
            className="mba-btn-ghost"
            onClick={() => navigate("/predictions/leaderboard")}
          >
            🏆 {translate("leaderboard", lang)}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Carousel ─────────────────────────────────────────────────────────────────
function BannerACarousel({ slides, autoPlayMs = 5000, onRequireAuth }) {
  const total = slides.length;
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

  const handleNav = (dir) => { setPaused(true); goTo(current + dir); };

  return (
    <div
      style={{ position: "relative", overflow: "hidden" }}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      {/* Track */}
      <div style={{
        display:    "flex",
        transition: "transform 0.4s cubic-bezier(0.22,1,0.36,1)",
        transform:  `translateX(-${current * 100}%)`,
      }}>
        {slides.map((slide, i) => (
          <div key={slide.id ?? i} style={{ width: "100%", flexShrink: 0 }}>
            <BannerASlide slide={slide} isActive={i === current} onRequireAuth={onRequireAuth} />
          </div>
        ))}
      </div>

      {/* Arrows */}
      {["prev", "next"].map((dir) => (
        <button
          key={dir}
          onClick={() => handleNav(dir === "prev" ? -1 : 1)}
          aria-label={dir === "prev" ? "Previous" : "Next"}
          style={{
            position:       "absolute",
            top:            "40%",
            [dir === "prev" ? "left" : "right"]: 10,
            transform:      "translateY(-50%)",
            background:     "rgba(0,0,0,0.4)",
            border:         "1px solid rgba(255,255,255,0.18)",
            borderRadius:   "50%",
            width:          34,
            height:         34,
            color:          "#fff",
            fontSize:       22,
            lineHeight:     "32px",
            textAlign:      "center",
            cursor:         "pointer",
            zIndex:         10,
            backdropFilter: "blur(6px)",
            WebkitTapHighlightColor: "transparent",
          }}
        >
          {dir === "prev" ? "‹" : "›"}
        </button>
      ))}

      {/* Dots */}
      {total > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: 5, padding: "8px 0 4px" }}>
          {slides.map((_, i) => (
            <span
              key={i}
              onClick={() => { setPaused(true); goTo(i); }}
              style={{
                width:        i === current ? 16 : 6,
                height:       6,
                borderRadius: 3,
                background:   i === current ? "var(--mw-primary)" : "rgba(255,255,255,0.25)",
                transition:   "all 0.3s ease",
                cursor:       "pointer",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function BannerASkeleton() {
  return (
    <div className="mba MobileBannerA" style={{ opacity: 0.4 }}>
      <div className="mba-image" style={{ background: "rgba(255,255,255,0.04)" }} />
      <div className="mba-body">
        <span style={{ display: "block", width: 80, height: 10, background: "rgba(255,255,255,0.06)", borderRadius: 4 }} />
        <div style={{ width: "70%", height: 30, background: "rgba(255,255,255,0.06)", borderRadius: 6, margin: "8px 0" }} />
        <div style={{ width: "55%", height: 12, background: "rgba(255,255,255,0.04)", borderRadius: 4, marginBottom: 14 }} />
      </div>
    </div>
  );
}

// ─── Public export ────────────────────────────────────────────────────────────
export default function BannerA({ autoPlayMs = 5000 }) {
  const [slides,  setSlides]  = useState(null);
  const [loading, setLoading] = useState(true);
  const [popupKey, setPopupKey] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
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

  if (loading || slides === null) return <BannerASkeleton />;
  if (slides.length === 1)        return <BannerASlide slide={slides[0]} isActive />;

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

  return (
  <>
  {popup}
  <BannerACarousel slides={slides} autoPlayMs={autoPlayMs} onRequireAuth={openRegisterPopup} />;
  </>
  );
}