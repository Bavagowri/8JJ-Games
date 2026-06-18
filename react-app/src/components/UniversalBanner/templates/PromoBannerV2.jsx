// react-app/src/components/UniversalBanner/templates/PromoBannerV2.jsx
import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./PromoBannerV2.css";

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

export default function PromoBannerV2({ banner, slides, config, onSlideClick }) {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState("idle"); // idle | exit | enter
  const [dir, setDir] = useState(1);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef(null);
  const rafRef = useRef(null);
  const startRef = useRef(null);

  const {
    autoPlay       = true,
    interval       = 6000,
    accentColor    = "#00e5ff",
  } = config || {};

  const total = slides?.length || 0;
  const current = slides?.[index] || {};
  const accent  = getAccent(current) || accentColor;

  // Progress animation
  const animateProgress = useCallback(() => {
    startRef.current = performance.now();
    const tick = (now) => {
      const elapsed = now - startRef.current;
      const pct = Math.min((elapsed / interval) * 100, 100);
      setProgress(pct);
      if (pct < 100) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [interval]);

  const goTo = useCallback((nextIdx, direction = 1) => {
    if (phase !== "idle" || nextIdx === index) return;
    cancelAnimationFrame(rafRef.current);
    clearTimeout(timerRef.current);
    setDir(direction);
    setPhase("exit");
    setTimeout(() => {
      setIndex(nextIdx);
      setProgress(0);
      setPhase("enter");
      setTimeout(() => {
        setPhase("idle");
        if (autoPlay && total > 1) animateProgress();
      }, 420);
    }, 320);
  }, [phase, index, autoPlay, total, animateProgress]);

  const goNext = useCallback(() => goTo((index + 1) % total, 1),  [goTo, index, total]);
  const goPrev = useCallback(() => goTo((index - 1 + total) % total, -1), [goTo, index, total]);

  // Auto-play
  useEffect(() => {
    if (!autoPlay || total <= 1) return;
    setProgress(0);
    animateProgress();
    timerRef.current = setInterval(goNext, interval);
    return () => {
      clearInterval(timerRef.current);
      cancelAnimationFrame(rafRef.current);
    };
  }, [index, autoPlay, interval, total]); // eslint-disable-line

  const handleCta = useCallback((e) => {
    e.stopPropagation();
    if (!current.cta_link) return;
    onSlideClick?.(current.cta_link);
    current.cta_link.startsWith("http")
      ? window.open(current.cta_link, "_blank", "noopener")
      : navigate(current.cta_link);
  }, [current, navigate, onSlideClick]);

  if (!slides || total === 0) return null;

  const bgUrl = getBg(current);

  return (
    <div
      className="pb2-wrap PromoBannerV2"
      style={{ "--accent": accent }}
    >
      {/* Top progress rail */}
      <div className="pb2-rail">
        <div className="pb2-rail-fill" style={{ width: total > 1 ? `${progress}%` : "100%" }} />
      </div>

      {/* Slide counter — top right */}
      <div className="pb2-counter">
        <span className="pb2-counter-cur">{String(index + 1).padStart(2, "0")}</span>
        <span className="pb2-counter-sep"> / </span>
        <span className="pb2-counter-tot">{String(total).padStart(2, "0")}</span>
      </div>

      {/* Media layer */}
      <div className={`pb2-media pb2-media--${phase} pb2-media--dir${dir > 0 ? "r" : "l"}`}>
        {bgUrl ? (
          <img key={bgUrl} src={bgUrl} alt="" className="pb2-bg-img" draggable={false} />
        ) : (
          <div className="pb2-bg-empty" />
        )}
        {/* Atmospheric overlay — heavy bottom, moderate left, clear top-right */}
        <div className="pb2-overlay" />
        {/* Radial glow behind console */}
        <div className="pb2-console-glow" />
      </div>

      {/* Side arrows */}
      {total > 1 && (
        <>
          <button className="pb2-arrow pb2-arrow--left" onClick={goPrev} aria-label="Previous">
            <div className="pb2-arrow-inner">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </div>
          </button>
          <button className="pb2-arrow pb2-arrow--right" onClick={goNext} aria-label="Next">
            <div className="pb2-arrow-inner">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </div>
          </button>
        </>
      )}

      {/* Character image — right side bleeds above console */}
      {current.logo_url && (
        <img
          key={current.logo_url}
          src={current.logo_url}
          alt=""
          className={`pb2-character pb2-character--${phase}`}
          draggable={false}
        />
      )}

      {/* Floating console — bottom center */}
      <div className={`pb2-console pb2-console--${phase} pb2-console--dir${dir > 0 ? "r" : "l"}`}>
        {/* Console scan lines texture */}
        <div className="pb2-scanlines" />

        {/* Console top edge accent */}
        <div className="pb2-console-edge" />

        {/* Corner brackets */}
        <div className="pb2-bracket pb2-bracket--tl" />
        <div className="pb2-bracket pb2-bracket--tr" />

        {/* Badge — floats above content */}
        {current.badge_text && (
          <div className="pb2-badge-wrap">
            <span className="pb2-badge-pip" />
            <span className="pb2-badge">{current.badge_text}</span>
          </div>
        )}

        {/* Eyebrow */}
        {current.title_highlight && (
          <p className="pb2-eyebrow">{current.title_highlight}</p>
        )}

        {/* Title — centered, large */}
        {current.title && (
          <h2 className="pb2-title">{current.title}</h2>
        )}

        {/* Subtitle */}
        {current.subtitle && (
          <p className="pb2-subtitle">{current.subtitle}</p>
        )}

        {/* CTA — 3D arcade press button */}
        {current.cta_text && current.cta_link && (
          <div className="pb2-cta-wrap">
            <button className="pb2-cta" onClick={handleCta}>
              <span className="pb2-cta-face">
                <span className="pb2-cta-label">{current.cta_text}</span>
                <svg className="pb2-cta-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </span>
              <span className="pb2-cta-edge" />
            </button>
            {/* Pulsing ring around button */}
            <div className="pb2-cta-ring" />
          </div>
        )}

        {/* Dot indicators inside console */}
        {total > 1 && (
          <div className="pb2-dots">
            {slides.map((_, i) => (
              <button
                key={i}
                className={`pb2-dot ${i === index ? "pb2-dot--active" : ""}`}
                onClick={() => goTo(i, i > index ? 1 : -1)}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}