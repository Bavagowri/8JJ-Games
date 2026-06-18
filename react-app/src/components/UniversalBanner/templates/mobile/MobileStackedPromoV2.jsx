// react-app/src/components/UniversalBanner/templates/mobile/MobileStackedPromoV2.jsx

import { useCallback, useState, useEffect, useRef } from "react";
import "./MobileStackedPromoV2.css";
import { loadBannerFont, BANNER_FONTS } from '../../../../utils/loadBannerFont';

export default function MobileStackedPromoV2({ banner, slides, config, onSlideClick }) {
  useEffect(() => { loadBannerFont(BANNER_FONTS.MobileStackedPromoV2); }, []);
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState("idle");
  const [progress, setProgress] = useState(0);
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);
  const timerRef = useRef(null);
  const rafRef = useRef(null);
  const phaseRef = useRef("idle");       // ← mirrors phase but always fresh
  const TRANS = 420;

  const {
    borderRadius = 20,
    cardHeight = 220,
    autoPlay = true,
    interval = 5000,
    overflowTop = 52,
    paddingTop = 25,
  } = config || {};

  const panels = slides || [];
  const n = panels.length;

  const getSc = (slide) => {
    try {
      return slide?.config
        ? (typeof slide.config === "string" ? JSON.parse(slide.config) : slide.config)
        : {};
    } catch (_) { return {}; }
  };

  const slide = panels[index] || {};
  const sc = getSc(slide);
  const accent = sc.accentColor || "#00e5ff";
  const bgImg = slide.background_image_url || slide.background;
  const charImg = slide.logo_url || slide.logo;

  // Keep phaseRef in sync so callbacks always read fresh phase
  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  // ── Core animate-to function ──
  const animateTo = useCallback((next, dir = "left") => {
    if (phaseRef.current !== "idle") return;

    clearTimeout(timerRef.current);
    cancelAnimationFrame(rafRef.current);
    setProgress(0);

    const outPhase = dir === "left" ? "out-left" : "out-right";
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
  }, []); // ← no stale deps; reads index via arg, phase via ref

  // ── Auto-advance + progress ──
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
      animateTo((index + 1) % n, "left"); // ← index is fresh here (effect re-runs on index change)
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
    onSlideClick?.(slide.cta_link);
  }, [slide, onSlideClick]);

  if (!n) return null;

  return (
    <div
      className="msv2-wrap MobileStackedPromoV2"
      style={{
        "--accent": accent,
        "--radius": `${borderRadius}px`,
        "--ch": `${cardHeight}px`,
        "--overflow": `${overflowTop}px`,
      

      }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >


      {n > 1 && (
        <div className="msv2-nav">
          {/* Progress segments */}
          <div className="msv2-segments">
            {panels.map((_, i) => (
              <button
                key={i}
                className={`msv2-seg${i === index ? " msv2-seg--active" : ""}${i < index ? " msv2-seg--past" : ""}`}
                onClick={() => goTo(i, i > index ? "left" : "right")}
                aria-label={`Go to slide ${i + 1}`}
              >
                {i === index && (
                  <span
                    className="msv2-seg-fill"
                    style={{ width: `${progress}%` }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Counter + arrows */}
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




      <div className="msv2-panel">

        {/* ── Inner card (overflow:hidden) ── */}
        <div
          className={`msv2-card msv2-phase-${phase}`}
          style={{ height: cardHeight }}
        >
          {/* Background */}
          {bgImg
            ? <img src={bgImg} alt="" className="msv2-bg" draggable={false} />
            : <div className="msv2-bg-fallback" style={{ background: sc.bgColor || "#050d1a" }} />
          }
          <div className="msv2-bg-fallback msv2-bg-fallback--base" />

          {/* Overlays */}
          <div className="msv2-ov-base" />
          <div className="msv2-ov-left" />
          <div className="msv2-scanlines" />

          {/* Diagonal slash accent */}
          <div className="msv2-slash" />

          {/* Char glow bloom */}
          <div className="msv2-char-glow" />

          {/* Content */}
          <div className="msv2-content">

            {/* Vertical eyebrow */}
            {slide.title_highlight && (
              <div className="msv2-eyebrow-wrap">
                <span className="msv2-eyebrow">{slide.title_highlight}</span>
              </div>
            )}

            <div className="msv2-text-block">
              {/* Badge */}
              {slide.badge_text && (
                <div className="msv2-badge">
                  <span className="msv2-badge-pip" />
                  <span className="msv2-badge-text">{slide.badge_text}</span>
                </div>
              )}

              {/* Title */}
              {slide.title && (
                <h3 className="msv2-title">{slide.title}</h3>
              )}

              {/* Subtitle */}
              {slide.subtitle && (
                <p className="msv2-sub">{slide.subtitle}</p>
              )}

              {/* CTA — same neon underline as desktop */}
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

          {/* Podium line */}
          <div className="msv2-podium" />
        </div>

        {/* ── CHARACTER — sibling, not inside card ── */}
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
