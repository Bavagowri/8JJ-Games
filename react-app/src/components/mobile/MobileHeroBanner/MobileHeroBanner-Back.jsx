// react-app/src/components/mobile/MobileHeroBanner/MobileHeroBanner.jsx


import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./MobileHeroBanner.css";

export default function MobileHeroBanner({ slides, autoPlay = true, interval = 5000 }) {
  const navigate    = useNavigate();
  const trackRef    = useRef(null);
  const autoPlayRef = useRef(null);

  const [index,      setIndex]      = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart,  setDragStart]  = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [loaded,     setLoaded]     = useState(false);

  const total = slides?.length || 0;

  // ── Loaded state (prevents flash before images are ready) ──────────────
  useEffect(() => {
    if (total === 0) return;
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, [total]);

  // ── Auto-play ──────────────────────────────────────────────────────────
  const startAutoPlay = useCallback(() => {
    if (!autoPlay || total <= 1) return;
    autoPlayRef.current = setInterval(() => {
      setIndex(prev => (prev + 1) % total);
    }, interval);
  }, [autoPlay, interval, total]);

  const stopAutoPlay = useCallback(() => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
  }, []);

  useEffect(() => {
    startAutoPlay();
    return stopAutoPlay;
  }, [startAutoPlay, stopAutoPlay]);

  // ── Touch / drag ───────────────────────────────────────────────────────
  const handleTouchStart = (e) => {
    stopAutoPlay();
    setIsDragging(true);
    setDragStart(e.touches[0].clientX);
    setDragOffset(0);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    setDragOffset(e.touches[0].clientX - dragStart);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (dragOffset < -50 && index < total - 1) setIndex(p => p + 1);
    else if (dragOffset > 50 && index > 0)     setIndex(p => p - 1);

    setDragOffset(0);
    startAutoPlay();
  };

  // ── CTA navigation — mirrors HeroBanner's handleClick exactly ──────────
  const handleCtaClick = useCallback((e, link) => {
    e.stopPropagation();
    if (!link) return;
    if (link.startsWith("http")) {
      window.open(link, "_blank", "noopener,noreferrer");
    } else {
      navigate(link);
    }
  }, [navigate]);

  // ── Guards ─────────────────────────────────────────────────────────────
  if (!slides || total === 0) return null;
  if (!loaded) return <div className="mobile-hero-skeleton" />;

  const translateX =
    -(index * 100) + (dragOffset / (trackRef.current?.clientWidth || 375)) * 100;

  return (
    <div
      className="mobile-hero-bannerz"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* ── Slide track ── */}
      <div
        ref={trackRef}
        className={`mobile-hero-track${isDragging ? " no-transition" : ""}`}
        style={{ transform: `translateX(${translateX}%)` }}
      >
        {slides.map((slide, i) => (
          <div key={i} className="mobile-hero-slide">

            {/* Background — same field as HeroBanner: slide.background */}
            {slide.background && (
              <img
              
                src={slide.background}
                alt={slide.titleHighlight || slide.title || ""}
                loading={i === 0 ? "eager" : "lazy"}
                draggable={false}
              />
            )}

            <div className="mobile-hero-overlay" />

            <div className="mobile-hero-content">

              {/* Logo — same field as HeroBanner: slide.logo with fallback */}
              <img
                src={slide.logo || "/8JJ_games.png"}
                alt="Logo"
                className="mobile-hero-logo"
                draggable={false}
              />

              {/* Badge — same field: slide.badge */}
              {slide.badge && (
                <span className="mobile-hero-badge">{slide.badge}</span>
              )}

              {/* Title — same structure as HeroBanner:
                    titleHighlight on top in cyan, then title below */}
              {(slide.title || slide.titleHighlight) && (
                <h2 className="mobile-hero-title">
                  {slide.titleHighlight && (
                    <>
                      <span className="mobile-hero-title-highlight">
                        {slide.titleHighlight}
                      </span>
                      {slide.title && <br />}
                    </>
                  )}
                  {slide.title}
                </h2>
              )}

              {/* Subtitle — same field: slide.subtitle */}
              {slide.subtitle && (
                <p className="mobile-hero-subtitle">{slide.subtitle}</p>
              )}

              {/* CTA — same fields: slide.cta + slide.link */}
              {slide.cta && slide.link && (
                <button
                  className="mobile-hero-cta"
                  onClick={(e) => handleCtaClick(e, slide.link)}
                >
                  {slide.cta}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ── Dot indicators ── */}
      {total > 1 && (
        <div className="mobile-hero-dots">
          {slides.map((_, i) => (
            <button
              key={i}
              className={`mobile-hero-dot${i === index ? " active" : ""}`}
              onClick={() => { stopAutoPlay(); setIndex(i); startAutoPlay(); }}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}