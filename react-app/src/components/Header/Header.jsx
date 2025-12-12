import "./Header.css";
import { useLanguage } from "../../context/LanguageContext";
import { translate } from "../../data/translations";
import { useState } from "react";
import ShareModal from "../ShareModal/ShareModal";


export default function Header({ onSearch }) {
  const { lang, changeLanguage } = useLanguage();
  const [shareOpen, setShareOpen] = useState(false);

  const handleSearch = (e) => {
    onSearch?.(e.target.value);
  };

  return (
    <>
      <header className="header">
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

          {/* Center categories bar – can be filled later if you like */}
          <div className="header-categories" />

          {/* Right actions */}
          <div className="header-actions">
            <div className="search">
              <input
                type="text"
                placeholder={translate("Search", lang)}
                aria-label="Search games"
                onChange={handleSearch}
              />
              <span className="search-icon">🔍</span>
            </div>

            <div className="lang-switch">
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

            {/* Simple share button, opens ShareModal via event */}
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
      {/* SHARE MODAL */}
        <ShareModal
          open={shareOpen}
          onClose={() => setShareOpen(false)}
        />
    </>

  );
}