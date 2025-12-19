import { useEffect, useState } from "react";
import MosaicGameCard from "../../components/MosaicGameCard/MosaicGameCard";
import CategoryGrid from "../../components/CategoryGrid/CategoryGrid";
import { translate } from "../../data/translations";
import { useLanguage } from "../../context/LanguageContext";
import WhatWeOffer from "../../components/WhatWeOffer/WhatWeOffer";
import ScrollToTop from "../../components/ScrollToTop";
import { useNavigate } from "react-router-dom";
import "./MosaicGamePage.css";
// import { useSearch } from "../../context/SearchContext.jsx";

const INITIAL_COUNT = 40;

export default function MosaicGamesPage() {
  const { lang } = useLanguage();
  const navigate = useNavigate();

  const [games, setGames] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
  // const { search } = useSearch();
  


  /* Load games once */
  useEffect(() => {
    const cached = localStorage.getItem("games");
    if (!cached) return;

    const parsed = JSON.parse(cached);

    const withSizes = parsed.map((g, i) => ({
      ...g,
      size:
        i % 12 === 0
          ? "large"
          : i % 9 === 0
          ? "wide"
          : i % 7 === 0
          ? "tall"
          : "small",
    }));

    setGames(withSizes);
  }, []);


  /* Reset visible count on search */
  useEffect(() => {
    setVisibleCount(INITIAL_COUNT);
  }, [searchTerm]);

/* Optimized search */
  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredGames = games.filter((game) => {
    const title = game.title.toLowerCase();

    if (!normalizedSearch) return true;

    if (normalizedSearch.length === 1) {
      return title.startsWith(normalizedSearch);
    }

    return title.startsWith(normalizedSearch);
  });

  /* Visible slice */
  const visibleGames = filteredGames.slice(0, visibleCount);


  const clearSearch = () => {
    setSearchTerm("");
  };

  return (
    <div className="ScrollSnap">
      <div className="mosaic-page home-wrapper">
        <ScrollToTop />
        {/* Heading */}
        <h1 className="page-title">🎮 {translate("allGames", lang)}</h1>

        {/* ✅ SEARCH BAR */}
        <div className="mosaic-search">
          <input
            type="text"
            className="mosaic-search-input"
            placeholder={`${translate("searchGames", lang)}`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            className="mosaic-search-icon-btn"
            onClick={searchTerm ? clearSearch : undefined}
          >
            {searchTerm ? "✖" : ""}
          </button>
        </div>

        <WhatWeOffer />

        {/* Games grid */}
        <div className="mosaic-grid">
          {visibleGames.map((game) => (
            <MosaicGameCard key={game.id} game={game} />
          ))}
        </div>

        {/* No results */}
        {filteredGames.length === 0 && (
          <div className="no-results">
            {translate("noGamesFound", lang)} "{searchTerm}"
          </div>
        )}

        {/* View more */}
        {visibleCount < filteredGames.length && (
          <div className="container">
            <a
              href="#"
              className="btn"
              onClick={(e) => {
                e.preventDefault();
                setVisibleCount((prev) => prev + 40);
              }}
            >
              <span className="btnInner">
                {translate("viewMoreGames", lang)}
              </span>
            </a>
          </div>
        )}
      </div>

      {/* Categories */}
      <div className="ScrollSnap">
        <div className="mosaic-page home-wrapper">
          <h2 className="Cat-title">{translate("MoreCategories", lang)}</h2>
          <CategoryGrid limit={14} />

          <div className="container">
            <button className="btn" onClick={() => navigate(`/categories`)}>
              <span className="btnInner">{translate("viewMore", lang)}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
