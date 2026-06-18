// src/components/mobile/MobileHeader/MobileMenu.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../../context/LanguageContext";
import { translate } from "../../../data/translations";
import { useAuth } from "../../../context/AuthContext";
import "./MobileMenu.css";
import {
  Home,
  Gamepad2,
  Folder,
  Star,
  Trophy,
  Share2,
  Info,
  MessageCircle,
  LogOut,
  LogIn,
  UserPlus,
  ChevronRight,
  X,
  ArrowLeft,
  Grid3X3,
  HelpCircle,
  Zap,
} from "lucide-react";

const R2_BASE = import.meta.env.VITE_ASSETS_BASE_URL || "https://assets.8jjgames.com";

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

const SOCIAL_LINKS = {
  facebook: "https://www.facebook.com/games8jj/",
  whatsapp: "https://chat.whatsapp.com/Jj2GX9riQWxLEErESqbiNQ",
  instagram: "https://www.instagram.com/8jjgames/",
  telegram: "https://t.me/+EqU2725tjvthYWRl"
};

export default function MobileMenu({ isOpen, onClose, user }) {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const { logout } = useAuth();
  
  const [activeSection, setActiveSection] = useState("main"); // main, categories, share

  const categories = [
    { id: "action", icon: CATEGORY_ICONS.action, label: translate("categoryAction", lang) },
    { id: "adventure", icon: CATEGORY_ICONS.adventure, label: translate("categoryAdventure", lang) },
    { id: "puzzles", icon: CATEGORY_ICONS.puzzles, label: translate("categoryPuzzles", lang) },
    { id: "driving", icon: CATEGORY_ICONS.driving, label: translate("categoryDriving", lang) },
    { id: "sports", icon: CATEGORY_ICONS.sports, label: translate("categorySports", lang) },
    { id: "shooting", icon: CATEGORY_ICONS.shooting, label: translate("categoryShooting", lang) },
    { id: "platformer", icon: CATEGORY_ICONS.platformer, label: translate("categoryPlatformer", lang) },
    { id: "racing", icon: CATEGORY_ICONS.racing, label: translate("categoryRacing", lang) },
    { id: "simulation", icon: CATEGORY_ICONS.simulation, label: translate("categorySimulation", lang) },
    { id: "strategy", icon: CATEGORY_ICONS.strategy, label: translate("categoryStrategy", lang) },
    { id: "arcade", icon: CATEGORY_ICONS.arcade, label: translate("categoryArcade", lang) },
    { id: "card", icon: CATEGORY_ICONS.card, label: translate("categoryCard", lang) },
    { id: "football", icon: CATEGORY_ICONS.football, label: translate("categoryFootball", lang) },
    { id: "basketball", icon: CATEGORY_ICONS.basketball, label: translate("categoryBasketball", lang) },
    { id: "halloween", icon: CATEGORY_ICONS.halloween, label: translate("categoryHalloween", lang) },
    { id: "christmas", icon: CATEGORY_ICONS.christmas, label: translate("categoryChristmas", lang) },
    { id: "zombie", icon: CATEGORY_ICONS.zombie, label: translate("categoryHorror", lang) },
    { id: "princess", icon: CATEGORY_ICONS.princess, label: translate("categoryGirlsGames", lang) },
    { id: "skill", icon: CATEGORY_ICONS.skill, label: translate("categorySkill", lang) },
    { id: "endless runner", icon: CATEGORY_ICONS.endless, label: translate("categoryEndlessRunner", lang) }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    onClose();
  };

  const handleCategoryClick = (categoryId) => {
    navigate(`/categories/${categoryId}`);
    onClose();
  };

  const handleLogout = () => {
    logout();
    onClose();
    navigate("/");
  };

  const handleBack = () => {
    setActiveSection("main");
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="mobile-menu-overlay" onClick={onClose}></div>

      {/* Menu Panel */}
      <div className="mobile-menu-panel">
        {/* Header */}
        <div className="mobile-menu-header">
          {activeSection !== "main" && (
            <button className="mobile-menu-back" onClick={handleBack}>
              <ArrowLeft size={20} />
            </button>
          )}
          <h3 className="mobile-menu-title">
            {activeSection === "main" && "Menu"}
            {activeSection === "categories" && translate("categories", lang)}
            {activeSection === "share" && translate("share", lang)}
          </h3>
          <button className="mobile-menu-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="mobile-menu-content">
          {/* MAIN MENU */}
          {activeSection === "main" && (
            <>
              {/* Navigation Section */}
              <div className="mobile-menu-section">
                <div className="mobile-menu-section-title">
                  {translate("navigation", lang) || "Navigation"}
                </div>

                <button
                  className="mobile-menu-item"
                  onClick={() => handleNavigation("/")}
                >
                  <span className="mobile-menu-icon">
                    <Home size={20} />
                  </span>
                  <span className="mobile-menu-label">{translate("home", lang)}</span>
                </button>

                <button
                  className="mobile-menu-item"
                  onClick={() => handleNavigation("/all-8jj-games")}
                >
                  <span className="mobile-menu-icon">
                    <Gamepad2 size={20} />
                  </span>
                  <span className="mobile-menu-label">{translate("allGames", lang)}</span>
                </button>

                {/* Predictions — mirrors desktop nav */}
                <button
                  className="mobile-menu-item"
                  onClick={() => handleNavigation("/predictions")}
                >
                  <span className="mobile-menu-icon">
                    <Zap size={20} />
                  </span>
                  <span className="mobile-menu-label">{translate("plb_title", lang)}</span>
                </button>

                <button
                  className="mobile-menu-item"
                  onClick={() => setActiveSection("categories")}
                >
                  <span className="mobile-menu-icon">
                    <Folder size={20} />
                  </span>
                  <span className="mobile-menu-label">{translate("categories", lang)}</span>
                  <span className="mobile-menu-arrow">
                    <ChevronRight size={16} />
                  </span>
                </button>

                <button
                  className="mobile-menu-item"
                  onClick={() => handleNavigation("/my-collection")}
                >
                  <span className="mobile-menu-icon">
                    <Star size={20} />
                  </span>
                  <span className="mobile-menu-label">{translate("myCollection", lang)}</span>
                </button>

                <button
                  className="mobile-menu-item"
                  onClick={() => handleNavigation("/leaderboard")}
                >
                  <span className="mobile-menu-icon">
                    <Trophy size={20} />
                  </span>
                  <span className="mobile-menu-label">{translate("leaderboard", lang)}</span>
                </button>
              </div>

              {/* Settings Section */}
              <div className="mobile-menu-section">
                <div className="mobile-menu-section-title">
                  {translate("settings", lang) || "Settings"}
                </div>
                <button
                  className="mobile-menu-item"
                  onClick={() => setActiveSection("share")}
                >
                  <span className="mobile-menu-icon">
                    <Share2 size={20} />
                  </span>
                  <span className="mobile-menu-label">{translate("share", lang)}</span>
                  <span className="mobile-menu-arrow">
                    <ChevronRight size={16} />
                  </span>
                </button>
              </div>

              {/* More Section */}
              <div className="mobile-menu-section">
                <div className="mobile-menu-section-title">
                  {translate("more", lang) || "More"}
                </div>

                <button
                  className="mobile-menu-item"
                  onClick={() => handleNavigation("/faq")}
                >
                  <span className="mobile-menu-icon">
                    <HelpCircle size={20} />
                  </span>
                  <span className="mobile-menu-label">{translate("faqTitle", lang) || "FAQ"}</span>
                </button>

                <button
                  className="mobile-menu-item"
                  onClick={() => handleNavigation("/about")}
                >
                  <span className="mobile-menu-icon">
                    <Info size={20} />
                  </span>
                  <span className="mobile-menu-label">{translate("aboutUs", lang)}</span>
                </button>

                <button
                  className="mobile-menu-item"
                  onClick={() => handleNavigation("/contact")}
                >
                  <span className="mobile-menu-icon">
                    <MessageCircle size={20} />
                  </span>
                  <span className="mobile-menu-label">{translate("contactUs", lang)}</span>
                </button>
              </div>

              {/* Auth Section */}
              <div className="mobile-menu-section">
                {user ? (
                  <button
                    className="mobile-menu-item mobile-menu-item-danger"
                    onClick={handleLogout}
                  >
                    <span className="mobile-menu-icon">
                      <LogOut size={20} />
                    </span>
                    <span className="mobile-menu-label">{translate("logout", lang)}</span>
                  </button>
                ) : (
                  <>
                    <button
                      className="mobile-menu-item mobile-menu-item-primary"
                      onClick={() => handleNavigation("/login")}
                    >
                      <span className="mobile-menu-icon">
                        <LogIn size={20} />
                      </span>
                      <span className="mobile-menu-label">{translate("logInHeader", lang)}</span>
                    </button>

                    <button
                      className="mobile-menu-item"
                      onClick={() => handleNavigation("/register")}
                    >
                      <span className="mobile-menu-icon">
                        <UserPlus size={20} />
                      </span>
                      <span className="mobile-menu-label">{translate("signUpHeader", lang)}</span>
                    </button>
                  </>
                )}
              </div>
            </>
          )}

          {/* CATEGORIES SECTION */}
          {activeSection === "categories" && (
            <div className="mobile-categories-grid">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  className="mobile-category-item"
                  onClick={() => handleCategoryClick(cat.id)}
                >
                  <img src={cat.icon} alt="" className="mobile-category-icon" />
                  <span className="mobile-category-label">{cat.label}</span>
                </button>
              ))}

              <button
                className="mobile-category-item mobile-category-item-all"
                onClick={() => handleNavigation("/categories")}
              >
                <Grid3X3 size={22} />
                <span className="mobile-category-label">
                  {translate("viewAllCategories", lang)}
                </span>
              </button>
            </div>
          )}

          {/* SHARE SECTION */}
          {activeSection === "share" && (
            <div className="mobile-share-section">
              {/* Header */}
              <div className="mobile-share-header">
                <img 
                  src="/8JJ_games.png" 
                  alt="8JJ Games" 
                  className="mobile-share-logo"
                />
              </div>

              {/* Social Links Grid */}
              <div className="mobile-share-grid">
                <a
                  href={SOCIAL_LINKS.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mobile-share-btnz facebook"
                >
                  <div className="mobile-share-icon-container">
                    <img 
                      src="/images/social-share/fb.png" 
                      alt="Facebook" 
                      className="mobile-share-icon"
                    />
                  </div>
                  <span className="mobile-share-label">
                    {translate("facebook", lang)}
                  </span>
                </a>

                <a
                  href={SOCIAL_LINKS.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mobile-share-btnz whatsapp"
                >
                  <div className="mobile-share-icon-container">
                    <img 
                      src="/images/social-share/whatsapp.png" 
                      alt="WhatsApp" 
                      className="mobile-share-icon"
                    />
                  </div>
                  <span className="mobile-share-label">
                    {translate("whatsapp", lang)}
                  </span>
                </a>

                <a
                  href={SOCIAL_LINKS.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mobile-share-btnz instagram"
                >
                  <div className="mobile-share-icon-container">
                    <img 
                      src="/images/social-share/insta.png" 
                      alt="Instagram" 
                      className="mobile-share-icon"
                    />
                  </div>
                  <span className="mobile-share-label">
                    {translate("instagram", lang)}
                  </span>
                </a>

                <a
                  href={SOCIAL_LINKS.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mobile-share-btnz telegram"
                >
                  <div className="mobile-share-icon-container">
                    <img 
                      src="/images/social-share/telegram.png" 
                      alt="Telegram" 
                      className="mobile-share-icon"
                    />
                  </div>
                  <span className="mobile-share-label">
                    {translate("telegram", lang)}
                  </span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}