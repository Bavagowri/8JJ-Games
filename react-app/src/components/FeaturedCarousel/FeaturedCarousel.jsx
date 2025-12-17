import "./FeaturedCarousel.css";
import { useLanguage } from "../../context/LanguageContext";
import { translate } from "../../data/translations";
import { featuredGames } from "../../data/games";
import { pushRecent } from "../../utils/localStorage";
import { useRef, useEffect } from "react";

function openFeatured(game) {
  pushRecent(game);
  if (game.externalUrl) {
    window.open(game.externalUrl, "_blank", "noopener");
  } else if (game.gameId) {
    window.location.href =
      "game_detail_page.html?game=" + encodeURIComponent(game.gameId);
  }
}

export default function FeaturedCarousel() {
  const { lang } = useLanguage();
  const trackRef = useRef(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let x = 0;
    let rafId;
    const speed = 0.35; // 👈 smooth speed

    const loop = () => {
      x -= speed;

      // when half scrolled → reset seamlessly
      if (Math.abs(x) >= track.scrollWidth / 2) {
        x = 0;
      }

      track.style.transform = `translateX(${x}px)`;
      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <section className="section" id="collectionsSection">
      <h2 className="section-header">
        <span className="section-icon">⭐</span>
        <span className="section-title">
          {translate("featured", lang)}
        </span>
      </h2>

      <div className="featured-strip">
        <div className="featured-track" ref={trackRef}>
          {[...featuredGames, ...featuredGames].map((game, idx) => (
            <button
              key={`${game.id}-${idx}`}
              className="f-card"
              onClick={() => openFeatured(game)}
            >
              <div
                className="f-thumb"
                style={{ backgroundImage: `url(${game.image})` }}
              />
              <div className="f-title">{game.title}</div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
