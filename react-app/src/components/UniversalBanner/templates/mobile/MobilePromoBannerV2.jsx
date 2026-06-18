// react-app/src/components/UniversalBanner/templates/mobile/MobilePromoBannerV2.jsx

import { useState, useEffect, useCallback, useRef } from "react";
import "./MobilePromoBannerV2.css";
import { loadBannerFont, BANNER_FONTS } from '../../../../utils/loadBannerFont';

function getBg(s) {
  return s?.background_image_url || s?.background || null;
}

function getAccent(s) {
  try {
    const sc = s?.config
      ? typeof s.config === "string" ? JSON.parse(s.config) : s.config
      : {};
    return sc.accentColor || null;
  } catch (_) { return null; }
}

export default function MobilePromoBannerV2({ banner, slides, config, onSlideClick }) {
  useEffect(() => { loadBannerFont(BANNER_FONTS.MobilePromoBannerV2); }, []);
  const [index, setIndex]   = useState(0);
  const [phase, setPhase]   = useState("idle"); // idle | exit | enter
  const [progress, setProgress] = useState(0);
  const timerRef  = useRef(null);
  const rafRef    = useRef(null);
  const startRef  = useRef(null);
  const touchRef  = useRef({ x: 0, y: 0, active: false });
  const wrapRef   = useRef(null);

  const {
    autoPlay   = true,
    interval   = 5000,
    accentColor = "#00e5ff",
  } = config || {};

  const total   = slides?.length || 0;
  const current = slides?.[index] || {};
  const accent  = getAccent(current) || accentColor;

  /* ── Progress RAF ── */
  const animateProgress = useCallback(() => {
    startRef.current = performance.now();
    const tick = (now) => {
      const pct = Math.min(((now - startRef.current) / interval) * 100, 100);
      setProgress(pct);
      if (pct < 100) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [interval]);

  /* ── Navigate ── */
  const goTo = useCallback((nextIdx) => {
    if (phase !== "idle" || nextIdx === index) return;
    cancelAnimationFrame(rafRef.current);
    clearInterval(timerRef.current);
    setPhase("exit");
    setTimeout(() => {
      setIndex(nextIdx);
      setProgress(0);
      setPhase("enter");
      setTimeout(() => {
        setPhase("idle");
        if (autoPlay && total > 1) animateProgress();
      }, 380);
    }, 280);
  }, [phase, index, autoPlay, total, animateProgress]);

  const goNext = useCallback(() => goTo((index + 1) % total), [goTo, index, total]);
  const goPrev = useCallback(() => goTo((index - 1 + total) % total), [goTo, index, total]);

  /* ── Auto-play ── */
  useEffect(() => {
    if (!autoPlay || total <= 1) return;
    setProgress(0);
    animateProgress();
    timerRef.current = setInterval(goNext, interval);
    return () => { clearInterval(timerRef.current); cancelAnimationFrame(rafRef.current); };
  }, [index, autoPlay, interval, total]); // eslint-disable-line

  /* ── Swipe ── */
  const onTouchStart = (e) => {
    touchRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY, active: true };
  };
  const onTouchEnd = (e) => {
    if (!touchRef.current.active) return;
    const dx = e.changedTouches[0].clientX - touchRef.current.x;
    const dy = Math.abs(e.changedTouches[0].clientY - touchRef.current.y);
    touchRef.current.active = false;
    if (Math.abs(dx) > 44 && dy < 60) {
      dx < 0 ? goNext() : goPrev();
    }
  };

  /* ── Tap feedback ── */
  const onTouchStartCard = () => wrapRef.current?.classList.add("mpb2-tap");
  const onTouchEndCard   = () => wrapRef.current?.classList.remove("mpb2-tap");

  const handleCta = useCallback((e) => {
    e.stopPropagation();
    if (!current.cta_link) return;
    onSlideClick?.(current.cta_link);
  }, [current, onSlideClick]);

  if (!slides || total === 0) return null;

  const bgUrl = getBg(current);

  return (
    <div
      className="mpb2-wrap MobilePromoBannerV2"
      ref={wrapRef}
      style={{ "--accent": accent }}
      onTouchStart={onTouchStartCard}
      onTouchEnd={onTouchEndCard}
    >
      {/* Progress rail — top */}
      <div className="mpb2-rail">
        <div className="mpb2-rail-fill" style={{ width: total > 1 ? `${progress}%` : "100%" }} />
      </div>

      {/* Slide counter — top right */}
      <div className="mpb2-counter">
        <span className="mpb2-counter-cur">{String(index + 1).padStart(2, "0")}</span>
        <span className="mpb2-counter-sep"> / </span>
        <span className="mpb2-counter-tot">{String(total).padStart(2, "0")}</span>
      </div>

      {/* Media */}
      <div
        className={`mpb2-media mpb2-media--${phase}`}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {bgUrl ? (
          <img key={bgUrl} src={bgUrl} alt="" className="mpb2-bg-img" draggable={false} />
        ) : (
          <div className="mpb2-bg-empty" />
        )}
        <div className="mpb2-overlayz" />
        {/* Ambient glow behind console */}
        <div className="mpb2-console-glow" />
      </div>

      {/* Character — sits above console, right-aligned */}
      {current.logo_url && (
        <img
          key={current.logo_url}
          src={current.logo_url}
          alt=""
          className={`mpb2-character mpb2-character--${phase}`}
          draggable={false}
        />
      )}

      {/* Floating console — bottom center */}
      <div className={`mpb2-console mpb2-console--${phase}`}>
        {/* Console scan lines */}
        <div className="mpb2-scanlines" />
        {/* Top edge glow */}
        <div className="mpb2-console-edge" />
        {/* Corner brackets */}
        <div className="mpb2-bracket mpb2-bracket--tl" />
        <div className="mpb2-bracket mpb2-bracket--tr" />

        {/* Badge */}
        {current.badge_text && (
          <div className="mpb2-badge-row">
            <span className="mpb2-badge-pip" />
            <span className="mpb2-badge">{current.badge_text}</span>
          </div>
        )}

        {/* Eyebrow */}
        {current.title_highlight && (
          <p className="mpb2-eyebrowz">{current.title_highlight}</p>
        )}

        {/* Title */}
        {current.title && (
          <h2 className="mpb2-title">{current.title}</h2>
        )}

        {/* Subtitle */}
        {current.subtitle && (
          <p className="mpb2-subtitle">{current.subtitle}</p>
        )}

        {/* CTA — glowing gradient bar, always expanded on mobile */}
        {current.cta_text && current.cta_link && (
          <button className="mpb2-cta" onClick={handleCta}>
            <span className="mpb2-cta-label">{current.cta_text}</span>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        )}

        {/* Dot indicators */}
        {total > 1 && (
          <div className="mpb2-dots">
            {slides.map((_, i) => (
              <button
                key={i}
                className={`mpb2-dot ${i === index ? "mpb2-dot--active" : ""}`}
                onClick={() => goTo(i)}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
