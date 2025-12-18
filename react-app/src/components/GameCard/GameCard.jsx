import "./GameCard.css";
import { useNavigate } from "react-router-dom";
import { pushRecent } from "../../utils/localStorage";
import { trackGameClick } from "../../utils/popularGamesUtils";
import { useLanguage } from "../../context/LanguageContext";
import { translate } from "../../data/translations";

export default function GameCard({ game, index }) {
  const navigate = useNavigate();
  const { lang } = useLanguage();

  const openGame = () => {
    // Check if game has valid data
    if (!game || !game.id) {
      console.error("Invalid game object:", game);
      return;
    }

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

    // Navigate to game page with game data
    // Pass the entire game object, not just index
    navigate(`/game/${game.id}`, { state: { game, index } });
  };

  return (
    <div className="game-card" onClick={openGame}>
      <img src={game.image} alt={game.title} className="game-image" />

      {/* Play Now Button */}
      <div className="play-button">
        {translate("playNow", lang)}
      </div>

      {/* Hot Badge - only show if game.isHot is true */}
      {game.isHot && (
        <div className="hot-badge">
          <img src="/images/game.png" className="game-image-hot" alt="" />
          {translate("hot", lang)}
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