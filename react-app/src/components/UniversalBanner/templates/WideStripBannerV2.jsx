// react-app/src/components/UniversalBanner/templates/WideStripBannerV2.jsx

import { useCallback, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./WideStripBannerV2.css";
import { loadBannerFont, BANNER_FONTS } from '../../../utils/loadBannerFont';

const SPEEDS = { slow: "55s", medium: "32s", fast: "18s" };

export default function WideStripBannerV2({ banner, slides, config, onSlideClick }) {
  useEffect(() => { loadBannerFont(BANNER_FONTS.WideStripBannerV2); }, []);
  const navigate = useNavigate();
  const [ctaPressed, setCtaPressed] = useState(false);

  const {
    scrollSpeed = "medium",
    showMarquee = true,
    accentColor = "#ffd700",
    stripBg     = "#07090f",
    showIcon    = true,
    liveLabel   = "LIVE",
  } = config || {};

  const mainSlide = slides?.[0] || {};

  // Build marquee text from all slides
  const marqueeItems = (slides || []).flatMap((s) => {
    const parts = [];
    if (s.badge_text) parts.push(s.badge_text);
    if (s.title)      parts.push(s.title);
    if (s.subtitle)   parts.push(s.subtitle);
    return parts.length ? [parts.join(" — ")] : [];
  });

  // Triple for seamless loop
  const ticker = [...marqueeItems, ...marqueeItems, ...marqueeItems];

  const handleCta = useCallback((e) => {
    e.stopPropagation();
    if (!mainSlide.cta_link) return;
    onSlideClick?.(mainSlide.cta_link);
    mainSlide.cta_link.startsWith("http")
      ? window.open(mainSlide.cta_link, "_blank", "noopener")
      : navigate(mainSlide.cta_link);
  }, [mainSlide, navigate, onSlideClick]);

  const handleCtaPress = () => {
    setCtaPressed(true);
    setTimeout(() => setCtaPressed(false), 200);
  };

  if (!slides || slides.length === 0) return null;

  return (
    <div
      className="ws2-strip WideStripBannerV2"
      style={{ "--accent": accentColor, "--strip-bg": stripBg }}
    >
      {/* Racing light sweep — pure CSS animation */}
      <div className="ws2-race-light" />

      {/* Left LIVE signal block */}
      <div className="ws2-signal">
        {/* Stacked bar equaliser — like a sound meter */}
        <div className="ws2-bars">
          <span className="ws2-bar" style={{ "--d": "0s" }} />
          <span className="ws2-bar" style={{ "--d": "0.15s" }} />
          <span className="ws2-bar" style={{ "--d": "0.3s" }} />
          <span className="ws2-bar" style={{ "--d": "0.1s" }} />
        </div>
        <span className="ws2-live-label">{liveLabel}</span>
      </div>

      {/* Vertical rule */}
      <div className="ws2-rule" />

      {/* Star icon */}
      {showIcon && (
        <div className="ws2-icon">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </div>
      )}

      {/* Scrolling marquee */}
      {showMarquee && ticker.length > 0 && (
        <div className="ws2-marquee-wrap">
          <div
            className="ws2-marquee"
            style={{ animationDuration: SPEEDS[scrollSpeed] || SPEEDS.medium }}
          >
            {ticker.map((text, i) => (
              <span key={i} className="ws2-marquee-item">
                <span className="ws2-separator">◆</span>
                <span className="ws2-marquee-text">{text}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Static fallback */}
      {!showMarquee && mainSlide.title && (
        <span className="ws2-static-text">{mainSlide.title}</span>
      )}

      {/* CTA — diagonal cut button */}
      {mainSlide.cta_text && mainSlide.cta_link && (
        <button
          className={`ws2-cta${ctaPressed ? " ws2-cta--pressed" : ""}`}
          onClick={handleCta}
          onMouseDown={handleCtaPress}
          onTouchStart={handleCtaPress}
        >
          <span className="ws2-cta-shimmer" />
          <span className="ws2-cta-text">{mainSlide.cta_text}</span>
          <svg className="ws2-cta-arrow" width="11" height="11" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="3"
            strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M13 6l6 6-6 6"/>
          </svg>
        </button>
      )}
    </div>
  );
}
