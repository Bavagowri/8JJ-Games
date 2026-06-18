// react-app/src/components/UniversalBanner/templates/mobile/MobileSplitBannerV2.jsx

import { useState, useEffect, useCallback, useRef } from "react";
import "./MobileSplitBannerV2.css";
import { loadBannerFont, BANNER_FONTS } from '../../../../utils/loadBannerFont';

export default function MobileSplitBannerV2({ banner, slides, config, onSlideClick }) {
  useEffect(() => { loadBannerFont(BANNER_FONTS.MobileSplitBannerV2); }, []);
  const [index, setIndex]   = useState(0);
  const [phase, setPhase]   = useState("idle");
  const timerRef            = useRef(null);
  const progressRef         = useRef(null);
  const touchStartX         = useRef(null);
  const touchStartY         = useRef(null);
  const TRANS               = 320;

  const {
    autoPlay       = true,
    interval       = 5500,
    showIndicators = true,
    accentColor    = "#00e5ff",
    cardHeight     = 340,
  } = config || {};

  const total   = slides?.length || 0;
  const current = slides?.[index] || {};

  let sc = {};
  try {
    sc = current.config
      ? typeof current.config === "string" ? JSON.parse(current.config) : current.config
      : {};
  } catch (_) {}
  const accent = sc.accentColor || accentColor;

  // ── Transition ─────────────────────────────────────────
  const goTo = useCallback((next) => {
    if (next === index || phase !== "idle") return;
    clearInterval(timerRef.current);
    setPhase("exit");
    setTimeout(() => {
      setIndex(next);
      setPhase("enter");
      setTimeout(() => setPhase("idle"), TRANS);
    }, TRANS);
  }, [index, phase]);

  // ── Auto-play with live progress bar ───────────────────
  const startAuto = useCallback(() => {
    if (!autoPlay || total <= 1) return;

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
      setIndex(p => {
        const next = (p + 1) % total;
        setPhase("exit");
        setTimeout(() => {
          setPhase("enter");
          setTimeout(() => setPhase("idle"), TRANS);
        }, TRANS);
        return next;
      });
    }, interval);
  }, [autoPlay, interval, total]);

  useEffect(() => {
    startAuto();
    return () => clearInterval(timerRef.current);
  }, [startAuto]);

  // ── Swipe gestures ─────────────────────────────────────
  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = Math.abs(e.changedTouches[0].clientY - touchStartY.current);
    touchStartX.current = null;
    // Only swipe horizontally (ignore vertical scroll)
    if (Math.abs(dx) < 40 || dy > 60) return;
    goTo(dx < 0 ? (index + 1) % total : (index - 1 + total) % total);
  };

  const handleCta = useCallback((e) => {
    e.stopPropagation();
    if (!current.cta_link) return;
    onSlideClick?.(current.cta_link);
  }, [current, onSlideClick]);

  if (!slides || total === 0) return null;

  return (
    <div
      className="msb2-wrap MobileSplitBannerV2"
      style={{ height: `${cardHeight}px`, "--accent": accent }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >

      {/* Logo watermark */}
      {current.logo_url && (
        <img src={current.logo_url} alt="" className="sh2-logoz" draggable={false} />
      )}

      {/* ── FULL-BLEED SCENE ── */}
      <div className={`msb2-scene msb2-scene-${phase}`}>
        {current.background_image_url && (
          <img
            src={current.background_image_url}
            alt=""
            className="msb2-img"
            draggable={false}
          />
        )}
        {/* cinematic vignette — heavy at bottom */}
        <div className="msb2-vignette" />
        {/* accent colour tint */}
        <div
          className="msb2-tint"
          style={{ background: `radial-gradient(ellipse at 60% 30%, ${accent}14 0%, transparent 65%)` }}
        />
      </div>

      {/* ── SLIDE COUNTER — floats top-right ── */}
      {total > 1 && (
        <div className="msb2-counter">
          <span className="msb2-counter-cur">{String(index + 1).padStart(2, "0")}</span>
          <span className="msb2-counter-sep" />
          <span className="msb2-counter-tot">{String(total).padStart(2, "0")}</span>
        </div>
      )}

      {/* ── BADGE — floats top-left ── */}
      {current.badge_text && (
        <div className="msb2-badge-wrap">
          <span className="msb2-badge-line" style={{ background: accent }} />
          <span className="msb2-badge">{current.badge_text}</span>
        </div>
      )}

      {/* ── GLASS FOOTER ── */}
      <div className="msb2-footer">
        <div className="msb2-footer-glass" />

        {/* Top rule of the footer */}
        <div className="msb2-footer-rule" style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }} />

        <div className={`msb2-content msb2-content-${phase}`}>
          {current.title_highlight && (
            <p className="msb2-eyebrow">{current.title_highlight}</p>
          )}

          {current.title && (
            <h2 className="msb2-title">{current.title}</h2>
          )}

          {current.subtitle && (
            <p className="msb2-sub">{current.subtitle}</p>
          )}

          {/* Bottom row: CTA + segments */}
          <div className="msb2-bottom-row">
            {current.cta_text && current.cta_link && (
              <button className="msb2-cta" onClick={handleCta}>
                <span className="msb2-cta-label">{current.cta_text}</span>
                <span className="msb2-cta-icon" style={{ color: accent }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.5"
                    strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </span>
                <span className="msb2-cta-underline" style={{ background: accent }} />
              </button>
            )}

            {/* Segmented progress bar */}
            {showIndicators && total > 1 && (
              <div className="msb2-segments">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    className={`msb2-seg ${i === index ? "msb2-seg-active" : i < index ? "msb2-seg-past" : ""}`}
                    onClick={() => goTo(i)}
                    aria-label={`Slide ${i + 1}`}
                  >
                    <span className="msb2-seg-track">
                      {i === index && autoPlay && (
                        <span
                          className="msb2-seg-fill"
                          ref={progressRef}
                          style={{ background: accent }}
                        />
                      )}
                      {i !== index && (
                        <span
                          className="msb2-seg-static"
                          style={{ background: i < index ? accent : "rgba(255,255,255,0.18)" }}
                        />
                      )}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
