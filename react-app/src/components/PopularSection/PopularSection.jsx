// PopularSection.jsx
import { useEffect, useState } from "react";
import GameCard from "../GameCard/GameCard";
import { loadPopular } from "../../utils/popularGamesUtils";
import "./PopularSection.css";

export default function PopularSection({ id, lang, translate }) {
  const [popularGames, setPopularGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Decide card limit based on screen size
    const getLimit = () => (window.innerWidth <= 768 ? 9 : 12);

    const loadGames = () => {
      const games = loadPopular();
      const limitedGames = games.slice(0, getLimit());
      setPopularGames(limitedGames);
      setLoading(false);
    };

    // Initial load
    loadGames();

    // Refresh on resize (mobile ↔ desktop)
    const handleResize = () => {
      loadGames();
    };

    // Refresh when localStorage changes
    const handleStorageChange = () => {
      loadGames();
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  if (loading) {
    return (
      <section className="popular-section game-section" id={id}>
        <div className="content-anim">
          <h2 className="section-title">
            💥 {translate("popularGames", lang)}
          </h2>
          <div className="games-grid">
            <p>Loading popular games...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="popular-section game-section" id={id}>
      <div className="content-anim">
        <h2 className="section-title">
          💥 {translate("popularGames", lang)}
        </h2>

        {popularGames && popularGames.length > 0 ? (
          <div className="games-grid">
            {popularGames.map((game, index) => (
              <div key={game.id} className="game-card-wrapper">
                {/* Click count badge */}
                <div className="click-count">
                  {game.clicks} plays
                </div>

                <GameCard
                  game={game}
                  index={index}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-message">
            <p>No popular games yet. Play games to see them here!</p>
          </div>
        )}
      </div>
    </section>
  );
}
