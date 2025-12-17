// PopularSection.jsx
import { useEffect, useState } from "react";
import GameCard from "../GameCard/GameCard";
import { loadPopular } from "../../utils/popularGamesUtils";
import "./PopularSection.css";

export default function PopularSection({ id, lang, translate }) {
  const [popularGames, setPopularGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load popular games from localStorage
    const games = loadPopular();
    // Keep only 12 games
    const limitedGames = games.slice(0, 12);
    setPopularGames(limitedGames);
    setLoading(false);

    // Refresh popular games when storage changes
    const handleStorageChange = () => {
      const updatedGames = loadPopular();
      const limited = updatedGames.slice(0, 12);
      setPopularGames(limited);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  if (loading) {
    return (
      <section className="popular-section game-section" id={id}>
        <div className="content-anim">
          <h2 className="section-title">💥 {translate("popularGames", lang)}</h2>
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
        <h2 className="section-title">💥 {translate("popularGames", lang)}</h2>
        
        {popularGames && popularGames.length > 0 ? (
          <div className="games-grid">
            {popularGames.map((game, index) => (
              <div key={game.id} className="game-card-wrapper">
                <GameCard 
                  game={game} 
                  index={index}
                />
                {/* Show click count badge */}
                <div className="click-count">
                  {game.clicks} plays
                </div>
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