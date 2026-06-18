// react-app/src/components/UniversalBanner/templates/CountdownBannerV2.jsx

import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./CountdownBannerV2.css";
import { loadBannerFont, BANNER_FONTS } from '../../../utils/loadBannerFont';

function getRemaining(targetDate) {
  const diff = targetDate - Date.now();
  if (diff <= 0) return null;
  const s = Math.floor(diff / 1000);
  return {
    days:    Math.floor(s / 86400),
    hours:   Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  };
}

function pad(n) { return String(n).padStart(2, "0"); }

// Flip digit — animates when value changes
function FlipDigit({ value, accentColor }) {
  const [flipping, setFlipping] = useState(false);
  const prev = useRef(value);

  useEffect(() => {
    if (prev.current !== value) {
      setFlipping(false);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setFlipping(true));
      });
      prev.current = value;
    }
  }, [value]);

  return (
    <span
      className={`cd2-digit-num${flipping ? " cd2-flip" : ""}`}
      style={{ "--accent": accentColor }}
    >
      {pad(value)}
    </span>
  );
}

export default function CountdownBannerV2({ banner, slides, config, onSlideClick }) {
  useEffect(() => { loadBannerFont(BANNER_FONTS.CountdownBannerV2); }, []);
  const navigate = useNavigate();
  const [time, setTime]       = useState(null);
  const [expired, setExpired] = useState(false);
  const [urgency, setUrgency] = useState(false); // last-minute urgency mode
  const tickRef = useRef(null);

  const slide = slides?.[0] || {};

  let slideConfig = {};
  try {
    slideConfig = slide.config
      ? typeof slide.config === "string"
        ? JSON.parse(slide.config)
        : slide.config
      : {};
  } catch (_) {}

  const {
    accentColor    = "#ffd000",
    timerLabel     = "Offer ends in",
    expiredText    = "This offer has ended",
    showDays       = true,
    overlayOpacity = 0.68,
  } = { ...config, ...slideConfig };

  const rawDate  = slideConfig.targetDate || config?.targetDate;
  const targetTs = rawDate ? new Date(rawDate).getTime() : null;

  useEffect(() => {
    if (!targetTs || isNaN(targetTs)) return;

    const tick = () => {
      const r = getRemaining(targetTs);
      if (!r) {
        setExpired(true);
        setTime({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(tickRef.current);
        return;
      }
      setTime(r);
      // Urgency mode: last 60 minutes
      const totalSecs = Math.floor((targetTs - Date.now()) / 1000);
      setUrgency(totalSecs <= 3600);
    };
    tick();
    tickRef.current = setInterval(tick, 1000);
    return () => clearInterval(tickRef.current);
  }, [targetTs]);

  const handleCta = useCallback((e) => {
    e.stopPropagation();
    if (!slide.cta_link) return;
    onSlideClick?.(slide.cta_link);
    slide.cta_link.startsWith("http")
      ? window.open(slide.cta_link, "_blank", "noopener")
      : navigate(slide.cta_link);
  }, [slide, navigate, onSlideClick]);

  if (!slides || slides.length === 0) return null;

  const units = showDays
    ? [
        { label: "Days",    val: time?.days    ?? 0, key: "d" },
        { label: "Hours",   val: time?.hours   ?? 0, key: "h" },
        { label: "Mins",    val: time?.minutes ?? 0, key: "m" },
        { label: "Secs",    val: time?.seconds ?? 0, key: "s" },
      ]
    : [
        { label: "Hours",   val: (time?.days ?? 0) * 24 + (time?.hours ?? 0), key: "h" },
        { label: "Mins",    val: time?.minutes ?? 0, key: "m" },
        { label: "Secs",    val: time?.seconds ?? 0, key: "s" },
      ];

  return (
    <div
      className={`cd2-wrap CountdownBannerV2${urgency ? " cd2-urgency" : ""}`}
      style={{ "--accent": accentColor }}
    >
      {/* Background */}
      {slide.background_image_url && (
        <img
          src={slide.background_image_url}
          alt=""
          className="cd2-bg"
          draggable={false}
        />
      )}
      <div className="cd2-overlay" style={{ opacity: overlayOpacity }} />

      {/* Diagonal slash divider between panels */}
      <div className="cd2-slash" />

      {/* Noise texture overlay */}
      <div className="cd2-noise" />

      {/* Character art — bleeds into both panels */}
      {slide.logo_url && (
        <img src={slide.logo_url} alt="" className="cd2-char" draggable={false} />
      )}

      <div className="cd2-body">

        {/* ══ LEFT PANEL — Promo copy ══ */}
        <div className="cd2-left">
          {/* Rule + eyebrow */}
          <div className="cd2-eyebrow-row">
            <div className="cd2-rule" />
            {slide.badge_text && (
              <span className="cd2-badge">
                {slide.badge_text}
              </span>
            )}
          </div>

          {slide.title_highlight && (
            <p className="cd2-eyebrow">{slide.title_highlight}</p>
          )}

          {slide.title && (
            <h2 className="cd2-title">{slide.title}</h2>
          )}

          {slide.subtitle && (
            <p className="cd2-subtitle">{slide.subtitle}</p>
          )}

          {slide.cta_text && slide.cta_link && (
            <button className="cd2-cta" onClick={handleCta}>
              <span className="cd2-cta-fill" />
              <span className="cd2-cta-label">
                {slide.cta_text}
                <svg
                  className="cd2-cta-icon"
                  width="14" height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </span>
            </button>
          )}
        </div>

        {/* ══ RIGHT PANEL — Timer ══ */}
        <div className="cd2-right">
          <p className="cd2-timer-label">
            {expired ? expiredText : timerLabel}
          </p>

          {targetTs ? (
            <div className="cd2-timer-row">
              {units.map((u, i) => (
                <div key={u.key} className="cd2-unit">
                  <div className="cd2-digit-box">
                    {/* Top/bottom half divider line */}
                    <div className="cd2-digit-mid" />
                    <FlipDigit value={u.val} accentColor={accentColor} />
                  </div>
                  <span className="cd2-unit-label">{u.label}</span>
                  {i < units.length - 1 && (
                    <span className="cd2-sep">:</span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="cd2-no-date">Configure targetDate in slide config</p>
          )}

          {/* Urgency warning strip */}
          {urgency && !expired && (
            <div className="cd2-urgency-strip">
              <span className="cd2-urgency-dot" />
              Ending soon — claim before it's gone
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
