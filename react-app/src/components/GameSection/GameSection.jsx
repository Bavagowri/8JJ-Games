import { useRef, useEffect, useState } from "react";
import GameCard from "../GameCard/GameCard";
import "./GameSection.css";

export default function GameSection({ title, games, id, slider = false }) {
  const sliderRef = useRef(null);
  const [showAll, setShowAll] = useState(false);

  // AUTOPLAY slider
  useEffect(() => {
    if (!slider) return;

    const sliderEl = sliderRef.current;
    if (!sliderEl) return;

    const autoplay = () => {
      if (sliderEl.scrollLeft + sliderEl.clientWidth >= sliderEl.scrollWidth - 5) {
        sliderEl.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        sliderEl.scrollBy({ left: 260, behavior: "smooth" });
      }
    };

    const interval = setInterval(autoplay, 2); // autoplay speed
    return () => clearInterval(interval);
  }, [slider, games]);

  // Visible games for NON-SLIDER sections
  const visibleGames = slider ? games : showAll ? games : games.slice(0, 12);

  return (
    <section className="game-section" id={id}>
      <h2 className="section-title">{title}</h2>

      {slider ? (
        // SLIDER MODE (Featured)
        <div className="slider-wrapper">
          <div className="slider-container" ref={sliderRef}>
            {visibleGames.map((g, i) => (
              <GameCard key={i} game={g} index={i} />
            ))}
          </div>
        </div>
      ) : (
        // NORMAL GRID MODE
        <div className="games-grid">
          {visibleGames.map((g, i) => (
            <GameCard key={i} game={g} index={i} />
          ))}
        </div>
      )}

      {/* VIEW MORE BUTTON for NON-SLIDER */}
      {!slider && games.length > 12 && (
        <button className="view-more-btn" onClick={() => setShowAll(!showAll)}>
          {showAll ? "View Less" : "View More"}
        </button>
      )}
    </section>
  );
}
