

// react-app/src/components/HeroBanner/HeroBanner.jsx
import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./HeroBanner.css";

export default function HeroBanner({ slides, autoPlay = true, interval = 5000 }) {
  const [index, setIndex] = useState(0);
  const touchStartRef = useRef(null);
  const touchEndRef = useRef(null);
  const navigate = useNavigate();

  const minSwipeDistance = 50;


  const nextIndex = useCallback(() => {
    setIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const nextIndexRef = useRef(nextIndex);
  useEffect(() => { nextIndexRef.current = nextIndex; }, [nextIndex]);

  useEffect(() => {
    if (!autoPlay || slides.length <= 1) return;
    const timer = setInterval(() => nextIndexRef.current(), interval);
    return () => clearInterval(timer);
    // interval and autoPlay intentionally omitted — changes to these are rare
    // and we don't want to restart the timer on every render
  }, [slides.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const slide = slides[index];

  const handleClick = useCallback(() => {
    if (slide.link) navigate(slide.link);
  }, [slide.link, navigate]);

  const prevSlide = useCallback((e) => {
    e.stopPropagation();
    setIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const nextSlide = useCallback((e) => {
    e.stopPropagation();
    setIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  
  const onTouchStart = useCallback((e) => {
    touchStartRef.current = e.targetTouches[0].clientX;
    touchEndRef.current = null;
  }, []);

  const onTouchMove = useCallback((e) => {
    touchEndRef.current = e.targetTouches[0].clientX;
  }, []);

  const onTouchEnd = useCallback(() => {
    if (touchStartRef.current === null || touchEndRef.current === null) return;
    const distance = touchStartRef.current - touchEndRef.current;
    if (distance > minSwipeDistance) {
      setIndex((prev) => (prev + 1) % slides.length);
    } else if (distance < -minSwipeDistance) {
      setIndex((prev) => (prev - 1 + slides.length) % slides.length);
    }
    touchStartRef.current = null;
    touchEndRef.current = null;
  }, [slides.length]);

  return (
    <section
      className="hero-banner"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      role="region"
      aria-label="Hero banner carousel"
    >
      <img
        src={slide.background}
        alt={`${slide.titleHighlight ?? ""} - Hero banner`}
        className="hero-background-image"
        fetchpriority={index === 0 ? "high" : "low"}
        loading={index === 0 ? "eager" : "lazy"}
        decoding="async"
        width="1920"
        height="420"
      />

      <div className="hero-overlay" />

      {slides.length > 1 && (
        <button className="hero-arrow left" onClick={prevSlide} aria-label="Previous slide">
          ‹
        </button>
      )}
      {slides.length > 1 && (
        <button className="hero-arrow right" onClick={nextSlide} aria-label="Next slide">
          ›
        </button>
      )}

      <div className="hero-content">
        <img
          src="/8JJ_games.png"
          alt="8JJ Games Logo"
          className="hero-content-logo"
          width="70"
          height="70"
          loading="eager"
          decoding="async"
        />

        {slide.badge && <span className="hero-badge">{slide.badge}</span>}

        <h1 className="hero-title">
          <span className="highlight">{slide.titleHighlight}</span>
          <br />
          {slide.title}
        </h1>

        {slide.subtitle && <p className="hero-subtitle">{slide.subtitle}</p>}

        {slide.cta && (
          <button className="hero-btn" onClick={handleClick}>
            {slide.cta}
          </button>
        )}
      </div>

      {slides.length > 1 && (
        <div className="hero-indicators" role="tablist" aria-label="Slide navigation">
          {slides.map((_, i) => (
            <button
              key={i}
              className={`indicator ${i === index ? "active" : ""}`}
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              aria-selected={i === index}
              role="tab"
            />
          ))}
        </div>
      )}
    </section>
  );
}