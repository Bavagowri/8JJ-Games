// src/components/GameCard/GameCard.jsx - OPTIMIZED FOR PAGESPEED

import "./GameCard.css";
import { useNavigate } from "react-router-dom";
import { useState, useCallback } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { translate } from "../../data/translations";
import { pushRecent } from "../../utils/localStorage";
import { trackGameClick } from "../../utils/popularGamesUtils";
import { getGameThumb } from "../../utils/getGameThumb";

export default function GameCard({ 
  game, 
  index, 
  isHot = false, 
  isFeatured = false,
  isPriority = false //  NEW: Flag for above-fold images
}) {
  const navigate = useNavigate();
  const { lang } = useLanguage();

  const [imgSrc, setImgSrc] = useState(getGameThumb(game));
  const [imageLoaded, setImageLoaded] = useState(false);

  const openGame = useCallback(() => {
    if (!game || !game.id) return;

    pushRecent({
      id: game.provider_id,
      title: game.title,
      image: game.image,
      category: game.category || "",
      gameId: game.gameId || game.id,
      externalUrl: game.externalUrl || game.link,
    });

    trackGameClick({
      id: game.provider_id,
      title: game.title,
      image: game.image,
      category: game.category || "",
      gameId: game.gameId || game.id,
      externalUrl: game.externalUrl || game.link,
    });

    navigate(`/games/${game.provider_id}`, { state: { game, index } });
  }, [game, index, navigate]);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  const handleImageError = useCallback(() => {
    setImgSrc(game.image);
    setImageLoaded(true);
  }, [game.image]);

  // SEO: Keyboard accessibility handler
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openGame();
    }
  }, [openGame]);

  // SEO: Generate comprehensive alt text
  const getImageAlt = () => {
    const categoryText = game.category ? ` - ${game.category}` : '';
    const typeText = isFeatured ? ' (Featured)' : isHot ? ' (Hot Game)' : '';
    return `Play ${game.title}${categoryText}${typeText} - Free online game`;
  };

  // SEO: Generate comprehensive aria-label
  const getAriaLabel = () => {
    const categoryText = game.category ? `, ${game.category} game` : '';
    const statusText = isFeatured ? ', featured game' : isHot ? ', hot game' : '';
    return `Play ${game.title}${categoryText}${statusText}. Click to start playing.`;
  };

  return (
    <article 
      className={`game-card ${isFeatured ? 'featured' : ''} ${isHot ? 'hot' : ''}`}
      onClick={openGame}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={getAriaLabel()}
      itemScope
      itemType="https://schema.org/VideoGame"
    >
      {/* SEO: Schema.org metadata */}
      <meta itemProp="name" content={game.title} />
      <meta itemProp="url" content={`https://8jjgames.com/game/${game.provider_id}`} />
      {game.category && <meta itemProp="genre" content={game.category} />}
      <meta itemProp="gamePlatform" content="Web Browser" />
      <meta itemProp="applicationCategory" content="Game" />

      {/*  OPTIMIZED: Image container with proper structure */}
      <div className="game-image-container">
        {!imageLoaded && (
          <div 
            className="game-card-skeleton" 
            aria-hidden="true"
            role="presentation"
          />
        )}
        
        {/* 
           CRITICAL OPTIMIZATIONS:
          1. Explicit width/height to prevent CLS
          2. loading="lazy" for below-fold images
          3. loading="eager" for above-fold images (first 6-8 cards)
          4. fetchpriority="high" for LCP candidates
          5. decoding="async" for non-blocking decode
          6. aspect-ratio preserved via CSS
        */}
        <img 
          src={imgSrc}
          alt={getImageAlt()}
          className={`game-image ${imageLoaded ? 'loaded' : ''}`}
          onLoad={handleImageLoad}
          onError={handleImageError}
          style={{ opacity: imageLoaded ? 1 : 0 }}
          loading={isPriority ? "eager" : "lazy"}
          fetchpriority={isPriority ? "high" : "auto"}
          decoding="async"
          width="350"
          height="350"
          itemProp="image"
        />
      </div>

      {/* SEO: Play button with proper accessibility */}
      <div className="play-button" aria-hidden="true" role="presentation">
        {translate("playNow", lang)}
      </div>

      {/* SEO: Hot badge with enhanced accessibility */}
      {isHot && (
        <div 
          className="hot-badge" 
          role="status"
          aria-label={`${game.title} is a hot game`}
        >
          <img
            src="/images/game.png"
            className="game-image-hot"
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
            width="14"
            height="14"
          />
          <span>{translate("hot", lang)}</span>
        </div>
      )}

      {/* SEO: Featured badge for featured games */}
      {isFeatured && (
        <div 
          className="featured-badge" 
          role="status"
          aria-label={`${game.title} is a featured game`}
        >
          <span>⭐ {translate("featured", lang) || "Featured"}</span>
        </div>
      )}

      {/* SEO: Game info with semantic structure */}
      <div className="game-overlay">
        {/* SEO: Using h3 for proper heading hierarchy */}
        <h3 className="game-title" itemProp="name">
          {game.title}
        </h3>
        {game.category && (
          <div className="game-category" itemProp="genre">
            {game.category}
          </div>
        )}
      </div>
    </article>
  );
}