// src/components/Header/Header.jsx

import "./Header.css";
import { useLanguage } from "../../context/LanguageContext";
import { translate } from "../../data/translations";
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ShareModal from "../ShareModal/ShareModal";
import { useSearch } from "../../context/SearchContext";
import { loadPopular } from "../../utils/popularGamesUtils";
import debounce from "lodash/debounce";
import { useAuth } from "../../context/AuthContext";
import { useProfile } from "../../context/ProfileContext";
import { 
  Search, 
  X, 
  Bell, 
  User, 
  Globe, 
  MoreVertical,
  Share2,
  Home,
  Gamepad2,
  Star,
  Folder,
  Zap,
  ChevronDown,
  Check
} from "lucide-react";

// Import dropdown components
import NotificationsDropdown from "./NotificationsDropdown";
import FriendsDropdown from "./FriendsDropdown";
import ProfileDropdown from "./ProfileDropdown";

const R2_BASE =
  import.meta.env.VITE_ASSETS_BASE_URL ||
  "https://assets.8jjgames.com";

const HEADER_ICONS = {
  categories: {
    action: `${R2_BASE}/8jj_icons/home-icons-2/action.webp`,
    adventure: `${R2_BASE}/8jj_icons/home-icons-2/adventure.webp`,
    puzzles: `${R2_BASE}/8jj_icons/home-icons-2/puzzle.webp`,
    driving: `${R2_BASE}/8jj_icons/home-icons-2/driving.webp`,
    sports: `${R2_BASE}/8jj_icons/home-icons-2/sports.webp`,
    shooting: `${R2_BASE}/8jj_icons/home-icons-2/shooting.webp`,
    platformer: `${R2_BASE}/8jj_icons/home-icons-2/platformer.webp`,
    racing: `${R2_BASE}/8jj_icons/home-icons-2/driving.webp`,
    simulation: `${R2_BASE}/8jj_icons/home-icons-2/all.webp`,
    strategy: `${R2_BASE}/8jj_icons/home-icons-2/strategy.webp`,
    arcade: `${R2_BASE}/8jj_icons/home-icons-2/simulation.webp`,
    card: `${R2_BASE}/8jj_icons/home-icons-2/card.webp`,
    football: `${R2_BASE}/8jj_icons/home-icons-2/football.webp`,
    basketball: `${R2_BASE}/8jj_icons/home-icons-2/basketball.webp`,
    halloween: `${R2_BASE}/8jj_icons/home-icons-2/halloween.webp`,
    christmas: `${R2_BASE}/8jj_icons/home-icons-2/christmas.webp`,
    zombie: `${R2_BASE}/8jj_icons/home-icons-2/horror.webp`,
    princess: `${R2_BASE}/8jj_icons/home-icons-2/makeup.webp`,
    skill: `${R2_BASE}/8jj_icons/home-icons-2/target.webp`,
    endless: `${R2_BASE}/8jj_icons/home-icons-2/runner.webp`,
  }
};

// Utility function for avatar URL
const getAvatarUrl = (avatar, fallback = '/images/default-avatar.png') => {
  if (!avatar?.trim()) return fallback;
  
  if (/^(https?:|blob:|data:)/.test(avatar)) {
    return avatar;
  }
  
  const API_BASE = import.meta.env.VITE_API_URL || '';
  return avatar.startsWith('/') 
    ? `${API_BASE}${avatar}`
    : `${API_BASE}/uploads/avatars/${avatar}`;
};

export default function Header() {
  const { lang, changeLanguage } = useLanguage();
  const { search, setSearch } = useSearch();
  const navigate = useNavigate();
  const location = useLocation();

  const [shareOpen, setShareOpen] = useState(false);
  const [sidebarHidden, setSidebarHidden] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hasPopularGames, setHasPopularGames] = useState(false);

  // Dropdown states
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [friendsOpen, setFriendsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // Search expansion state
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [localSearchValue, setLocalSearchValue] = useState(search);

  const dropdownRef = useRef(null);
  const categoriesRef = useRef(null);
  const searchRef = useRef(null);
  const searchInputRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Page detection
  const isCollectionPage = location.pathname === "/my-collection";
  const isHomePage = location.pathname === "/";
  const isAllGamesPage = location.pathname === "/all-8jj-games";
  const isPredictionPage = location.pathname === "/predictions";
  const isProfilePage = location.pathname.startsWith("/profile");

  // AUTH LOGIC
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const isLoggedIn = isAuthenticated;
  const authChecked = !authLoading;

  useEffect(() => {
    if (!isLoggedIn) {
      setProfileOpen(false);
      setNotificationsOpen(false);
      setFriendsOpen(false);
    }
  }, [isLoggedIn]);

  // POPULAR GAMES
  const checkPopularGames = useCallback(() => {
    const popularGames = loadPopular();
    setHasPopularGames(popularGames && popularGames.length > 0);
  }, []);

  useEffect(() => {
    checkPopularGames();

    const handleStorageChange = (e) => {
      if (e.key === 'popularGames') {
        checkPopularGames();
      }
    };

    const handlePopularGamesUpdate = () => {
      checkPopularGames();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("popularGamesUpdated", handlePopularGamesUpdate);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("popularGamesUpdated", handlePopularGamesUpdate);
    };
  }, [checkPopularGames]);

  // SEARCH - DEBOUNCED
  const debouncedSetSearch = useMemo(
    () => debounce((value) => setSearch(value), 300),
    [setSearch]
  );

  const handleSearch = (e) => {
    const value = e.target.value;
    setLocalSearchValue(value);
    debouncedSetSearch(value);
  };

  const clearSearch = () => {
    setLocalSearchValue("");
    setSearch("");
    searchInputRef.current?.focus();
  };

  // SIDEBAR TOGGLE
  const toggleSidebar = () => {
    setSidebarHidden((prev) => !prev);
    document.dispatchEvent(new CustomEvent("toggleSidebar"));
  };

  // LANGUAGE DROPDOWN
  const toggleLangDropdown = () => {
    setLangDropdownOpen((prev) => !prev);
  };

  const handleLanguageChange = (newLang) => {
    changeLanguage(newLang);
    setLangDropdownOpen(false);
  };

  // CATEGORIES DROPDOWN
  const toggleCategories = () => {
    setCategoriesOpen((prev) => !prev);
  };

  const handleCategoryClick = (categoryId) => {
    setCategoriesOpen(false);
    setMobileMenuOpen(false);
    navigate(`/categories/${categoryId}`);
  };

  // MOBILE MENU
  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const handleMobileMenuItemClick = (action) => {
    setMobileMenuOpen(false);
    action();
  };

  // SEARCH HANDLERS
  const handleSearchExpand = () => {
    setSearchExpanded(true);
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 300);
  };

  const handleSearchCollapse = () => {
    if (!localSearchValue) {
      setSearchExpanded(false);
    }
  };

  // NAVIGATION HANDLERS
  const handleHome = () => {
    navigate("/");
  };

  const handleAllGames = () => {
    navigate("/all-8jj-games");
  };

  const handlePrediction = () => {
    navigate("/predictions");
  };

  const handlePopular = () => {
    if (!hasPopularGames) return;

    if (location.pathname !== "/") {
      navigate("/", { state: { scrollTo: "popularSection" } });
    } else {
      const el = document.getElementById("popularSection");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleMyCollection = () => {
    navigate("/my-collection");
  };

  const handleAllCategories = () => {
    navigate("/categories");
  };

  // CLOSE DROPDOWNS ON OUTSIDE CLICK
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setLangDropdownOpen(false);
      }
      if (categoriesRef.current && !categoriesRef.current.contains(event.target)) {
        setCategoriesOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        handleSearchCollapse();
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [localSearchValue]);

  // CLOSE DROPDOWNS ON ESCAPE KEY
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setCategoriesOpen(false);
        setNotificationsOpen(false);
        setFriendsOpen(false);
        setProfileOpen(false);
        setLangDropdownOpen(false);
        setMobileMenuOpen(false);
        if (searchExpanded && !localSearchValue) {
          setSearchExpanded(false);
        }
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [searchExpanded, localSearchValue]);

  // CLOSE DROPDOWNS ON ROUTE CHANGE
  useEffect(() => {
    setNotificationsOpen(false);
    setFriendsOpen(false);
    setProfileOpen(false);
    setCategoriesOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // DATA CONSTANTS
  const languages = [
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "hi", name: "हिन्दी", flag: "🇮🇳" },
    { code: "ta", name: "தமிழ்", flag: "🇮🇳" },
    { code: "ml", name: "മലയാളം", flag: "🇮🇳" },
    { code: "kn", name: "ಕನ್ನಡ", flag: "🇮🇳" },
    { code: "bn", name: "বাংলা", flag: "🇧🇩" },
    { code: "ur", name: "اردو", flag: "🇵🇰" },
    { code: "pa", name: "ਪੰਜਾਬੀ", flag: "🇮🇳" },
    { code: "gu", name: "ગુજરાતી", flag: "🇮🇳" },
    { code: "te", name: "తెలుగు", flag: "🇮🇳" },
    { code: "mr", name: "मराठी", flag: "🇮🇳" }
  ];

  const currentLanguage = languages.find(l => l.code === lang) || languages[0];

  const categories = [
    { id: "action", icon: HEADER_ICONS.categories.action, label: translate("categoryAction", lang) },
    { id: "adventure", icon: HEADER_ICONS.categories.adventure, label: translate("categoryAdventure", lang) },
    { id: "puzzles", icon: HEADER_ICONS.categories.puzzles, label: translate("categoryPuzzles", lang) },
    { id: "driving", icon: HEADER_ICONS.categories.driving, label: translate("categoryDriving", lang) },
    { id: "sports", icon: HEADER_ICONS.categories.sports, label: translate("categorySports", lang) },
    { id: "shooting", icon: HEADER_ICONS.categories.shooting, label: translate("categoryShooting", lang) },
    { id: "platformer", icon: HEADER_ICONS.categories.platformer, label: translate("categoryPlatformer", lang) },
    { id: "racing", icon: HEADER_ICONS.categories.racing, label: translate("categoryRacing", lang) },
    { id: "simulation", icon: HEADER_ICONS.categories.simulation, label: translate("categorySimulation", lang) },
    { id: "strategy", icon: HEADER_ICONS.categories.strategy, label: translate("categoryStrategy", lang) },
    { id: "arcade", icon: HEADER_ICONS.categories.arcade, label: translate("categoryArcade", lang) },
    { id: "card", icon: HEADER_ICONS.categories.card, label: translate("categoryCard", lang) },
    { id: "football", icon: HEADER_ICONS.categories.football, label: translate("categoryFootball", lang) },
    { id: "basketball", icon: HEADER_ICONS.categories.basketball, label: translate("categoryBasketball", lang) },
    { id: "halloween", icon: HEADER_ICONS.categories.halloween, label: translate("categoryHalloween", lang) },
    { id: "christmas", icon: HEADER_ICONS.categories.christmas, label: translate("categoryChristmas", lang) },
    { id: "zombie", icon: HEADER_ICONS.categories.zombie, label: translate("categoryHorror", lang) },
    { id: "princess", icon: HEADER_ICONS.categories.princess, label: translate("categoryGirlsGames", lang) },
    { id: "skill", icon: HEADER_ICONS.categories.skill, label: translate("categorySkill", lang) },
    { id: "endless runner", icon: HEADER_ICONS.categories.endless, label: translate("categoryEndlessRunner", lang) }
  ];

  return (
    <>
      <header className="header" role="banner">
        <div className="header-categories">
          <button
            className={`sidebar-toggle-btn ${sidebarHidden ? 'open' : ''}`}
            onClick={toggleSidebar}
            aria-label={translate("toggleSidebar", lang)}
            aria-expanded={!sidebarHidden}
            aria-controls="sidebar"
          >
            <svg
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              focusable="false"
              className="menu-icon"
            >
              <rect x="3" y="3" width="18" height="2" rx="0.5" className="bar" />
              <rect x="3" y="11" width="10" height="2" rx="0.5" className="bar" />
              <rect x="3" y="19" width="18" height="2" rx="0.5" className="bar" />
              <polygon
                points="15.36,11.15 20.47,7.96 20.47,16.04 15.36,12.85"
                className="play"
              />
            </svg>
          </button>
        </div>

        <div className="header-container">
          <div className="brand">
            <button
              className="icon-btn menu-toggle"
              type="button"
              aria-label={translate("openMenu", lang)}
              aria-expanded="false"
              onClick={() =>
                document.dispatchEvent(new CustomEvent("toggleDrawer"))
              }
            >
              <svg
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                focusable="false"
                className="menu-icon"
              >
                <rect x="3" y="3" width="18" height="2" rx="0.5" className="bar" />
                <rect x="3" y="11" width="10" height="2" rx="0.5" className="bar" />
                <rect x="3" y="19" width="18" height="2" rx="0.5" className="bar" />
                <polygon
                  points="15.36,11.15 20.47,7.96 20.47,16.04 15.36,12.85"
                  className="play"
                />
              </svg>
            </button>

            <a href="/" aria-label="8JJ Games - Home" title="8JJ Games Home">
              <img
                className="brand-logo"
                src="/8JJ_games.png"
                alt="8JJ Games logo - Free online games"
                title="8JJ Games Home"
              />
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="header-nav" role="navigation" aria-label="Main navigation">
            {!isHomePage && (
              <button
                className="nav-btn-header"
                onClick={handleHome}
                aria-label="Go to home page"
              >
                <Home className="nav-icon-lucide" size={18} strokeWidth={2.5} />
                <span className="nav-text">{translate("home", lang)}</span>
              </button>
            )}

            <button
              id="all-games-btn"
              className={`nav-btn-header ${isAllGamesPage ? 'nav-btn-header-active' : ''}`}
              onClick={handleAllGames}
              aria-label="View all games"
              aria-current={isAllGamesPage ? "page" : undefined}
            >
              <Gamepad2 className="nav-icon-lucide" size={18} strokeWidth={2.5} />
              <span className="nav-text">{translate("allGames", lang)}</span>
            </button>

            <button
              id="all-games-btn"
              className={`nav-btn-header ${isPredictionPage ? 'nav-btn-header-active' : ''}`}
              onClick={handlePrediction}
              aria-label="View all games"
              aria-current={isPredictionPage ? "page" : undefined}
            >
              <Zap className="nav-icon-lucide" size={18} strokeWidth={2.5} />
              <span className="nav-text">{translate("ph_prediction_title", lang)}</span>
            </button>

            {/* {hasPopularGames && (
              <button
                className="nav-btn-header"
                onClick={handlePopular}
                aria-label="View popular games"
              >
                <Star className="nav-icon-lucide" size={18} strokeWidth={2.5} />
                <span className="nav-text">{translate("popular", lang)}</span>
              </button>
            )} */}

            <div className="nav-dropdown" ref={categoriesRef}>
              <button
                className="nav-btn-header"
                onClick={toggleCategories}
                aria-label="Browse game categories"
                aria-expanded={categoriesOpen}
                aria-haspopup="true"
              >
                <Folder className="nav-icon-lucide" size={18} strokeWidth={2.5} />
                <span className="nav-text">{translate("categories", lang)}</span>
                <ChevronDown 
                  className={`dropdown-arrow-lucide ${categoriesOpen ? 'open' : ''}`} 
                  size={14} 
                  strokeWidth={2.5}
                />
              </button>

              {categoriesOpen && (
                <div className="mega-menu" role="menu" aria-label="Game categories">
                  <div className="mega-menu-grid">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        className="mega-menu-item"
                        onClick={() => handleCategoryClick(cat.id)}
                        role="menuitem"
                        aria-label={`Browse ${cat.label} games`}
                      >
                        <img
                          src={cat.icon}
                          alt=""
                          aria-hidden="true"
                          className="mega-icon"
                        />
                        <span className="mega-label">{cat.label}</span>
                      </button>
                    ))}
                  </div>
                  <div className="mega-menu-footer">
                    <button
                      className="view-all-btn"
                      onClick={() => {
                        setCategoriesOpen(false);
                        navigate("/categories");
                      }}
                      aria-label="View all game categories"
                    >
                      {translate("viewAllCategories", lang)} →
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              id="CollectionMenuBtn"
              className={`nav-btn-header ${isCollectionPage ? 'nav-btn-header-active' : ''}`}
              onClick={handleMyCollection}
              aria-label="View my game collection"
              aria-current={isCollectionPage ? "page" : undefined}
            >
              <Star className="nav-icon-lucide" size={18} strokeWidth={2.5} />
              <span className="nav-text">{translate("myCollection", lang)}</span>
            </button>
          </nav>

          <div className="header-actions" role="toolbar" aria-label="Header actions">
            {/* Premium Search Bar */}
            <div
              className={`search-container ${searchExpanded ? 'expanded' : ''}`}
              ref={searchRef}
            >
              <form
                className="search"
                onSubmit={(e) => e.preventDefault()}
                role="search"
                aria-label="Search games"
              >
                <input
                  ref={searchInputRef}
                  type="search"
                  placeholder={translate("searchHeader", lang)}
                  aria-label={translate("searchGames", lang)}
                  value={localSearchValue}
                  onChange={handleSearch}
                  onBlur={handleSearchCollapse}
                  autoComplete="off"
                  className="search-input"
                />
                <button
                  className="search-icon-btn"
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    if (searchExpanded && localSearchValue) {
                      clearSearch();
                    } else if (!searchExpanded) {
                      handleSearchExpand();
                    }
                  }}
                  aria-label={localSearchValue ? "Clear search" : "Open search"}
                >
                  {searchExpanded && localSearchValue ? (
                    <X className="search-icon-lucide" size={18} strokeWidth={2.5} />
                  ) : (
                    <Search className="search-icon-lucide" size={18} strokeWidth={2.5} />
                  )}
                </button>
              </form>
            </div>

            {/* Logged In Icons */}
            {isLoggedIn && (
              <div
                id="LoggedInIcons"
                className="header-icon-buttons"
              >
                {/* Notifications Button */}
                <button
                  className={`header-icon-btn ${notificationsOpen ? 'active' : ''}`}
                  onClick={() => {
                    setNotificationsOpen(!notificationsOpen);
                    setFriendsOpen(false);
                    setProfileOpen(false);
                  }}
                  aria-label="Notifications"
                  title="Notifications"
                >
                  <Bell className="header-icon-lucide" size={20} strokeWidth={2.5} />
                </button>

                {/* Profile Button */}
                <button
                  className={`header-icon-btn profile-btn ${profileOpen ? 'active' : ''} ${isProfilePage ? 'page-active' : ''}`}
                  onClick={() => {
                    setProfileOpen(!profileOpen);
                    setNotificationsOpen(false);
                    setFriendsOpen(false);
                  }}
                  aria-label="Profile menu"
                  aria-current={isProfilePage ? "page" : undefined}
                  title="Profile"
                >
                  <div className="profile-avatar-header">
                    {profile?.avatar ? (
                      <img 
                        src={getAvatarUrl(profile.avatar)} 
                        alt="Profile" 
                        className="header-avatar-img"
                        onError={(e) => {
                          e.currentTarget.src = '/images/default-avatar.png';
                        }}
                      />
                    ) : (
                      <User className="header-icon-lucide" size={20} strokeWidth={2.5} />
                    )}
                  </div>
                </button>
              </div>
            )}

            {/* Not Logged In Icons */}
            {!isLoggedIn && authChecked && (
              <div
                id="NotLoggedInIcons"
                className="auth-buttons"
              >
                {/* Login Button */}
                <a
                  href="/login"
                  rel="noopener noreferrer"
                  className="auth-btn"
                  aria-label={translate("logInHeader", lang)}
                >
                  <span className="auth-btn-content">
                    <span className="auth-btn-main">
                      <span className="auth-btn-text">
                        {translate("logInHeader", lang)}
                      </span>
                    </span>
                    <span className="auth-btn-hover LGIN">
                      <span className="auth-btn-text">
                        {translate("logInHeader", lang)}
                      </span>
                    </span>
                  </span>
                </a>

                {/* Sign Up Button */}
                <a
                  href="/register"
                  rel="noopener noreferrer"
                  className="auth-btn auth-btn-signup"
                  aria-label={translate("signUpHeader", lang)}
                >
                  <span className="auth-btn-content">
                    <span className="auth-btn-main">
                      <span className="auth-btn-text">
                        {translate("signUpHeader", lang)}
                      </span>
                      <span className="auth-btn-icon" aria-hidden="true">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">
                          <path fill="currentColor" d="M8 0L4.66706 8L3.4838 4.51621L0 3.33294L8 0Z" />
                        </svg>
                      </span>
                    </span>
                    <span className="auth-btn-hover SNUP">
                      <span className="auth-btn-text">
                        {translate("signUpHeader", lang)}
                      </span>
                      <span className="auth-btn-icon" aria-hidden="true">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">
                          <path fill="currentColor" d="M8 0L4.66706 8L3.4838 4.51621L0 3.33294L8 0Z" />
                        </svg>
                      </span>
                    </span>
                  </span>
                </a>
              </div>
            )}

            {/* Language Selector */}
            <div
              className="lang-dropdown-container mobile-with-icons"
              ref={dropdownRef}
              role="region"
              aria-label="Language selection"
            >
              <button
                className="lang-selector-btn header-icon-btn"
                onClick={toggleLangDropdown}
                aria-label={translate("selectLanguage", lang)}
                aria-expanded={langDropdownOpen}
                aria-haspopup="true"
              >
                <span className="lang-flag">{currentLanguage.flag}</span>
                <span className="lang-code">{currentLanguage.code}</span>
                <ChevronDown 
                  className={`lang-chevron ${langDropdownOpen ? 'open' : ''}`}
                  size={14} 
                  strokeWidth={2.5}
                />
              </button>
              <div
                className={`lang-dropdown ${langDropdownOpen ? 'open' : ''}`}
                role="menu"
                aria-label="Available languages"
              >
                {languages.map((language) => (
                  <button
                    key={language.code}
                    className={`lang-option ${lang === language.code ? 'active' : ''}`}
                    onClick={() => handleLanguageChange(language.code)}
                    role="menuitem"
                    aria-label={`Switch to ${language.name}`}
                    aria-current={lang === language.code ? "true" : undefined}
                  >
                    <span className="lang-option-flag">{language.flag}</span>
                    <span className="lang-option-name">{language.name}</span>
                    {lang === language.code && (
                      <Check className="lang-option-check" size={16} strokeWidth={2.5} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Desktop Share Button */}
            <button
              className="icon-btn desktop-only header-icon-btn"
              onClick={() => setShareOpen(true)}
              aria-label="Share 8JJ Games with friends"
            >
              <Share2 className="header-icon-lucide" size={20} strokeWidth={2.5} />
            </button>

            {/* Mobile More Menu Button */}
            <div className="mobile-more-menu" ref={mobileMenuRef}>
              <button
                className="header-icon-btn mobile-more-btn"
                onClick={toggleMobileMenu}
                aria-label="More options"
                aria-expanded={mobileMenuOpen}
              >
                <MoreVertical className="header-icon-lucide" size={20} strokeWidth={2.5} />
              </button>

              {mobileMenuOpen && (
                <div className="mobile-more-dropdown">
                  <button
                    className="mobile-menu-item"
                    onClick={() => handleMobileMenuItemClick(handleAllGames)}
                  >
                    <Gamepad2 className="mobile-menu-icon-lucide" size={18} strokeWidth={2.5} />
                    <span className="mobile-menu-label">{translate("allGames", lang)}</span>
                  </button>

                  <button
                    className="mobile-menu-item"
                    onClick={() => handleMobileMenuItemClick(handleAllCategories)}
                  >
                    <Folder className="mobile-menu-icon-lucide" size={18} strokeWidth={2.5} />
                    <span className="mobile-menu-label">{translate("categories", lang)}</span>
                  </button>

                  {hasPopularGames && (
                    <button
                      className="mobile-menu-item"
                      onClick={() => handleMobileMenuItemClick(handlePopular)}
                    >
                      <Star className="mobile-menu-icon-lucide" size={18} strokeWidth={2.5} />
                      <span className="mobile-menu-label">{translate("popular", lang)}</span>
                    </button>
                  )}

                  <button
                    className="mobile-menu-item"
                    onClick={() => handleMobileMenuItemClick(handleMyCollection)}
                  >
                    <Star className="mobile-menu-icon-lucide" size={18} strokeWidth={2.5} />
                    <span className="mobile-menu-label">{translate("myCollection", lang)}</span>
                  </button>

                  <button
                    className="mobile-menu-item"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setShareOpen(true);
                    }}
                  >
                    <Share2 className="mobile-menu-icon-lucide" size={18} strokeWidth={2.5} />
                    <span className="mobile-menu-label">{translate("share", lang)}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="header-categories" id="HIDEHIDEHIDE">
          <button
            className={`sidebar-toggle-btn ${sidebarHidden ? 'open' : ''}`}
            onClick={toggleSidebar}
            aria-label={translate("toggleSidebar", lang)}
            aria-expanded={!sidebarHidden}
            aria-controls="sidebar"
          >
            <svg
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              focusable="false"
              className="menu-icon"
            >
              <rect x="3" y="3" width="18" height="2" rx="0.5" className="bar" />
              <rect x="3" y="11" width="10" height="2" rx="0.5" className="bar" />
              <rect x="3" y="19" width="18" height="2" rx="0.5" className="bar" />
              <polygon
                points="15.36,11.15 20.47,7.96 20.47,16.04 15.36,12.85"
                className="play"
              />
            </svg>
          </button>
        </div>
      </header>

      {/* Dropdown Components */}
      <NotificationsDropdown
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />

      <FriendsDropdown
        isOpen={friendsOpen}
        onClose={() => setFriendsOpen(false)}
      />

      <ProfileDropdown
        isOpen={profileOpen}
        onClose={() => setProfileOpen(false)}
        user={user}
      />

      <ShareModal open={shareOpen} onClose={() => setShareOpen(false)} />
    </>
  );
}