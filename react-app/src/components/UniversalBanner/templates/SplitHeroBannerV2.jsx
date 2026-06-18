// react-app/src/components/UniversalBanner/templates/SplitHeroBannerV2.jsx

import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./SplitHeroBannerV2.css";
import { loadBannerFont, BANNER_FONTS } from '../../../utils/loadBannerFont';

export default function SplitHeroBannerV2({ banner, slides, config, onSlideClick }) {
  useEffect(() => { loadBannerFont(BANNER_FONTS.SplitHeroBannerV2); }, []);
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState("idle"); // "idle" | "exit" | "enter"
  const [prevIdx, setPrevIdx] = useState(null);
  const timerRef = useRef(null);
  const progressRef = useRef(null);
  const TRANSITION_MS = 420;

  const {
    autoPlay = true,
    interval = 7000,
    showIndicators = true,
    showArrows = true,
    accentColor = "#08a3f7ff",
    leftBg = "#06101e",
    splitRatio = 48,
    overlayOpacity = 0.42,
  } = config || {};

  const total = slides?.length || 0;
  const current = slides?.[index] || {};

  let slideExtra = {};
  try { slideExtra = current.config ? JSON.parse(current.config) : {}; } catch (_) { }
  const accent = slideExtra.accentColor || accentColor;

  // ── Transition ────────────────────────────────────────────
  const goTo = useCallback((nextIdx, restartTimer = false) => {
    if (nextIdx === index || phase !== "idle") return;
    clearInterval(timerRef.current);
    setPrevIdx(index);
    setPhase("exit");
    setTimeout(() => {
      setIndex(nextIdx);
      setPhase("enter");
      setTimeout(() => {
        setPhase("idle");
        setPrevIdx(null);
        if (restartTimer && autoPlay) startAuto();
      }, TRANSITION_MS);
    }, TRANSITION_MS);
  }, [index, phase, autoPlay]); // eslint-disable-line

  const startAuto = useCallback(() => {
    if (!autoPlay || total <= 1) return;
    // Reset progress bar
    if (progressRef.current) {
      progressRef.current.style.transition = "none";
      progressRef.current.style.width = "0%";
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (progressRef.current) {
            progressRef.current.style.transition = `width ${interval}ms linear`;
            progressRef.current.style.width = "100%";
          }
        });
      });
    }
    timerRef.current = setInterval(() => {
      setIndex(p => {
        const next = (p + 1) % total;
        setPrevIdx(p);
        setPhase("exit");
        setTimeout(() => {
          setPhase("enter");
          setTimeout(() => { setPhase("idle"); setPrevIdx(null); }, TRANSITION_MS);
        }, TRANSITION_MS);
        return next;
      });
    }, interval);
  }, [autoPlay, interval, total]);

  useEffect(() => {
    startAuto();
    return () => clearInterval(timerRef.current);
  }, [startAuto]);

  const prev = () => goTo((index - 1 + total) % total, true);
  const next = () => goTo((index + 1) % total, true);

  const handleCta = useCallback((e) => {
    e.stopPropagation();
    if (!current.cta_link) return;
    onSlideClick?.(current.cta_link);
    current.cta_link.startsWith("http")
      ? window.open(current.cta_link, "_blank", "noopener")
      : navigate(current.cta_link);
  }, [current, navigate, onSlideClick]);

  if (!slides || total === 0) return null;

  return (
    <div className="sh2-wrap SplitHeroBannerV2" style={{ "--accent": accent }}>

      {/* Logo watermark */}
      {current.logo_url && (
        <img src={current.logo_url} alt="" className="sh2-logo" draggable={false} />
      )}

      {/* ── FULL-BLEED background image ── */}
      <div className={`sh2-scene sh2-scene-${phase}`}>
        {current.background_image_url && (
          <img
            src={current.background_image_url}
            alt=""
            className="sh2-bg-img"
            draggable={false}
          />
        )}
        {/* cinematic vignette */}
        <div className="sh2-vignette" />
        {/* subtle accent colour wash */}
        <div
          className="sh2-color-wash"
          style={{ background: `radial-gradient(ellipse at 70% 50%, ${accent}18 0%, transparent 65%)` }}
        />
      </div>

      {/* ── GLASS LEFT PANEL ── */}
      <div className="sh2-glass-panel" style={{ width: `${splitRatio}%` }}>
        {/* frosted inner */}
        <div className="sh2-glass-inner" />

        {/* vertical accent rail */}
        <div className="sh2-rail" style={{ background: accent }} />

        {/* Slide counter — big typographic number */}
        <div className="sh2-counter" style={{ color: accent }}>
          <span className="sh2-counter-cur">{String(index + 1).padStart(2, "0")}</span>
          <span className="sh2-counter-sep" />
          <span className="sh2-counter-tot">{String(total).padStart(2, "0")}</span>
        </div>

        {/* Content */}
        <div className={`sh2-content sh2-content-${phase}`}>
          {current.badge_text && (
            <div className="sh2-badge-wrap">
              <span className="sh2-badge-line" style={{ background: accent }} />
              <span className="sh2-badge">{current.badge_text}</span>
            </div>
          )}

          {current.title_highlight && (
            <p className="sh2-eyebrow">{current.title_highlight}</p>
          )}

          {current.title && (
            <h2 className="sh2-title">{current.title}</h2>
          )}

          {current.subtitle && (
            <p className="sh2-subtitle">{current.subtitle}</p>
          )}

          {current.cta_text && current.cta_link && (
            <button className="sh2-cta" onClick={handleCta}>
              {/* underline-expand style */}
              <span className="sh2-cta-text">{current.cta_text}</span>
              <span className="sh2-cta-arrow" style={{ color: accent }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </span>
              <span className="sh2-cta-underline" style={{ background: accent }} />
            </button>
          )}
        </div>


      </div>

      {/* ── BOTTOM CONTROLS ── */}
      <div className="sh2-controls">

        {/* Segmented progress bar */}
        {showIndicators && total > 1 && (
          <div className="sh2-segments">
            {slides.map((_, i) => (
              <button
                key={i}
                className={`sh2-segment ${i === index ? "sh2-segment-active" : i < index ? "sh2-segment-past" : ""}`}
                onClick={() => goTo(i, true)}
                aria-label={`Go to slide ${i + 1}`}
                style={{ "--accent": accent }}
              >
                <span className="sh2-seg-track">
                  {i === index && autoPlay && (
                    <span className="sh2-seg-fill" ref={progressRef} style={{ background: accent }} />
                  )}
                  {i !== index && (
                    <span
                      className="sh2-seg-static"
                      style={{ background: i < index ? accent : "rgba(255,255,255,0.2)" }}
                    />
                  )}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Arrow controls */}
        {showArrows && total > 1 && (
          <div className="sh2-arrows">
            <button className="sh2-arrow" onClick={prev} aria-label="Previous">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button className="sh2-arrow" onClick={next} aria-label="Next">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
