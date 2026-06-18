// react-app/src/components/UniversalBanner/templates/mobile/MobileVideoHeroBannerV2.jsx

import { useState, useEffect, useRef, useCallback } from "react";
import "./MobileVideoHeroBannerV2.css";
import { loadBannerFont, BANNER_FONTS } from '../../../../utils/loadBannerFont';

export default function MobileVideoHeroBannerV2({ banner, slides, config, onSlideClick }) {
  useEffect(() => { loadBannerFont(BANNER_FONTS.MobileVideoHeroBannerV2); }, []);
  const [index, setIndex]       = useState(0);
  const [phase, setPhase]       = useState("idle");
  const [videoErr, setVideoErr] = useState(false);
  const [progress, setProgress] = useState(0);
  const [tapped, setTapped]     = useState(false);
  const videoRef                = useRef(null);
  const timerRef                = useRef(null);
  const rafRef                  = useRef(null);
  const touchStartX             = useRef(null);
  const touchStartY             = useRef(null);
  const TRANS                   = 360;

  const {
    autoPlay    = true,
    interval    = 7000,
    accentColor = "#00ff88",
    muted       = true,
    height      = 280,
  } = config || {};

  const total = slides?.length || 0;

  // Parse per-slide config
  const getSlideConfig = (s) => {
    try {
      return s?.config
        ? (typeof s.config === "string" ? JSON.parse(s.config) : s.config)
        : {};
    } catch (_) { return {}; }
  };

  const slide  = slides?.[index] || {};
  const sc     = getSlideConfig(slide);
  const accent = sc.accentColor || accentColor;
  const videoUrl  = sc.videoUrl || slide.video_url || null;
  const videoType = sc.videoType || "video/mp4";
  const bgImg     = slide.background_image_url || slide.background;
  const charImg   = slide.logo_url || slide.logo;

  // Reset video on slide change
  useEffect(() => {
    setVideoErr(false);
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
    }
  }, [index, videoUrl]);

  // Navigate
  const goTo = useCallback((next) => {
    if (next === index || phase !== "idle") return;
    clearInterval(timerRef.current);
    cancelAnimationFrame(rafRef.current);
    setProgress(0);
    setPhase("out");
    setTimeout(() => {
      setIndex(next);
      setPhase("in");
      setTimeout(() => setPhase("idle"), TRANS);
    }, TRANS);
  }, [index, phase]);

  // Auto-play + progress
  useEffect(() => {
    if (!autoPlay || total <= 1) return;
    setProgress(0);
    const startTime = Date.now();
    const tick = () => {
      const pct = Math.min(((Date.now() - startTime) / interval) * 100, 100);
      setProgress(pct);
      if (pct < 100) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    timerRef.current = setInterval(() => {
      setIndex(p => {
        const next = (p + 1) % total;
        goTo(next);
        return p;
      });
    }, interval);
    return () => {
      clearInterval(timerRef.current);
      cancelAnimationFrame(rafRef.current);
    };
  }, [autoPlay, interval, total, index]);

  // Swipe
  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };
  const onTouchEnd = (e) => {
    if (!touchStartX.current) return;
    const dx = touchStartX.current - e.changedTouches[0].clientX;
    const dy = Math.abs(touchStartY.current - e.changedTouches[0].clientY);
    touchStartX.current = null;
    if (Math.abs(dx) < 44 || dy > 60) return;
    dx > 0
      ? goTo((index + 1) % total)
      : goTo((index - 1 + total) % total);
  };

  const handleCta = useCallback((e) => {
    e.stopPropagation();
    if (!slide.cta_link) return;
    onSlideClick?.(slide.cta_link);
  }, [slide, onSlideClick]);

  const handlePress = () => {
    setTapped(true);
    setTimeout(() => setTapped(false), 160);
  };

  if (!slides || total === 0) return null;

  // Waveform segments — same pattern as desktop for consistency
  const waveSegs = [3, 7, 4, 11, 5, 8, 3, 10, 5, 8, 4, 6, 9, 3, 7];

  return (
    <div
      className={`mvhb2-wrap MobileVideoHeroBannerV2${tapped ? " mvhb2-wrap--tap" : ""}`}
      style={{ "--accent": accent, "--h": `${height}px` }}
      onTouchStart={(e) => { onTouchStart(e); handlePress(); }}
      onTouchEnd={onTouchEnd}
    >
      {/* ── Full-bleed media ── */}
      <div className="mvhb2-media">
        {videoUrl && !videoErr ? (
          <video
            ref={videoRef}
            className="mvhb2-video"
            autoPlay loop muted={muted} playsInline preload="auto"
            onError={() => setVideoErr(true)}
            key={videoUrl}
          >
            <source src={videoUrl} type={videoType} />
          </video>
        ) : bgImg ? (
          <img src={bgImg} alt="" className="mvhb2-bg-img" draggable={false} />
        ) : (
          <div className="mvhb2-no-media" />
        )}

        {/* Overlays */}
        <div className="mvhb2-ov-top" />
        <div className="mvhb2-ov-bottom" />
        <div className="mvhb2-scanlines" />

        {/* Accent radial glow top-center */}
        <div className="mvhb2-glow-top" />
      </div>

      {/* ── Oscilloscope line — single horizontal across media ── */}
      <div className="mvhb2-osc" aria-hidden="true" />

      {/* ── Character image — right side ── */}
      {charImg && (
        <img
          src={charImg}
          alt=""
          className="mvhb2-char"
          draggable={false}
        />
      )}

      {/* ── Slide counter top-right ── */}
      {total > 1 && (
        <div className="mvhb2-counter" aria-hidden="true">
          <span className="mvhb2-counter-cur">{String(index + 1).padStart(2, "0")}</span>
          <span className="mvhb2-counter-sep">/</span>
          <span className="mvhb2-counter-tot">{String(total).padStart(2, "0")}</span>
        </div>
      )}

      {/* ════════════════════════════════
          FROSTED GLASS BOTTOM SHELF
          Mobile adaptation of desktop's
          side panel — same DNA, new axis
      ════════════════════════════════ */}
      <div className="mvhb2-shelf">
        {/* Top accent stripe — same as desktop panel stripe */}
        <div className="mvhb2-shelf-stripe" />

        {/* HUD bracket corners — top-left + top-right of shelf */}
        <div className="mvhb2-bracket mvhb2-bracket--tl" />
        <div className="mvhb2-bracket mvhb2-bracket--tr" />

        {/* Shelf body content */}
        <div className={`mvhb2-shelf-body mvhb2-${phase}`}>

          {/* Badge */}
          {slide.badge_text && (
            <div className="mvhb2-badge">
              <span className="mvhb2-badge-pip" />
              <span className="mvhb2-badge-label">{slide.badge_text}</span>
            </div>
          )}

          {/* Eyebrow */}
          {slide.title_highlight && (
            <p className="mvhb2-eyebrow">
              <span className="mvhb2-eyebrow-tick" />
              {slide.title_highlight}
            </p>
          )}

          {/* Title */}
          {slide.title && (
            <h2 className="mvhb2-title">{slide.title}</h2>
          )}

          {/* Subtitle */}
          {slide.subtitle && (
            <p className="mvhb2-sub">{slide.subtitle}</p>
          )}

          {/* CTA — fill-sweep on press (mobile) */}
          {slide.cta_text && slide.cta_link && (
            <button className="mvhb2-cta" onClick={handleCta}>
              <span className="mvhb2-cta-fill" />
              <span className="mvhb2-cta-content">
                <span className="mvhb2-cta-text">{slide.cta_text}</span>
                <svg className="mvhb2-cta-icon" width="12" height="12"
                  viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </span>
            </button>
          )}
        </div>

        {/* Shelf footer — waveform + dots */}
        <div className="mvhb2-shelf-footer">
          {/* Waveform progress */}
          {autoPlay && total > 1 && (
            <div className="mvhb2-waveform" aria-hidden="true">
              {waveSegs.map((w, i) => {
                const segStart = (i / waveSegs.length) * 100;
                const lit = progress >= segStart;
                return (
                  <span
                    key={i}
                    className={`mvhb2-wave-seg${lit ? " mvhb2-wave-seg--lit" : ""}`}
                    style={{ width: w, height: 3 + (w / 11) * 8 }}
                  />
                );
              })}
            </div>
          )}

          {/* Dot nav */}
          {total > 1 && (
            <div className="mvhb2-dots">
              {slides.map((_, i) => (
                <button
                  key={i}
                  className={`mvhb2-dot${i === index ? " mvhb2-dot--on" : ""}`}
                  onClick={() => goTo(i)}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
