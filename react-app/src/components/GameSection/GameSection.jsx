import { useState } from "react";
import GameCard from "../GameCard/GameCard";
import "./GameSection.css";

export default function GameSection({ title, games, id }) {
  const [showAll, setShowAll] = useState(false);

  if (!games || games.length === 0) return null;

  // Show only first 12 unless expanded
  const visibleGames = showAll ? games : games.slice(0, 12);

  return (
    <section className="game-section" id={id}>
      <h2 className="section-title">{title}</h2>

      <div className="games-grid">
        {visibleGames.map((game, i) => (
          <GameCard key={i} game={game} />
        ))}
      </div>

      {games.length > 12 && (
        <button className="view-more-btn" onClick={() => setShowAll(!showAll)}>
          {showAll ? "View Less" : "View More"}
        </button>
      )}
    </section>
  );
}
