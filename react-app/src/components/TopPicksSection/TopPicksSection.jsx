// react-app/src/components/TopPicksSection/TopPicksSection.jsx - SEO OPTIMIZED

import { useRef, useState, useEffect } from "react";
import GameCard from "../GameCard/GameCard";
import "./TopPicksSection.css";

export default function TopPicksSection({
  title,       // JSX (icon + text)
  titleText,   // STRING (SEO / schema)
  games,
  id,
}) {
  const containerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  /* ================= Mobile Detection ================= */
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  /* ================= Scroll Controls ================= */
  const checkScrollButtons = () => {
    if (!containerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  const scroll = (direction) => {
    if (!containerRef.current) return;
    const gap = 32;
    const scrollAmount = containerRef.current.clientWidth + gap;
    containerRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
    setTimeout(checkScrollButtons, 300);
  };

  /* ================= Slides Logic ================= */
  const gamesPerSlide = isMobile ? 10 : 11;
  const gridGamesCount = isMobile ? 9 : 10;

  const slides = [];
  for (let i = 0; i < games.length; i += gamesPerSlide) {
    slides.push(games.slice(i, i + gamesPerSlide));
  }

  /* ================= SEO ================= */
  const cleanTitle = titleText;

  const sectionDescription = `Discover our handpicked collection of ${games.length} top games. Featuring ${slides.length} curated slides with the best free online games across all categories.`;

  /* ================= RENDER ================= */
  return (
    <section
      className="top-picks-section game-section"
      id={id}
      aria-labelledby={`${id}-heading`}
      itemScope
      itemType="https://schema.org/ItemList"
    >
      {/* SEO Metadata */}
      <meta itemProp="name" content={cleanTitle} />
      <meta itemProp="description" content={sectionDescription} />
      <meta itemProp="numberOfItems" content={games.length} />

      <div className="content-anim">
        {/* Header */}
        <header className="Title-container-sections">
          <h2
            className="section-title"
            id={`${id}-heading`}
            itemProp="name"
          >
            {title}
          </h2>
        </header>

        {/* Hidden SEO Description */}
        <p className="sr-only" itemProp="description">
          {sectionDescription}
        </p>

        {/* Carousel */}
        <div
          className="top-picks-wrapper"
          role="region"
          aria-roledescription="carousel"
          aria-label={`${cleanTitle} carousel`}
        >
          {/* Left Button */}
          {canScrollLeft && (
            <button
              onClick={() => scroll("left")}
              className="top-picks-nav left"
              aria-label={`Previous ${cleanTitle} slide`}
              type="button"
            >
              <svg
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span className="sr-only">Previous games</span>
            </button>
          )}

          {/* Scroll Container */}
          <div
            className="top-picks-container"
            ref={containerRef}
            onScroll={checkScrollButtons}
            role="list"
            aria-live="polite"
          >
            {slides.map((slideGames, slideIndex) => (
              <div
                key={slideIndex}
                className="top-picks-slide"
                role="group"
                aria-roledescription="slide"
                aria-label={`Slide ${slideIndex + 1} of ${slides.length}`}
              >
                {/* Featured Game */}
                {slideGames[0] && (
                  <div
                    className="top-picks-featured"
                    role="listitem"
                    itemProp="itemListElement"
                    itemScope
                    itemType="https://schema.org/ListItem"
                  >
                    <meta
                      itemProp="position"
                      content={slideIndex * gamesPerSlide + 1}
                    />
                    <GameCard
                      game={slideGames[0]}
                      index={slideIndex * gamesPerSlide}
                      isFeatured
                    />
                  </div>
                )}

                {/* Grid Games */}
                <div className="top-picks-grid" role="list">
                  {slideGames
                    .slice(1, 1 + gridGamesCount)
                    .map((game, index) => (
                      <div
                        key={index}
                        className="top-picks-grid-item"
                        role="listitem"
                        itemProp="itemListElement"
                        itemScope
                        itemType="https://schema.org/ListItem"
                      >
                        <meta
                          itemProp="position"
                          content={
                            slideIndex * gamesPerSlide + index + 2
                          }
                        />
                        <GameCard
                          game={game}
                          index={
                            slideIndex * gamesPerSlide + index + 1
                          }
                        />
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>

          {/* Right Button */}
          {canScrollRight && (
            <button
              onClick={() => scroll("right")}
              className="top-picks-nav right"
              aria-label={`Next ${cleanTitle} slide`}
              type="button"
            >
              <svg
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
              <span className="sr-only">Next games</span>
            </button>
          )}
        </div>

        {/* Screen Reader Status */}
        <div
          className="sr-only"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          Showing {slides.length} slides of top picks.
        </div>
      </div>
    </section>
  );
}
