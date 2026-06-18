// react-app/src/components/UniversalBanner/templates/MultiPanelBannerV2.jsx

import { useCallback, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./MultiPanelBannerV2.css";
import { loadBannerFont, BANNER_FONTS } from '../../../utils/loadBannerFont';

export default function MultiPanelBannerV2({ banner, slides, config, onSlideClick }) {
  useEffect(() => { loadBannerFont(BANNER_FONTS.MultiPanelBannerV2); }, []);
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(null);

  const {
    maxPanels    = 3,
    gap          = 14,
    borderRadius = 16,
    cardHeight   = 280,
    overflowTop  = 60,  // px the character bursts above the card
  } = config || {};

  const handleCta = useCallback((slide, e) => {
    e?.stopPropagation();
    if (!slide.cta_link) return;
    onSlideClick?.(slide.cta_link);
    slide.cta_link.startsWith("http")
      ? window.open(slide.cta_link, "_blank", "noopener")
      : navigate(slide.cta_link);
  }, [navigate, onSlideClick]);

  if (!slides || slides.length === 0) return null;

  const panels = slides.slice(0, maxPanels);
  const n      = panels.length;

  return (
    
    <div
      className="mpb2-stage MultiPanelBannerV2"
      style={{
        "--gap":      `${gap}px`,
        "--radius":   `${borderRadius}px`,
        "--ch":       `${cardHeight}px`,
        "--overflow": `${overflowTop}px`,
        paddingTop:   `${overflowTop}px`,
        gap:          `${gap}px`,
      }}
    >
      {panels.map((slide, i) => {
        let sc = {};
        try {
          sc = slide.config
            ? (typeof slide.config === "string" ? JSON.parse(slide.config) : slide.config)
            : {};
        } catch (_) {}

        const accent    = sc.accentColor || "#00e5ff";
        const bgImg     = slide.background_image_url || slide.background;
        const charImg   = slide.logo_url || slide.logo;
        const isLarge   = n === 3 && i === 0;
        const isHov     = hovered === i;
        const cardId    = slide.id != null ? slide.id : i;

        return (
         
          <div
            key={cardId}
            className={`mpb2-panel${isLarge ? " mpb2-panel--large" : ""}${isHov ? " mpb2-panel--hov" : ""}`}
            style={{ "--accent": accent }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            onClick={(e) => handleCta(slide, e)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && handleCta(slide, e)}
            aria-label={slide.title || `Panel ${i + 1}`}
          >
            {/* ── Inner card — overflow:hidden for bg ── */}
            <div className="mpb2-card">

              {/* Background image — proper <img> not backgroundImage */}
              {bgImg && (
                <img
                  src={bgImg}
                  alt=""
                  className="mpb2-bg"
                  draggable={false}
                />
              )}
              <div className="mpb2-bg-fallback" style={{ background: sc.bgColor || "#050d1a" }} />

              {/* Overlays */}
              <div className="mpb2-ov-base" />
              <div className="mpb2-ov-left" />
              <div className="mpb2-scanlines" />

              {/* Diagonal bottom accent slash */}
              <div className="mpb2-slash" />

              {/* Hover shimmer */}
              <div className="mpb2-shimmer" />

              {/* Content */}
              <div className="mpb2-content">

                {/* Vertical eyebrow — rotated 90° on left edge */}
                {slide.title_highlight && (
                  <div className="mpb2-eyebrow-wrap">
                    <span className="mpb2-eyebrow">{slide.title_highlight}</span>
                  </div>
                )}

                <div className="mpb2-text-block">
                  {/* Badge */}
                  {slide.badge_text && (
                    <div className="mpb2-badge">
                      <span className="mpb2-badge-pip" />
                      <span className="mpb2-badge-text">{slide.badge_text}</span>
                    </div>
                  )}

                  {/* Title */}
                  {slide.title && (
                    <h3 className="mpb2-title">{slide.title}</h3>
                  )}

                  {/* Subtitle */}
                  {slide.subtitle && (
                    <p className="mpb2-sub">{slide.subtitle}</p>
                  )}

                  {/* CTA — neon underline style */}
                  {slide.cta_text && slide.cta_link && (
                    <button
                      className="mpb2-ctaz"
                      onClick={(e) => handleCta(slide, e)}
                    >
                      <div className="mpb2-cta-inner-row">
                        <span className="mpb2-cta-label">{slide.cta_text}</span>
                        <svg className="mpb2-cta-arrow" width="14" height="14"
                          viewBox="0 0 24 24" fill="none" stroke="currentColor"
                          strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h14M13 6l6 6-6 6"/>
                        </svg>
                      </div>
                      <span className="mpb2-cta-line" />
                    </button>
                  )}
                </div>
              </div>

              {/* Accent glow bloom — top area where char erupts from */}
              <div className="mpb2-char-glow" />

            </div>{/* end .mpb2-card */}

            {/*
              CHARACTER IMAGE — rendered OUTSIDE .mpb2-card
              so it is NOT clipped by overflow:hidden.
              Position is absolute relative to .mpb2-panel
              which has overflow:visible and paddingTop.
              negative top value pulls it above the card.
            */}
            {charImg && (
              <img
                src={charImg}
                alt=""
                className={`mpb2-charz${isHov ? " mpb2-char--hov" : ""}`}
                draggable={false}
              />
            )}

            {/* Bottom podium accent line */}
            <div className="mpb2-podium" />

          </div>
        );
      })}
    </div>
  );
}
