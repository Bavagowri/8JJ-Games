
// react-app/src/components/HotSection/HotSection.jsx
import { useEffect, useState, useRef } from "react";
import GameCard from "../GameCard/GameCard";
import { getHotGames } from "../../api/games.api";
import "./HotSection.css";

function SkeletonCard() {
  return (
    <div className="skeleton-card" role="status" aria-label="Loading game">
      <div className="skeleton-image" aria-hidden="true"></div>
      <div className="skeleton-content" aria-hidden="true">
        <div className="skeleton-title"></div>
        <div className="skeleton-subtitle"></div>
      </div>
      <span className="sr-only">Loading game information...</span>
    </div>
  );
}

export default function HotSection({ id, lang, translate }) {
  const [hotGames, setHotGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deviceType, setDeviceType] = useState("desktop");
  const sectionRef = useRef(null);

  // Detect device type using ResizeObserver
  useEffect(() => {
    const ro = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width ?? window.innerWidth;

      if (width < 768) setDeviceType("mobile");
      else if (width <= 1024) setDeviceType("tablet");
      else setDeviceType("desktop");
    });

    const el = sectionRef.current ?? document.documentElement;
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Fetch hot games from backend
  useEffect(() => {
    async function fetchHotGames() {
      try {
        const limit =
          deviceType === "mobile"
            ? 6
            : deviceType === "tablet"
            ? 9
            : 12;

        const data = await getHotGames(limit);
        setHotGames(data || []);
      } catch (err) {
        console.error("Failed to fetch hot games:", err);
        setHotGames([]);
      } finally {
        setLoading(false);
      }
    }

    fetchHotGames();
  }, [deviceType]);

  const getSkeletonCount = () => {
    if (deviceType === "mobile") return 6;
    if (deviceType === "tablet") return 9;
    return 12;
  };

  const sectionTitle = translate("hotGames", lang);
  const sectionDescription = `Trending games right now! Check out the hottest ${
    hotGames.length || "trending"
  } games on the platform.`;

  if (loading) {
    return (
      <section
        ref={sectionRef}
        className="hot-section game-section"
        id={id}
        aria-labelledby={`${id}-heading`}
        aria-busy="true"
      >
        <div className="content-anim">
          <header className="hot-header">
            <h2 className="section-title" id={`${id}-heading`}>
              🔥 {sectionTitle}
            </h2>
          </header>

          <div
            className="HotSkeleton"
            role="list"
            aria-label="Loading hot games"
          >
            {Array.from({ length: getSkeletonCount() }).map((_, i) => (
              <div key={i} role="listitem">
                <SkeletonCard />
              </div>
            ))}
          </div>

          <div className="sr-only" role="status" aria-live="polite">
            Loading hot games, please wait...
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="hot-section game-section"
      id={id}
      aria-labelledby={`${id}-heading`}
      itemScope
      itemType="https://schema.org/ItemList"
    >
      <meta itemProp="name" content="Hot Games" />
      <meta itemProp="description" content={sectionDescription} />
      <meta itemProp="numberOfItems" content={hotGames.length} />

      <div className="content-anim">
        <header className="Title-container-sections">
          <span
            className="section-emoji"
            aria-hidden="true"
            role="img"
            aria-label="Hot games icon"
          >
            🔥
          </span>
          <h2 id={`${id}-heading`} itemProp="name">
            <span className="section-title Title-align">
              {sectionTitle}
            </span>
          </h2>
        </header>

        <p className="sr-only" itemProp="description">
          {sectionDescription}
        </p>

        {hotGames.length > 0 ? (
          <div
            className="games-grid"
            role="list"
            aria-label="Hot and trending games"
          >
            {hotGames.map((game, index) => (
              <div
                key={`${game.id}-${index}`}
                role="listitem"
                itemProp="itemListElement"
                itemScope
                itemType="https://schema.org/ListItem"
              >
                <meta itemProp="position" content={index + 1} />
                <GameCard
                  game={game}
                  index={index}
                  isHot={true}
                />
              </div>
            ))}
          </div>
        ) : (
          <div
            className="empty-message"
            role="status"
            aria-live="polite"
          >
            <p>No hot games available at the moment. Check back soon!</p>
          </div>
        )}
      </div>
    </section>
  );
}
