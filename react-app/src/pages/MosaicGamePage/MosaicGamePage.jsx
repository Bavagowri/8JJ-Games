

// react-app/src/pages/MosaicGamePage/MosaicGamePage.jsx

import { useEffect, useState, useMemo, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import MosaicGameCard from "../../components/MosaicGameCard/MosaicGameCard";
import CategoryGrid from "../../components/CategoryGrid/CategoryGrid";
import GameFilter from "../../components/GameFilter/GameFilter";
import { translate } from "../../data/translations";
import { useLanguage } from "../../context/LanguageContext";
import WhatWeOffer from "../../components/WhatWeOffer/WhatWeOffer";
import ScrollToTop from "../../components/ScrollToTop";
import { enhanceGamesWithMetadata } from "../../data/gameMetadata";
import { BLOCKED_GAME_IDS } from "../../utils/blockedGames";
import "./MosaicGamePage.css";

import SEO from "../../components/SEO/SEO";
import { generateKeywords } from "../../config/seoKeywords";

//  UniversalBanner
import UniversalBanner from "../../components/UniversalBanner/UniversalBanner";

const INITIAL_COUNT = 40;

export default function MosaicGamesPage() {
  const { lang } = useLanguage();
  const navigate = useNavigate();

  const [games, setGames] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
  const [sortBy, setSortBy] = useState("title-asc");
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
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    if (games.length === 0) return;

    const collectionPageSchema = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Browse All Games - 8JJ Games",
      "description": `Browse our complete collection of ${games.length} free online games. Play instantly in your browser - no download or registration required!`,
      "url": "https://8jjgames.com/all-8jj-games",
      "mainEntity": {
        "@type": "ItemList",
        "numberOfItems": games.length,
        "itemListElement": games.slice(0, 20).map((game, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "item": {
            "@type": "VideoGame",
            "name": game.title,
            "url": `https://8jjgames.com/game/${game.provider_id}`,
            "genre": game.category || "Casual",
            "gamePlatform": "Web Browser"
          }
        }))
      }
    };

    const schemaScript = document.createElement('script');
    schemaScript.type = 'application/ld+json';
    schemaScript.text = JSON.stringify([collectionPageSchema]);
    schemaScript.id = 'browse-schema';
    document.head.appendChild(schemaScript);

    return () => {
      const existingScript = document.getElementById('browse-schema');
      if (existingScript) document.head.removeChild(existingScript);
    };
  }, [games.length]);

  const seoTitle = useMemo(() => {
    if (searchTerm.trim()) return `Search "${searchTerm}" - Find Free Games | 8JJ Games`;
    return `Browse ${games.length > 0 ? games.length + ' ' : ''}Free Online Games | 8JJ Games`;
  }, [searchTerm, games.length]);

  const seoDescription = useMemo(() => {
    if (searchTerm.trim()) {
      return `Search results for "${searchTerm}" on 8JJ Games. Find and play free online games instantly in your browser. No download, no registration required!`;
    }
    const count = games.length > 0 ? games.length : "thousands of";
    return `Browse all ${count} free online games on 8JJ Games. Play action, puzzle, racing, sports, arcade games and more. Search, filter, and discover your next favorite game - no download required!`;
  }, [searchTerm, games.length]);

  const seoKeywords = useMemo(() => {
    if (searchTerm.trim()) {
      return `${searchTerm}, ${searchTerm} games, free ${searchTerm} games, play ${searchTerm} online, ${generateKeywords('pages', 'allgames')}`;
    }
    return generateKeywords('pages', 'allgames');
  }, [searchTerm]);

  useEffect(() => {
    const loadAllGames = async () => {
      try {
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
      }
    };

    loadAllGames();
  }, []);

  useEffect(() => {
    setVisibleCount(INITIAL_COUNT);
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

  const clearSearch = () => setSearchTerm("");
  const handleBack = () => navigate(-1);
  const handleFilterChange = useCallback((newFilters) => setFilters(newFilters), []);

  const resetAllFilters = () => {
    clearSearch();
    setFilters({ categories: [], tags: [], difficulty: [], players: [], ageRating: [], features: [], onlyTrending: false, onlyPopular: false });
  };

  return (
    <>
      <SEO
        title={seoTitle}
        description={seoDescription}
        keywords={seoKeywords}
        image="/images/8JJ-GAMES1.jpg"
        url="/all-8jj-games"
        type="website"
      />

      <div className="ScrollSnap AllGAMESCATPAGE">
        <div className="mosaic-page-with-filter">

          <GameFilter
            onFilterChange={handleFilterChange}
            totalGames={games.length}
            filteredCount={filteredGames.length}
            isOpen={filterOpen}
            onClose={() => setFilterOpen(false)}
          />

          <ScrollToTop />

          <main className="mosaic-main-content">
            <nav className="breadcrumb" aria-label="Breadcrumb">
              <Link to="/" className="breadcrumb-link">Home</Link>
              <span className="breadcrumb-separator" aria-hidden="true">/</span>
              <span className="breadcrumb-current">All Games</span>
            </nav>

            {/* <header className="game-header-allgames">
              <button
                onClick={handleBack}
                className="premium-back-button game-back-button"
                aria-label="Go back to previous page"
              >
                <span className="back-arrow">←</span>
              </button>
            </header> */}

            {/*  Hero banner above the title */}
            <UniversalBanner
              placementKey="all_games_hero"
              className="all-games-hero-banner"
            />

            <h1 className="page-title">
              {searchTerm.trim()
                ? `🔍 ${translate("searchResults", lang) || "Search Results"}: "${searchTerm}"`
                : `🎮 ${translate("allGames", lang) || "Browse All Games"}`
              }
            </h1>

            <p className="page-description">
              {searchTerm.trim()
                ? `Found ${filteredGames.length} game${filteredGames.length !== 1 ? 's' : ''} matching "${searchTerm}". Refine your search or explore more games below.`
                : translate("browseAllGamesDescription", lang) ||
                  `Browse our complete collection of ${games.length > 0 ? games.length : ''} free online games. Play instantly in your browser - no download or registration required! Use search and filters to find your perfect game.`
              }
            </p>

            <div className="search-controls-bar">
              <div className="mosaic-search">
                <label htmlFor="game-search" className="sr-only">
                  {translate("searchGamesz", lang) || "Search games"}
                </label>
                <input
                  id="game-search"
                  type="search"
                  className="mosaic-search-input"
                  placeholder={`${translate("searchGamesz", lang) || "Search games"}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  aria-label={translate("searchGamesz", lang) || "Search games"}
                  autoComplete="off"
                />
                <button
                  className="mosaic-search-icon-btn"
                  onClick={searchTerm ? clearSearch : undefined}
                  aria-label={searchTerm ? (translate("clearSearch", lang) || "Clear search") : "Search"}
                  type="button"
                >
                  {searchTerm ? "✖" : "🔍"}
                </button>
              </div>

              <div className="controls-row">
                <div className="sort-control">
                  <label htmlFor="sort-select" className="sr-only">Sort games by</label>
                  <select
                    id="sort-select"
                    className="sort-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    aria-label="Sort games"
                  >
                    <option value="title-asc">{translate("titleAZ", lang) || "Title (A-Z)"}</option>
                    <option value="title-desc">{translate("titleZA", lang) || "Title (Z-A)"}</option>
                    <option value="popular">{translate("mostPopular", lang) || "Most Popular"}</option>
                    <option value="trending">{translate("trending", lang) || "Trending"}</option>
                    <option value="newest">{translate("newestFirst", lang) || "Newest First"}</option>
                    <option value="oldest">{translate("oldestFirst", lang) || "Oldest First"}</option>
                  </select>
                </div>

                <button
                  className="mobile-filter-btn"
                  onClick={() => setFilterOpen(true)}
                  aria-label="Open filters"
                  type="button"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <title>Filter</title>
                    <path d="M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z"/>
                  </svg>
                  <span className="sr-only">Filters</span>
                </button>
              </div>
            </div>

            {(filters.categories.length > 0 || filters.tags.length > 0 || searchTerm.trim()) && (
              <div className="results-info" role="status" aria-live="polite">
                <p>
                  Showing <strong>{visibleCount}</strong> of <strong>{filteredGames.length}</strong> games
                  {searchTerm.trim() && ` for "${searchTerm}"`}
                </p>
              </div>
            )}

            <WhatWeOffer />

            <section className="mosaic-grid" aria-label="Game collection" aria-live="polite">
              {visibleGames.map((game) => (
                <MosaicGameCard key={game.provider_id} game={game} />
              ))}

              {visibleCount < filteredGames.length && (
                <button
                  className="btn-primary load-more-btn"
                  onClick={() => setVisibleCount((prev) => prev + 40)}
                  aria-label={`Load more games - Showing ${visibleCount} of ${filteredGames.length}`}
                  type="button"
                >
                  <div className="see-all-content Allgames">
                    <div className="see-all-icon" aria-hidden="true">→</div>
                    <div className="see-all-text">
                      <span>{translate("viewMoreGames", lang) || "Load More Games"}</span>
                    </div>
                    <div className="see-all-count Allgames">
                      <span>({visibleCount} / {filteredGames.length})</span>
                    </div>
                  </div>
                </button>
              )}
            </section>

            {filteredGames.length === 0 && (
              <div className="no-results" role="status" aria-live="polite">
                <div className="no-results-icon" aria-hidden="true">🎮</div>
                <h2>{translate("noGamesFound", lang) || "No Games Found"}</h2>
                <p>
                  {searchTerm.trim()
                    ? `${translate("noResultsFor", lang) || "No results found for"} "${searchTerm}"`
                    : translate("noGamesMatchFilters", lang) || "No games match your selected filters"
                  }
                </p>
                <p className="no-results-suggestion">
                  Try adjusting your search or filters, or explore our popular categories below.
                </p>
                <button
                  className="btn-primary clearSearchBTN"
                  onClick={resetAllFilters}
                  type="button"
                  aria-label="Reset all filters and search"
                >
                  <span>{translate("resetFilters", lang) || "Reset All Filters"}</span>
                </button>
              </div>
            )}
          </main>
        </div>

        <div className="ScrollSnap">
          <div className="mosaic-page home-wrapper">
            <section className="categories-section" aria-labelledby="categories-heading">
              <h2 id="categories-heading" className="Cat-title">
                {translate("MoreCategories", lang) || "Explore Game Categories"}
              </h2>
              <CategoryGrid limit={14} />
              <div className="container">
                <button
                  className="btn-primary cat"
                  onClick={() => navigate(`/categories`)}
                  aria-label={translate("viewAllCategories", lang) || "View all game categories"}
                  type="button"
                >
                  <span>{translate("viewMore", lang) || "View All Categories"}</span>
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}