// react-app/src/components/MultiPanelBannerHardcoded/MultiPanelBannerHardcoded-Mobile.jsx

import { useCallback, useState, useEffect, useRef } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { translate } from "../../data/translations";
import "../UniversalBanner/templates/mobile/MobileStackedPromoV2.css";
import { loadBannerFont, BANNER_FONTS } from "../../utils/loadBannerFont";

const CONFIG = {
  borderRadius: 20,
  cardHeight:   220,
  autoPlay:     true,
  interval:     5000,
  overflowTop:  52,
};

const TRANS = 420;

export default function MultiPanelBannerHardcodedMobile() {
  useEffect(() => {
    loadBannerFont(BANNER_FONTS.MobileStackedPromoV2);
  }, []);

  const { lang } = useLanguage();

  const PANELS = [
    {
      id:                   1,
      accentColor:          "#ff6b35",
      background_image_url: "/images/DONGGDONI1.png",
      logo_url:             "/images/DONI022.png",
      bgColor:              "#050d1a",
      title_highlight:      translate("mpb_featured",              lang),
      badge_text:           translate("mpb_new_release",           lang),
      title:                translate("mpb_shadow_realm_title",    lang),
      subtitle:             translate("mpb_shadow_realm_subtitle", lang),
      cta_text:             translate("mpb_predict_now",              lang),
      cta_link:             "/predictions",
    },
    {
      id:                   2,
      accentColor:          "#b87cff",
      background_image_url: "/images/BANNMID01.jpg",
      logo_url:             "/images/BANKoli01.webp",
      bgColor:              "#120800",
      title_highlight:      translate("mpb_hot_pick",              lang),
      badge_text:           translate("mpb_top_rated",             lang),
      title:                translate("mpb_neon_striker_title",    lang),
      subtitle:             translate("mpb_neon_striker_subtitle", lang),
      cta_text:             translate("mpb_predict_now",              lang),
      cta_link:             "/predictions",
    },
    {
      id:                   3,
      accentColor:          "#00e5ff",
      background_image_url: "/images/BANNTWO22.jpg",
      logo_url:             "/images/BANBura03.webp",
      bgColor:              "#0a0514",
      title_highlight:      translate("mpb_exclusive",             lang),
      badge_text:           translate("mpb_limited_time",          lang),
      title:                translate("mpb_void_runner_title",     lang),
      subtitle:             translate("mpb_void_runner_subtitle",  lang),
      cta_text:             translate("mpb_predict_now",              lang),
      cta_link:             "/predictions",
    },
  ];

  const { borderRadius, cardHeight, autoPlay, interval, overflowTop } = CONFIG;

  const [index, setIndex]   = useState(0);
  const [phase, setPhase]   = useState("idle");
  const [progress, setProgress] = useState(0);

  const touchStartX = useRef(null);
  const touchStartY = useRef(null);
  const timerRef    = useRef(null);
  const rafRef      = useRef(null);
  const phaseRef    = useRef("idle");

  const n     = PANELS.length;
  const slide = PANELS[index];
  const accent = slide.accentColor || "#00e5ff";
  const bgImg  = slide.background_image_url;
  const charImg = slide.logo_url;

  // Keep phaseRef in sync
  useEffect(() => { phaseRef.current = phase; }, [phase]);

  // ── Core animate-to ──
  const animateTo = useCallback((next, dir = "left") => {
    if (phaseRef.current !== "idle") return;
    clearTimeout(timerRef.current);
    cancelAnimationFrame(rafRef.current);
    setProgress(0);

    const outPhase = dir === "left" ? "out-left"  : "out-right";
    const inPhase  = dir === "left" ? "in-right"  : "in-left";

    phaseRef.current = outPhase;
    setPhase(outPhase);

    setTimeout(() => {
      setIndex(next);
      phaseRef.current = inPhase;
      setPhase(inPhase);
      setTimeout(() => {
        phaseRef.current = "idle";
        setPhase("idle");
      }, TRANS);
    }, TRANS);
  }, []);

  // ── Auto-advance + progress bar ──
  useEffect(() => {
    if (!autoPlay || n <= 1) return;
    setProgress(0);
    const startTime = Date.now();

    const tick = () => {
      const pct = Math.min(((Date.now() - startTime) / interval) * 100, 100);
      setProgress(pct);
      if (pct < 100) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    timerRef.current = setTimeout(() => {
      animateTo((index + 1) % n, "left");
    }, interval);

    return () => {
      clearTimeout(timerRef.current);
      cancelAnimationFrame(rafRef.current);
    };
  }, [index, autoPlay, interval, n, animateTo]);

  // ── Manual nav ──
  const goTo = useCallback((next, dir = "left") => {
    if (next === index) return;
    animateTo(next, dir);
  }, [index, animateTo]);

  // ── Swipe ──
  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const onTouchEnd = (e) => {
    if (touchStartX.current == null) return;
    const dx = touchStartX.current - e.changedTouches[0].clientX;
    const dy = Math.abs(touchStartY.current - e.changedTouches[0].clientY);
    touchStartX.current = null;
    if (Math.abs(dx) < 40 || dy > 55) return;
    dx > 0
      ? goTo((index + 1) % n, "left")
      : goTo((index - 1 + n) % n, "right");
  };

  const handleCta = useCallback((e) => {
    e?.stopPropagation();
    if (!slide.cta_link) return;
    if (slide.cta_link.startsWith("http")) {
      window.open(slide.cta_link, "_blank", "noopener");
    } else {
      window.location.href = slide.cta_link;
    }
  }, [slide]);

  return (
    <div
      className="msv2-wrap MobileStackedPromoV2"
      style={{
        "--accent":   accent,
        "--radius":   `${borderRadius}px`,
        "--ch":       `${cardHeight}px`,
        "--overflow": `${overflowTop}px`,
      }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* ── Progress nav ── */}
      {n > 1 && (
        <div className="msv2-nav">
          <div className="msv2-segments">
            {PANELS.map((_, i) => (
              <button
                key={i}
                className={`msv2-seg${i === index ? " msv2-seg--active" : ""}${i < index ? " msv2-seg--past" : ""}`}
                onClick={() => goTo(i, i > index ? "left" : "right")}
                aria-label={`Go to slide ${i + 1}`}
              >
                {i === index && (
                  <span className="msv2-seg-fill" style={{ width: `${progress}%` }} />
                )}
              </button>
            ))}
          </div>

          <div className="msv2-counter-row">
            <button
              className="msv2-arrow msv2-arrow--prev"
              onClick={() => goTo((index - 1 + n) % n, "right")}
              aria-label="Previous"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6"/>
              </svg>
            </button>

            <span className="msv2-counter">
              <span className="msv2-counter-cur">{String(index + 1).padStart(2, "0")}</span>
              <span className="msv2-counter-sep"> / </span>
              <span className="msv2-counter-tot">{String(n).padStart(2, "0")}</span>
            </span>

            <button
              className="msv2-arrow msv2-arrow--next"
              onClick={() => goTo((index + 1) % n, "left")}
              aria-label="Next"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* ── Panel ── */}
      <div className="msv2-panel">

        {/* Inner card — overflow:hidden */}
        <div
          className={`msv2-card msv2-phase-${phase}`}
          style={{ height: cardHeight }}
        >
          {bgImg
            ? <img src={bgImg} alt="" className="msv2-bg" draggable={false} />
            : <div className="msv2-bg-fallback" style={{ background: slide.bgColor || "#050d1a" }} />
          }
          <div className="msv2-bg-fallback msv2-bg-fallback--base" />

          <div className="msv2-ov-base" />
          <div className="msv2-ov-left" />
          <div className="msv2-scanlines" />
          <div className="msv2-slash" />
          <div className="msv2-char-glow" />

          <div className="msv2-content">
            {slide.title_highlight && (
              <div className="msv2-eyebrow-wrap">
                <span className="msv2-eyebrow">{slide.title_highlight}</span>
              </div>
            )}

            <div className="msv2-text-block">
              {slide.badge_text && (
                <div className="msv2-badge">
                  <span className="msv2-badge-pip" />
                  <span className="msv2-badge-text">{slide.badge_text}</span>
                </div>
              )}

              {slide.title && (
                <h3 className="msv2-title">{slide.title}</h3>
              )}

              {slide.subtitle && (
                <p className="msv2-sub">{slide.subtitle}</p>
              )}

              {slide.cta_text && slide.cta_link && (
                <button className="msv2-cta" onClick={handleCta}>
                  <div className="msv2-cta-inner-row">
                    <span className="msv2-cta-label">{slide.cta_text}</span>
                    <svg className="msv2-cta-arrow" width="13" height="13"
                      viewBox="0 0 24 24" fill="none" stroke="currentColor"
                      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </div>
                  <span className="msv2-cta-line" />
                </button>
              )}
            </div>
          </div>

          <div className="msv2-podium" />
        </div>

        {/* Character — outside card so it overflows above */}
        {charImg && (
          <img
            src={charImg}
            alt=""
            className={`msv2-char msv2-phase-char-${phase}`}
            draggable={false}
          />
        )}
      </div>
    </div>
  );
}