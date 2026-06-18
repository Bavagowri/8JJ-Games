// react-app/src/components/UniversalBanner/templates/VideoHeroBannerV2.jsx

import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./VideoHeroBannerV2.css";
import { loadBannerFont, BANNER_FONTS } from '../../../utils/loadBannerFont';

export default function VideoHeroBannerV2({ banner, slides, config, onSlideClick }) {
  useEffect(() => { loadBannerFont(BANNER_FONTS.VideoHeroBannerV2); }, []);
  const navigate = useNavigate();
  const [index, setIndex]       = useState(0);
  const [phase, setPhase]       = useState("idle");
  const [videoErr, setVideoErr] = useState(false);
  const [progress, setProgress] = useState(0);
  const [tapped, setTapped]     = useState(false);
  const timerRef                = useRef(null);
  const progressRef             = useRef(null);
  const videoRef                = useRef(null);
  const TRANS                   = 420;

  const {
    autoPlay       = true,
    interval       = 8000,
    showIndicators = true,
    showArrows     = true,
    accentColor    = "#00ff88",
    muted          = true,
    height         = 400,
  } = config || {};

  const total   = slides?.length || 0;
  const current = slides?.[index] || {};

  // Parse per-slide config
  let sc = {};
  try {
    sc = current.config
      ? (typeof current.config === "string" ? JSON.parse(current.config) : current.config)
      : {};
  } catch (_) {}

  const accent    = sc.accentColor || accentColor;
  const videoUrl  = sc.videoUrl    || current.video_url  || null;
  const videoType = sc.videoType   || "video/mp4";
  const bgImg     = current.background_image_url || current.background;
  const charImg   = current.logo_url || current.logo;

  // Reset video on slide change
  useEffect(() => {
    setVideoErr(false);
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
    }
  }, [index]);

  // Navigate to slide
  const goTo = useCallback((next) => {
    if (next === index || phase !== "idle") return;
    clearInterval(timerRef.current);
    setProgress(0);
    setPhase("out");
    setTimeout(() => {
      setIndex(next);
      setPhase("in");
      setTimeout(() => setPhase("idle"), TRANS);
    }, TRANS);
  }, [index, phase]);

  // Auto-play + progress bar
  useEffect(() => {
    if (!autoPlay || total <= 1) return;
    setProgress(0);

    // Animate progress 0→100 over `interval`
    const startTime = Date.now();
    const tick = () => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min((elapsed / interval) * 100, 100);
      setProgress(pct);
      if (pct < 100) {
        progressRef.current = requestAnimationFrame(tick);
      }
    };
    progressRef.current = requestAnimationFrame(tick);

    timerRef.current = setInterval(() => {
      setIndex(p => {
        const next = (p + 1) % total;
        goTo(next);
        return p; // goTo handles actual change
      });
    }, interval);

    return () => {
      clearInterval(timerRef.current);
      cancelAnimationFrame(progressRef.current);
    };
  }, [autoPlay, interval, total, index]);

  const handleCta = useCallback((e) => {
    e.stopPropagation();
    if (!current.cta_link) return;
    onSlideClick?.(current.cta_link);
    current.cta_link.startsWith("http")
      ? window.open(current.cta_link, "_blank", "noopener")
      : navigate(current.cta_link);
  }, [current, navigate, onSlideClick]);

  const handlePanelPress = () => {
    setTapped(true);
    setTimeout(() => setTapped(false), 160);
  };

  if (!slides || total === 0) return null;

  // Waveform segment widths — fixed pattern for visual rhythm
  const waveSegments = [3, 8, 4, 12, 5, 9, 3, 14, 6, 10, 4, 7, 11, 3, 8, 5, 13, 4, 9, 6];

  return (
    <div
      className="vhb2-wrap VideoHeroBannerV2"
      style={{ "--accent": accent, "--h": `${height}px` }}
    >
      {/* ── Full-bleed media ── */}
      <div className="vhb2-media">
        {videoUrl && !videoErr ? (
          <video
            ref={videoRef}
            className="vhb2-video"
            autoPlay
            loop
            muted={muted}
            playsInline
            preload="auto"
            onError={() => setVideoErr(true)}
            key={videoUrl}
          >
            <source src={videoUrl} type={videoType} />
          </video>
        ) : bgImg ? (
          <img
            src={bgImg}
            alt=""
            className="vhb2-bg-img"
            draggable={false}
          />
        ) : (
          <div className="vhb2-no-media" />
        )}

        {/* Atmospheric overlays */}
        <div className="vhb2-ov-base" />
        <div className="vhb2-ov-vignette" />
        <div className="vhb2-scanlines" />

        {/* Accent radial glow on right — where the panel ISN'T */}
        <div className="vhb2-glow-right" />
      </div>

      {/* ── Oscilloscope decoration lines ── */}
      <div className="vhb2-osc" aria-hidden="true">
        <div className="vhb2-osc-line vhb2-osc-line--1" />
        <div className="vhb2-osc-line vhb2-osc-line--2" />
        <div className="vhb2-osc-line vhb2-osc-line--3" />
      </div>

      {/* ── Character image — right side, behind panel ── */}
      {charImg && (
        <img
          src={charImg}
          alt=""
          className="vhb2-char"
          draggable={false}
        />
      )}

      {/* ════════════════════════════════
          FROSTED GLASS SIDE PANEL
          This is the signature element —
          a vertical panel left-anchored
      ════════════════════════════════ */}
      <div
        className={`vhb2-panel${tapped ? " vhb2-panel--tap" : ""}`}
        onMouseDown={handlePanelPress}
        onTouchStart={handlePanelPress}
      >
        {/* Panel top accent stripe */}
        <div className="vhb2-panel-stripe" />

        {/* HUD corner bracket — top left of panel */}
        <div className="vhb2-bracket vhb2-bracket--tl" />
        <div className="vhb2-bracket vhb2-bracket--bl" />

        {/* Panel inner content */}
        <div className={`vhb2-panel-body vhb2-${phase}`}>

          {/* Badge */}
          {current.badge_text && (
            <div className="vhb2-badge">
              <span className="vhb2-badge-pip" />
              <span className="vhb2-badge-label">{current.badge_text}</span>
            </div>
          )}

          {/* Eyebrow */}
          {current.title_highlight && (
            <p className="vhb2-eyebrow">
              <span className="vhb2-eyebrow-tick" />
              {current.title_highlight}
            </p>
          )}

          {/* Title */}
          {current.title && (
            <h2 className="vhb2-title">{current.title}</h2>
          )}

          {/* Subtitle */}
          {current.subtitle && (
            <p className="vhb2-subtitle">{current.subtitle}</p>
          )}

          {/* CTA — outline fill-sweep style */}
          {current.cta_text && current.cta_link && (
            <button className="vhb2-cta" onClick={handleCta}>
              <span className="vhb2-cta-fill" />
              <span className="vhb2-cta-content">
                <span className="vhb2-cta-text">{current.cta_text}</span>
                <svg className="vhb2-cta-icon" width="14" height="14"
                  viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </span>
            </button>
          )}
        </div>

        {/* Waveform progress + nav */}
        <div className="vhb2-panel-footer">
          {/* Waveform bar — fills left-to-right as progress advances */}
          {autoPlay && total > 1 && (
            <div className="vhb2-waveform" aria-hidden="true">
              {waveSegments.map((w, i) => {
                // Each segment lights up based on progress
                const segStart = (i / waveSegments.length) * 100;
                const lit = progress >= segStart;
                return (
                  <span
                    key={i}
                    className={`vhb2-wave-seg${lit ? " vhb2-wave-seg--lit" : ""}`}
                    style={{ width: w, height: 4 + (w / 14) * 10 }}
                  />
                );
              })}
            </div>
          )}

          {/* Dot indicators + arrows */}
          <div className="vhb2-nav">
            {showIndicators && total > 1 && (
              <div className="vhb2-dots">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    className={`vhb2-dot${i === index ? " vhb2-dot--on" : ""}`}
                    onClick={() => goTo(i)}
                    aria-label={`Slide ${i + 1}`}
                  />
                ))}
              </div>
            )}

            {showArrows && total > 1 && (
              <div className="vhb2-arrows">
                <button
                  className="vhb2-arrow"
                  onClick={() => goTo((index - 1 + total) % total)}
                  aria-label="Previous"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.5"
                    strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 18l-6-6 6-6"/>
                  </svg>
                </button>
                <button
                  className="vhb2-arrow"
                  onClick={() => goTo((index + 1) % total)}
                  aria-label="Next"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.5"
                    strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18l6-6-6-6"/>
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Slide counter — floats top-right of the full wrap */}
      {total > 1 && (
        <div className="vhb2-counter" aria-hidden="true">
          <span className="vhb2-counter-cur">{String(index + 1).padStart(2, "0")}</span>
          <span className="vhb2-counter-sep"> / </span>
          <span className="vhb2-counter-tot">{String(total).padStart(2, "0")}</span>
        </div>
      )}
    </div>
  );
}
