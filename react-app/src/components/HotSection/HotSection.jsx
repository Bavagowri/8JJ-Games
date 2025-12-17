// HotSection.jsx
import { useEffect, useState } from "react";
import GameCard from "../GameCard/GameCard";
import "./HotSection.css";

export default function HotSection({ games, id, lang, translate }) {
  const [hotGames, setHotGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (games && Array.isArray(games)) {
      // Keep only 12 games
      const limitedGames = games.slice(0, 12);
      setHotGames(limitedGames);
    }
    setLoading(false);
  }, [games]);

  if (loading) {
    return (
      <section className="hot-section game-section" id={id}>
        <div className="content-anim">
          <div className="hot-header">
            <h2 className="section-title">🔥 {translate("hotGames", lang)}</h2>
          </div>
          <div className="games-grid">
            <p>Loading hot games...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="hot-section game-section" id={id}>
      <div className="content-anim">
        <h2 className="section-title">🔥 {translate("hotGames", lang)}</h2>
       
        {hotGames && hotGames.length > 0 ? (
          <div className="games-grid">
            {hotGames.map((game, index) => (
              <GameCard 
                key={game.id || index} 
                game={game} 
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="empty-message">
            <p>No hot games available</p>
          </div>
        )}
      </div>
    </section>
  );
}