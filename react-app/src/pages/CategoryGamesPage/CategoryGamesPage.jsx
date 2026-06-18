// react-app/src/pages/CategoryGamesPage/CategoryGamesPage.jsx

import { useParams, useNavigate } from "react-router-dom";
import { useLayoutEffect, useEffect, useState, useRef, useCallback, useMemo } from "react";
import MosaicGameCard from "../../components/MosaicGameCard/MosaicGameCard";
import { translate } from "../../data/translations";
import { useLanguage } from "../../context/LanguageContext";
import "./CategoryGamesPage.css";
import SEO from "../../components/SEO/SEO";
import { generateKeywords } from "../../config/seoKeywords";
//  UniversalBanner
import UniversalBanner from "../../components/UniversalBanner/UniversalBanner";

const R2_BASE =
  import.meta.env.VITE_ASSETS_BASE_URL ||
  "https://assets.8jjgames.com";

const CATEGORY_ICONS = {
  home: `${R2_BASE}/8jj_icons/sidebar-icons-2/home.webp`,
  featured: `${R2_BASE}/8jj_icons/sidebar-icons-2/star.webp`,
  adventure: `${R2_BASE}/8jj_icons/home-icons-2/adventure.webp`,
  sports: `${R2_BASE}/8jj_icons/home-icons-2/sports.webp`,
  shooting: `${R2_BASE}/8jj_icons/home-icons-2/shooting.webp`,
  christmas: `${R2_BASE}/8jj_icons/sidebar-icons-2/christmas.webp`,
  princess: `${R2_BASE}/8jj_icons/sidebar-icons-2/makeup.webp`,
  driving: `${R2_BASE}/8jj_icons/sidebar-icons-2/driving.webp`,
  racing: `${R2_BASE}/8jj_icons/sidebar-icons-2/driving.webp`,
  strategy: `${R2_BASE}/8jj_icons/home-icons-2/strategy.webp`,
  action: `${R2_BASE}/8jj_icons/sidebar-icons-2/action.webp`,
  platformer: `${R2_BASE}/8jj_icons/sidebar-icons-2/platformer.webp`,
  halloween: `${R2_BASE}/8jj_icons/sidebar-icons-2/halloween.webp`,
  card: `${R2_BASE}/8jj_icons/sidebar-icons-2/card.webp`,
  football: `${R2_BASE}/8jj_icons/sidebar-icons-2/football.webp`,
  basketball: `${R2_BASE}/8jj_icons/sidebar-icons-2/basketball.webp`,
  categories: `${R2_BASE}/8jj_icons/sidebar-icons-2/categories.webp`,
  simulation: `${R2_BASE}/8jj_icons/sidebar-icons-2/all.webp`,
  arcade: `${R2_BASE}/8jj_icons/sidebar-icons-2/simulation.webp`,
  skill: `${R2_BASE}/8jj_icons/sidebar-icons-2/target.webp`,
  zombie: `${R2_BASE}/8jj_icons/sidebar-icons-2/horror.webp`,
  endless: `${R2_BASE}/8jj_icons/sidebar-icons-2/runner.webp`,
  puzzles: `${R2_BASE}/8jj_icons/sidebar-icons-2/puzzle.webp`,
  allGames: `${R2_BASE}/8jj_icons/sidebar-icons-2/all.webp`,
  faq: `${R2_BASE}/8jj_icons/sidebar-icons-2/help.webp`,
  endless_runner: `${R2_BASE}/8jj_icons/sidebar-icons-2/runner.webp`,
  games: `${R2_BASE}/8jj_icons/sidebar-icons-2/all.webp`,
  brain: `${R2_BASE}/8jj_icons/sidebar-icons-2/all.webp`,
};

export default function CategoryGamesPage() {
  const { categoryId } = useParams();
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [displayedGames, setDisplayedGames] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  const GAMES_PER_PAGE = 24;

  const categoryName = useMemo(() => {
    return translate(categoryId, lang) || categoryId;
  }, [categoryId, lang]);

  const seoTitle = useMemo(() => {
    return `${categoryName} Games - Play Free Online ${categoryName} Games`;
  }, [categoryName]);

  const seoDescription = useMemo(() => {
    const count = games.length > 0 ? games.length : "hundreds of";
    return `Play ${count} free ${categoryName.toLowerCase()} games online on 8jj-games. Browse our collection of ${categoryName.toLowerCase()} games - no download required, play instantly in your browser!`;
  }, [categoryName, games.length]);

  const seoKeywords = useMemo(() => {
    const categoryKey = categoryId.toLowerCase();
    return generateKeywords('categories', categoryKey);
  }, [categoryId]);

  useLayoutEffect(() => {
    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
    });
  }, [categoryId]);

  useEffect(() => {
    const loadCategoryGames = async () => {
      try {
        let endpoint;

        // If categoryId matches your DB categories
        const dbCategories = [
          "puzzles",
          "sports",
          "racing",
          "shooters",
          "adventures",
          "girls",
          "strategy",
          "shooting",
          "driving",
          "other"
        ];

        if (dbCategories.includes(categoryId.toLowerCase())) {
          endpoint = `/api/games/category/${categoryId}`;
        } else {
          endpoint = `/api/games/tag/${categoryId}`;
        }

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}${endpoint}`
        );

        const data = await res.json();
        const categoryGames = data.data || [];

        setGames(categoryGames);
        setDisplayedGames(categoryGames.slice(0, GAMES_PER_PAGE));
        setPage(1);
        setHasMore(categoryGames.length > GAMES_PER_PAGE);

        window.scrollTo({ top: 0, behavior: "instant" });

      } catch (err) {
        console.error("Failed to load category games:", err);
      }
    };

    loadCategoryGames();
  }, [categoryId]);

  const loadMoreGames = useCallback(() => {
    const nextPage = page + 1;
    const startIndex = page * GAMES_PER_PAGE;
    const endIndex = startIndex + GAMES_PER_PAGE;
    const newGames = games.slice(startIndex, endIndex);

    if (newGames.length > 0) {
      setDisplayedGames(prev => [...prev, ...newGames]);
      setPage(nextPage);
      setHasMore(endIndex < games.length);
    } else {
      setHasMore(false);
    }
  }, [page, games]);

  const lastGameRef = useCallback(node => {
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMoreGames();
      }
    });

    if (node) observer.current.observe(node);
  }, [hasMore, loadMoreGames]);

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <>
      <SEO
        title={seoTitle}
        description={seoDescription}
        keywords={seoKeywords}
        image={displayedGames.length > 0 ? displayedGames[0].image : "/images/8JJ-GAMES1.jpg"}
        url={`/categories/${categoryId}`}
      />

      <div className="ScrollSnap">
        <div className="category-page">

          <div className="category-header">
            <button
              onClick={handleBack}
              className="premium-back-button"
              aria-label="Go back to previous page"
            >
              <span className="back-arrow">←</span>
            </button>

            {/* <h1 className="category-title">
              🎮 {categoryName}
            </h1> */}

            <h1 className="category-title">
              {CATEGORY_ICONS[categoryId] ? (
                <img
                  src={CATEGORY_ICONS[categoryId]}
                  alt={categoryName}
                  className="category-page-icon"
                />
              ) : (
                <span>🎮</span>
              )}
              {categoryName}
            </h1>

            <p className="page-subtitle hidden">
              {translate("browseGamesByCategory", lang) || translate("allGames", lang)}
            </p>
          </div>

          {/*  Hero banner for category pages */}
          <UniversalBanner
            placementKey="category_hero"
            className="category-hero-banner"
          />

          <p className="category-description">
            {translate("browseOur", lang) || "Browse our collection of"} {games.length} {categoryName.toLowerCase()} {translate("games", lang) || "games"}. {translate("playFreeInstantly", lang) || "Play free online games instantly in your browser - no download required!"}
          </p>

          <section className="mosaic-grid" aria-label={`${categoryName} games grid`}>
            {displayedGames.map((game, index) => {
              if (displayedGames.length === index + 1) {
                return (
                  <div ref={lastGameRef} key={game.provider_id}>
                    <MosaicGameCard game={game} />
                  </div>
                );
              } else {
                return <MosaicGameCard key={game.provider_id} game={game} />;
              }
            })}
          </section>

          {hasMore && (
            <div style={{ textAlign: 'center', padding: '20px' }} aria-live="polite" aria-busy="true">
              <div className="loader-spinner"></div>
              <p className="sr-only">{translate("loading", lang) || "Loading more games..."}</p>
            </div>
          )}

          {games.length === 0 && (
            <div className="no-games-message">
              <p>{translate("noGamesFound", lang) || "No games found in this category."}</p>
              <a className="no-games-message-a" href="/categories">
                {translate("browseAllCategories", lang) || "Browse All Categories"}
              </a>
            </div>
          )}
        </div>
      </div>
    </>
  );
}