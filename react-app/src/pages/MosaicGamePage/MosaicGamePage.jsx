import { useEffect, useState } from "react";
import MosaicGameCard from "../../components/MosaicGameCard/MosaicGameCard";
import CategoryGrid from "../../components/CategoryGrid/CategoryGrid";
import { translate } from "../../data/translations";
import { useLanguage } from "../../context/LanguageContext";
import WhatWeOffer from "../../components/WhatWeOffer/WhatWeOffer";
import ScrollToTop from "../../components/ScrollToTop";
import "./MosaicGamePage.css";

const INITIAL_COUNT = 40;

export default function MosaicGamesPage() {
  const { lang } = useLanguage();

  const [games, setGames] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);

  /* Load games once */
  useEffect(() => {
    const cached = localStorage.getItem("games");
    if (!cached) return;

    const parsed = JSON.parse(cached);

    const withSizes = parsed.map((g, i) => ({
      ...g,
      size:
        i % 12 === 0 ? "large" :
        i % 9 === 0 ? "wide" :
        i % 7 === 0 ? "tall" :
        "small",
    }));

    setGames(withSizes);
  }, []);

  /* Reset visible count on search */
  useEffect(() => {
    setVisibleCount(INITIAL_COUNT);
  }, [searchTerm]);

  /* Filtered games */
  const filteredGames = games.filter(game =>
    game.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /* Visible slice */
  const visibleGames = filteredGames.slice(0, visibleCount);

  return (
    <div className="mosaic-page">
      <ScrollToTop />
      {/* Heading */}
      <h1 className="page-title">🎮 {translate("allGames", lang)}</h1>

      {/* ✅ SEARCH BAR */}
      <div className="mosaic-search">
        <input
          type="text"
          className="mosaic-search-input"
          placeholder={`${translate("search", lang)} games...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <WhatWeOffer />

      {/* Games grid */}
      <div className="mosaic-grid">
        {visibleGames.map(game => (
          <MosaicGameCard key={game.id} game={game} />
        ))}
      </div>

      {/* No results */}
      {filteredGames.length === 0 && (
        <div className="no-results">
          No games found for “{searchTerm}”
        </div>
      )}

      {/* View more */}
      {visibleCount < filteredGames.length && (
        <div className="view-more-wrapper">
          <button
            className="view-more-btn"
            onClick={() => setVisibleCount(filteredGames.length)}
          >
            View More Games
          </button>
        </div>
      )}

      {/* Categories */}
      <CategoryGrid />
    </div>
  );
}
