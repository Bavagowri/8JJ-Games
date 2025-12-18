import { useEffect, useState, useRef } from "react";
import GameCard from "../GameCard/GameCard";
import { loadRecent } from "../../utils/localStorage";
import "./RecentSection.css";

export default function RecentSection({ id, lang, translate }) {
  const [recentGames, setRecentGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const carouselRef = useRef(null);

  useEffect(() => {
    // Load recent games from localStorage
    const games = loadRecent();
    // Keep only 30 games
    const limitedGames = games.slice(0, 30);
    setRecentGames(limitedGames);
    setLoading(false);
  }, []);

  useEffect(() => {
    const checkScroll = () => {
      if (carouselRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
      }
    };

    checkScroll();
    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
    }

    return () => {
      if (carousel) {
        carousel.removeEventListener('scroll', checkScroll);
      }
      window.removeEventListener('resize', checkScroll);
    };
  }, [recentGames]);

  const scroll = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = carouselRef.current.clientWidth * 0.8;
      const newScrollLeft = direction === 'left'
        ? carouselRef.current.scrollLeft - scrollAmount
        : carouselRef.current.scrollLeft + scrollAmount;

      carouselRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  // Hide the entire section if loading is complete and there are no games
  if (!loading && (!recentGames || recentGames.length === 0)) {
    return null;
  }

  if (loading) {
    return (
      <section className="recent-section" id={id}>
        <div className="content-anim">
          <div className="recent-carousel-wrapper">
            <div className="recent-carousel-container">
              <ul className="recent-carousel">
                <li className="recent-carousel-item recent-label-item">
                  <div className="recent-label skeleton-label">
                    <div className="skeleton-text"></div>
                    <div className="skeleton-arrow"></div>
                  </div>
                </li>
                {[...Array(8)].map((_, i) => (
                  <li key={i} className="recent-carousel-item">
                    <div className="skeleton-card">
                      <div className="skeleton-image"></div>
                      <div className="skeleton-title"></div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="recent-section" id={id}>
      <div className="content-anim">
        <div className="recent-carousel-wrapper">
          <div className="recent-carousel-container">
            {canScrollLeft && (
              <button
                className="carousel-arrow carousel-arrow-left"
                onClick={() => scroll('left')}
                aria-label="Scroll left"
              />
            )}

            <ul className="recent-carousel" ref={carouselRef}>
              <li className="recent-carousel-item recent-label-item">
                <div className="recent-label">
                  <span>{translate("recentlyPlayed", lang)}</span>
                  <svg viewBox="0 0 24 24" className="recent-label-arrow">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      fill="white"
                      d="M7.25759 2.33006C7.62758 1.92004 8.25992 1.88759 8.66994 2.25758L16.9814 9.75758C18.3395 10.9831 18.3395 13.0169 16.9814 14.2424L8.66994 21.7424C8.25992 22.1124 7.62758 22.08 7.25759 21.6699C6.88759 21.2599 6.92005 20.6276 7.33007 20.2576L15.6415 12.7576C16.1195 12.3263 16.1195 11.6737 15.6415 11.2424L7.33007 3.74242C6.92005 3.37242 6.88759 2.74009 7.25759 2.33006Z"
                    ></path>
                  </svg>
                </div>
              </li>
              {recentGames.map((game) => (
                <li key={game.id} className="recent-carousel-item">
                  <GameCard game={game} index={0} />
                </li>
              ))}
            </ul>

            {canScrollRight && (
              <button
                className="carousel-arrow carousel-arrow-right"
                onClick={() => scroll('right')}
                aria-label="Scroll right"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}