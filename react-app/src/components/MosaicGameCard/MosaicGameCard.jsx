import { useNavigate } from "react-router-dom";
import { pushRecent } from "../../utils/localStorage";
import { trackGameClick } from "../../utils/popularGamesUtils";
import { useLanguage } from "../../context/LanguageContext";
import { translate } from "../../data/translations";
import "./MosaicGameCard.css";

export default function MosaicGameCard({ game }) {
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
    navigate(`/game/${game.id}`, { state: { game } });
  };

  return (
    <div
      className={`mosaic-card ${game.size || "small"}`}
      onClick={openGame}
    >
      <img src={game.image} alt={game.title} />

      {/* Play Now Button */}
      <div className="mosaic-play-button">
        {translate("playNow", lang)}
      </div>

      {/* Hot Badge - only show if game.isHot is true */}
      {game.isHot && (
        <div className="mosaic-hot-badge">
          <img src="/images/game.png" className="mosaic-game-image-hot" alt="" />
          {translate("hot", lang)}
        </div>
      )}

      {/* Game Info Overlay */}
      <div className="mosaic-overlay">
        <div className="mosaic-title">{game.title}</div>
        {game.category && <div className="mosaic-category">{game.category}</div>}
      </div>
    </div>
  );
}