import { useRef, useState, useEffect } from "react";
import GameCard from "../GameCard/GameCard";
import "./TopPicksSection.css";

export default function TopPicksSection({ title, games, id }) {
  const containerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const checkScrollButtons = () => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction) => {
    if (containerRef.current) {
      // Get the width of the container plus the gap between slides
      const gap = 32; // 2rem = 32px
      const scrollAmount = containerRef.current.clientWidth + gap;
      containerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
      setTimeout(checkScrollButtons, 300);
    }
  };

  // Group games into slides - adjust based on mobile/desktop
  const gamesPerSlide = isMobile ? 10 : 9; // 1 featured + 9 grid (mobile) or 1 featured + 8 grid (desktop)
  const gridGamesCount = isMobile ? 9 : 8;

  const slides = [];
  for (let i = 0; i < games.length; i += gamesPerSlide) {
    slides.push(games.slice(i, i + gamesPerSlide));
  }

  return (
    <section className="top-picks-section game-section" id={id}>
      <div className="content-anim">


        <h2 className="section-title">{title}</h2>


        <div className="top-picks-wrapper">
          {/* Navigation Buttons */}
          {canScrollLeft && (
            <button
              onClick={() => scroll('left')}
              className="top-picks-nav left"
              aria-label="Previous"
            >
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          <div
            className="top-picks-container"
            ref={containerRef}
            onScroll={checkScrollButtons}
          >
            {slides.map((slideGames, slideIndex) => (
              <div key={slideIndex} className="top-picks-slide">

                {/* Large Featured Game (Left) */}
                {slideGames[0] && (
                  <div className="top-picks-featured">
                    <GameCard game={slideGames[0]} index={0} />
                  </div>
                )}

                {/* Small Games Grid (Right) - 8 games on desktop, 9 on mobile */}
                <div className="top-picks-grid">
                  {slideGames.slice(1, 1 + gridGamesCount).map((game, index) => (
                    <div key={index} className="top-picks-grid-item">
                      <GameCard game={game} index={index + 1} />
                    </div>
                  ))}
                </div>

              </div>
            ))}
          </div>

          {canScrollRight && (
            <button
              onClick={() => scroll('right')}
              className="top-picks-nav right"
              aria-label="Next"
            >
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>

      </div>
    </section>
  );
}