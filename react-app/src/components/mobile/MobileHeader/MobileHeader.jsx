
// src/components/mobile/MobileHeader/MobileHeader.jsx
import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "../../../context/LanguageContext";
import { translate } from "../../../data/translations";
import { useAuth } from "../../../context/AuthContext";
import {
  Search,
  Bell,
  Menu,
  Globe,
  ChevronDown,
  Check,
} from "lucide-react";
import MobileMenu from "./MobileMenu";
import MobileNotifications from "./MobileNotifications";
import MobileSearchOverlay from "../MobileSearchOverlay/MobileSearchOverlay";
import "./MobileHeader.css";

const LANGUAGES = [
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
  { code: "mr", name: "मराठी", flag: "🇮🇳" },
];

export default function MobileHeader({ onSearch }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { lang, changeLanguage } = useLanguage();
  const { isAuthenticated, user } = useAuth();

  //  Replaced inline search expansion with overlay toggle
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);

  const languageRef = useRef(null);

  // Close all panels on route change
  useEffect(() => {
    setSearchOpen(false);
    setMenuOpen(false);
    setNotificationsOpen(false);
    setLanguageOpen(false);
  }, [location.pathname]);

  // Escape key closes everything
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setSearchOpen(false);
        setMenuOpen(false);
        setNotificationsOpen(false);
        setLanguageOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  // Close language dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (languageRef.current && !languageRef.current.contains(e.target)) {
        setLanguageOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  const handleSearchOpen = () => {
    setSearchOpen(true);
    setMenuOpen(false);
    setNotificationsOpen(false);
    setLanguageOpen(false);
  };

  const handleLogoClick = () => {
    navigate("/");
    setSearchOpen(false);
    setMenuOpen(false);
    setNotificationsOpen(false);
    setLanguageOpen(false);
  };

  const handleNotificationsToggle = () => {
    setNotificationsOpen(!notificationsOpen);
    setMenuOpen(false);
    setLanguageOpen(false);
  };

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
    setNotificationsOpen(false);
    setLanguageOpen(false);
  };

  const handleLanguageToggle = () => {
    setLanguageOpen(!languageOpen);
    setMenuOpen(false);
    setNotificationsOpen(false);
  };

  const handleLanguageSelect = (newLang) => {
    changeLanguage(newLang);
    setLanguageOpen(false);
  };

  const currentLanguage = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0];

  return (
    <>
      <header className="mobile-header">
        <div className="mobile-header-container">
          {/* Logo */}
          <button
            className="mobile-logo-btn"
            onClick={handleLogoClick}
            aria-label="Go to home"
          >
            <img src="/8JJ_games.png" alt="8JJ Games" className="mobile-logo" />
          </button>

          {/* Action Buttons */}
          <div className="mobile-header-actions">
            {/*  Search now opens the full-screen overlay */}
            <button
              className="mobile-header-btn"
              onClick={handleSearchOpen}
              aria-label="Search games"
            >
              <Search className="header-iconz" />
            </button>

            {/* Notifications — only when logged in */}
            {isAuthenticated && (
              <button
                className={`mobile-header-btn ${notificationsOpen ? "active" : ""}`}
                onClick={handleNotificationsToggle}
                aria-label="Notifications"
              >
                <Bell className="header-iconz" />
              </button>
            )}

            {/* Language Selector */}
            <div className="mobile-language-selector" ref={languageRef}>
              <button
                className={`mobile-language-btn ${languageOpen ? "open" : ""}`}
                onClick={handleLanguageToggle}
                aria-label="Select language"
                aria-expanded={languageOpen}
              >
                <span className="mobile-language-flag">{currentLanguage.flag}</span>
                <span className="mobile-language-code">{currentLanguage.code}</span>
                <ChevronDown className="mobile-language-icon" />
              </button>

              {languageOpen && (
                <div className="mobile-language-dropdown">
                  {LANGUAGES.map((language) => (
                    <button
                      key={language.code}
                      className={`mobile-language-option ${lang === language.code ? "active" : ""}`}
                      onClick={() => handleLanguageSelect(language.code)}
                    >
                      <span className="mobile-language-option-flag">{language.flag}</span>
                      <span className="mobile-language-option-name">{language.name}</span>
                      {lang === language.code && (
                        <Check className="mobile-language-option-check" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Menu */}
            <button
              className={`mobile-header-btn ${menuOpen ? "active" : ""}`}
              onClick={handleMenuToggle}
              aria-label="Menu"
              aria-expanded={menuOpen}
            >
              <Menu className="header-iconz" />
            </button>
          </div>
        </div>
      </header>

      {/*  Full-screen search overlay — works on every page */}
      <MobileSearchOverlay
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
      />

      {/* Notifications Dropdown */}
      <MobileNotifications
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />

      {/* Main Menu Dropdown */}
      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} user={user} />
    </>
  );
}