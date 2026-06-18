// // react-app/src/components/mobile/MobileFeaturedGameSection/MobileFeaturedGameSection.jsx
// // Mobile Featured Games
// import { useNavigate } from "react-router-dom";
// import { useLanguage } from "../../../context/LanguageContext";
// import { translate } from "../../../data/translations";
// import "./MobileFeaturedGameSection.css";
// import { getGameThumb } from "../../../utils/getGameThumb";

// export default function MobileFeaturedGameSection({
//   title,
//   titleText,
//   games,
//   categoryId,
//   showSeeAll = true
// }) {
//   const navigate = useNavigate();
//   const { lang } = useLanguage();

//   if (!games || games.length === 0) return null;

//   const handleSeeAll = () => {
//     if (categoryId) {
//       navigate(`/categories/${categoryId}`);
//     }
//   };

//   const handlePlay = (provider_id) => {
//     navigate(`/games/${provider_id}`);
//   };

//   return (
//     <section className="mobile-featured-sectionz">
//       {/* Header */}
//       <div className="mobile-section-featured-header">
//         <h2 className="mobile-section-scroll-title">
//           {title}
//         </h2>

//         {/* {showSeeAll && categoryId && (
//           <button
//             className="mobile-see-all-btn"
//             onClick={handleSeeAll}
//           >
//             {translate("seeAll", lang)}
//           </button>
//         )} */}
//       </div>

//       {/* Horizontal Scroll */}
//       <div className="mobile-featured-scroll">
//         {games.slice(0, 10).map((game) => (
//           <article
//             key={game.provider_id}
//             className="mobile-featured-card"
//             onClick={() => handlePlay(game.provider_id)}
//             role="button"
//             tabIndex={0}
//           >
//             <img
//               src={getGameThumb(game)}
//               alt={game.title}
//               loading="lazy"
//             />

//             <div className="mobile-featured-overlay">
//               <h3 className="mobile-featured-title">
//                 {game.title}
//               </h3>

//               {game.category && (
//                 <span className="mobile-featured-category">
//                   {game.category}
//                 </span>
//               )}
//             </div>
//           </article>
//         ))}
//       </div>
//     </section>
//   );
// }


// react-app/src/components/mobile/MobileFeaturedGameSection/MobileFeaturedGameSection.jsx
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../../context/LanguageContext";
import { translate } from "../../../data/translations";
import "./MobileFeaturedGameSection.css";
import { getGameThumb } from "../../../utils/getGameThumb";

export default function MobileFeaturedGameSection({
  title,
  titleText,
  games,
  categoryId,
  showSeeAll = true
}) {
  const navigate = useNavigate();
  const { lang } = useLanguage();

  if (!games || games.length === 0) return null;

  const handleSeeAll = () => {
    if (categoryId) navigate(`/categories/${categoryId}`);
  };

  const handlePlay = (provider_id) => {
    navigate(`/games/${provider_id}`);
  };

  return (
    <section className="mobile-featured-sectionz">
      <div className="mobile-section-featured-header">
        <h2 className="mobile-section-scroll-title">{title}</h2>
      </div>

      <div className="mobile-featured-scroll">
        {games.slice(0, 10).map((game) => (
          <article
            key={game.provider_id}
            className="mobile-featured-card"
            onClick={() => handlePlay(game.provider_id)}
            role="button"
            tabIndex={0}
          >
            {/* CHANGED: wrapper reserves 3:4 space before image loads — prevents CLS.
                Using the same aspect ratio as the card styling. */}
            <div style={{ aspectRatio: '3 / 4', width: '100%' }}>
              <img
                src={getGameThumb(game)}
                alt={game.title}
                loading="lazy"
                decoding="async"
                width="150"
                height="200"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            <div className="mobile-featured-overlay">
              <h3 className="mobile-featured-title">{game.title}</h3>
              {game.category && (
                <span className="mobile-featured-category">{game.category}</span>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}