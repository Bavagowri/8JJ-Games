

// react-app/src/components/MosaicGameCard/MosaicGameCard.jsx

import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { pushRecent } from "../../utils/localStorage";
import { trackGameClick } from "../../utils/popularGamesUtils";
import { useLanguage } from "../../context/LanguageContext";
import { translate } from "../../data/translations";
import "./MosaicGameCard.css";
import { getGameThumb } from "../../utils/getGameThumb";

export default function MosaicGameCard({ game }) {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const { slug } = useParams();  

  const [imgSrc, setImgSrc] = useState(getGameThumb(game));
  const [imageError, setImageError] = useState(false);

  const openGame = () => {
    if (!game || !game.provider_id) {
      console.error("Invalid game object:", game);
      return;
    }

    pushRecent({
      id: game.provider_id,
      title: game.title,
      image: game.image,
      category: game.category || "",
      gameId: game.id,
      externalUrl: game.externalUrl || game.link,
    });

    trackGameClick({
      id: game.provider_id,
      title: game.title,
      image: game.image,
      category: game.category || "",
      gameId: game.id,
      externalUrl: game.externalUrl || game.link,
    });

    navigate(`/games/${game.provider_id}`, { state: { game } });
  };

  //  Keyboard support for accessibility
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openGame();
    }
  };

  //  Improved error handling for images
  const handleImageError = () => {
    if (!imageError) {
      setImgSrc(game.image);
      setImageError(true);
    } else {
      // Final fallback to placeholder
      setImgSrc('/images/game-placeholder.png');
    }
  };

  return (
    /*  Semantic article element with proper ARIA */
    <article
      className={`mosaic-card ${game.size || "small"}`}
      onClick={openGame}
      onKeyPress={handleKeyPress}
      role="button"
      tabIndex={0}
      aria-label={`Play ${game.title}${game.category ? ` - ${game.category} game` : ''}`}
      itemScope
      itemType="https://schema.org/Game"
    >
      {/*  Optimized image with proper alt text and lazy loading */}
      <img 
        src={imgSrc}
        alt={`Play ${game.title}${game.category ? ` - ${game.category}` : ''} online free`}
        className="game-image"
        onError={handleImageError}
        loading="lazy"
        decoding="async"
        itemProp="image"
      />

      {/*  Play Now Button with ARIA hidden (decorative) */}
      <div className="mosaic-play-button" aria-hidden="true">
        {translate("playNow", lang)}
      </div>

      {/*  Hot Badge - only show if game.isHot is true */}
      {game.isHot && (
        <div className="mosaic-hot-badge" aria-label="Hot game">
          <img 
            src="/images/game.png" 
            className="mosaic-game-image-hot" 
            alt="Hot badge"
            aria-hidden="true"
            loading="lazy"
            decoding="async"
          />
          {translate("hot", lang)}
        </div>
      )}

      {/*  Game Info Overlay with semantic markup */}
      <div className="mosaic-overlay">
        <h3 className="mosaic-title" itemProp="name">
          {game.title}
        </h3>
        {game.category && (
          <div className="mosaic-category" itemProp="genre">
            {game.category}
          </div>
        )}
      </div>

      {/*  Hidden metadata for SEO */}
      <meta itemProp="url" content={`https://8jjgames.com/game/${game.provider_id}`} />
      <meta itemProp="gamePlatform" content="Web Browser" />
    </article>
  );
}