// // src/components/mobile/MobileGameCard/MobileGameCard.jsx
// import { useNavigate } from "react-router-dom";
// import { useState } from "react";
// import { useLanguage } from "../../../context/LanguageContext";
// import { translate } from "../../../data/translations";
// import { pushRecent } from "../../../utils/localStorage";
// import { trackGameClick } from "../../../utils/popularGamesUtils";
// import { getGameThumb } from "../../../utils/getGameThumb";
// import "./MobileGameCard.css";

// export default function MobileGameCard({ game, index = 0, isHot = false, isFeatured = false }) {
//   const navigate = useNavigate();
//   const { lang } = useLanguage();
//   const [imgSrc, setImgSrc] = useState(getGameThumb(game));
//   const [imageLoaded, setImageLoaded] = useState(false);

//   if (!game) return null;

//   const handleGameClick = async () => {
//     pushRecent({
//       id: game.provider_id,
//       title: game.title,
//       image: game.image,
//       category: game.category || "",
//       gameId: game.id,
//     });

//     // Increment plays in DB
//     fetch(`${import.meta.env.VITE_API_URL}/api/games/${game.provider_id}/play`, {
//       method: "POST"
//     }).catch(() => {});

//     navigate(`/games/${game.provider_id}`);
//   };

//   const handleImageLoad = () => {
//     setImageLoaded(true);
//   };

//   const handleImageError = () => {
//     setImgSrc(game.image);
//     setImageLoaded(true);
//   };

//   return (
//     <article 
//       className={`mobile-game-card ${isFeatured ? 'featured' : ''} ${isHot ? 'hot' : ''}`}
//       onClick={handleGameClick}
//       itemScope
//       itemType="https://schema.org/VideoGame"
//     >
//       {/* Schema metadata */}
//       <meta itemProp="name" content={game.title} />
//       <meta itemProp="url" content={`https://8jjgames.com/games/${game.provider_id}`} />
//       {game.category && <meta itemProp="genre" content={game.category} />}

//       {/* Image Container */}
//       <div className="mobile-game-image-container">
//         {!imageLoaded && (
//           <div className="mobile-game-skeleton" />
//         )}
//         <img 
//           src={imgSrc}
//           alt={`Play ${game.title} online free - ${game.category || "Browser Game"}`}
//           className={`mobile-game-image ${imageLoaded ? 'loaded' : ''}`}
//           onLoad={handleImageLoad}
//           onError={handleImageError}
//           loading="lazy"
//           itemProp="image"
//         />
        
//         {/* Play Overlay */}
//         <div className="mobile-game-overlay">
//           <div className="mobile-play-icon">▶</div>
//         </div>
//       </div>

//       {/* Hot Badge */}
//       {isHot && (
//         <div className="mobile-hot-badge">
//           <span>🔥 {translate("hot", lang)}</span>
//         </div>
//       )}

//       {/* Featured Badge */}
//       {isFeatured && (
//         <div className="mobile-featured-badge">
//           <span>⭐ {translate("featured", lang)}</span>
//         </div>
//       )}

//       {/* Game Info */}
//       <div className="mobile-game-info">
//         <h3 className="mobile-game-title" itemProp="name">
//           {game.title}
//         </h3>
//         {game.category && (
//           <div className="mobile-game-category" itemProp="genre">
//             {game.category}
//           </div>
//         )}
//       </div>
//     </article>
//   );
// }


// src/components/mobile/MobileGameCard/MobileGameCard.jsx
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useLanguage } from "../../../context/LanguageContext";
import { translate } from "../../../data/translations";
import { pushRecent } from "../../../utils/localStorage";
import { trackGameClick } from "../../../utils/popularGamesUtils";
import { getGameThumb } from "../../../utils/getGameThumb";
import "./MobileGameCard.css";

export default function MobileGameCard({ game, index = 0, isHot = false, isFeatured = false }) {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const [imgSrc, setImgSrc] = useState(getGameThumb(game));
  const [imageLoaded, setImageLoaded] = useState(false);

  if (!game) return null;

  const handleGameClick = async () => {
    pushRecent({
      id: game.provider_id,
      title: game.title,
      image: game.image,
      category: game.category || "",
      gameId: game.id,
    });

    fetch(`${import.meta.env.VITE_API_URL}/api/games/${game.provider_id}/play`, {
      method: "POST"
    }).catch(() => {});

    navigate(`/games/${game.provider_id}`);
  };

  const handleImageLoad = () => setImageLoaded(true);
  const handleImageError = () => {
    setImgSrc(game.image);
    setImageLoaded(true);
  };

  return (
    <article 
      className={`mobile-game-card ${isFeatured ? 'featured' : ''} ${isHot ? 'hot' : ''}`}
      onClick={handleGameClick}
      itemScope
      itemType="https://schema.org/VideoGame"
    >
      <meta itemProp="name" content={game.title} />
      <meta itemProp="url" content={`https://8jjgames.com/games/${game.provider_id}`} />
      {game.category && <meta itemProp="genre" content={game.category} />}

      {/* CHANGED: wrapper has explicit aspect-ratio so browser reserves space
          before the image loads — prevents CLS (layout shift). */}
      <div
        className="mobile-game-image-container"
        style={{ aspectRatio: '1 / 1' }}
      >
        {!imageLoaded && (
          <div className="mobile-game-skeleton" />
        )}
        {/* CHANGED: explicit width + height prevent CLS; loading="lazy" unchanged */}
        <img 
          src={imgSrc}
          alt={`Play ${game.title} online free - ${game.category || "Browser Game"}`}
          className={`mobile-game-image ${imageLoaded ? 'loaded' : ''}`}
          onLoad={handleImageLoad}
          onError={handleImageError}
          loading="lazy"
          decoding="async"
          width="200"
          height="200"
          itemProp="image"
        />
        
        <div className="mobile-game-overlay">
          <div className="mobile-play-icon">▶</div>
        </div>
      </div>

      {isHot && (
        <div className="mobile-hot-badge">
          <span>🔥 {translate("hot", lang)}</span>
        </div>
      )}

      {isFeatured && (
        <div className="mobile-featured-badge">
          <span>⭐ {translate("featured", lang)}</span>
        </div>
      )}

      <div className="mobile-game-info">
        <h3 className="mobile-game-title" itemProp="name">
          {game.title}
        </h3>
        {game.category && (
          <div className="mobile-game-category" itemProp="genre">
            {game.category}
          </div>
        )}
      </div>
    </article>
  );
}