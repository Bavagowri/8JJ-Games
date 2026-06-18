


// react-app/src/components/UniversalBanner/templates/CarouselCardsBannerV2.jsx

import { useCallback, useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CarouselCardsBannerV2.css";
import { loadBannerFont, BANNER_FONTS } from '../../../utils/loadBannerFont';

export default function CarouselCardsBannerV2({ banner, slides, config, onSlideClick }) {
  useEffect(() => { loadBannerFont(BANNER_FONTS.CarouselCardsBannerV2); }, []);
  const navigate  = useNavigate();
  const trackRef  = useRef(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd,   setAtEnd]   = useState(false);
  const [activeIdx, setActiveIdx] = useState(null);

  const {
    visibleCards  = 3,
    cardHeight    = 240,
    gap           = 14,
    borderRadius  = 16,
    accentColor   = "#00e5ff",
    showArrows    = true,
  } = config || {};

  const handleClick = useCallback((slide, e) => {
    e?.stopPropagation();
    if (!slide.cta_link) return;
    onSlideClick?.(slide.cta_link);
    slide.cta_link.startsWith("http")
      ? window.open(slide.cta_link, "_blank", "noopener")
      : navigate(slide.cta_link);
  }, [navigate, onSlideClick]);

  const updateEdges = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 8);
    setAtEnd(el.scrollLeft >= el.scrollWidth - el.clientWidth - 8);
  }, []);

  const scroll = useCallback((dir) => {
    const el = trackRef.current;
    if (!el) return;
    const cardW = el.clientWidth / visibleCards;
    el.scrollBy({ left: dir * (cardW + gap), behavior: "smooth" });
  }, [visibleCards, gap]);

  useEffect(() => {
    updateEdges();
  }, [slides]);

  if (!slides || slides.length === 0) return null;

  const cardWidthPct = `calc(${100 / visibleCards}% - ${gap * (visibleCards - 1) / visibleCards}px)`;

  return (
    <div className="ccb2-wrap CarouselCardsBannerV2">

      {/* Prev arrow */}
      {showArrows && !atStart && (
        <button
          className="ccb2-arrow ccb2-arrow-prev"
          onClick={() => scroll(-1)}
          aria-label="Previous"
          style={{ "--accent": accentColor }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>
      )}

      {/* Scrollable track */}
      <div
        ref={trackRef}
        className="ccb2-track"
        style={{ gap: `${gap}px` }}
        onScroll={updateEdges}
      >
        {slides.map((slide, i) => {
          let sc = {};
          try { sc = slide.config ? (typeof slide.config === "string" ? JSON.parse(slide.config) : slide.config) : {}; } catch(_) {}
          const accent = sc.accentColor || accentColor;
          const isActive = activeIdx === i;

          return (
            <div
              key={slide.id || i}
              className={`ccb2-card${isActive ? " ccb2-card--active" : ""}`}
              style={{
                backgroundImage: slide.background_image_url ? `url(${slide.background_image_url})` : undefined,
                width: cardWidthPct,
                height: `${cardHeight}px`,
                borderRadius: `${borderRadius}px`,
                flexShrink: 0,
                "--accent": accent,
              }}
              onClick={(e) => handleClick(slide, e)}
              onMouseEnter={() => setActiveIdx(i)}
              onMouseLeave={() => setActiveIdx(null)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && handleClick(slide, e)}
            >
              {/* Deep dark overlay - gradient from bottom */}
              <div className="ccb2-overlay" />

              {/* Animated scanline texture */}
              <div className="ccb2-scanlines" />

              {/* Neon border glow frame */}
              <div className="ccb2-border-glow" />

              {/* Top-left corner bracket decorations */}
              <div className="ccb2-corner ccb2-corner-tl" />
              <div className="ccb2-corner ccb2-corner-br" />

              {/* Character / decorative image */}
              {slide.logo_url && (
                <img src={slide.logo_url} alt="" className="ccb2-char" draggable={false} />
              )}

              {/* Hover shimmer sweep */}
              <div className="ccb2-shimmer-sweep" />

              {/* Live indicator dot (optional badge area enhancement) */}
              {slide.badge_text && (
                <div className="ccb2-live-badge" style={{ background: accent }}>
                  <span className="ccb2-live-dot" />
                  {slide.badge_text}
                </div>
              )}

              {/* Content block */}
              <div className="ccb2-content">
                {slide.title_highlight && (
                  <p className="ccb2-eyebrow" style={{ color: accent }}>
                    <span className="ccb2-eyebrow-line" style={{ background: accent }} />
                    {slide.title_highlight}
                  </p>
                )}
                {slide.title && (
                  <h3 className="ccb2-title">
                    {slide.title}
                  </h3>
                )}
                {slide.subtitle && (
                  <p className="ccb2-sub">{slide.subtitle}</p>
                )}
                {slide.cta_text && slide.cta_link && (
                  <button
                    className="ccb2-cta"
                    onClick={(e) => handleClick(slide, e)}
                    style={{ "--accent": accent }}
                  >
                    <span className="ccb2-cta-bg" />
                    <span className="ccb2-cta-text">
                      {slide.cta_text}
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </span>
                  </button>
                )}
              </div>

              {/* Bottom accent line */}
              <div className="ccb2-bottom-bar" style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }} />
            </div>
          );
        })}
      </div>

      {/* Next arrow */}
      {showArrows && !atEnd && (
        <button
          className="ccb2-arrow ccb2-arrow-next"
          onClick={() => scroll(1)}
          aria-label="Next"
          style={{ "--accent": accentColor }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>
      )}
    </div>
  );
}
