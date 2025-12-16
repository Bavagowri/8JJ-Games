import { useEffect, useState, useRef, useCallback } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { translate } from "../../data/translations";
import GameCard from "../../components/GameCard/GameCard";
import "./AllGames.css";

const GAMES_PER_PAGE = 50;

export default function AllGames() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [displayedGames, setDisplayedGames] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { lang } = useLanguage();
  const observerTarget = useRef(null);

  /* ✅ Load games from cache */
  useEffect(() => {
    const cached = localStorage.getItem("games");
    if (cached) {
      setGames(JSON.parse(cached));
      setLoading(false);
    }
  }, []);

  const filteredGames = games.filter(game =>
    game.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /* Reset pagination on search */
  useEffect(() => {
    setPage(1);
    setDisplayedGames([]);
    setHasMore(true);
  }, [searchTerm]);

  /* Paginate */
  useEffect(() => {
    const endIndex = page * GAMES_PER_PAGE;
    const slice = filteredGames.slice(0, endIndex);

    setDisplayedGames(slice);
    setHasMore(endIndex < filteredGames.length);
  }, [page, filteredGames]);

  /* Infinite scroll */
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

    if (observerTarget.current) observer.observe(observerTarget.current);
    return () => observer.disconnect();
  }, [handleObserver]);

  if (loading) {
    return (
      <div className="all-games-page">
        <div className="all-games-header">
          <h1>{translate("allGames", lang)}</h1>
          <p>Loading games...</p>
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
          {filteredGames.length} {translate("games", lang).toLowerCase()}
          {displayedGames.length < filteredGames.length &&
            ` (showing ${displayedGames.length})`}
        </p>
      </div>

      {/* Search */}
      <div className="all-games-search">
        <input
          type="text"
          placeholder={`${translate("search", lang)} games...`}
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Grid */}
      <div className="all-games-grid">
        {displayedGames.map(game => (
          <GameCard
            key={game.id}
            game={game}      // ✅ GameCard navigates via game.id
          />
        ))}
      </div>

      {/* Loader */}
      {hasMore && (
        <div ref={observerTarget} className="loading-indicator">
          <div className="loading-spinner"></div>
          <p>Loading more games...</p>
        </div>
      )}

      {/* Empty state */}
      {!loading && filteredGames.length === 0 && (
        <div className="no-results">
          <p>No games found for “{searchTerm}”</p>
        </div>
      )}
    </div>
  );
}
