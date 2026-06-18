
// src/pages/mobile/MobileCategoryGamesPage/MobileCategoryGamesPage.jsx


import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback, useRef } from "react";
import MobileHeader from "../../../components/mobile/MobileHeader/MobileHeader";
import MobileBottomNav from "../../../components/mobile/MobileBottomNav/MobileBottomNav";
import { useLanguage } from "../../../context/LanguageContext";
import { translate } from "../../../data/translations";
import SEO from "../../../components/SEO/SEO";
import { generateKeywords } from "../../../config/seoKeywords";
import "./MobileCategoryGamesPage.css";
import { getGameThumb } from "../../../utils/getGameThumb";

//  UniversalBanner
import UniversalBanner from "../../../components/UniversalBanner/UniversalBanner";

const GAMES_PER_PAGE = 20;

const R2_BASE =
  import.meta.env.VITE_ASSETS_BASE_URL ||
  "https://assets.8jjgames.com";

const CATEGORY_ICONS = {
  home: `${R2_BASE}/8jj_icons/sidebar-icons-2/home.webp`,
  hot: `${R2_BASE}/8jj_icons/sidebar-icons-2/fire.webp`,
  featured: `${R2_BASE}/8jj_icons/sidebar-icons-2/star.webp`,
  topPicks: `${R2_BASE}/8jj_icons/sidebar-icons-2/chili.webp`,
  adventure: `${R2_BASE}/8jj_icons/home-icons-2/adventure.webp`,
  sports: `${R2_BASE}/8jj_icons/home-icons-2/sports.webp`,
  shooting: `${R2_BASE}/8jj_icons/home-icons-2/shooting.webp`,
  christmas: `${R2_BASE}/8jj_icons/sidebar-icons-2/christmas.webp`,
  girls: `${R2_BASE}/8jj_icons/sidebar-icons-2/makeup.webp`,
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
  games: `${R2_BASE}/8jj_icons/sidebar-icons-2/all.webp`,
  brain: `${R2_BASE}/8jj_icons/sidebar-icons-2/all.webp`,
};

export default function MobileCategoryGamesPage() {
  const { categoryId } = useParams();
  const { lang } = useLanguage();
  const navigate = useNavigate();

  const [games, setGames] = useState([]);
  const [displayedGames, setDisplayedGames] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);

  const observer = useRef();

  const categoryName = translate(categoryId, lang) || categoryId;

  const CATEGORY_ALIAS = { sports: "basketball" };
  const iconKey = CATEGORY_ALIAS[categoryId] || categoryId;

  // useEffect(() => {
  //   const loadCategory = async () => {
  //     try {
  //       setLoading(true);

  //       const res = await fetch(
  //         `${import.meta.env.VITE_API_URL}/api/games/tag/${categoryId}`
  //       );
  //       const data = await res.json();

  //       const list = data.data || [];

  //       setGames(list);
  //       setDisplayedGames(list.slice(0, GAMES_PER_PAGE));
  //       setHasMore(list.length > GAMES_PER_PAGE);
  //     } catch (err) {
  //       console.error("Failed to load category:", err);
  //       setGames([]);
  //     } finally {
  //       setLoading(false);
  //       window.scrollTo(0, 0);
  //     }
  //   };

  //   loadCategory();
  // }, [categoryId]);

  useEffect(() => {
    const loadCategoryGames = async () => {
      try {
        setLoading(true); // 🔥 ADD THIS

        let endpoint;

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
        setGames([]);
      } finally {
        setLoading(false); // 🔥 VERY IMPORTANT
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
      if (entries[0].isIntersecting && hasMore) loadMoreGames();
    });
    if (node) observer.current.observe(node);
  }, [hasMore, loadMoreGames]);

  const seoTitle = `${categoryName} Games - Play Free Mobile ${categoryName} Games`;
  const seoDescription = `Play ${games.length > 0 ? games.length : 'hundreds of'} free ${categoryName.toLowerCase()} games on your mobile device. Instant play, no download required!`;

  if (loading) {
    return (
      <div className="mobile-category-wrapper">
        <MobileHeader />
        <div className="mobile-content">
          <div className="mobile-loading">
            <div className="mobile-spinner"></div>
            <p>{translate("loading", lang)}</p>
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
        keywords={generateKeywords('categories', categoryId.toLowerCase())}
        url={`/categories/${categoryId}`}
      />

      <div className="mobile-category-wrapper">
        <MobileHeader />

        <div className="mobile-content">
          {/* Header */}
          <section className="mobile-category-hero">
            <nav className="mobile-category-breadcrumb" aria-label="Breadcrumb">
              <span className="breadcrumb-link" onClick={() => navigate("/")} role="link">
                {translate("home", lang) || "Home"}
              </span>
              <span className="mobile-breadcrumb-separator">›</span>
              {categoryId !== "games" && (
                <>
                  <span className="mobile-breadcrumb-link" onClick={() => navigate("/categories")} role="link">
                    {translate("categories", lang) || "Categories"}
                  </span>
                  <span className="mobile-breadcrumb-separator">›</span>
                </>
              )}
              <span className="mobile-breadcrumb-current">{categoryName}</span>
            </nav>

            <div className="mobile-category-hero-content">
              <div className="mobile-category-page-icon">
                <img
                  src={CATEGORY_ICONS[iconKey] || CATEGORY_ICONS.games}
                  className="cat-section-icon"
                  alt={categoryName}
                  loading="lazy"
                />
              </div>
              <div className="mobile-category-text">
                <h1 className="mobile-category-name">{categoryName}</h1>
                <span className="mobile-category-count">
                  {games.length} {translate("games", lang) || "games"}
                </span>
              </div>
            </div>
          </section>

          {/*  Category hero banner between header and game grid */}
          <UniversalBanner
            placementKey="category_hero"
            className="mobile-banner-section"
          />

          {displayedGames.length > 0 ? (
            <>
              <div className="mobile-games-grid category-grid-page">
                {displayedGames.map((game, index) => {
                  const card = (
                    <article
                      key={game.provider_id}
                      className="mobile-category-game-card"
                      onClick={() => navigate(`/games/${game.provider_id}`)}
                      role="button"
                      tabIndex={0}
                      onKeyPress={(e) => e.key === "Enter" && navigate(`/games/${game.provider_id}`)}
                    >
                      <div className="mobile-category-thumb">
                        <img
                          src={getGameThumb(game)}
                          alt={game.provider_id}
                          loading="lazy"
                          onError={(e) => { e.currentTarget.src = game.image; }}
                        />
                      </div>
                      <h3 className="mobile-category-game-title">{game.title}</h3>
                    </article>
                  );

                  if (displayedGames.length === index + 1) {
                    return <div ref={lastGameRef} key={game.id}>{card}</div>;
                  }
                  return <div key={game.provider_id}>{card}</div>;
                })}
              </div>

              {hasMore && (
                <div className="mobile-loading-more">
                  <div className="mobile-spinner"></div>
                  <p>{translate("loading", lang)}...</p>
                </div>
              )}
            </>
          ) : (
            <div className="mobile-no-games">
              <div className="mobile-no-games-icon">😕</div>
              <h2>{translate("noGamesFound", lang) || "No Games Found"}</h2>
              <p>No games in this category yet.</p>
              <button className="mobile-browse-btn" onClick={() => navigate("/categories")}>
                {translate("browseAllCategories", lang) || "Browse Categories"}
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