
// react-app/src/components/PopularSection/PopularSection.jsx - SEO OPTIMIZED
import { useEffect, useState } from "react";
import GameCard from "../GameCard/GameCard";
import { loadPopular } from "../../utils/popularGamesUtils";
import { getPopularGames } from "../../api/games.api";


import "./PopularSection.css";

const API_BASE = import.meta.env.VITE_API_URL;
if (!API_BASE) {
  console.warn("VITE_API_URL is not defined");
}

export default function PopularSection({ id, lang, translate }) {
  const [popularGames, setPopularGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function fetchPopular() {
      try {
        const games = await getPopularGames(6);
        if (mounted) {
          setPopularGames(games);
        }
      } catch (err) {
        console.error("Popular fetch failed", err);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchPopular();

    return () => {
      mounted = false;
    };
  }, []);


  // Hide section while loading
  if (loading) {
    return null;
  }

  // Hide section if no popular games
  if (!popularGames || popularGames.length === 0) {
    return null;
  }

  //  SEO: Clean title without emoji
  const sectionTitle = translate("popularGames", lang);
  const cleanTitle = "Popular Games";

  //  SEO: Generate section description
  const sectionDescription = `Browse the most popular games on 8JJ Games. These ${popularGames.length} games are loved by our community and played thousands of times. See what everyone is playing!`;

  return (
    <section 
      className="popular-section game-section" 
      id={id}
      aria-labelledby={`${id}-heading`}
      itemScope
      itemType="https://schema.org/ItemList"
    >
      {/*  SEO: Hidden metadata for search engines */}
      <meta itemProp="name" content={cleanTitle} />
      <meta itemProp="description" content={sectionDescription} />
      <meta itemProp="numberOfItems" content={popularGames.length} />

      <div className="content-anim">
        {/*  SEO: Semantic header with proper structure */}
        <header className="Title-container-sections">
          <span 
            className="section-emoji" 
            aria-hidden="true"
            role="img"
            aria-label="Popular games icon"
          >
            🚀
          </span>
          <h2 id={`${id}-heading`} itemProp="name">
            <span className="section-title Title-align">
              {sectionTitle}
            </span>
          </h2>
        </header>

        {/*  SEO: Hidden description for search engines */}
        <p className="sr-only" itemProp="description">
          {sectionDescription}
        </p>

        {/*  SEO: Games grid with proper semantic markup */}
        <div 
          className="games-grid"
          role="list"
          aria-label="Most popular games on 8JJ Games"
        >
          {popularGames.map((game, index) => (
            <div 
              key={game.id} 
              className="game-card-wrapper"
              role="listitem"
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              {/*  SEO: Schema position */}
              <meta itemProp="position" content={index + 1} />

              {/*  SEO: Click count badge with proper accessibility */}
              <div 
                className="click-count"
                role="status"
                aria-label={`${game.total_plays} plays`}
              >
                <span aria-hidden="true">
                  {game.total_plays} {translate("playsCount", lang)}
                </span>
                <span className="sr-only">
                  This game has been played {game.total_plays} times
                </span>
              </div>

              <GameCard
                game={game}
                index={index}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}