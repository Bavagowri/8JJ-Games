// react-app/src/components/UniversalBanner/templates/HeroBannerV2.jsx

import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./HeroBannerV2.css";
import { loadBannerFont, BANNER_FONTS } from '../../../utils/loadBannerFont';

export default function HeroBannerV2({ slides, config, onSlideClick }) {
  useEffect(() => { loadBannerFont(BANNER_FONTS.HeroBannerV2); }, []);
  const navigate                      = useNavigate();
  const [index, setIndex]             = useState(0);
  const [isTransitioning, setTransit] = useState(false);
  const [direction, setDirection]     = useState("next");
  const [prevIndex, setPrevIndex]     = useState(null);
  const touchStartX                   = useRef(null);
  const touchStartY                   = useRef(null);
  const timerRef                      = useRef(null);
  const progressRef                   = useRef(null);
  const TRANS                         = 650;

  const {
    autoPlay       = true,
    interval       = 6500,
    showArrows     = true,
    showIndicators = true,
  } = config || {};

  const totalSlides = slides?.length || 0;
  const current     = slides?.[index];

  // ── Parse per-slide config ──────────────────────────────
  const getSlideConfig = (s) => {
    try {
      return s?.config
        ? (typeof s.config === "string" ? JSON.parse(s.config) : s.config)
        : {};
    } catch (_) { return {}; }
  };

  // ── Data helpers (dual field-name support) ───────────────
  const getBg     = (s) => s?.background_image_url || s?.background;
  const getBadge  = (s) => s?.badge_text  || s?.badge;
  const getCta    = (s) => s?.cta_text    || s?.cta;
  const getLink   = (s) => s?.cta_link    || s?.link;
  const getLogo   = (s) => s?.logo_url    || s?.logo;
  const getAccent = (s) => getSlideConfig(s)?.accentColor || "#00e5ff";

  // ── Timer ────────────────────────────────────────────────
  const stopTimer = useCallback(() => clearInterval(timerRef.current), []);

  const startTimer = useCallback(() => {
    if (!autoPlay || totalSlides <= 1) return;
    if (progressRef.current) {
      progressRef.current.style.transition = "none";
      progressRef.current.style.width = "0%";
      requestAnimationFrame(() => requestAnimationFrame(() => {
        if (progressRef.current) {
          progressRef.current.style.transition = `width ${interval}ms linear`;
          progressRef.current.style.width = "100%";
        }
      }));
    }
    timerRef.current = setInterval(() => {
      setDirection("next");
      setIndex(p => { setPrevIndex(p); return (p + 1) % totalSlides; });
    }, interval);
  }, [autoPlay, interval, totalSlides]);

  const resetTimer = useCallback(() => { stopTimer(); startTimer(); }, [stopTimer, startTimer]);
  useEffect(() => { startTimer(); return stopTimer; }, [startTimer, stopTimer]);

  // ── Navigation ───────────────────────────────────────────
  const goTo = useCallback((idx, dir = "next") => {
    if (isTransitioning || idx === index) return;
    setTransit(true);
    setDirection(dir);
    setPrevIndex(index);
    setIndex(idx);
    resetTimer();
    setTimeout(() => { setTransit(false); setPrevIndex(null); }, TRANS);
  }, [index, isTransitioning, resetTimer]);

  const nextSlide = useCallback(() => goTo((index + 1) % totalSlides, "next"), [goTo, index, totalSlides]);
  const prevSlide = useCallback(() => goTo((index - 1 + totalSlides) % totalSlides, "prev"), [goTo, index, totalSlides]);

  // ── Touch ────────────────────────────────────────────────
  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };
  const onTouchEnd = (e) => {
    if (!touchStartX.current) return;
    const dx = touchStartX.current - e.changedTouches[0].clientX;
    const dy = Math.abs(touchStartY.current - e.changedTouches[0].clientY);
    touchStartX.current = null;
    if (Math.abs(dx) < 50 || dy > 80) return;
    dx > 0 ? nextSlide() : prevSlide();
    resetTimer();
  };

  // ── Keyboard ─────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft")  { prevSlide(); resetTimer(); }
      if (e.key === "ArrowRight") { nextSlide(); resetTimer(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [nextSlide, prevSlide, resetTimer]);

  // ── CTA click ────────────────────────────────────────────
  const handleCta = useCallback((e) => {
    e.stopPropagation();
    const link = getLink(current);
    if (!link) return;
    onSlideClick?.(current.id || link);
    link.startsWith("http")
      ? window.open(link, "_blank", "noopener,noreferrer")
      : navigate(link);
  }, [current, navigate, onSlideClick]);

  if (!slides || totalSlides === 0) return null;

  // Render title with optional highlighted word
  const renderTitle = (slide) => {
    const hl = slide?.title_highlight;
    const t  = slide?.title;
    if (!t) return null;
    if (!hl) return <>{t}</>;
    const pos = t.indexOf(hl);
    if (pos === -1) return <>{t}</>;
    return (
      <>
        {t.slice(0, pos)}
        <em className="hb2-title-hl">{hl}</em>
        {t.slice(pos + hl.length)}
      </>
    );
  };

  const accent = getAccent(current);

  return (
    <div
      className="hb2-wrap HeroBannerV2"
      style={{ "--accent": accent }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      role="region"
      aria-label="Hero Banner"
    >

      {/* ══════════════════════════════
          SLIDE BACKGROUNDS
      ══════════════════════════════ */}
      <div className="hb2-slides">
        {slides.map((slide, i) => {
          const sc        = getSlideConfig(slide);
          const sa        = sc.accentColor || "#00e5ff";
          const isActive  = i === index;
          const isExiting = i === prevIndex;
          let cls = "hb2-slide hb2-slide--hidden";
          if (isActive)  cls = "hb2-slide hb2-slide--active";
          if (isExiting) cls = `hb2-slide hb2-slide--exit-${direction}`;

          return (
            <div key={slide.id || i} className={cls} style={{ "--sa": sa }}>
              {/* Solid colour fallback behind image */}
              <div className="hb2-bg-fallback"
                style={{ background: sc.bgColor || sc.backgroundColor || "#04070d" }} />

              {/* Background — proper <img> tag, never inline backgroundImage */}
              {getBg(slide) && (
                <img
                  src={getBg(slide)}
                  alt=""
                  className="hb2-bg-img"
                  loading={i === 0 ? "eager" : "lazy"}
                  draggable={false}
                />
              )}

              {/* Left text-safe overlay — stops at ~55%, image breathes on right */}
              <div className="hb2-ov-left" />
              {/* Top/bottom edge darkening */}
              <div className="hb2-ov-edges" />
              {/* Diagonal accent beam */}
              <div className="hb2-ov-beam" />
              {/* CRT scanlines */}
              <div className="hb2-scanlines" />
              {/* Dot-grid texture — image side only */}
              <div className="hb2-dot-grid" />

              {/* HUD corner brackets — lit in slide accent colour */}
              <div className="hb2-corner hb2-corner--tl" />
              <div className="hb2-corner hb2-corner--tr" />
              <div className="hb2-corner hb2-corner--br" />
            </div>
          );
        })}
      </div>

      {/* ══════════════════════════════
          CONTENT LAYER
          Independent animation timeline
      ══════════════════════════════ */}
      <div
        className={`hb2-content${isTransitioning ? " hb2-content--out" : " hb2-content--in"}`}
      >
        {/* HUD counter — top right */}
        {totalSlides > 1 && (
          <div className="hb2-counter" aria-hidden="true">
            <span className="hb2-counter-cur">{String(index + 1).padStart(2, "0")}</span>
            <span className="hb2-counter-sep">/</span>
            <span className="hb2-counter-tot">{String(totalSlides).padStart(2, "0")}</span>
          </div>
        )}

        {/* Badge */}
        {getBadge(current) && (
          <div className="hb2-badge">
            <span className="hb2-badge-dot" />
            <span className="hb2-badge-text">{getBadge(current)}</span>
          </div>
        )}

        {/* Eyebrow */}
        {current?.eyebrow && (
          <p className="hb2-eyebrow">
            <span className="hb2-eyebrow-rule" />
            {current.eyebrow}
          </p>
        )}

        {/* MEGA title */}
        {current?.title && (
          <h2 className="hb2-title">{renderTitle(current)}</h2>
        )}

        {/* Divider + subtitle */}
        {current?.subtitle && (
          <>
            <div className="hb2-divider">
              <span className="hb2-divider-dot" />
              <span className="hb2-divider-line" />
            </div>
            <p className="hb2-subtitle">{current.subtitle}</p>
          </>
        )}

        {/* CTA — accent-coloured clip-path split button, loop shimmer */}
        {getCta(current) && getLink(current) && (
          <div className="hb2-cta-wrap">
            <span className="hb2-cta-glow" aria-hidden="true" />
            <button className="hb2-cta" onClick={handleCta}>
              <span className="hb2-cta-shimmer" aria-hidden="true" />
              <span className="hb2-cta-label">{getCta(current)}</span>
              <span className="hb2-cta-icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5"
                  strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </span>
            </button>
          </div>
        )}

        {/* Logo */}
        {getLogo(current) && (
          <img
            src={getLogo(current)}
            alt="Logo"
            className="hb2-logo"
            draggable={false}
          />
        )}
      </div>

      {/* ══════════════════════════════
          BOTTOM BAR
      ══════════════════════════════ */}
      <div className="hb2-bottom-bar">
        {autoPlay && totalSlides > 1 && (
          <div className="hb2-progress-track">
            <div className="hb2-progress-fill" ref={progressRef} />
          </div>
        )}

        <div className="hb2-bar-inner">
          {showIndicators && totalSlides > 1 && (
            <div className="hb2-thumbs">
              {slides.map((slide, i) => (
                <button
                  key={slide.id || i}
                  className={`hb2-thumb${i === index ? " hb2-thumb--on" : ""}`}
                  onClick={() => goTo(i, i > index ? "next" : "prev")}
                  aria-label={`Slide ${i + 1}`}
                >
                  {getBg(slide)
                    ? <img src={getBg(slide)} alt="" className="hb2-thumb-img" draggable={false} />
                    : <div className="hb2-thumb-fallback"
                        style={{ background: getSlideConfig(slide).bgColor || "#060a14" }} />
                  }
                  <div className="hb2-thumb-dim" />
                  {i === index && <span className="hb2-thumb-bar" />}
                </button>
              ))}
            </div>
          )}

          {showArrows && totalSlides > 1 && (
            <div className="hb2-arrows">
              <button className="hb2-arrow"
                onClick={() => { prevSlide(); resetTimer(); }}
                aria-label="Previous slide">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 18l-6-6 6-6"/>
                </svg>
              </button>
              <button className="hb2-arrow"
                onClick={() => { nextSlide(); resetTimer(); }}
                aria-label="Next slide">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
