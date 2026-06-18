// // react-app/src/components/mobile/MobileGameSectionScroll/MobileGameSectionScroll.jsx
// import { useNavigate } from "react-router-dom";
// import { useRef, useState, useEffect } from "react";
// import { useLanguage } from "../../../context/LanguageContext";
// import { translate } from "../../../data/translations";
// import "./MobileGameSectionScroll.css";
// import { getGameThumb } from "../../../utils/getGameThumb";

// export default function MobileGameSectionScroll({
//   title,
//   titleText,
//   games,
//   categoryId,
//   isTag = false,
//   showSeeAll = true,
//   gamesPerPage = 6 // 3 columns × 2 rows
// }) {
//   const navigate = useNavigate();
//   const { lang } = useLanguage();
//   const scrollRef = useRef(null);
//   const [activePage, setActivePage] = useState(0);
//   const [isLoaded, setIsLoaded] = useState(false);
//   const [canScrollLeft, setCanScrollLeft] = useState(false);
//   const [canScrollRight, setCanScrollRight] = useState(false);

//   // Define updateScrollButtons before it's used
//   const updateScrollButtons = () => {
//     if (!scrollRef.current) return;
    
//     const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    
//     setCanScrollLeft(scrollLeft > 10);
//     setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
//   };

//   useEffect(() => {
//     // Trigger entrance animation
//     setTimeout(() => setIsLoaded(true), 100);
//   }, []);

//   useEffect(() => {
//     // Update scroll button states
//     updateScrollButtons();
//   }, [activePage]);

//   if (!games || games.length === 0) return null;

//   // Chunk games into pages (3 per page for 3-column grid)
//   const itemsPerPage = 3; // 3 columns
//   const pages = [];
//   for (let i = 0; i < games.length; i += itemsPerPage) {
//     pages.push(games.slice(i, i + itemsPerPage));
//   }

//   const handleSeeAll = () => {
//     if (!categoryId) return;

//     if (isTag) {
//       navigate(`/categories/${categoryId}`);
//     } else {
//       navigate(`/categories/${categoryId}`);
//     }
//   };

//   const handlePlay = (providerId) => {
//     if (!providerId) return;
//     navigate(`/games/${providerId}`);
//   };

//   const handleScroll = () => {
//     if (!scrollRef.current) return;
    
//     const scrollLeft = scrollRef.current.scrollLeft;
//     const pageWidth = scrollRef.current.clientWidth;
//     const newPage = Math.round(scrollLeft / pageWidth);
    
//     setActivePage(newPage);
//     updateScrollButtons();
//   };

//   const scrollToPage = (pageIndex) => {
//     if (!scrollRef.current) return;
    
//     const pageWidth = scrollRef.current.clientWidth;
//     scrollRef.current.scrollTo({
//       left: pageIndex * pageWidth,
//       behavior: 'smooth'
//     });
//     setActivePage(pageIndex);
//   };

//   const scrollLeft = () => {
//     if (activePage > 0) {
//       scrollToPage(activePage - 1);
//     }
//   };

//   const scrollRight = () => {
//     if (activePage < pages.length - 1) {
//       scrollToPage(activePage + 1);
//     }
//   };

//   return (
//    <section className={`mobile-game-section-v4 ${isLoaded ? 'loaded' : ''} ${(categoryId || titleText) ? `${categoryId || titleText}-section` : ''}`}>
//       {/* Header */}
//       <div className="mobile-section-header">
//         <h2 className="mobile-section-scroll-title">{title}</h2>

//         {showSeeAll && categoryId && (
//           <button
//             className="mobile-see-all-btn"
//             onClick={handleSeeAll}
//             aria-label={`View all ${titleText} games`}
//           >
//             {translate("seeAll", lang) || "View All"}
//           </button>
//         )}
//       </div>

//       {/* Scroll Container with Navigation */}
//       <div style={{ position: 'relative' }}>
//         {/* Left Arrow */}
//         {pages.length > 1 && (
//           <button
//             className={`mobile-scroll-nav left ${!canScrollLeft ? 'disabled' : ''}`}
//             onClick={scrollLeft}
//             aria-label="Scroll left"
//           >
//             ‹
//           </button>
//         )}

//         {/* Horizontal Scroll */}
//         <div 
//           className="mobile-horizontal-scroll"
//           ref={scrollRef}
//           onScroll={handleScroll}
//         >
//           <div className="mobile-scroll-track">
//             {pages.map((page, pageIndex) => (
//               <div key={pageIndex} className="mobile-grid-page">
//                 {page.map((game) => (
//                   <div
//                     key={game.provider_id}
//                     className="mobile-game-rect-card"
//                     onClick={() => handlePlay(game.provider_id)}
//                     role="button"
//                     tabIndex={0}
//                     onKeyPress={(e) => {
//                       if (e.key === 'Enter' || e.key === ' ') {
//                         handlePlay(game.provider_id);
//                       }
//                     }}
//                   >
//                     {/* Image with wrapper for aspect ratio */}
//                     <div className="mobile-game-rect-card-image-wrapper">
//                       <img
//                         src={getGameThumb(game)}
//                         alt={game.title}
//                         loading="lazy"
//                         onError={(e) => {
//                           e.currentTarget.src = game.image;
//                         }}
//                       />
                      
//                       {/* Play icon overlay */}
//                       <div className="mobile-game-rect-card-overlay">
//                         <div className="mobile-game-rect-card-play-icon">
//                           ▶
//                         </div>
//                       </div>
//                     </div>

//                     {/* Title */}
//                     <p>{game.title}</p>
//                   </div>
//                 ))}
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Right Arrow */}
//         {pages.length > 1 && (
//           <button
//             className={`mobile-scroll-nav right ${!canScrollRight ? 'disabled' : ''}`}
//             onClick={scrollRight}
//             aria-label="Scroll right"
//           >
//             ›
//           </button>
//         )}
//       </div>

//       {/* Page Indicator Dots */}
//       {pages.length > 1 && (
//         <div className="mobile-scroll-dots">
//           {pages.map((_, index) => (
//             <button
//               key={index}
//               className={`mobile-scroll-dot ${index === activePage ? 'active' : ''}`}
//               onClick={() => scrollToPage(index)}
//               aria-label={`Go to page ${index + 1}`}
//             />
//           ))}
//         </div>
//       )}
//     </section>
//   );
// }

// react-app/src/components/mobile/MobileGameSectionScroll/MobileGameSectionScroll.jsx
import { useNavigate } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import { useLanguage } from "../../../context/LanguageContext";
import { translate } from "../../../data/translations";
import "./MobileGameSectionScroll.css";
import { getGameThumb } from "../../../utils/getGameThumb";

export default function MobileGameSectionScroll({
  title,
  titleText,
  games,
  categoryId,
  isTag = false,
  showSeeAll = true,
  gamesPerPage = 6
}) {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const scrollRef = useRef(null);
  const [activePage, setActivePage] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollButtons = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  useEffect(() => {
    updateScrollButtons();
  }, [activePage]);

  if (!games || games.length === 0) return null;

  const itemsPerPage = 3;
  const pages = [];
  for (let i = 0; i < games.length; i += itemsPerPage) {
    pages.push(games.slice(i, i + itemsPerPage));
  }

  const handleSeeAll = () => {
    if (!categoryId) return;
    navigate(`/categories/${categoryId}`);
  };

  const handlePlay = (providerId) => {
    if (!providerId) return;
    navigate(`/games/${providerId}`);
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const scrollLeft = scrollRef.current.scrollLeft;
    const pageWidth = scrollRef.current.clientWidth;
    const newPage = Math.round(scrollLeft / pageWidth);
    setActivePage(newPage);
    updateScrollButtons();
  };

  const scrollToPage = (pageIndex) => {
    if (!scrollRef.current) return;
    const pageWidth = scrollRef.current.clientWidth;
    scrollRef.current.scrollTo({
      left: pageIndex * pageWidth,
      behavior: 'smooth'
    });
    setActivePage(pageIndex);
  };

  const scrollLeft = () => { if (activePage > 0) scrollToPage(activePage - 1); };
  const scrollRight = () => { if (activePage < pages.length - 1) scrollToPage(activePage + 1); };

  return (
    <section className={`mobile-game-section-v4 ${isLoaded ? 'loaded' : ''} ${(categoryId || titleText) ? `${categoryId || titleText}-section` : ''}`}>
      <div className="mobile-section-header">
        <h2 className="mobile-section-scroll-title">{title}</h2>

        {showSeeAll && categoryId && (
          <button
            className="mobile-see-all-btn"
            onClick={handleSeeAll}
            aria-label={`View all ${titleText} games`}
          >
            {translate("seeAll", lang) || "View All"}
          </button>
        )}
      </div>

      <div style={{ position: 'relative' }}>
        {pages.length > 1 && (
          <button
            className={`mobile-scroll-nav left ${!canScrollLeft ? 'disabled' : ''}`}
            onClick={scrollLeft}
            aria-label="Scroll left"
          >
            ‹
          </button>
        )}

        <div
          className="mobile-horizontal-scroll"
          ref={scrollRef}
          onScroll={handleScroll}
        >
          <div className="mobile-scroll-track">
            {pages.map((page, pageIndex) => (
              <div key={pageIndex} className="mobile-grid-page">
                {page.map((game) => (
                  <div
                    key={game.provider_id}
                    className="mobile-game-rect-card"
                    onClick={() => handlePlay(game.provider_id)}
                    role="button"
                    tabIndex={0}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') handlePlay(game.provider_id);
                    }}
                  >
                    {/* CHANGED: wrapper reserves 1:1 space before image loads — prevents CLS */}
                    <div
                      className="mobile-game-rect-card-image-wrapper"
                      style={{ aspectRatio: '1 / 1' }}
                    >
                      {/* CHANGED: explicit width + height attributes prevent CLS */}
                      <img
                        src={getGameThumb(game)}
                        alt={game.title}
                        loading="lazy"
                        decoding="async"
                        width="120"
                        height="120"
                        onError={(e) => { e.currentTarget.src = game.image; }}
                      />
                      
                      <div className="mobile-game-rect-card-overlay">
                        <div className="mobile-game-rect-card-play-icon">▶</div>
                      </div>
                    </div>

                    <p>{game.title}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {pages.length > 1 && (
          <button
            className={`mobile-scroll-nav right ${!canScrollRight ? 'disabled' : ''}`}
            onClick={scrollRight}
            aria-label="Scroll right"
          >
            ›
          </button>
        )}
      </div>

      {pages.length > 1 && (
        <div className="mobile-scroll-dots">
          {pages.map((_, index) => (
            <button
              key={index}
              className={`mobile-scroll-dot ${index === activePage ? 'active' : ''}`}
              onClick={() => scrollToPage(index)}
              aria-label={`Go to page ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}