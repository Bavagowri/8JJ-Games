

// react-app/src/components/FeaturedCarousel/FeaturedCarousel.jsx
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
  const halfWidthRef = useRef(0);
  const xRef = useRef(0);
  const rafIdRef = useRef(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // ─── FIX: measure ONCE with ResizeObserver, not inside the loop ──────
    // The original code read track.scrollWidth / 2 inside requestAnimationFrame
    // every frame — that's a layout read after a style write = forced reflow.
    // ResizeObserver fires after layout is already committed, so reading
    // scrollWidth here costs nothing extra.
    const ro = new ResizeObserver(() => {
      halfWidthRef.current = track.scrollWidth / 2;
    });
    ro.observe(track);

    // ─── Animation loop — pure math + one style write, zero reads ─────────
    const loop = () => {
      xRef.current -= 0.35;
      if (halfWidthRef.current > 0 && Math.abs(xRef.current) >= halfWidthRef.current) {
        xRef.current = 0;
      }
      track.style.transform = `translateX(${xRef.current}px)`;
      rafIdRef.current = requestAnimationFrame(loop);
    };

    rafIdRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafIdRef.current);
      ro.disconnect();
    };
  }, []);

  return (
    <section className="section" id="collectionsSection">
      <div className="Title-container-sections">
        <span className="section-emoji" aria-hidden="true">⭐</span>
        <h2>
          <span className="section-title Title-align">
            {translate("featured", lang)}
          </span>
        </h2>
      </div>

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