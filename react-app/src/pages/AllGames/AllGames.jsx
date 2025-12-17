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

  useEffect(() => {
    // Load games from localStorage (already fetched in Home)
    const cachedGames = localStorage.getItem("games");
    if (cachedGames) {
      setGames(JSON.parse(cachedGames));
      setLoading(false);
    }
  }, []);

  const filteredGames = games.filter((game) =>
    game.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Reset pagination when search term changes
  useEffect(() => {
    setPage(1);
    setDisplayedGames([]);
    setHasMore(true);
  }, [searchTerm]);

  // Load more games when page changes
  useEffect(() => {
    if (filteredGames.length === 0) {
      setDisplayedGames([]);
      setHasMore(false);
      return;
    }

    const startIndex = 0;
    const endIndex = page * GAMES_PER_PAGE;
    const newDisplayedGames = filteredGames.slice(startIndex, endIndex).map((game, idx) => ({
      ...game,
      originalIndex: games.findIndex(g => g.id === game.id || g.title === game.title)
    }));
    
    setDisplayedGames(newDisplayedGames);
    setHasMore(endIndex < filteredGames.length);
  }, [page, filteredGames, games]);

  // Intersection Observer for infinite scroll
  const handleObserver = useCallback((entries) => {
    const [target] = entries;
    if (target.isIntersecting && hasMore && !loading) {
      setPage((prev) => prev + 1);
    }
  }, [hasMore, loading]);

  useEffect(() => {
    const element = observerTarget.current;
    const option = { threshold: 0.1 };
    const observer = new IntersectionObserver(handleObserver, option);
    
    if (element) observer.observe(element);
    
    return () => {
      if (element) observer.unobserve(element);
    };
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
      {/* Header Section */}
      <div className="all-games-header">
        <h1>🎮 {translate("allGames", lang)}</h1>
        <p className="all-games-count">
          {filteredGames.length} {translate("games", lang).toLowerCase()}
          {displayedGames.length < filteredGames.length && 
            ` (showing ${displayedGames.length})`
          }
        </p>
      </div>

      {/* Search Bar */}
      <div className="all-games-search">
        <input
          type="text"
          placeholder={`${translate("search", lang) || "Search"} games...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Games Grid - Masonry Layout */}
      <div className="all-games-grid">
        {displayedGames.map((game) => (
          <GameCard 
            key={`${game.id}-${game.originalIndex}`} 
            game={game} 
            index={game.originalIndex} 
          />
        ))}
      </div>

      {/* Loading Indicator */}
      {hasMore && displayedGames.length > 0 && (
        <div ref={observerTarget} className="loading-indicator">
          <div className="loading-spinner"></div>
          <p>Loading more games...</p>
        </div>
      )}

      {/* No Results */}
      {filteredGames.length === 0 && !loading && (
        <div className="no-results">
          <p>No games found matching "{searchTerm}"</p>
        </div>
      )}
    </div>
  );
}