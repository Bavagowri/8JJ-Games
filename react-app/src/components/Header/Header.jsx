import "./Header.css";
import { useLanguage } from "../../context/LanguageContext";
import { translate } from "../../data/translations";
import { useState } from "react";
import ShareModal from "../ShareModal/ShareModal";

export default function Header({ onSearch }) {
  const { lang, changeLanguage } = useLanguage();
  const [shareOpen, setShareOpen] = useState(false);
  const [sidebarHidden, setSidebarHidden] = useState(false);
  const [searchText, setSearchText] = useState("");

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchText(value);
    onSearch?.(value);
  };

  const clearSearch = () => {
    setSearchText("");
    onSearch?.("");
  };

  const toggleSidebar = () => {
    setSidebarHidden((prev) => !prev);
    document.dispatchEvent(new CustomEvent("toggleSidebar"));
  };
  

  return (
    <>
      <header className="header">
        {/* Sidebar toggle button */}
        <div className="header-categories">
          <button
            className="sidebar-toggle-btn"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            <img
              src={sidebarHidden ? "/images/show.png" : "/images/show.png"}
              alt="Toggle sidebar"
              className="sidebar-toggle-icon"
            />
          </button>
        </div>

        <div className="header-container">
          {/* Brand */}
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

          {/* Actions */}
          <div className="header-actions">
            {/* Search */}
            <div className="search MarginLeftRight">
              <input
                type="text"
                placeholder={translate("searchHeader", lang)}
                aria-label="Search games"
                value={searchText}
                onChange={handleSearch}
              />
              <button
                className="search-icon-btn"
                onClick={searchText ? clearSearch : undefined}
              >
                {searchText ? "✖" : "🔍"}
              </button>
            </div>

            {/* Language switch */}
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

            {/* Share */}
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
