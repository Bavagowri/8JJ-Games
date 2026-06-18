
// src/pages/mobile/MobileAllGames/MobileAllGames.jsx


import { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import MobileHeader from "../../../components/mobile/MobileHeader/MobileHeader";
import MobileBottomNav from "../../../components/mobile/MobileBottomNav/MobileBottomNav";
import MobileGameFilter from "../../../components/mobile/MobileGameFilter/MobileGameFilter";
import { useLanguage } from "../../../context/LanguageContext";
import { translate } from "../../../data/translations";
import { enhanceGamesWithMetadata } from "../../../data/gameMetadata";
import { BLOCKED_GAME_IDS } from "../../../utils/blockedGames";
import SEO from "../../../components/SEO/SEO";
import { generateKeywords } from "../../../config/seoKeywords";
import "./MobileAllGames.css";
import { getGameThumb } from "../../../utils/getGameThumb";
import MobileBreadcrumb from "../../../components/mobile/MobileBreadcrumb/MobileBreadcrumb";

//  UniversalBanner
import UniversalBanner from "../../../components/UniversalBanner/UniversalBanner";

const INITIAL_LOAD = 30;
const LOAD_MORE_COUNT = 20;


const R2_BASE =
  import.meta.env.VITE_ASSETS_BASE_URL ||
  "https://assets.8jjgames.com";

const ICONS = {
  games: `${R2_BASE}/8jj_icons/sidebar-icons-2/all.webp`,
};

export default function MobileAllGames() {
  const { lang } = useLanguage();
  const navigate = useNavigate();

  const [games, setGames] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleCount, setVisibleCount] = useState(INITIAL_LOAD);
  const [sortBy, setSortBy] = useState("title-asc");
  const [filterOpen, setFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    categories: [],
    tags: [],
    difficulty: [],
    players: [],
    ageRating: [],
    features: [],
    onlyTrending: false,
    onlyPopular: false
  });

  useEffect(() => {
    const loadAllGames = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/games`
        );

        const data = await res.json();
        const dbGames = data.data || [];

        const allowedGames = dbGames.filter(
          g => !BLOCKED_GAME_IDS.includes(g.id)
        );

        const enhanced = enhanceGamesWithMetadata(allowedGames);

        const withSizes = enhanced.map((g, i) => ({
          ...g,
          size:
            i % 12 === 0 ? "large"
            : i % 9 === 0 ? "wide"
            : i % 7 === 0 ? "tall"
            : "small",
        }));

        setGames(withSizes);

      } catch (err) {
        console.error("Failed to load all games:", err);
      } finally {
        setLoading(false);
      }
    };

    loadAllGames();
  }, []);
  useEffect(() => {
    setVisibleCount(INITIAL_LOAD);
  }, [searchTerm, filters, sortBy]);

  const applyFilters = useCallback((game) => {
    if (searchTerm.trim()) {
      const normalizedSearch = searchTerm.trim().toLowerCase();
      const title = game.title.toLowerCase();
      if (normalizedSearch.length === 1) {
        if (!title.startsWith(normalizedSearch)) return false;
      } else {
        if (!title.includes(normalizedSearch)) return false;
      }
    }

    if (filters.categories.length > 0) {
      const gameCategory = (game.category || '').toLowerCase().trim();
      if (!gameCategory) return false;
      const hasMatchingCategory = filters.categories.some(
        filterCat => gameCategory === filterCat.toLowerCase().trim()
      );
      if (!hasMatchingCategory) return false;
    }

    if (filters.tags.length > 0) {
      let gameTags = [];
      if (Array.isArray(game.tagList) && game.tagList.length > 0) {
        gameTags = game.tagList.map(tag => String(tag).toLowerCase().trim());
      } else if (typeof game.tags === 'string' && game.tags.trim()) {
        gameTags = game.tags.split(',').map(t => t.toLowerCase().trim()).filter(Boolean);
      }
      if (gameTags.length === 0) return false;
      const normalizedFilterTags = filters.tags.map(tag => String(tag).toLowerCase().trim());
      if (!normalizedFilterTags.some(ft => gameTags.includes(ft))) return false;
    }

    if (filters.difficulty.length > 0 && (!game.difficulty || !filters.difficulty.includes(game.difficulty))) return false;
    if (filters.players.length > 0 && (!game.players || !filters.players.includes(game.players))) return false;
    if (filters.ageRating.length > 0 && (!game.ageRating || !filters.ageRating.includes(game.ageRating))) return false;

    if (filters.features.length > 0) {
      const gameFeatures = game.features || [];
      if (!filters.features.some(feature => gameFeatures.includes(feature))) return false;
    }

    if (filters.onlyTrending && !game.trending) return false;
    if (filters.onlyPopular && !game.popular) return false;

    return true;
  }, [searchTerm, filters]);

  const sortGames = useCallback((gamesArray) => {
    const sorted = [...gamesArray];
    switch (sortBy) {
      case "title-asc":   return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case "title-desc":  return sorted.sort((a, b) => b.title.localeCompare(a.title));
      case "popular":     return sorted.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
      case "trending":    return sorted.sort((a, b) => (b.trending ? 1 : 0) - (a.trending ? 1 : 0));
      case "newest":      return sorted.sort((a, b) => (b.releaseYear || 0) - (a.releaseYear || 0));
      case "oldest":      return sorted.sort((a, b) => (a.releaseYear || 0) - (b.releaseYear || 0));
      default:            return sorted;
    }
  }, [sortBy]);

  const filteredGames = useMemo(() => sortGames(games.filter(applyFilters)), [games, applyFilters, sortGames]);
  const visibleGames = filteredGames.slice(0, visibleCount);

  const handleLoadMore = () => setVisibleCount(prev => prev + LOAD_MORE_COUNT);
  const handleSearch = (value) => setSearchTerm(value);
  const handleSortChange = (sort) => setSortBy(sort);
  const handleFilterChange = useCallback((newFilters) => setFilters(newFilters), []);

  const resetAllFilters = () => {
    setSearchTerm("");
    setFilters({ categories: [], tags: [], difficulty: [], players: [], ageRating: [], features: [], onlyTrending: false, onlyPopular: false });
  };

  const getActiveFilterCount = () =>
    filters.categories.length + filters.tags.length + filters.difficulty.length +
    filters.players.length + filters.ageRating.length + filters.features.length +
    (filters.onlyTrending ? 1 : 0) + (filters.onlyPopular ? 1 : 0);

  const hasActiveFilters = getActiveFilterCount() > 0;

  const seoTitle = searchTerm.trim()
    ? `Search "${searchTerm}" - Mobile Games | 8JJ Games`
    : `Browse ${games.length}+ Mobile Games | 8JJ Games`;
  const seoDescription = searchTerm.trim()
    ? `Search results for "${searchTerm}" - Find and play free mobile games instantly.`
    : `Browse all ${games.length}+ free mobile games. Play action, puzzle, racing, sports games and more on your phone or tablet.`;

  if (loading) {
    return (
      <div className="mobile-allgames-wrapper">
        <MobileHeader />
        <div className="mobile-content">
          <div className="mobile-loading">
            <div className="mobile-spinner"></div>
            <p>{translate("loadingText", lang)}</p>
          </div>
        </div>
        <MobileBottomNav />
      </div>
    );
  }

  return (
    <>
      <SEO
        title={seoTitle}
        description={seoDescription}
        keywords={generateKeywords('pages', 'allgames')}
        url="/all-mosaic-games"
      />

      <div className="mobile-allgames-wrapper">
        <MobileHeader onSearch={handleSearch} />

        <MobileGameFilter
          isOpen={filterOpen}
          onClose={() => setFilterOpen(false)}
          onFilterChange={handleFilterChange}
          totalGames={games.length}
          filteredCount={filteredGames.length}
          initialFilters={filters}
        />

        <div className="mobile-content">

          {/*  Hero banner above breadcrumb/header */}
          <UniversalBanner
            placementKey="all_games_hero"
            className="mobile-banner-hero"
          />

          <MobileBreadcrumb
            items={[
              { label: translate("home", lang) || "Home", path: "/", icon: "" },
              { label: translate("allGames", lang) || "All Games", icon: "" }
            ]}
          />

          <div className="mobile-all-games-header">
            <div className="mobile-all-games-header-content">
              <div className="mobile-all-games-header-icon-box">
                <img src={ICONS.games} className="mobile-all-games-header-icon" alt="" />
              </div>
              <div className="mobile-all-games-header-info">
                <h1 className="mobile-all-games-header-title">
                  {searchTerm.trim() ? `Search: "${searchTerm}"` : translate("allGames", lang) || "All Games"}
                </h1>
                <p className="mobile-all-games-header-count">
                  {filteredGames.length} {translate("games", lang) || "Games"}
                </p>
              </div>
            </div>
          </div>

          <div className="mobile-controls-bar">
            <div className="mobile-controls-left">
              <button
                className={`mobile-filter-trigger ${hasActiveFilters ? 'active' : ''}`}
                onClick={() => setFilterOpen(true)}
              >
                <span className="mobile-filter-icon">⚙️</span>
                <span className="mobile-filter-text">{translate("filters", lang) || "Filters"}</span>
                {hasActiveFilters && <span className="mobile-filter-badge">{getActiveFilterCount()}</span>}
              </button>
            </div>
            <div className="mobile-controls-right">
              <select
                className="mobile-sort-select"
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                aria-label="Sort games"
              >
                <option value="title-asc">{translate("titleAZ", lang) || "A-Z"}</option>
                <option value="title-desc">{translate("titleZA", lang) || "Z-A"}</option>
                <option value="popular">{translate("mostPopular", lang) || "Popular"}</option>
                <option value="trending">{translate("trending", lang) || "Trending"}</option>
                <option value="newest">{translate("newestFirst", lang) || "Newest"}</option>
                <option value="oldest">{translate("oldestFirst", lang) || "Oldest"}</option>
              </select>
            </div>
          </div>

          {hasActiveFilters && (
            <div className="mobile-active-filters">
              <div className="mobile-active-filters-title">{translate("activeFilters", lang) || "Active Filters"}:</div>
              <div className="mobile-active-filters-chips">
                {filters.categories.map(cat => (
                  <span key={`cat-${cat}`} className="mobile-active-filter-chip">
                    {cat}
                    <button className="mobile-active-filter-remove" onClick={() => setFilters(prev => ({ ...prev, categories: prev.categories.filter(c => c !== cat) }))}>✕</button>
                  </span>
                ))}
                {filters.tags.map(tag => (
                  <span key={`tag-${tag}`} className="mobile-active-filter-chip">
                    {tag.replace(/-/g, ' ')}
                    <button className="mobile-active-filter-remove" onClick={() => setFilters(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }))}>✕</button>
                  </span>
                ))}
                {filters.difficulty.map(diff => (
                  <span key={`diff-${diff}`} className="mobile-active-filter-chip">
                    {diff}
                    <button className="mobile-active-filter-remove" onClick={() => setFilters(prev => ({ ...prev, difficulty: prev.difficulty.filter(d => d !== diff) }))}>✕</button>
                  </span>
                ))}
                {filters.onlyTrending && (
                  <span className="mobile-active-filter-chip">
                    🔥 {translate("trending", lang) || "Trending"}
                    <button className="mobile-active-filter-remove" onClick={() => setFilters(prev => ({ ...prev, onlyTrending: false }))}>✕</button>
                  </span>
                )}
                {filters.onlyPopular && (
                  <span className="mobile-active-filter-chip">
                    ⭐ {translate("popular", lang) || "Popular"}
                    <button className="mobile-active-filter-remove" onClick={() => setFilters(prev => ({ ...prev, onlyPopular: false }))}>✕</button>
                  </span>
                )}
                <button className="mobile-active-filter-clear-all" onClick={resetAllFilters}>
                  {translate("clearAll", lang) || "Clear All"}
                </button>
              </div>
            </div>
          )}

          {visibleGames.length > 0 ? (
            <>
              <div className="mobile-all-games-page-grid">
                {visibleGames.map((game, index) => {
                  const isBig = !searchTerm && index % 6 === 0;
                  return (
                    <article
                      key={game.id}
                      className={`mobile-all-games-page-card ${isBig ? "big" : ""}`}
                      onClick={() => navigate(`/games/${game.provider_id}`)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === "Enter" && navigate(`/games/${game.provider_id}`)}
                    >
                      <img src={getGameThumb(game)} alt={game.title} loading="lazy" onError={(e) => { e.currentTarget.src = game.image; }} />
                      <div className="mobile-all-games-page-overlay">
                        <span className="mobile-all-games-page-title">{game.title}</span>
                      </div>
                    </article>
                  );
                })}
              </div>

              {visibleCount < filteredGames.length && (
                <button className="mobile-load-more-btn" onClick={handleLoadMore}>
                  {translate("loadMore", lang) || "Load More"} ({visibleCount} / {filteredGames.length})
                </button>
              )}
            </>
          ) : (
            <div className="mobile-no-results">
              <div className="mobile-no-results-icon">😕</div>
              <h2>{translate("noGamesFound", lang) || "No Games Found"}</h2>
              <p>
                {searchTerm.trim()
                  ? `${translate("noResultsFor", lang) || "No results for"} "${searchTerm}"`
                  : translate("noGamesMatchFilters", lang) || "No games match your filters"
                }
              </p>
              <button className="mobile-reset-btn" onClick={resetAllFilters}>
                {translate("resetFilters", lang) || "Reset All Filters"}
              </button>
            </div>
          )}

          <div className="mobile-footer-space" />
        </div>

        <MobileBottomNav />
      </div>
    </>
  );
}