import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HeroBanner.css";

export default function HeroBanner({ slides, autoPlay = true, interval = 5000 }) {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (!autoPlay || slides.length <= 1) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, interval);

    return () => clearInterval(timer);
  }, [index, slides, autoPlay, interval]);

  const slide = slides[index];

  const handleClick = () => {
    if (slide.link) {
      navigate(slide.link);
    }
  };

  const prevSlide = (e) => {
    e.stopPropagation();
    setIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const nextSlide = (e) => {
    e.stopPropagation();
    setIndex((prev) => (prev + 1) % slides.length);
  };

  return (
    <section
      className="hero-banner"
      style={{ backgroundImage: `url(${slide.background})` }}
    >
      <div className="hero-overlay" />

      {/* ◀ LEFT ARROW */}
      {slides.length > 1 && (
        <button className="hero-arrow left" onClick={prevSlide}>
          ‹
        </button>
      )}

      {/* ▶ RIGHT ARROW */}
      {slides.length > 1 && (
        <button className="hero-arrow right" onClick={nextSlide}>
          ›
        </button>
      )}

      <div className="hero-content">
        {slide.badge && <span className="hero-badge">{slide.badge}</span>}

        <h1 className="hero-title">
          <span className="highlight">{slide.titleHighlight}</span>
          <br />
          {slide.title}
        </h1>

        {slide.subtitle && (
          <p className="hero-subtitle">{slide.subtitle}</p>
        )}

        {slide.cta && (
          <button className="hero-btn" onClick={handleClick}>
            {slide.cta}
          </button>
        )}
      </div>
    </section>
  );
}
