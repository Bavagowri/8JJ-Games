import { useRef, useEffect, useState } from "react";
import GameCard from "../GameCard/GameCard";
import "./GameSection.css";

export default function GameSection({ title, games, id, slider = false }) {
  const sliderRef = useRef(null);
  const [showAll, setShowAll] = useState(false);

  /* ✅ AUTOPLAY slider (NO vibration) */
  useEffect(() => {
    if (!slider) return;

    const el = sliderRef.current;
    if (!el) return;

    const speed = 0.4; // px per frame

    const canScroll = () =>
      el.scrollWidth > el.clientWidth + 5;

    const animate = () => {
      if (!pausedRef.current && canScroll()) {
        // Smooth loop without snapping
        if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 1) {
          el.scrollLeft = 0;
        } else {
          el.scrollLeft += speed;
        }
      }
      rafRef.current = requestAnimationFrame(animate);
    };

    const onEnter = () => (pausedRef.current = true);
    const onLeave = () => (pausedRef.current = false);

    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [slider, games.length]); // 👈 games.length is important

  const visibleGames = slider
    ? games
    : showAll
    ? games
    : games.slice(0, 12);

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