import "./Footer.css";
import { useLanguage } from "../../context/LanguageContext";
import { translate } from "../../data/translations";

export default function Footer() {
  const { lang } = useLanguage();

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (!el) return;

    window.scrollTo({
      top: el.offsetTop - 80,
      behavior: "smooth",
    });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="footer-container">

      {/* MAIN CONTENT */}
      <div className="footer-inner">

        {/* LEFT SECTION */}
        <div className="footer-left">
          <div className="footer-brand-row">
            <img src="/images/8JJ_games.png" alt="8JJ Games" className="footer-logo" />
            <div className="footer-tile-row">
                <h2 className="footer-heading">8JJ GAMES</h2>
                <p className="footer-description">
                  {translate("footerTagline", lang)}
                </p>
            </div>
          </div>

          <div className="footer-badges">
            <span className="badge">🎮 {translate("freeBadge", lang)}</span>
            <span className="badge">⚡ {translate("oneClick", lang)}</span>
            <span className="badge">📱 {translate("worksOnDevice", lang)}</span>
          </div>
        </div>

        {/* RIGHT SECTION (COLUMNS) */}
        <div className="footer-right">

          {/* BROWSE */}
          <div className="footer-column">
            <h3>{translate("browse", lang)}</h3>
            <ul>
              <li onClick={() => scrollTo("popularSection")}>{translate("popularGames", lang)}</li>
              <li onClick={() => scrollTo("hotSection")}>{translate("hotGames", lang)}</li>
              <li onClick={() => scrollTo("featuredSection")}>{translate("featuredGames", lang)}</li>
              <li onClick={() => scrollTo("gamesAll")}>{translate("allGames", lang)}</li>
              <li onClick={() => scrollTo("recentSection")}>{translate("recentlyPlayed", lang)}</li>
            </ul>
          </div>

          {/* CATEGORIES */}
          <div className="footer-column">
            <h3>{translate("categories", lang)}</h3>
            <ul>
              <li onClick={() => scrollTo("number_games")}>{translate("cricket", lang)} {translate("games", lang)}</li>
              <li onClick={() => scrollTo("football_games")}>{translate("football", lang)} {translate("games", lang)}</li>
              <li onClick={() => scrollTo("basketball_games")}>{translate("basketball", lang)} {translate("games", lang)}</li>
              <li onClick={() => scrollTo("hotSection")}>{translate("racing", lang)}</li>
              <li onClick={() => scrollTo("gamesAll")}>{translate("cardPuzzle", lang)}</li>
            </ul>
          </div>

          {/* SUPPORT */}
          <div className="footer-column">
            <h3>{translate("support", lang)}</h3>
            <ul>
              <li onClick={() => scrollTo("faqSection")}>{translate("faq", lang)}</li>
            </ul>
          </div>

        </div>
      </div>

      {/* DIVIDER */}
      <div className="footer-divider"></div>

      {/* BOTTOM COPYRIGHT ROW */}
      <div className="footer-bottom">
        <p>© 2025 8JJ Games — {translate("allGames", lang)}.</p>
        <button onClick={scrollToTop} className="back-to-top">
          {translate("backToTop", lang)}
        </button>
      </div>

    </footer>
  );
}
