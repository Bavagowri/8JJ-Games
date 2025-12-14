import "./Header.css";
import { useLanguage } from "../../context/LanguageContext";
import { translate } from "../../data/translations";
import { useState } from "react";
import ShareModal from "../ShareModal/ShareModal";

export default function Header({ onSearch }) {
  const { lang, changeLanguage } = useLanguage();
  const [shareOpen, setShareOpen] = useState(false);
  const [sidebarHidden, setSidebarHidden] = useState(false);

  const handleSearch = (e) => {
    onSearch?.(e.target.value);
  };

  const toggleSidebar = () => {
    setSidebarHidden(prev => !prev);
    document.dispatchEvent(new CustomEvent("toggleSidebar"));
  };

  return (
    <>
      <header className="header">
      {/* Light and Dark Mode - Bubble Switch
      <label className="bubble-label"><input class="bubble" type="checkbox" name="dummy" value="on"/></label>
      - End */}

        {/* Center categories bar */}
          <div className="header-categories">
            {/* Animated sidebar toggle button for desktop */}
            <label className="sidebar-toggle-btn">
              <input 
                type="checkbox" 
                checked={sidebarHidden}
                onChange={toggleSidebar}
                aria-label="Toggle sidebar"
              />
              <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="30" />
                <path className="line--1" d="M0 40h62c18 0 18-20-17 5L31 55" />
                <path className="line--2" d="M0 50h80" />
                <path className="line--3" d="M0 60h62c18 0 18 20-17-5L31 45" />
              </svg>
            </label>
          </div>

        <div className="header-container">
          {/* Left brand */}
          <div className="brand">
            <button
              className="icon-btn menu-toggle"
              type="button"
              aria-label="Open menu"
              onClick={() =>
                document.dispatchEvent(new CustomEvent("openDrawer"))
              }
            >
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
            </button>

            <a href="/" aria-label="8JJ Home">
              <img
                className="brand-logo"
                src="/images/8JJ_games.png"
                alt="8JJ Games"
              />
            </a>
          </div>

          

          {/* Right actions */}
          <div className="header-actions">
            <div className="search MarginLeftRight">
              <input
                type="text"
                placeholder={translate("Search", lang)}
                aria-label="Search games"
                onChange={handleSearch}
              />
              <span className="search-icon">🔍</span>
            </div>

            <div className="lang-switch MarginLeftRight">
              <span className="language-label">🌐</span>
              <select
                className="language-select"
                value={lang}
                onChange={(e) => changeLanguage(e.target.value)}
              >
                <option value="en">English</option>
                <option value="hi">हिन्दी</option>
                <option value="ta">தமிழ்</option>
                <option value="ml">മലയാളം</option>
                <option value="kn">ಕನ್ನಡ</option>
                <option value="bn">বাংলা</option>
              </select>
            </div>

            <button
              className="icon-btn"
              onClick={() => setShareOpen(true)}
            >
              <img
                src="/images/shared.png"
                alt="Share"
                className="share-header-icon"
              />
            </button>
          </div>
        </div>
      </header>
      
      <ShareModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
      />
    </>
  );
}