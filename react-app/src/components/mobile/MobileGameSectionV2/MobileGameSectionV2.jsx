// // react-app/src/components/mobile/MobileGameSectionV2/MobileGameSectionV2.jsx
// import { useNavigate } from "react-router-dom";
// import { useLanguage } from "../../../context/LanguageContext";
// import { translate } from "../../../data/translations";
// import "./MobileGameSectionV2.css";
// import { getGameThumb } from "../../../utils/getGameThumb";

// export default function MobileGameSectionV2({
//   title,
//   titleText,
//   games,
//   categoryId,
//   showSeeAll = true
// }) {
//   const navigate = useNavigate();
//   const { lang } = useLanguage();

//   if (!games || games.length === 0) return null;

//   const featuredGame = games[0];
//   const gridGames = games.slice(1, 7);

//   const handleSeeAll = () => {
//     if (categoryId) {
//       navigate(`/categories/${categoryId}`);
//     }
//   };

//   const handlePlay = (slug) => {
//     navigate(`/games/${slug}`);
//   };

//   return (
//     <section className={`mobile-game-section-v2 v2 ${categoryId || ''}`}>
//       {/* Header */}
//       <div className="mobile-section-header">
//         <h2 className="mobile-section-scroll-title">{title}</h2>

//         {showSeeAll && categoryId && (
//           <button
//             className="mobile-see-all-btn"
//             onClick={handleSeeAll}
//           >
//             {translate("seeAll", lang)}
//           </button>
//         )}
//       </div>

//       {/* Featured Game */}
//       <div
//         className="mobile-featured-game"
//         onClick={() => handlePlay(featuredGame.provider_id)}
//       >
//         <img
//           src={getGameThumb(featuredGame)}
//           alt={featuredGame.title}
//           loading="lazy"
//           className="featured-bg"
//           onError={(e) => {
//             e.currentTarget.src = featuredGame.image;
//           }}
//         />

//         <div className="featured-gradient" />

//         <div className="featured-content">
//           <div className="featured-left">
//             <img
//               src={getGameThumb(featuredGame)}
//               alt={featuredGame.title}
//               loading="lazy"
//               className="featured-icon"
//               onError={(e) => {
//                 e.currentTarget.src = featuredGame.image;
//               }}
//             />
//             <div>
//               <h3>{featuredGame.title}</h3>
//             </div>
//           </div>

//           <button className="featured-play-btn">{translate("playNow", lang)}</button>
//         </div>
//       </div>

//       {/* Grid - FIXED: Added wrapper div for consistent sizing */}
//       <div className="mobile-game-grid">
//         {gridGames.map((game) => (
//           <div
//             key={game.provider_id}
//             className="mobile-grid-card"
//             onClick={() => handlePlay(game.provider_id)}
//           >
//             {/* FIXED: Image wrapper enforces 1:1 aspect ratio */}
//             <div className="mobile-grid-card-image-wrapper">
//               <img
//                 src={getGameThumb(game)}
//                 alt={game.title}
//                 loading="lazy"
//                 onError={(e) => {
//                   e.currentTarget.src = game.image;
//                 }}
//               />
//             </div>
//             <p>{game.title}</p>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// }


// react-app/src/components/mobile/MobileGameSectionV2/MobileGameSectionV2.jsx
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../../context/LanguageContext";
import { translate } from "../../../data/translations";
import "./MobileGameSectionV2.css";
import { getGameThumb } from "../../../utils/getGameThumb";

export default function MobileGameSectionV2({
  title,
  titleText,
  games,
  categoryId,
  showSeeAll = true
}) {
  const navigate = useNavigate();
  const { lang } = useLanguage();

  if (!games || games.length === 0) return null;

  const featuredGame = games[0];
  const gridGames = games.slice(1, 7);

  const handleSeeAll = () => {
    if (categoryId) navigate(`/categories/${categoryId}`);
  };

  const handlePlay = (slug) => {
    navigate(`/games/${slug}`);
  };

  return (
    <section className={`mobile-game-section-v2 v2 ${categoryId || ''}`}>
      <div className="mobile-section-header">
        <h2 className="mobile-section-scroll-title">{title}</h2>

        {showSeeAll && categoryId && (
          <button className="mobile-see-all-btn" onClick={handleSeeAll}>
            {translate("seeAll", lang)}
          </button>
        )}
      </div>

      {/* Featured Game */}
      <div
        className="mobile-featured-game"
        onClick={() => handlePlay(featuredGame.provider_id)}
      >
        {/* CHANGED: explicit width + height on featured background image — prevents CLS */}
        <img
          src={getGameThumb(featuredGame)}
          alt={featuredGame.title}
          loading="lazy"
          decoding="async"
          className="featured-bg"
          width="600"
          height="300"
          onError={(e) => { e.currentTarget.src = featuredGame.image; }}
        />

        <div className="featured-gradient" />

        <div className="featured-content">
          <div className="featured-left">
            {/* CHANGED: explicit width + height on the icon thumbnail — prevents CLS */}
            <img
              src={getGameThumb(featuredGame)}
              alt={featuredGame.title}
              loading="lazy"
              decoding="async"
              className="featured-icon"
              width="60"
              height="60"
              onError={(e) => { e.currentTarget.src = featuredGame.image; }}
            />
            <div>
              <h3>{featuredGame.title}</h3>
            </div>
          </div>

          <button className="featured-play-btn">{translate("playNow", lang)}</button>
        </div>
      </div>

      {/* Grid */}
      <div className="mobile-game-grid">
        {gridGames.map((game) => (
          <div
            key={game.provider_id}
            className="mobile-grid-card"
            onClick={() => handlePlay(game.provider_id)}
          >
            {/* CHANGED: wrapper + explicit dimensions prevent CLS on grid cards */}
            <div
              className="mobile-grid-card-image-wrapper"
              style={{ aspectRatio: '1 / 1' }}
            >
              <img
                src={getGameThumb(game)}
                alt={game.title}
                loading="lazy"
                decoding="async"
                width="120"
                height="120"
                onError={(e) => { e.currentTarget.src = game.image; }}
              />
            </div>
            <p>{game.title}</p>
          </div>
        ))}
      </div>
    </section>
  );
}