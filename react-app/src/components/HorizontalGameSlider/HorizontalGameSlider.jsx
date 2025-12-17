import { useRef } from "react";
import GameCard from "../GameCard/GameCard";
import "./HorizontalGameSlider.css";

export default function HorizontalGameSlider({ title, games }) {
  const sliderRef = useRef(null);

  const scroll = (direction) => {
    if (!sliderRef.current) return;

    const amount = sliderRef.current.clientWidth * 0.9;
    sliderRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <section className="h-slider-section">
      <div className="h-slider-header">
        <h2>{title}</h2>

        <div className="h-slider-arrows">
          <button onClick={() => scroll("left")}>‹</button>
          <button onClick={() => scroll("right")}>›</button>
        </div>
      </div>

      <div className="h-slider-wrapper" ref={sliderRef}>
        {games.map((game) => (
          <div className="h-slider-item" key={game.id}>
            <GameCard game={game} />
          </div>
        ))}
      </div>
    </section>
  );
}
