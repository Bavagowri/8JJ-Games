// react-app/src/components/UniversalBanner/templates/FloatingAnnouncementV2.jsx

import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./FloatingAnnouncementV2.css";

const STORAGE_KEY = "fa2_dismissed";

export default function FloatingAnnouncementV2({ banner, slides, config, onSlideClick }) {
  const navigate = useNavigate();
  const [expanded,  setExpanded]  = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [mounted,   setMounted]   = useState(false);

  const {
    position        = "bottom-right",
    accentColor     = "#ff6b35",
    pillLabel       = "New Offer",
    collapseAfterMs = 0,
    storageKey      = STORAGE_KEY,
  } = config || {};

  const slide = slides?.[0] || {};

  let sc = {};
  try { sc = slide.config ? (typeof slide.config === "string" ? JSON.parse(slide.config) : slide.config) : {}; } catch(_) {}
  const accent = sc.accentColor || accentColor;

  // Check if dismissed this session
  useEffect(() => {
    const isDismissed = sessionStorage.getItem(storageKey) === "1";
    setDismissed(isDismissed);
    // Animate in after a brief delay
    const t = setTimeout(() => setMounted(true), 600);
    return () => clearTimeout(t);
  }, [storageKey]);

  // Auto-collapse
  useEffect(() => {
    if (!expanded || !collapseAfterMs) return;
    const t = setTimeout(() => setExpanded(false), collapseAfterMs);
    return () => clearTimeout(t);
  }, [expanded, collapseAfterMs]);

  const handleDismiss = useCallback((e) => {
    e.stopPropagation();
    sessionStorage.setItem(storageKey, "1");
    setDismissed(true);
  }, [storageKey]);

  const handleCta = useCallback((e) => {
    e.stopPropagation();
    if (!slide.cta_link) return;
    onSlideClick?.(slide.cta_link);
    slide.cta_link.startsWith("http")
      ? window.open(slide.cta_link, "_blank", "noopener")
      : navigate(slide.cta_link);
  }, [slide, navigate, onSlideClick]);

  if (!slides || slides.length === 0 || dismissed) return null;

  const posClass = position === "bottom-left" ? "fa2-left" : "fa2-right";

  return (
    <div
      className={`fa2-float FloatingAnnouncementV2 ${posClass} ${mounted ? "fa2-visible" : ""} ${expanded ? "fa2-expanded" : ""}`}
      style={{ "--fa2-accent": accent }}
    >
      {/* ── COLLAPSED PILL ── */}
      {!expanded && (
        <button
          className="fa2-pill"
          onClick={() => setExpanded(true)}
          style={{ background: accent, color: "#000" }}
        >
          {/* Pulse ring */}
          <span className="fa2-pulse-ring" style={{ borderColor: accent }} />
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          <span className="fa2-pill-label">{slide.badge_text || pillLabel}</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>
      )}

      {/* ── EXPANDED CARD ── */}
      {expanded && (
        <div className="fa2-card">
          {/* Card background image */}
          {slide.background_image_url && (
            <img src={slide.background_image_url} alt="" className="fa2-card-bg" draggable={false} />
          )}
          <div className="fa2-card-overlay" />

          {/* Accent top bar */}
          <div className="fa2-card-topbar" style={{ background: accent }} />

          {/* Dismiss */}
          <button className="fa2-dismiss" onClick={handleDismiss} aria-label="Close">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>

          {/* Collapse toggle */}
          <button className="fa2-collapse" onClick={() => setExpanded(false)} aria-label="Minimise">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 9l-7 7-7-7"/>
            </svg>
          </button>

          <div className="fa2-card-body">
            {slide.badge_text && (
              <span className="fa2-card-badge" style={{ background: accent, color: "#000" }}>
                {slide.badge_text}
              </span>
            )}
            {slide.title_highlight && (
              <p className="fa2-card-eyebrow" style={{ color: accent }}>{slide.title_highlight}</p>
            )}
            {slide.title && <h3 className="fa2-card-title">{slide.title}</h3>}
            {slide.subtitle && <p className="fa2-card-sub">{slide.subtitle}</p>}

            {slide.cta_text && slide.cta_link && (
              <button
                className="fa2-card-cta"
                onClick={handleCta}
                style={{ background: accent, color: "#000" }}
              >
                {slide.cta_text}
              </button>
            )}
          </div>

          {/* Character image */}
          {slide.logo_url && (
            <img src={slide.logo_url} alt="" className="fa2-card-char" draggable={false} />
          )}
        </div>
      )}
    </div>
  );
}