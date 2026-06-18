// react-app/src/components/UniversalBanner/templates/mobile/MobileAnnouncementBarV2.jsx

import { useState, useEffect, useCallback } from "react";
import "./MobileAnnouncementBarV2.css";

const SK = "mab2_dismissed";

export default function MobileAnnouncementBarV2({ banner, slides, config, onSlideClick }) {
  const [dismissed, setDismissed] = useState(false);
  const [visible,   setVisible]   = useState(false);

  const {
    accentColor  = "#ffd700",
    barBg        = "#0a0f1a",
    scrollSpeed  = "20s",
    storageKey   = SK,
    showDismiss  = true,
  } = config || {};

  const mainSlide = slides?.[0] || {};

  // Build ticker content from all slides
  const items = (slides || []).flatMap((s) => {
    const parts = [];
    if (s.badge_text) parts.push(s.badge_text);
    if (s.title)      parts.push(s.title);
    return parts.length ? [parts.join(": ")] : [];
  });
  const ticker = [...items, ...items, ...items];

  useEffect(() => {
    const isDismissed = sessionStorage.getItem(storageKey) === "1";
    setDismissed(isDismissed);
    if (!isDismissed) setTimeout(() => setVisible(true), 100);
  }, [storageKey]);

  const handleDismiss = useCallback(() => {
    setVisible(false);
    setTimeout(() => {
      sessionStorage.setItem(storageKey, "1");
      setDismissed(true);
    }, 280);
  }, [storageKey]);

  const handleCta = useCallback((e) => {
    e.stopPropagation();
    if (!mainSlide.cta_link) return;
    onSlideClick?.(mainSlide.cta_link);
  }, [mainSlide, onSlideClick]);

  if (!slides || slides.length === 0 || dismissed) return null;

  return (
    <div
      className={`mab2-bar MobileAnnouncementBarV2 ${visible ? "mab2-in" : ""}`}
      style={{ background: barBg, borderColor: `${accentColor}30` }}
    >
      {/* Accent dot */}
      <div className="mab2-dot" style={{ background: accentColor }} />

      {/* Scrolling ticker */}
      <div className="mab2-ticker-wrap">
        <div className="mab2-ticker" style={{ animationDuration: scrollSpeed }}>
          {ticker.map((text, i) => (
            <span key={i} className="mab2-ticker-item">
              <span className="mab2-sep" style={{ color: accentColor }}>★</span>
              <span className="mab2-ticker-text">{text}</span>
            </span>
          ))}
        </div>
      </div>

      {/* CTA */}
      {mainSlide.cta_text && mainSlide.cta_link && (
        <button
          className="mab2-cta"
          onClick={handleCta}
          style={{ color: accentColor, borderColor: `${accentColor}50` }}
        >
          {mainSlide.cta_text}
        </button>
      )}

      {/* Dismiss */}
      {showDismiss && (
        <button className="mab2-close" onClick={handleDismiss} aria-label="Dismiss" style={{ color: `rgba(255,255,255,.5)` }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      )}
    </div>
  );
}