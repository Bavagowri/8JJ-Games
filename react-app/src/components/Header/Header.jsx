import "./Header.css";
import { useLanguage } from "../../context/LanguageContext";
import { translate } from "../../data/translations";
import { useState } from "react";
import ShareModal from "../ShareModal/ShareModal";
import { useSearch } from "../../context/SearchContext";

export default function Header() {
  const { lang, changeLanguage } = useLanguage();
  const { search, setSearch } = useSearch();
  const [shareOpen, setShareOpen] = useState(false);
  const [sidebarHidden, setSidebarHidden] = useState(false);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const clearSearch = () => {
    setSearch("");
  };

  const toggleSidebar = () => {
    setSidebarHidden((prev) => !prev);
    document.dispatchEvent(new CustomEvent("toggleSidebar"));
  };

  
  return (
    <>
      <header className="header">
        <div className="header-categories">
          <button
            className={`sidebar-toggle-btn ${sidebarHidden ? 'open' : ''}`}
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
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
              aria-label="Open menu"
              onClick={() =>
                document.dispatchEvent(new CustomEvent("openDrawer"))
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


            <a href="/" aria-label="8JJ Home">
              <img
                className="brand-logo"
                src="/images/8JJ_games.png"
                alt="8JJ Games"
              />
            </a>
          </div>

          <div className="header-actions">
            <div className="search MarginLeftRight">
              <input
                type="text"
                placeholder={translate("searchHeader", lang)}
                aria-label="Search games"
                value={search}
                onChange={handleSearch}
              />
              <button
                className="search-icon-btn"
                onClick={search ? clearSearch : undefined}
              >
                {search ? "✖" : "🔍"}
              </button>
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

            <button className="icon-btn" onClick={() => setShareOpen(true)}>
              <img
                src="/images/shared.png"
                alt="Share"
                className="share-header-icon"
              />
            </button>
          </div>

          {/* Sidebar toggle button */}
        <div className="header-categories" id="HIDEHIDEHIDE">
          <button
            className={`sidebar-toggle-btn ${sidebarHidden ? 'open' : ''}`}
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
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
        </div>
      </header>

      <ShareModal open={shareOpen} onClose={() => setShareOpen(false)} />
    </>
  );
}
