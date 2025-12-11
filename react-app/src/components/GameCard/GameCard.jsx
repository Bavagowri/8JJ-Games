import "./GameCard.css";

export default function GameCard({ game, onClick }) {
  const handleClick = () => {
    if (game.isLocked) return; 
    if (onClick) onClick(game); 
  };

  return (
    <div 
      className={`game-card ${game.isLocked ? 'locked-card' : ''}`}
      onClick={handleClick}
    >
      <img src={game.image} alt={game.title} className="game-image" />

      {/* Play Now Button - only show if not locked */}
      {!game.isLocked && (
        <div className="play-button">
          Play Now
        </div>
      )}

      {/* Hot Badge - show if game.isHot is true */}
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
      </div>
    </div>
  );
}