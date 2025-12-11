import "./GameCard.css";

export default function GameCard({ game, onClick }) {
  return (
<<<<<<< Updated upstream
    <div className="game-card" onClick={onClick}>
      <img src={game.image} alt={game.title} className="game-card-img" />
      <div className="game-card-info">
        <h4 className="game-title">{game.title}</h4>
=======
    <div className="game-card" onClick={openGame}>
      <img src={game.image} alt={game.title} className="game-image" />

      {/* Play Now Button */}
      <div className="play-button">
        Play Now
      </div>

      {/* Hot Badge - only show if game.isHot is true */}
      {game.isHot && (
        <div className="hot-badge">
          <img src="/images/game.png" className="game-image-hot" alt="" />
          Hot
        </div>
      )}

      {/* Game Info Overlay */}
      <div className="game-overlay">
        <div className="game-title">{game.title}</div>
        {game.category && <div className="game-category">{game.category}</div>}
>>>>>>> Stashed changes
      </div>
    </div>
  );
}