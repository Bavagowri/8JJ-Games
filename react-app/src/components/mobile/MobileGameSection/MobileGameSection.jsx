// src/components/mobile/MobileGameSection/MobileGameSection.jsx
import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MobileGameCard from "../MobileGameCard/MobileGameCard";
import { useLanguage } from "../../../context/LanguageContext";
import { translate } from "../../../data/translations";
import "./MobileGameSection.css";

export default function MobileGameSection({
  title,
  titleText,
  games,
  categoryId,
  allGamesPage = false,
  showSeeAll = true,
  isHot = false,
  isFeatured = false
}) {
  const scrollRef = useRef(null);
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    setTimeout(() => setIsLoaded(true), 50);
  }, []);

  useEffect(() => {
    // Check if content overflows (for scroll indicator)
    const checkOverflow = () => {
      if (scrollRef.current) {
        const hasScroll = scrollRef.current.scrollWidth > scrollRef.current.clientWidth;
        setHasOverflow(hasScroll);
      }
    };

    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [games]);

  if (!games || games.length === 0) return null;

  const handleSeeAll = () => {
    if (allGamesPage) {
      navigate("/all-mosaic-games");
    } else if (categoryId) {
      navigate(`/categories/${categoryId}`);
    }
  };

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const scrollAmount = scrollRef.current.clientWidth * 0.8;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  return (
    <section 
      className={`mobile-game-section ${isLoaded ? 'loaded' : ''} ${hasOverflow ? 'has-overflow' : ''} ${isFeatured ? 'featured' : ''} ${isHot ? 'hot' : ''}`}
      aria-labelledby={`mobile-section-${categoryId || 'games'}`}
    >
      {/* Section Header */}
      <div className="mobile-section-header">
        <h2 
          id={`mobile-section-${categoryId || 'games'}`}
          className="mobile-section-title"
        >
          {isHot && <span className="mobile-section-icon hot-icon">🔥</span>}
          {isFeatured && <span className="mobile-section-icon featured-icon">⭐</span>}
          {title}
        </h2>
        
        {showSeeAll && categoryId && (
          <button 
            className="mobile-see-all-btn"
            onClick={handleSeeAll}
            aria-label={`View all ${titleText} games`}
          >
            {translate("seeAll", lang)}
            <span className="mobile-arrow">→</span>
          </button>
        )}
      </div>

      {/* Horizontal Scroll Container */}
      <div className="mobile-scroll-container">
        <div 
          className="mobile-games-scroll"
          ref={scrollRef}
        >
          {games.map((game, index) => (
            <div 
              key={game.provider_id} 
              className="mobile-game-item"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <MobileGameCard 
                game={game} 
                index={index}
                isHot={isHot}
                isFeatured={isFeatured}
              />
            </div>
          ))}
        </div>

        {/* Scroll indicator */}
        {hasOverflow && (
          <div className="mobile-scroll-indicator" aria-hidden="true" />
        )}
      </div>
    </section>
  );
}