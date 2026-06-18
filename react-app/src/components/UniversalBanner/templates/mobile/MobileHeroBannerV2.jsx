// react-app/src/components/UniversalBanner/templates/mobile/MobileHeroBannerV2.jsx

import { useEffect, useRef, useState, useCallback } from "react";
import "./MobileHeroBannerV2.css";
import { loadBannerFont, BANNER_FONTS } from '../../../../utils/loadBannerFont';

export default function MobileHeroBannerV2({ banner, slides, config, onSlideClick }) {
  useEffect(() => { loadBannerFont(BANNER_FONTS.MobileHeroBannerV2); }, []);
  const [index, setIndex]           = useState(0);
  const [prev, setPrev]             = useState(null);
  const [tapped, setTapped]         = useState(false);
  const [dragStart, setDragStart]   = useState(null);
  const [dragDY, setDragDY]         = useState(0);
  const [loaded, setLoaded]         = useState(false);
  const autoPlayRef                 = useRef(null);
  const wrapRef                     = useRef(null);

  const {
    autoPlay      = true,
    interval      = 5000,
    showDots      = true,
    height        = 260,
  } = config || {};

  const total = slides?.length || 0;

  useEffect(() => {
    if (total > 0) {
      const t = setTimeout(() => setLoaded(true), 80);
      return () => clearTimeout(t);
    }
  }, [total]);

  const goTo = useCallback((next) => {
    setPrev(index);
    setIndex(next);
    setTimeout(() => setPrev(null), 420);
  }, [index]);

  const startAuto = useCallback(() => {
    if (!autoPlay || total <= 1) return;
    autoPlayRef.current = setInterval(() => {
      setIndex(p => {
        const next = (p + 1) % total;
        setPrev(p);
        setTimeout(() => setPrev(null), 420);
        return next;
      });
    }, interval);
  }, [autoPlay, interval, total]);

  const stopAuto = useCallback(() => clearInterval(autoPlayRef.current), []);

  useEffect(() => { startAuto(); return stopAuto; }, [startAuto, stopAuto]);

  /* ── Touch / Swipe ── */
  const onTouchStart = (e) => {
    stopAuto();
    setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    setDragDY(0);
  };

  const onTouchMove = (e) => {
    if (!dragStart) return;
    const dx = e.touches[0].clientX - dragStart.x;
    const dy = Math.abs(e.touches[0].clientY - dragStart.y);
    setDragDY(dy);
    // if mostly vertical, let page scroll
    if (dy > 60) return;
    e.preventDefault();
  };

  const onTouchEnd = (e) => {
    if (!dragStart) return;
    const dx = e.changedTouches[0].clientX - dragStart.x;
    const dy = Math.abs(e.changedTouches[0].clientY - dragStart.y);

    if (dy < 60) {
      if (dx < -48 && index < total - 1) goTo(index + 1);
      else if (dx > 48 && index > 0)     goTo(index - 1);
    }
    setDragStart(null);
    startAuto();
  };

  /* ── Tap feedback ── */
  const onPress = () => {
    setTapped(true);
    setTimeout(() => setTapped(false), 180);
  };

  if (!slides || total === 0) return null;
  if (!loaded) return <div className="mhb2-skeleton" style={{ height }} />;

  const slide = slides[index];
  let sc = {};
  try { sc = slide.config ? (typeof slide.config === "string" ? JSON.parse(slide.config) : slide.config) : {}; } catch(_) {}
  const accent = sc.accentColor || "#00e5ff";

  return (
    <div
      ref={wrapRef}
      className={`mhb2-wrap MobileHeroBannerV2${tapped ? " mhb2-tap" : ""}`}
      style={{ "--accent": accent, "--h": `${height}px` }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onTouchStartCapture={onPress}
    >
      {/* ── Scan-line texture overlay ── */}
      <div className="mhb2-scanlines" />

      {/* ── Slide layers ── */}
      {slides.map((sl, i) => {
        let slc = {};
        try { slc = sl.config ? (typeof sl.config === "string" ? JSON.parse(sl.config) : sl.config) : {}; } catch(_) {}
        const slAccent = slc.accentColor || "#00e5ff";

        const isActive = i === index;
        const isPrev   = i === prev;

        return (
          <div
            key={sl.id || i}
            className={`mhb2-slide${isActive ? " mhb2-slide--in" : isPrev ? " mhb2-slide--out" : ""}`}
            style={{ "--sa": slAccent }}
            onClick={() => isActive && sl.cta_link && onSlideClick?.(sl.cta_link)}
          >
            {/* BG image */}
            {sl.background_image_url && (
              <img
                src={sl.background_image_url}
                alt={sl.title || ""}
                className="mhb2-bg"
                loading={i === 0 ? "eager" : "lazy"}
                draggable={false}
              />
            )}
            <div className="mhb2-bg-fallback" style={{ background: slc.bgColor || "#050d1a" }} />

            {/* Gradient vignettes */}
            <div className="mhb2-vignette-bottom" />
            <div className="mhb2-vignette-left" />

            {/* HUD corner decorations */}
            <div className="mhb2-corner mhb2-corner--tl" />
            <div className="mhb2-corner mhb2-corner--tr" />
            <div className="mhb2-corner mhb2-corner--bl" />

            {/* Top HUD bar */}
            <div className="mhb2-hud-top">
              {sl.badge_text && (
                <div className="mhb2-badge">
                  <span className="mhb2-badge-dot" />
                  <span className="mhb2-badge-text">{sl.badge_text}</span>
                </div>
              )}
              <div className="mhb2-counter">
                <span className="mhb2-counter-cur">{String(index + 1).padStart(2, "0")}</span>
                <span className="mhb2-counter-sep">/</span>
                <span className="mhb2-counter-tot">{String(total).padStart(2, "0")}</span>
              </div>
            </div>

            {/* Character / logo image */}
            {sl.logo_url && (
              <img
                src={sl.logo_url}
                alt=""
                className="mhb2-char"
                draggable={false}
              />
            )}

            {/* Content */}
            <div className="mhb2-content">
              {sl.eyebrow && (
                <p className="mhb2-eyebrow">
                  <span className="mhb2-eyebrow-line" />
                  {sl.eyebrow}
                </p>
              )}

              {sl.title && (
                <h2 className="mhb2-title">
                  {sl.title}
                  {sl.title_highlight && (
                    <> <span className="mhb2-title-hl">{sl.title_highlight}</span></>
                  )}
                </h2>
              )}

              {sl.subtitle && (
                <p className="mhb2-sub">{sl.subtitle}</p>
              )}

              {sl.cta_text && sl.cta_link && (
                <button
                  className="mhb2-cta"
                  onClick={(e) => { e.stopPropagation(); onSlideClick?.(sl.cta_link); }}
                >
                  <span className="mhb2-cta-label">{sl.cta_text}</span>
                  <span className="mhb2-cta-arrow">
                    <svg viewBox="0 0 16 16" fill="none">
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </button>
              )}
            </div>

            {/* Bottom accent line */}
            <div className="mhb2-bottom-line" />
          </div>
        );
      })}

      {/* ── Dot nav ── */}
      {showDots && total > 1 && (
        <div className="mhb2-dots">
          {slides.map((_, i) => (
            <button
              key={i}
              className={`mhb2-dot${i === index ? " mhb2-dot--on" : ""}`}
              onClick={() => { stopAuto(); goTo(i); startAuto(); }}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
