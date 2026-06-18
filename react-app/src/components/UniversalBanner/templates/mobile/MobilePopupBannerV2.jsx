// react-app/src/components/UniversalBanner/templates/mobile/MobilePopupBannerV2.jsx

import { useState, useEffect, useCallback } from "react";
import "./MobilePopupBannerV2.css";

export default function MobilePopupBannerV2({ banner, slides, config, onSlideClick }) {
  const [visible,  setVisible]  = useState(false);
  const [animOut,  setAnimOut]  = useState(false);

  const {
    accentColor   = "#ff6b35",
    showAfterMs   = 2000,
    storageKey    = "mpb2_seen",
    showOnce      = true,
  } = config || {};

  const slide = slides?.[0] || {};

  let sc = {};
  try { sc = slide.config ? (typeof slide.config === "string" ? JSON.parse(slide.config) : slide.config) : {}; } catch(_) {}
  const accent = sc.accentColor || accentColor;

  // Show after delay, unless already seen
  useEffect(() => {
    if (showOnce && sessionStorage.getItem(storageKey) === "1") return;
    const t = setTimeout(() => setVisible(true), showAfterMs);
    return () => clearTimeout(t);
  }, [showAfterMs, storageKey, showOnce]);

  const close = useCallback(() => {
    setAnimOut(true);
    setTimeout(() => {
      setVisible(false);
      setAnimOut(false);
      if (showOnce) sessionStorage.setItem(storageKey, "1");
    }, 300);
  }, [showOnce, storageKey]);

  const handleCta = useCallback((e) => {
    e.stopPropagation();
    if (!slide.cta_link) return;
    onSlideClick?.(slide.cta_link);
    close();
  }, [slide, onSlideClick, close]);

  if (!slides || slides.length === 0 || !visible) return null;

  return (
    <div
      className={`mpb2-backdrop MobilePopupBannerV2 ${animOut ? "mpb2-out" : "mpb2-in"}`}
      onClick={close}
    >
      <div
        className={`mpb2-modal ${animOut ? "mpb2-modal-out" : "mpb2-modal-in"}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background image */}
        {slide.background_image_url && (
          <img src={slide.background_image_url} alt="" className="mpb2-bg" draggable={false} />
        )}

        {/* Overlays */}
        <div className="mpb2-overlay" />
        <div className="mpb2-glow" style={{ background: `radial-gradient(ellipse at 80% 20%, ${accent}50 0%, transparent 60%)` }} />

        {/* Top accent bar */}
        <div className="mpb2-topbar" style={{ background: accent }} />

        {/* Close button */}
        <button className="mpb2-close" onClick={close} aria-label="Close popup">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>

        {/* Character */}
        {slide.logo_url && (
          <img src={slide.logo_url} alt="" className="mpb2-char" draggable={false} />
        )}

        {/* Content */}
        <div className="mpb2-body">
          {slide.badge_text && (
            <span className="mpb2-badge" style={{ background: accent, color: "#000" }}>
              {slide.badge_text}
            </span>
          )}
          {slide.title_highlight && (
            <p className="mpb2-eyebrow" style={{ color: accent }}>{slide.title_highlight}</p>
          )}
          {slide.title && <h2 className="mpb2-title">{slide.title}</h2>}
          {slide.subtitle && <p className="mpb2-sub">{slide.subtitle}</p>}

          {slide.cta_text && slide.cta_link && (
            <button
              className="mpb2-cta"
              onClick={handleCta}
              style={{ background: accent, color: "#000" }}
            >
              {slide.cta_text}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          )}

          <button className="mpb2-skip" onClick={close}>
            No thanks
          </button>
        </div>
      </div>
    </div>
  );
}