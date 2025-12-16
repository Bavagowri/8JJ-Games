import { useRef, useEffect, useState } from "react";
import GameCard from "../GameCard/GameCard";
import "./GameSection.css";

export default function GameSection({ title, games, id, slider = false }) {
  const sliderRef = useRef(null);
  const [showAll, setShowAll] = useState(false);

  // AUTOPLAY slider with pause on hover
  useEffect(() => {
    if (!slider) return;

    const sliderEl = sliderRef.current;
    if (!sliderEl) return;

    let rafId;
    let speed = 0.5; // px per frame
    let isPaused = false;

    const animate = () => {
      if (!isPaused) {
        if (
          sliderEl.scrollLeft + sliderEl.clientWidth >=
          sliderEl.scrollWidth
        ) {
          sliderEl.scrollLeft = 0;
        } else {
          sliderEl.scrollLeft += speed;
        }
      }
      rafId = requestAnimationFrame(animate);
    };

    // Pause animation when hovering over slider
    const handleMouseEnter = () => {
      isPaused = true;
    };

    const handleMouseLeave = () => {
      isPaused = false;
    };

    // Add event listeners to the slider container
    sliderEl.addEventListener('mouseenter', handleMouseEnter);
    sliderEl.addEventListener('mouseleave', handleMouseLeave);

    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      sliderEl.removeEventListener('mouseenter', handleMouseEnter);
      sliderEl.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [slider]);

  const visibleGames = slider ? games : showAll ? games : games.slice(0, 12);

  return (
    <section className="game-section" id={id}>

      <div className="content-anim">

        <h2 className="section-title">{title}</h2>

        {slider ? (
          <div className="slider-wrapper">
            <div className="slider-container" ref={sliderRef}>
              {visibleGames.map((g, i) => (
                <GameCard key={i} game={g}/>
              ))}
            </div>
          </div>
        ) : (
          <div className="games-grid">
            {visibleGames.map((g, i) => (
              <GameCard key={i} game={g} />
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