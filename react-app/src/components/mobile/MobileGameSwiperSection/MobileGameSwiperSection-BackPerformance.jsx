// react-app/src/components/mobile/MobileGameSwiperSection/MobileGameSwiperSection.jsx
// Mobile Hot Games
import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../../context/LanguageContext";
import { translate } from "../../../data/translations";
import { pushRecent } from "../../../utils/localStorage";
import { trackGameClick } from "../../../utils/popularGamesUtils";
import { getGameThumb } from "../../../utils/getGameThumb";
import "./MobileGameSwiperSection.css";

export default function MobileGameSwiperSection({
  title,
  titleText,
  games,
  categoryId,
  showSeeAll = false,
  isHot = true,
  isFeatured = false
}) {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const sliderRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Trigger animation on mount
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  if (!games || games.length === 0) return null;

  const handleSeeAll = () => {
    if (categoryId) {
      navigate(`/categories/${categoryId}`);
    }
  };

  const handleGameClick = (game, index) => {
    // Same logic as MobileGameCard
    pushRecent({
      id: game.id,
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
  };

  const handleScroll = () => {
    if (!sliderRef.current) return;
    const width = sliderRef.current.clientWidth;
    const newIndex = Math.round(sliderRef.current.scrollLeft / width);
    setActiveIndex(newIndex);
  };

  const scrollToSlide = (index) => {
    if (!sliderRef.current) return;
    const width = sliderRef.current.clientWidth;
    sliderRef.current.scrollTo({
      left: index * width,
      behavior: 'smooth'
    });
  };

  // Calculate rating (you can replace with actual rating data)
  const getGameRating = (game) => {
    return game.rating || (4.0 + Math.random() * 1.0).toFixed(1);
  };

  return (
    <section className={`mobile-game-swiper-section ${isLoaded ? 'loaded' : ''} ${categoryId || ''}`}>
      {/* Header */}
      <div className="mobile-section-header">
        <h2 className="mobile-section-swiper-title">{title}</h2>

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

      {/* Swiper */}
      <div
        className="mobile-game-swiper"
        ref={sliderRef}
        onScroll={handleScroll}
      >
        {games.slice(0, 6).map((game, index) => (
          <div
            key={game.provider_id}
            className="mobile-game-swiper-slide"
            onClick={() => handleGameClick(game, index)}
          >
            <img
              src={getGameThumb(game) || game.image}
              alt={game.title}
              className="mobile-game-swiper-image"
              loading="lazy"
            />

            {/* Badge: HOT or FEATURED */}
            {isHot && (
              <div className="mobile-swiper-hot-badge">
                🔥 {translate("hot", lang)}
              </div>
            )}

            {isFeatured && !isHot && (
              <div className="mobile-swiper-featured-badge">
                ⭐ Featured
              </div>
            )}

            {/* Rating Badge (optional) */}
            <div className="mobile-swiper-info-badge">
              <span className="star-icon">★</span>
              {getGameRating(game)}
            </div>

            <div className="mobile-game-swiper-overlay">
              <h3 className="mobile-game-swiper-title">
                {game.title}
              </h3>

              <button className="mobile-game-swiper-play-btn">
                <span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-play-icon lucide-play"><path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z"/></svg></span>
                {translate("playNow", lang)}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Dots */}
      <div className="mobile-swiper-dots">
        {games.slice(0, 6).map((_, i) => (
          <span
            key={i}
            className={`dot ${i === activeIndex ? "active" : ""}`}
            onClick={() => scrollToSlide(i)}
            role="button"
            aria-label={`Go to slide ${i + 1}`}
            tabIndex={0}
          />
        ))}
      </div>
    </section>
  );
}