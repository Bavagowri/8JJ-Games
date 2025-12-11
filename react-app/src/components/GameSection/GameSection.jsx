import { useRef, useEffect } from "react";
import GameCard from "../GameCard/GameCard";
import "./GameSection.css";

export default function GameSection({ title, games, id, slider = false }) {
  const sliderRef = useRef(null);

  // AUTOPLAY slider
  useEffect(() => {
    if (!slider) return;

    const sliderEl = sliderRef.current;
    if (!sliderEl) return;

    const autoplay = () => {
      // End reached? → loop to start
      if (sliderEl.scrollLeft + sliderEl.clientWidth >= sliderEl.scrollWidth - 5) {
        sliderEl.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        sliderEl.scrollBy({ left: 260, behavior: "smooth" });
      }
    };

    const interval = setInterval(autoplay, 1); // autoplay speed

    return () => clearInterval(interval);
  }, [slider, games]);

  // UI RENDER
  return (
    <section className="game-section" id={id}>
      <h2 className="section-title">{title}</h2>

      {slider ? (
        <div className="slider-wrapper">
          <div className="slider-container" ref={sliderRef}>
            {games.map((g, i) => (
              <GameCard key={i} game={g} index={i} />
            ))}
          </div>
        </div>
      ) : (
        <div className="games-grid">
          {games.map((g, i) => (
            <GameCard key={i} game={g} index={i} />
          ))}
        </div>
      )}
    </section>
  );
}
