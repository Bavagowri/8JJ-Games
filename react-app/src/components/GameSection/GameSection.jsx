import { useRef, useEffect, useState } from "react";
import GameCard from "../GameCard/GameCard";
import "./GameSection.css";

export default function GameSection({ title, games, id, slider = false, trending = false }) {
  const sliderRef = useRef(null);
  const [showAll, setShowAll] = useState(false);

  // AUTOPLAY slider
  useEffect(() => {
    if (!slider) return;

    const sliderEl = sliderRef.current;
    if (!sliderEl) return;

    let rafId;
    let speed = 0.4; // px per frame

    const animate = () => {
      if (
        sliderEl.scrollLeft + sliderEl.clientWidth >=
        sliderEl.scrollWidth
      ) {
        sliderEl.scrollLeft = 0;
      } else {
        sliderEl.scrollLeft += speed;
      }
      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(rafId);
  }, [slider]);

  const scroll = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = 300;
      sliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const visibleGames = slider ? games : showAll ? games : games.slice(0, 12);

  // Trending Games Layout
  if (trending) {
    return (
      <section className="game-section trending-section" id={id}>
        <div className="content-anim">
          
          {/* Header with Navigation */}
          <div className="trending-header">
            <h2 className="section-title">{title}</h2>
            <div className="trending-nav">
              <button
                onClick={() => scroll('left')}
                className="nav-btn"
                aria-label="Scroll left"
              >
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => scroll('right')}
                className="nav-btn"
                aria-label="Scroll right"
              >
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Trending Games Carousel */}
          <div className="trending-wrapper">
            <div className="trending-container" ref={sliderRef}>
              {games.map((game, i) => (
                <div key={i} className="trending-item">
                  {/* Background Number */}
                  <div className="trending-number">{i + 1}</div>
                  
                  {/* Game Card */}
                  <div className="trending-card-wrapper">
                    <GameCard game={game} index={i} />
                    <div className="rank-badge">{i + 1}</div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Gradient Overlays */}
            <div className="gradient-left"></div>
            <div className="gradient-right"></div>
          </div>

        </div>
      </section>
    );
  }

  // Original Layout (Grid or Slider)
  return (
    <section className="game-section" id={id}>
      
      <div className="content-anim">

        <h2 className="section-title">{title}</h2>

        {slider ? (
          <div className="slider-wrapper">
            <div className="slider-container" ref={sliderRef}>
              {visibleGames.map((g, i) => (
                <GameCard key={i} game={g} index={i} />
              ))}
            </div>
          </div>
        ) : (
          <div className="games-grid">
            {visibleGames.map((g, i) => (
              <GameCard key={i} game={g} index={i} />
            ))}
          </div>
        )}

        {!slider && games.length > 12 && (
          <div className="container">
            <a
              className="btn"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setShowAll(!showAll);
              }}
            >
              <span className="btnInner">
                {showAll ? "View Less" : "View More"}
              </span>
            </a>
          </div>
        )}

      </div>

    </section>
  );
}