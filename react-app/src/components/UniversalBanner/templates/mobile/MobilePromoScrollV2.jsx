

// react-app/src/components/UniversalBanner/templates/mobile/MobilePromoScrollV2.jsx

import { useCallback, useState, useEffect } from "react";
import "./MobilePromoScrollV2.css";
import { loadBannerFont, BANNER_FONTS } from '../../../../utils/loadBannerFont';

export default function MobilePromoScrollV2({ banner, slides, config, onSlideClick }) {
  useEffect(() => { loadBannerFont(BANNER_FONTS.MobilePromoScrollV2); }, []);
  const [activeIdx, setActiveIdx] = useState(null);

  const {
    cardWidth    = 248,
    cardHeight   = 168,
    gap          = 10,
    padding      = 12,
    borderRadius = 14,
  } = config || {};

  const handleClick = useCallback((slide, e) => {
    e?.stopPropagation();
    if (!slide.cta_link) return;
    onSlideClick?.(slide.cta_link);
  }, [onSlideClick]);

  if (!slides || slides.length === 0) return null;

  return (
    <div className="mps2-outer MobilePromoScrollV2">
      <div className="mps2-track" style={{ gap: `${gap}px` }}>
        {slides.map((slide, i) => {
          let sc = {};
          try {
            sc = slide.config
              ? typeof slide.config === "string"
                ? JSON.parse(slide.config)
                : slide.config
              : {};
          } catch (_) {}
          const accent = sc.accentColor || "#00e5ff";
          const isActive = activeIdx === i;

          return (
            <div
              key={slide.id || i}
              className={`mps2-card${isActive ? " mps2-card--tap" : ""}`}
              style={{
                backgroundImage: slide.background_image_url
                  ? `url(${slide.background_image_url})`
                  : undefined,
                width: `${cardWidth}px`,
                height: `${cardHeight}px`,
                borderRadius: `${borderRadius}px`,
                flexShrink: 0,
                "--accent": accent,
              }}
              onClick={(e) => handleClick(slide, e)}
              onTouchStart={() => setActiveIdx(i)}
              onTouchEnd={() => setActiveIdx(null)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && handleClick(slide, e)}
            >
              {/* Depth overlay */}
              <div className="mps2-overlay" />

              {/* Scanlines */}
              <div className="mps2-scanlines" />

              {/* Neon border glow */}
              <div className="mps2-border-glow" />

              {/* Corner brackets */}
              <div className="mps2-corner mps2-corner-tl" />
              <div className="mps2-corner mps2-corner-br" />

              {/* Character image */}
              {slide.logo_url && (
                <img
                  src={slide.logo_url}
                  alt=""
                  className="mps2-char"
                  draggable={false}
                />
              )}

              {/* Badge */}
              {slide.badge_text && (
                <div className="mps2-live-badge" style={{ background: accent }}>
                  <span className="mps2-live-dot" />
                  {slide.badge_text}
                </div>
              )}

              {/* Content */}
              <div className="mps2-content">
                {slide.title_highlight && (
                  <p className="mps2-eyebrow" style={{ color: accent }}>
                    <span className="mps2-eyebrow-line" style={{ background: accent }} />
                    {slide.title_highlight}
                  </p>
                )}
                {slide.title && (
                  <h3 className="mps2-title">{slide.title}</h3>
                )}
                {slide.cta_text && slide.cta_link && (
                  <button
                    className="mps2-cta"
                    onClick={(e) => handleClick(slide, e)}
                    style={{ "--accent": accent }}
                  >
                    <span className="mps2-cta-bg" />
                    <span className="mps2-cta-text">
                      {slide.cta_text}
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </span>
                  </button>
                )}
              </div>

              {/* Bottom accent bar */}
              <div
                className="mps2-bottom-bar"
                style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
