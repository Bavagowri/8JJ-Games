// // react-app/src/components/mobile/MobilePopularSection/MobilePopularSection.jsx
// import { useEffect, useState, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import MobileGameCard from "../MobileGameCard/MobileGameCard";
// import { useLanguage } from "../../../context/LanguageContext";
// import { translate } from "../../../data/translations";
// import "./MobilePopularSection.css";
// import { getPopularGames } from "../../../api/games.api";


// const API_BASE = import.meta.env.VITE_API_URL;
// if (!API_BASE) {
//   console.warn("VITE_API_URL is not defined");
// }

// export default function MobilePopularSection({ id, title }) {
//   const [popularGames, setPopularGames] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [isLoaded, setIsLoaded] = useState(false);
//   const [hasOverflow, setHasOverflow] = useState(false);
//   const { lang } = useLanguage();
//   const navigate = useNavigate();
//   const scrollRef = useRef(null);

//   useEffect(() => {
//     let mounted = true;

//     async function fetchPopular() {
//       try {
//         const games = await getPopularGames(12); // mobile shows 12
//         if (mounted) {
//           setPopularGames(games);
//         }
//       } catch (err) {
//         console.error("Popular fetch failed", err);
//         if (mounted) {
//           setPopularGames([]);
//         }
//       } finally {
//         if (mounted) {
//           setLoading(false);
//           setTimeout(() => setIsLoaded(true), 100);
//         }
//       }
//     }

//     fetchPopular();

//     return () => {
//       mounted = false;
//     };
//   }, []);

//   useEffect(() => {
//     // Check if content overflows (for scroll indicator)
//     const checkOverflow = () => {
//       if (scrollRef.current) {
//         const hasScroll = scrollRef.current.scrollWidth > scrollRef.current.clientWidth;
//         setHasOverflow(hasScroll);
//       }
//     };

//     checkOverflow();
//     window.addEventListener('resize', checkOverflow);
//     return () => window.removeEventListener('resize', checkOverflow);
//   }, [popularGames]);

//   // Format plays count for display
//   const formatPlays = (count) => {
//     if (!count) return "0";
//     if (count >= 1000000) {
//       return `${(count / 1000000).toFixed(1)}M`;
//     }
//     if (count >= 1000) {
//       return `${(count / 1000).toFixed(1)}K`;
//     }
//     return count.toString();
//   };

//   // Determine if game is trending (increased plays recently)
//   const isTrending = (index) => {
//     // Simple logic: top 3 games are trending
//     return index < 3;
//   };

//   // Get rank class for styling
//   const getRankClass = (index) => {
//     if (index === 0) return "top-1";
//     if (index === 1) return "top-2";
//     if (index === 2) return "top-3";
//     return "";
//   };

//   if (!loading && (!popularGames || popularGames.length === 0)) {
//     return (
//       <section className="mobile-popular-section" id={id}>
//         <div className="mobile-popular-section-header">
//           <h2 className="mobile-section-popular-title">{title}</h2>
//         </div>
//         <div className="mobile-popular-empty">
//           <div className="mobile-popular-empty-icon">🎮</div>
//           <div className="mobile-popular-empty-text">No popular games yet</div>
//           <div className="mobile-popular-empty-subtext">
//             Start playing to see popular games here
//           </div>
//         </div>
//       </section>
//     );
//   }

//   if (loading) {
//     return (
//       <section className="mobile-popular-section" id={id}>
//         <div className="mobile-popular-section-header">
//           <h2 className="mobile-section-popular-title">{title}</h2>
//         </div>
//         <div className="mobile-popular-scroll">
//           {Array.from({ length: 6 }).map((_, index) => (
//             <div key={`skeleton-${index}`} className="mobile-popular-skeleton" />
//           ))}
//         </div>
//       </section>
//     );
//   }

//   return (
//     <section
//       className={`mobile-popular-section ${isLoaded ? 'loaded' : ''} ${hasOverflow ? 'has-overflow' : ''}`}
//       id={id}
//     >
//       {/* Header */}
//       <div className="mobile-popular-section-header">
//         <h2 className="mobile-section-popular-title">{title}</h2>

//         {/* Optional: View All button */}
//         {/* <button 
//           className="mobile-popular-view-all"
//           onClick={() => navigate('/popular')}
//         >
//           View All →
//         </button> */}
//       </div>

//       {/* Horizontal scroll */}
//       <div className="mobile-popular-scroll" ref={scrollRef}>
//         {popularGames.map((game, index) => (
//           <div key={game.provider_id} className="mobile-popular-item">
//             {/* Ranking Badge */}
//             <div className={`mobile-popular-rank ${getRankClass(index)}`}>
//               {index + 1}
//             </div>

//             {/* Plays Badge */}
//             {game.total_plays > 0 && (
//               <div className="mobile-popular-plays">
//                 <span className="mobile-popular-plays-icon">▶</span>
//                 {formatPlays(game.total_plays)}
//               </div>
//             )}

//             {/* Trending Badge (for top 3) */}
//             {isTrending(index) && (
//               <div className="mobile-popular-trending">
//                 <span className="mobile-popular-trending-icon">↗</span>
//                 Hot
//               </div>
//             )}

//             <MobileGameCard game={game} index={index} />
//           </div>
//         ))}
//       </div>

//       {/* Scroll indicator */}
//       {hasOverflow && (
//         <div className="mobile-popular-scroll-indicator" aria-hidden="true" />
//       )}
//     </section>
//   );
// }

// react-app/src/components/mobile/MobilePopularSection/MobilePopularSection.jsx
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import MobileGameCard from "../MobileGameCard/MobileGameCard";
import { useLanguage } from "../../../context/LanguageContext";
import { translate } from "../../../data/translations";
import "./MobilePopularSection.css";
import { getPopularGames } from "../../../api/games.api";

export default function MobilePopularSection({ id, title, games: gamesProp }) {
  const [popularGames, setPopularGames] = useState(gamesProp || []);
  const [loading, setLoading] = useState(!gamesProp);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  useEffect(() => {
    // CHANGED: If a games array was passed as a prop (from MobileHome's bundle),
    // skip the independent API call entirely. This removes a competing network
    // request that was firing at the same time as the LCP image fetch.
    if (gamesProp && gamesProp.length > 0) {
      setPopularGames(gamesProp);
      setLoading(false);
      setTimeout(() => setIsLoaded(true), 100);
      return;
    }

    // Fallback: fetch independently if no prop provided
    // (e.g. when MobilePopularSection is used outside of MobileHome)
    let mounted = true;

    async function fetchPopular() {
      try {
        const games = await getPopularGames(12);
        if (mounted) {
          setPopularGames(games);
        }
      } catch (err) {
        console.error("Popular fetch failed", err);
        if (mounted) {
          setPopularGames([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
          setTimeout(() => setIsLoaded(true), 100);
        }
      }
    }

    fetchPopular();

    return () => {
      mounted = false;
    };
  }, [gamesProp]);

  // Update popularGames if the prop changes after mount
  useEffect(() => {
    if (gamesProp && gamesProp.length > 0) {
      setPopularGames(gamesProp);
      setLoading(false);
    }
  }, [gamesProp]);

  useEffect(() => {
    const checkOverflow = () => {
      if (scrollRef.current) {
        const hasScroll = scrollRef.current.scrollWidth > scrollRef.current.clientWidth;
        setHasOverflow(hasScroll);
      }
    };

    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [popularGames]);

  const formatPlays = (count) => {
    if (!count) return "0";
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  const isTrending = (index) => index < 3;

  const getRankClass = (index) => {
    if (index === 0) return "top-1";
    if (index === 1) return "top-2";
    if (index === 2) return "top-3";
    return "";
  };

  if (!loading && (!popularGames || popularGames.length === 0)) {
    return null;
  }

  if (loading) {
    return (
      <section className="mobile-popular-section" id={id}>
        <div className="mobile-popular-section-header">
          <h2 className="mobile-section-popular-title">{title}</h2>
        </div>
        <div className="mobile-popular-scroll">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={`skeleton-${index}`} className="mobile-popular-skeleton" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      className={`mobile-popular-section ${isLoaded ? 'loaded' : ''} ${hasOverflow ? 'has-overflow' : ''}`}
      id={id}
    >
      <div className="mobile-popular-section-header">
        <h2 className="mobile-section-popular-title">{title}</h2>
      </div>

      <div className="mobile-popular-scroll" ref={scrollRef}>
        {popularGames.map((game, index) => (
          <div key={game.provider_id} className="mobile-popular-item">
            <div className={`mobile-popular-rank ${getRankClass(index)}`}>
              {index + 1}
            </div>

            {game.total_plays > 0 && (
              <div className="mobile-popular-plays">
                <span className="mobile-popular-plays-icon">▶</span>
                {formatPlays(game.total_plays)}
              </div>
            )}

            {isTrending(index) && (
              <div className="mobile-popular-trending">
                <span className="mobile-popular-trending-icon">↗</span>
                Hot
              </div>
            )}

            <MobileGameCard game={game} index={index} />
          </div>
        ))}
      </div>

      {hasOverflow && (
        <div className="mobile-popular-scroll-indicator" aria-hidden="true" />
      )}
    </section>
  );
}