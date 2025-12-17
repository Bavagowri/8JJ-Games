// RecentSection.jsx
import { useEffect, useState } from "react";
import GameCard from "../GameCard/GameCard";
import { loadRecent } from "../../utils/localStorage";
import "./RecentSection.css";

export default function RecentSection({ id }) {
  const [recentGames, setRecentGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load recent games from localStorage
    const games = loadRecent();
    // Keep only 12 games
    const limitedGames = games.slice(0, 12);
    setRecentGames(limitedGames);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <section className="recent-section game-section" id={id}>
        <div className="content-anim">
         
            <h2 className="section-title">⏱️ Recent Games</h2>
         
          <div className="games-grid">
            <p>Loading recent games...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="recent-section game-section" id={id}>
      <div className="content-anim">
        
          <h2 className="section-title">⏱️ Recent Games</h2>
       
        {recentGames && recentGames.length > 0 ? (
          <div className="games-grid">
            {recentGames.map((game) => (
              <GameCard 
                key={game.id} 
                game={game} 
                index={0}
              />
            ))}
          </div>
        ) : (
          <div className="empty-message">
            <p>No recently played games yet. Start playing!</p>
          </div>
        )}
      </div>
    </section>
  );
}