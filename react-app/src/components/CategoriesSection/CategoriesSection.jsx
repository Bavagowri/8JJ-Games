// react-app/src/components/CategoriesSection/CategoriesSection.jsx
import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loadRecent } from "../../utils/localStorage";
import "./CategoriesSection.css";

const R2_BASE =
  import.meta.env.VITE_ASSETS_BASE_URL ||
  "https://assets.8jjgames.com";
    // featured: `${R2_BASE}/8jj_icons/icons/.png`, 


const CATEGORY_ICONS = {
  home: `${R2_BASE}/8jj_icons/sidebar-icons-2/home.webp`,
  featured: `${R2_BASE}/8jj_icons/sidebar-icons-2/star.webp`,
  hot: `${R2_BASE}/8jj_icons/sidebar-icons-2/fire.webp`,
  christmas: `${R2_BASE}/8jj_icons/sidebar-icons-2/christmas.webp`,
  girls: `${R2_BASE}/8jj_icons/sidebar-icons-2/makeup.webp`,
  driving: `${R2_BASE}/8jj_icons/sidebar-icons-2/driving.webp`,
  popular: `${R2_BASE}/8jj_icons/sidebar-icons-2/rocket.webp`,
  action: `${R2_BASE}/8jj_icons/sidebar-icons-2/action.webp`,
  topPicks: `${R2_BASE}/8jj_icons/sidebar-icons-2/chili.webp`,
  platformer: `${R2_BASE}/8jj_icons/sidebar-icons-2/platformer.webp`,
  halloween: `${R2_BASE}/8jj_icons/sidebar-icons-2/halloween.webp`,
  card: `${R2_BASE}/8jj_icons/sidebar-icons-2/card.webp`,
  football: `${R2_BASE}/8jj_icons/sidebar-icons-2/football.webp`,
  basketball: `${R2_BASE}/8jj_icons/sidebar-icons-2/basketball.webp`,
  categories: `${R2_BASE}/8jj_icons/sidebar-icons-2/categories.webp`,
  simulation: `${R2_BASE}/8jj_icons/sidebar-icons-2/simulation.webp`,
  skill: `${R2_BASE}/8jj_icons/sidebar-icons-2/target.webp`,
  horror: `${R2_BASE}/8jj_icons/sidebar-icons-2/horror.webp`,
  endless: `${R2_BASE}/8jj_icons/sidebar-icons-2/runner.webp`,
  puzzles: `${R2_BASE}/8jj_icons/sidebar-icons-2/puzzle.webp`,
  allGames: `${R2_BASE}/8jj_icons/sidebar-icons-2/all.webp`,
  faq: `${R2_BASE}/8jj_icons/sidebar-icons-2/help.webp`,
  games: `${R2_BASE}/8jj_icons/sidebar-icons-2/all.webp`,
};

const sidebarItems = [
  { id: "featuredSection", icon: "featured", label: "Featured", route: null },
  { id: "recentSection", icon: "⏱️", label: "Recent", route: null },
  { id: "popularSection", icon: "popular", label: "Popular", route: null },
  { id: "hotSection", icon: "hot", label: "Hot", route: null },
  { id: "driving", icon: "driving", label: "Driving", route: "/categories/driving" },
  // { id: "trending", icon: "trending", label: "Trending", route: null },
  { id: "christmas", icon: "christmas", label: "Christmas", route: "/categories/christmas" },
  { id: "action", icon: "action", label: "Action", route: "/categories/action" },
  { id: "top-picks", icon: "topPicks", label: "Top Picks", route: null },
  { id: "halloween_games", icon: "halloween", label: "Halloween", route: "/categories/halloween" },
  { id: "card_games", icon: "card", label: "Card", route: "/categories/card" },
  { id: "football_games", icon: "football", label: "Football", route: "/categories/football" },
  { id: "basketball_games", icon: "basketball", label: "Basketball", route: "/categories/basketball" },
  { id: "simulation_games", icon: "simulation", label: "Simulation", route: "/categories/simulation" },
  { id: "skill_games", icon: "skill", label: "Skill", route: "/categories/skill" },
  { id: "horror_games", icon: "horror", label: "Horror", route: "/categories/horror" },
  { id: "endless_runner", icon: "endless", label: "Endless Runner", route: "/categories/endless-runner" },
  { id: "platformer", icon: "platformer", label: "Platformer", route: "/categories/platformer" },
  { id: "puzzles", icon: "puzzles", label: "Puzzles", route: "/categories/puzzle" },
  { id: "gamesAll", icon: "allGames", label: "All Games", route: "/browse" },
];

export default function CategoriesSection({
  title = "📂 Browse Categories",
  id = "categoriesSection",
}) {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [recentGames, setRecentGames] = useState([]);

  useEffect(() => {
    setRecentGames(loadRecent());
    checkScrollButtons();
  }, []);

  const checkScrollButtons = () => {
    const el = containerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  const scroll = (direction) => {
    containerRef.current?.scrollBy({
      left: direction === "left" ? -300 : 300,
      behavior: "smooth",
    });
    setTimeout(checkScrollButtons, 300);
  };

  //  Improved category click handler with navigation support
  const handleCategoryClick = (item) => {
    // If item has a route, navigate to it
    if (item.route) {
      navigate(item.route);
    } else {
      // Otherwise scroll to section on page
      const element = document.getElementById(item.id);
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
  };

  //  Keyboard support for scroll buttons
  const handleScrollKeyPress = (e, direction) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      scroll(direction);
    }
  };

  //  Keyboard support for category items
  const handleCategoryKeyPress = (e, item) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCategoryClick(item);
    }
  };

  return (
    /*  Semantic section with proper ARIA landmark */
    <section 
      className="categories-section" 
      id={id}
      aria-labelledby="categories-heading"
    >
      <div className="categories-content">
        {/*  Proper heading hierarchy */}
        <header className="categories-header">
          <h2 id="categories-heading" className="categories-title">
            {title}
          </h2>
        </header>

        {/*  Navigation with proper ARIA */}
        <nav 
          className="categories-wrapper"
          aria-label="Game categories navigation"
        >
          {/*  Left scroll button with accessibility */}
          {canScrollLeft && (
            <button
              className="categories-nav left"
              onClick={() => scroll("left")}
              onKeyPress={(e) => handleScrollKeyPress(e, "left")}
              aria-label="Scroll categories left"
              tabIndex={0}
            >
              <span aria-hidden="true">‹</span>
            </button>
          )}

          {/*  Scrollable container with keyboard navigation */}
          <div
            className="categories-container"
            ref={containerRef}
            onScroll={checkScrollButtons}
            role="list"
            aria-label="Category list"
          >
            {sidebarItems.map((item) => (
              <div 
                className="category-item" 
                key={item.id}
                role="listitem"
              >
                {/*  Accessible category card button */}
                <button
                  className="category-card"
                  onClick={() => handleCategoryClick(item)}
                  onKeyPress={(e) => handleCategoryKeyPress(e, item)}
                  aria-label={`${item.label} games category`}
                  tabIndex={0}
                >
                  {CATEGORY_ICONS[item.icon] ? (
                    <img
                      src={CATEGORY_ICONS[item.icon]}
                      alt={item.label}
                      className="category-icon"
                    />
                  ) : (
                    <span className="category-fallback-icon">🎮</span>
                  )}
                  <div className="category-label">
                    {item.label}
                  </div>
                </button>
              </div>
            ))}
          </div>

          {/*  Right scroll button with accessibility */}
          {canScrollRight && (
            <button
              className="categories-nav right"
              onClick={() => scroll("right")}
              onKeyPress={(e) => handleScrollKeyPress(e, "right")}
              aria-label="Scroll categories right"
              tabIndex={0}
            >
              <span aria-hidden="true">›</span>
            </button>
          )}
        </nav>
      </div>
    </section>
  );
}