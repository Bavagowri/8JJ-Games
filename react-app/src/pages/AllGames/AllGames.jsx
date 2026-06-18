import { useEffect, useState, useRef, useCallback } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { translate } from "../../data/translations";
import GameCard from "../../components/GameCard/GameCard";
import HorizontalGameSlider from "../../components/HorizontalGameSlider/HorizontalGameSlider";
import WhatWeOffer from "../../components/WhatWeOffer/WhatWeOffer";

import "./AllGames.css";

const GAMES_PER_PAGE = 50;

export default function AllGames() {
  const { lang } = useLanguage();
  const observerTarget = useRef(null);

  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);

  /*  Load cached games ONCE */
  useEffect(() => {
    const cached = typeof window !== "undefined" ? localStorage.getItem("games") : null;
    if (cached) {
      setGames(JSON.parse(cached));
    }
    setLoading(false);
  }, []);

  /*  Filter is derived — no state */
  const filteredGames = games.filter(game =>
    game.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /*  Paginated slice (derived, no loop) */
  const displayedGames = filteredGames.slice(
    0,
    page * GAMES_PER_PAGE
  );

  const hasMore = displayedGames.length < filteredGames.length;

  /* Reset page on search */
  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  /* Infinite scroll observer */
  const handleObserver = useCallback(
    entries => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        setPage(p => p + 1);
      }
    },
    [hasMore, loading]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      threshold: 0.1,
    });

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [handleObserver]);

  if (loading) {
    return (
      <div className="all-games-page">
        <div className="all-games-header">
          <h1>{translate("allGames", lang)}</h1>
          <p>Loading games…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="all-games-page">
      {/* Header */}
      <div className="all-games-header">
        <h1>🎮 {translate("allGames", lang)}</h1>
        <p className="all-games-count">
          {filteredGames.length}{" "}
          {translate("games", lang).toLowerCase()}
          {displayedGames.length < filteredGames.length &&
            ` (showing ${displayedGames.length})`}
        </p>
      </div>

      {/* Search */}
      <div className="all-games-search">
        <input
          className="search-input"
          placeholder={`${translate("search", lang)} games…`}
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      <WhatWeOffer />

      <HorizontalGameSlider
        title="🔥 Top Picks for You"
        games={games.slice(0, 20)}
      />

      {/* Grid */}
      <div className="all-games-grid">
        {displayedGames.map(game => (
          <GameCard
            key={game.id}
            game={game}   //  GameCard navigates by game.id
          />
        ))}
      </div>

      {/* Infinite loader */}
      {hasMore && (
        <div ref={observerTarget} className="loading-indicator">
          <div className="loading-spinner" />
          <p>Loading more games…</p>
        </div>
      )}

      {/* Empty */}
      {!loading && filteredGames.length === 0 && (
        <div className="no-results">
          <p>No games found</p>
        </div>
      )}
    </div>
  );
}
