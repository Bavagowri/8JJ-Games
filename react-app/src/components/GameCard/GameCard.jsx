import "./GameCard.css";
import { useNavigate } from "react-router-dom";
import { pushRecent } from "../../utils/localStorage";
import { trackGameClick } from "../../utils/popularGamesUtils";


export default function GameCard({ game }) {
  const navigate = useNavigate();

  const openGame = () => {
    // Save game to recent games list
    pushRecent({
      id: game.id,
      title: game.title,
      image: game.image,
      category: game.category || "",
      gameId: game.gameId || game.id,
      externalUrl: game.externalUrl || game.link,
    });

    // Track game click for popular games
    trackGameClick({
      id: game.id,
      title: game.title,
      image: game.image,
      category: game.category || "",
      gameId: game.gameId || game.id,
      externalUrl: game.externalUrl || game.link,
    });

    // Save ENTIRE game list
    const list = JSON.parse(localStorage.getItem("games"));
    if (!list) return;

    navigate(`/game/${index}`);
  };


  return (
    <div className="game-card" onClick={() => navigate(`/game/${game.id}`)}>
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
      </div>
    </div>
  );
}