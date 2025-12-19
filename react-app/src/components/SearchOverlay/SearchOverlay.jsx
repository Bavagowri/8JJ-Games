import { useEffect, useRef } from "react";
import GameSection from "../GameSection/GameSection";
import { translate } from "../../data/translations";
import { useLanguage } from "../../context/LanguageContext";
import { useSearch } from "../../context/SearchContext";
import "./SearchOverlay.css";

export default function SearchOverlay({ games }) {
  const { search } = useSearch();
  const { lang } = useLanguage();

  const hasScrolledRef = useRef(false);
  const normalizedSearch = search.trim().toLowerCase();

  /* 🔥 SCROLL THE REAL CONTAINER */
  useEffect(() => {
    if (!normalizedSearch) {
      hasScrolledRef.current = false;
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

  if (!normalizedSearch) return null;

  const searchResults = games.filter((g) => {
    const title = g.title.toLowerCase();

    if (normalizedSearch.length === 1) {
      return title.startsWith(normalizedSearch);
    }

    return title.startsWith(normalizedSearch);
  });

  return (
    <div className="search-overlay">
      {searchResults.length > 0 ? (
        <GameSection
          id="searchResults"
          title={translate("searchResults", lang)}
          games={searchResults}
        />
      ) : (
        <div
          style={{
            textAlign: "center",
            padding: "60px 20px",
            minHeight: "300px",
          }}
        >
          <h2>{translate("noGamesFound", lang)}</h2>
        </div>
      )}
    </div>
  );
}
