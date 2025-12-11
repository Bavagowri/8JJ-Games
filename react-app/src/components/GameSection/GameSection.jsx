import { useState } from "react";
import GameCard from "../GameCard/GameCard";
import GameModal from "../GameModal/GameModal";
import "./GameSection.css";

export default function GameSection({ title, games, id }) {
  const [showAll, setShowAll] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);

  if (!games || games.length === 0) return null;

  const visibleGames = showAll ? games : games.slice(0, 12);

  return (
    <section className="game-section" id={id}>
      <h2 className="section-title">{title}</h2>

      <div className="games-grid">
        {visibleGames.map((game, i) => (
          <GameCard key={i} game={game} onClick={() => setSelectedGame(game)} />
        ))}
      </div>

      {games.length > 12 && (
        <button className="view-more-btn" onClick={() => setShowAll(!showAll)}>
          {showAll ? "View Less" : "View More"}
        </button>
      )}

      {/* Modal */}
      <GameModal game={selectedGame} onClose={() => setSelectedGame(null)} />
    </section>
  );
}
