// react-app/src/components/UniversalBanner/templates/mobile/MobileCountdownBannerV2.jsx

import { useState, useEffect, useCallback, useRef } from "react";
import "./MobileCountdownBannerV2.css";
import { loadBannerFont, BANNER_FONTS } from '../../../../utils/loadBannerFont';

function getRemaining(ts) {
  const diff = ts - Date.now();
  if (diff <= 0) return null;
  const s = Math.floor(diff / 1000);
  return {
    hours:   Math.floor(s / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  };
}
function pad(n) { return String(n).padStart(2, "0"); }

// Digit cell — fires flip animation on each change
function DigitCell({ value, label, accentColor }) {
  const [anim, setAnim] = useState(false);
  const prev = useRef(value);

  useEffect(() => {
    if (prev.current !== value) {
      setAnim(false);
      requestAnimationFrame(() => requestAnimationFrame(() => setAnim(true)));
      prev.current = value;
    }
  }, [value]);

  return (
    <div className="mcd2-unit">
      <div className="mcd2-box">
        <div className="mcd2-box-shine" />
        <span
          className={`mcd2-digit${anim ? " mcd2-flip" : ""}`}
          style={{ "--accent": accentColor }}
        >
          {pad(value)}
        </span>
        {/* mid-line */}
        <div className="mcd2-midline" />
      </div>
      <span className="mcd2-unit-lbl">{label}</span>
    </div>
  );
}

export default function MobileCountdownBannerV2({ banner, slides, config, onSlideClick }) {
  useEffect(() => { loadBannerFont(BANNER_FONTS.MobileCountdownBannerV2); }, []);
  const [time, setTime]       = useState(null);
  const [expired, setExpired] = useState(false);
  const [urgency, setUrgency] = useState(false);
  const tickRef               = useRef(null);

  const slide = slides?.[0] || {};

  let sc = {};
  try {
    sc = slide.config
      ? typeof slide.config === "string" ? JSON.parse(slide.config) : slide.config
      : {};
  } catch (_) {}

  const {
    accentColor    = "#ffd000",
    timerLabel     = "Offer ends in",
    expiredText    = "Offer ended",
    overlayOpacity = 0.65,
  } = { ...config, ...sc };

  const rawDate  = sc.targetDate || config?.targetDate;
  const targetTs = rawDate ? new Date(rawDate).getTime() : null;

  useEffect(() => {
    if (!targetTs || isNaN(targetTs)) return;
    const tick = () => {
      const r = getRemaining(targetTs);
      if (!r) {
        setExpired(true);
        setTime({ hours: 0, minutes: 0, seconds: 0 });
        clearInterval(tickRef.current);
        return;
      }
      setTime(r);
      setUrgency((targetTs - Date.now()) / 1000 <= 3600);
    };
    tick();
    tickRef.current = setInterval(tick, 1000);
    return () => clearInterval(tickRef.current);
  }, [targetTs]);

  const handleCta = useCallback((e) => {
    e.stopPropagation();
    if (!slide.cta_link) return;
    onSlideClick?.(slide.cta_link);
  }, [slide, onSlideClick]);

  if (!slides || slides.length === 0) return null;

  const units = [
    { label: "HRS", val: time?.hours   ?? 0 },
    { label: "MIN", val: time?.minutes ?? 0 },
    { label: "SEC", val: time?.seconds ?? 0 },
  ];

  return (
    <div
      className={`mcd2-wrap MobileCountdownBannerV2${urgency ? " mcd2-urgency" : ""}`}
      style={{ "--accent": accentColor }}
    >
      {/* Background */}
      {slide.background_image_url && (
        <img src={slide.background_image_url} alt="" className="mcd2-bg" draggable={false} />
      )}
      <div className="mcd2-overlay" style={{ opacity: overlayOpacity }} />
      <div className="mcd2-noise" />

      {/* Character bleeds from right */}
      {slide.logo_url && (
        <img src={slide.logo_url} alt="" className="mcd2-char" draggable={false} />
      )}

      {/* ── Top accent rule ── */}
      <div className="mcd2-top-rule" />

      <div className="mcd2-body">

        {/* ── SECTION 1: Badge + Copy ── */}
        <div className="mcd2-copy">
          <div className="mcd2-badge-row">
            {slide.badge_text && (
              <span className="mcd2-badge">{slide.badge_text}</span>
            )}
          </div>

          {slide.title_highlight && (
            <p className="mcd2-eyebrow">{slide.title_highlight}</p>
          )}

          {slide.title && (
            <h2 className="mcd2-title">{slide.title}</h2>
          )}

          {slide.subtitle && (
            <p className="mcd2-sub">{slide.subtitle}</p>
          )}
        </div>

        {/* ── TIMER BAND ── */}
        {targetTs && (
          <div className="mcd2-timer-band">
            <div className="mcd2-band-inner">
              {/* Label on left */}
              <div className="mcd2-band-label-col">
                <span className="mcd2-band-label">
                  {expired ? expiredText : timerLabel}
                </span>
                {urgency && !expired && (
                  <span className="mcd2-urgency-tag">
                    <span className="mcd2-urgency-dot" />
                    Soon
                  </span>
                )}
              </div>

              {/* Digit slots on right */}
              <div className="mcd2-digits">
                {units.map((u, i) => (
                  <div key={u.label} className="mcd2-digit-group">
                    <DigitCell
                      value={u.val}
                      label={u.label}
                      accentColor={accentColor}
                    />
                    {i < units.length - 1 && (
                      <span className="mcd2-sep">:</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── CTA ── */}
        {slide.cta_text && slide.cta_link && (
          <div className="mcd2-cta-row">
            <button className="mcd2-cta" onClick={handleCta}>
              <span className="mcd2-cta-fill" />
              <span className="mcd2-cta-inner">
                {slide.cta_text}
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5"
                  strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </span>
            </button>
          </div>
        )}

      </div>

      {/* ── Bottom accent rule ── */}
      <div className="mcd2-bottom-rule" />
    </div>
  );
}
