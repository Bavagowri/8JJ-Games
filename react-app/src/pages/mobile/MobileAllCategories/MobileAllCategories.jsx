// react-app/src/pages/mobile/MobileAllCategories/MobileAllCategories.jsx
import { useNavigate } from "react-router-dom";
import MobileHeader from "../../../components/mobile/MobileHeader/MobileHeader";
import MobileBottomNav from "../../../components/mobile/MobileBottomNav/MobileBottomNav";
import { useLanguage } from "../../../context/LanguageContext";
import { translate } from "../../../data/translations";
import SEO from "../../../components/SEO/SEO";
import "./MobileAllCategories.css";
import MobileBreadcrumb from "../../../components/mobile/MobileBreadcrumb/MobileBreadcrumb";

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

const MOBILE_CATEGORIES = [
  { id: "shooting", icon: CATEGORY_ICONS.shooting, name: "Shooting" },
  { id: "basketball", icon: CATEGORY_ICONS.basketball, name: "Basketball" },
  { id: "football", icon: CATEGORY_ICONS.football, name: "Football" },
  { id: "driving", icon: CATEGORY_ICONS.driving, name: "Driving Games" },
  { id: "adventure", icon: CATEGORY_ICONS.adventure, name: "Adventure" },
  { id: "zombie", icon: CATEGORY_ICONS.zombie, name: "Horror" },
  { id: "puzzles", icon: CATEGORY_ICONS.puzzles, name: "Puzzle Games" },
  { id: "card", icon: CATEGORY_ICONS.card, name: "Card Games" },
  { id: "halloween", icon: CATEGORY_ICONS.halloween, name: "Halloween" },
  { id: "action", icon: CATEGORY_ICONS.action, name: "Action Games" },
  { id: "simulation", icon: CATEGORY_ICONS.arcade, name: "Simulation Games" },
  { id: "girls", icon: CATEGORY_ICONS.princess, name: "Girls" },
  { id: "skill", icon: CATEGORY_ICONS.skill, name: "Skill Games" },
  { id: "endless runner", icon: CATEGORY_ICONS.endless_runner, name: "endlessRunner" },
  { id: "platformer", icon: CATEGORY_ICONS.platformer, name: "platformer" },
  { id: "christmas", icon: CATEGORY_ICONS.christmas, name: "christmas" },

];

const ICONS = {
  hot: `${R2_BASE}/8jj_icons/home-icons-2/rocket.webp`,
  categories: `${R2_BASE}/8jj_icons/sidebar-icons-2/all-games.webp`,
  sparks: `${R2_BASE}/8jj_icons/icons/sparks.webp`,
  safe: `${R2_BASE}/8jj_icons/icons/security-2.webp`,
  device: `${R2_BASE}/8jj_icons/icons/device.webp`
}

const POPULAR_CATEGORIES = [
  { id: "action", icon: CATEGORY_ICONS.action, name: "Action" },
  { id: "puzzles", icon: CATEGORY_ICONS.puzzles, name: "Puzzles" },
  { id: "driving", icon: CATEGORY_ICONS.driving, name: "Racing" },
  { id: "basketball", icon: CATEGORY_ICONS.basketball, name: "Sports" },
  { id: "shooting", icon: CATEGORY_ICONS.shooting, name: "Shooting" },
];

export default function MobileAllCategories() {
  const navigate = useNavigate();
  const { lang } = useLanguage();

  return (
    <>
      <SEO
        title="Browse Game Categories | 8JJ Games"
        description="Explore all game categories including action, puzzle, sports, racing, shooting and more. Find your favorite mobile games on 8JJ Games."
        keywords="game categories, mobile games, action games, puzzle games, sports games, racing games, free online games"
        url="/categories"
      />

      <div className="mobile-all-category-grid-page-wrapper">
        <MobileHeader />



        <MobileBreadcrumb
          items={[
            { label: translate("home", lang) || "Home", path: "/", icon: "" },
            { label: translate("categories", lang) || "All Categories", icon: "" }
          ]}
        />



        <main className="mobile-all-category-grid-page">
          {/* Hero Header */}
          <header className="mobile-all-category-hero">
            <div className="mobile-all-category-hero-content">
              <div className="mobile-all-category-hero-icon">
                <img src={ICONS.categories} className="mobile-all-cat-section-icon" alt="" />
              </div>
              <div className="mobile-all-category-hero-text">
                <h1 className="mobile-all-category-hero-title">
                  {translate("categories", lang) || "Categories"}
                </h1>
                <p className="mobile-all-category-hero-subtitle">
                  {/* Explore {MOBILE_CATEGORIES.length} game categories */}
                  {translate("explore_game_categories", lang).replace(
                    "{count}",
                    MOBILE_CATEGORIES.length
                  )}

                </p>
              </div>
            </div>
          </header>

          {/* Popular Categories Section */}
          <section className="mobile-all-category-popular-section">
            <h2 className="mobile-all-category-section-title">
              <img src={ICONS.hot} className="mobile-home-section-icon" alt="" />
              {translate("popularGames", lang) || "Popular Categories"}
            </h2>
            <div className="mobile-all-category-popular-scroll">
              {POPULAR_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  className="mobile-all-category-popular-chip"
                  onClick={() => navigate(`/categories/${cat.id}`)}
                  aria-label={`View ${cat.name} games`}
                >
                  <img
                    src={cat.icon}
                    alt=""
                    className="mobile-all-category-popular-icon"
                    loading="lazy"
                  />
                  <span>{translate(cat.id, lang) || cat.name}</span>
                </button>
              ))}
            </div>
          </section>

          {/* All Categories Grid */}
          <section className="mobile-all-category-main-section">
            <h2 className="mobile-all-category-section-title">
              {translate("viewAllCategories", lang) || "All Categories"}
            </h2>
            <div className="mobile-all-category-grid-page-grid">
              {MOBILE_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  className="mobile-all-category-grid-page-card"
                  onClick={() => navigate(`/categories/${cat.id}`)}
                  aria-label={`${cat.name} games`}
                >
                  <img
                    src={cat.icon}
                    alt=""
                    className="mobile-all-category-grid-page-icon"
                    loading="lazy"
                  />
                  <span className="mobile-all-category-grid-page-label">
                    {translate(cat.name, lang)}
                  </span>
                </button>
              ))}
            </div>
          </section>

          {/* About Section */}
          <section className="mobile-all-category-about-section">
            <div className="mobile-all-category-about-card">
              <h2 className="mobile-all-category-about-title">
                About 8JJ Games
              </h2>
              <p className="mobile-all-category-about-text">
                8JJ Games is your ultimate destination for free online games.
                Play thousands of games instantly on your mobile device - no downloads,
                no registration required. From action-packed shooters to brain-teasing
                puzzles, we have something for everyone.
              </p>
              <div className="mobile-all-category-about-features">
                <div className="mobile-all-category-about-feature">
                  <span className="mobile-all-category-about-feature-icon">
                    <img src={ICONS.sparks} className="mobile-home-section-icon" alt="" />
                  </span>
                  <span>1500+ Free Games</span>
                </div>
                <div className="mobile-all-category-about-feature">
                  <span className="mobile-all-category-about-feature-icon">
                    <img src={ICONS.device} className="mobile-home-section-icon" alt="" />
                  </span>
                  <span>Mobile Optimized</span>
                </div>
                <div className="mobile-all-category-about-feature">
                  <span className="mobile-all-category-about-feature-icon">
                    <img src={ICONS.hot} className="mobile-home-section-icon" alt="" />
                  </span>
                  <span>Instant Play</span>
                </div>
                <div className="mobile-all-category-about-feature">
                  <span className="mobile-all-category-about-feature-icon">
                    <img src={ICONS.safe} className="mobile-home-section-icon" alt="" />
                  </span>
                  <span>Safe & Secure</span>
                </div>
              </div>
              <button
                className="mobile-all-category-about-link-btn"
                onClick={() => navigate('/about')}
              >
                Learn More About Us
                <span className="mobile-all-category-about-link-arrow">→</span>
              </button>
            </div>
          </section>

          <div className="mobile-footer-space" />
        </main>

        <MobileBottomNav />
      </div>
    </>
  );
}