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

  const visibleGames = slider ? games : showAll ? games : games.slice(0, 12);

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
