// // react-app/src/components/SearchOverlay/SearchOverlay.jsx
// import { useEffect, useRef } from "react";
// import GameSection from "../GameSection/GameSection";
// import { translate } from "../../data/translations";
// import { useLanguage } from "../../context/LanguageContext";
// import { useSearch } from "../../context/SearchContext";
// import "./SearchOverlay.css";

// export default function SearchOverlay({ games }) {
//   const { search } = useSearch();
//   const { lang } = useLanguage();

//   const hasScrolledRef = useRef(false);
//   const normalizedSearch = search.trim().toLowerCase();

//   /*  SCROLL THE REAL CONTAINER */
//   useEffect(() => {
//     if (!normalizedSearch) {
//       hasScrolledRef.current = false;
//       return;
//     }

//     if (!hasScrolledRef.current) {
//       const scrollRoot = document.getElementById("app-scroll-root");
//       if (scrollRoot) {
//         scrollRoot.scrollTo({ top: 0, behavior: "auto" });
//       } else {
//         window.scrollTo({ top: 0, behavior: "auto" });
//       }
//       hasScrolledRef.current = true;
//     }
//   }, [normalizedSearch]);

//   if (!normalizedSearch) return null;

//   // Add safety check for games array
//   if (!games || !Array.isArray(games)) {
//     return (
//       <div className="search-overlay">
//         <div
//           style={{
//             textAlign: "center",
//             padding: "60px 20px",
//             minHeight: "300px",
//           }}
//         >
//           <h2>{translate("noGamesFound", lang)}</h2>
//         </div>
//       </div>
//     );
//   }

//   // Filter with additional safety checks
//   const searchResults = games.filter((g) => {
//     if (!g || typeof g.title !== 'string') return false;
    
//     const title = g.title.toLowerCase();

//     if (normalizedSearch.length === 1) {
//       return title.startsWith(normalizedSearch);
//     }

//     return title.startsWith(normalizedSearch);
//   });

//   // Get translated search results text
//   const searchResultsText = translate("searchResults", lang);

//   return (
//     <div className="search-overlay">
//       {searchResults.length > 0 ? (
//         <GameSection
//           id="searchResults"
//           title={searchResultsText}
//           titleText={searchResultsText} // ADD THIS - required for SEO
//           games={searchResults}
//           slider={false}
//           allGamesPage={false}
//         />
//       ) : (
//         <div
//           style={{
//             textAlign: "center",
//             padding: "60px 20px",
//             minHeight: "300px",
//           }}
//         >
//           <h2>{translate("noGamesFound", lang)}</h2>
//         </div>
//       )}
//     </div>
//   );
// }




// react-app/src/components/SearchOverlay/SearchOverlay.jsx
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import GameSection from "../GameSection/GameSection";
import { translate } from "../../data/translations";
import { useLanguage } from "../../context/LanguageContext";
import { useSearch } from "../../context/SearchContext";
import "./SearchOverlay.css";

export default function SearchOverlay() {
  const { search } = useSearch();
  const { lang } = useLanguage();

  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);

  const hasScrolledRef = useRef(false);
  const normalizedSearch = search.trim().toLowerCase();

  const API = import.meta.env.VITE_API_URL;

  // ── Scroll to top on new search ───────────────────────────────────
  useEffect(() => {
    if (!normalizedSearch) {
      hasScrolledRef.current = false;
      setGames([]);
      return;
    }

    if (!hasScrolledRef.current) {
      const scrollRoot = document.getElementById("app-scroll-root");
      if (scrollRoot) {
        scrollRoot.scrollTo({ top: 0, behavior: "auto" });
      } else {
        window.scrollTo({ top: 0, behavior: "auto" });
      }
      hasScrolledRef.current = true;
    }
  }, [normalizedSearch]);

  // ── Debounced API fetch ───────────────────────────────────────────
  // Fetches from the real DB — provider_id is always correct,
  // including self-hosted games (provider_id = "self_xxx").
  useEffect(() => {
    const trimmed = search.trim();
    if (!trimmed) {
      setGames([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `${API}/api/games?search=${encodeURIComponent(trimmed)}&limit=40`
        );
        const data = await res.json();
        setGames(data.data || []);
      } catch (err) {
        console.error("SearchOverlay fetch error:", err);
        setGames([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [search, API]);

  if (!normalizedSearch) return null;

  const searchResultsText = translate("searchResults", lang);

  if (loading) {
    return (
      <div className="search-overlay">
        <div style={{ textAlign: "center", padding: "60px 20px", minHeight: "300px" }}>
          <p>{translate("loading", lang) || "Searching..."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="search-overlay">
      {games.length > 0 ? (
        <GameSection
          id="searchResults"
          title={searchResultsText}
          titleText={searchResultsText}
          games={games}
          slider={false}
          allGamesPage={false}
        />
      ) : (
        <div style={{ textAlign: "center", padding: "60px 20px", minHeight: "300px" }}>
          <h2>{translate("noGamesFound", lang)}</h2>
        </div>
      )}
    </div>
  );
}