import { useRef } from "react";
import GameCard from "../GameCard/GameCard";
import "./TrendingSection.css";

export default function TrendingSection({ title, games, id }) {
  const sliderRef = useRef(null);

  const scroll = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = 300;
      sliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="trending-section game-section" id={id}>
      <div className="content-anim">
      <div className="trending-content">

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

                </div>
              </div>
            ))}
          </div>

         
        </div>

      </div>
      </div>
    </section>
  );
}