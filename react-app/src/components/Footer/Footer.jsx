import "./Footer.css";
import { useLanguage } from "../../context/LanguageContext";
import { translate } from "../../data/translations";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";



export default function Footer() {
  const { lang } = useLanguage();
  const [open, setOpen] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const goToSection = (id) => {
    if (location.pathname !== "/") {
      // Go to home first with section info
      navigate("/", { state: { scrollTo: id } });
    } else {
      // Already on home → scroll directly
      scrollToId(id);
    }
  };

  const scrollToId = (id) => {
    const el = document.getElementById(id);
    if (!el) return;

    window.scrollTo({
      top: el.offsetTop - 80,
      behavior: "smooth",
    });
  };

  const toggleAccordion = (section) => {
    setOpen(open === section ? null : section);
  };

  return (
    <footer className="footer-container">
      <div className="FooterDesktop">
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
                <li onClick={() => goToSection("featuredSection")}>{translate("featuredGames", lang)}</li>
                <li onClick={() => goToSection("trending")}>{translate("trendingGames", lang)}</li>
                <li onClick={() => goToSection("top-picks")}>{translate("topPicks", lang)}</li>
                <li onClick={() => goToSection("gamesAll")}>{translate("allGames", lang)}</li>
              </ul>
            </div>

            {/* CATEGORIES */}
            <div className="footer-column">
              <h3>{translate("categories", lang)}</h3>
              <ul>
                {/* <li onClick={() => goToSection("action")}>{translate("action", lang)}</li> */}
                {/* <li onClick={() => goToSection("driving")}>{translate("driving", lang)}</li> */}
                {/* <li onClick={() => goToSection("puzzles")}>{translate("puzzles", lang)}</li> */}
                {/* <li onClick={() => goToSection("skill_games")}>{translate("skill", lang)}</li> */}
                {/* <li onClick={() => goToSection("simulation_games")}>{translate("simulation", lang)}</li> */}
                <li onClick={() => goToSection("platformer")}>{translate("platformer", lang)}</li>
                <li onClick={() => goToSection("christmas")}>{translate("christmas", lang)} {translate("games", lang)}</li>
                <li onClick={() => goToSection("halloween_games")}>{translate("halloween", lang)} {translate("games", lang)}</li>
                {/* <li onClick={() => goToSection("football_games")}>{translate("football", lang)} {translate("games", lang)}</li> */}
                {/* <li onClick={() => goToSection("basketball_games")}>{translate("basketball", lang)} {translate("games", lang)}</li> */}
                {/* <li onClick={() => goToSection("card_games")}>{translate("card", lang)} {translate("games", lang)}</li> */}
                <li onClick={() => goToSection("horror_games")}>{translate("horror", lang)} {translate("games", lang)}</li>
                {/* <li onClick={() => goToSection("endless_runner")}>{translate("endlessRunner", lang)}</li> */}
              </ul>
            </div>



            {/* SUPPORT */}
            {/* <div className="footer-column">
            <h3>{translate("support", lang)}</h3>
            <ul>
              <li onClick={() => goToSection("faqSection")}>FAQ</li>
            </ul>
          </div> */}

          </div>
        </div>

        {/* DIVIDER */}
        <div className="footer-divider"></div>

        {/* BOTTOM COPYRIGHT ROW */}
        <div className="footer-bottom">
          <p>© 2025 8JJ Games — {translate("allGames", lang)}.</p>
          <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="back-to-top">
            {translate("backToTop", lang)}
          </button>
        </div>
      </div>




      <div className="FooterMobile">


        <div className="footer-brand-row">
          <img src="/images/8JJ_games.png" alt="8JJ Games" className="footer-logo" />
          <div className="footer-tile-row">
            <h2 className="footer-heading">8JJ GAMES</h2>
            <p className="footer-description">
              {translate("footerTagline", lang)}
            </p>
          </div>
        </div>


        {/* QUICK ACTIONS */}
        <div className="footer-mobile-actions">
          <div className="footer-mobile-actions">
            <span className="badge">🎮 {translate("freeBadge", lang)}</span>
            <span className="badge">⚡ {translate("oneClick", lang)}</span>
            <span className="badge">📱 {translate("worksOnDevice", lang)}</span>
          </div>
        </div>

        {/* ACCORDIONS */}
        <div className="footer-mobile-accordions">

          {/* BROWSE */}
          <div className={`accordion ${open === "browse" ? "open" : ""}`}>
            <div className="accordion-header" onClick={() => toggleAccordion("browse")}>
              <span>{translate("browse", lang)}</span>
              <span className="arrow"><svg className="faq-icon-chevron" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg></span>
            </div>

            <ul className="accordion-body">
              <li onClick={() => goToSection("featuredSection")}>{translate("featuredGames", lang)}</li>
              <li onClick={() => goToSection("trending")}>{translate("trendingGames", lang)}</li>
              <li onClick={() => goToSection("top-picks")}>{translate("topPicks", lang)}</li>
              <li onClick={() => goToSection("gamesAll")}>{translate("allGames", lang)}</li>
            </ul>
          </div>

          {/* CATEGORIES */}
          <div className={`accordion ${open === "categories" ? "open" : ""}`}>
            <div className="accordion-header" onClick={() => toggleAccordion("categories")}>
              <span>{translate("categories", lang)}</span>
              <span className="arrow"><svg className="faq-icon-chevron" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg></span>
            </div>

            <ul className="accordion-body">
              <li onClick={() => goToSection("platformer")}>{translate("platformer", lang)}</li>
              <li onClick={() => goToSection("christmas")}>{translate("christmas", lang)}</li>
              <li onClick={() => goToSection("halloween_games")}>{translate("halloween", lang)}</li>
              <li onClick={() => goToSection("horror_games")}>{translate("horror", lang)}</li>
            </ul>
          </div>
        </div>

        {/* COPYRIGHT */}
        <div className="footer-mobile-bottom">
          <p>© 2025 8JJ Games — {translate("allGames", lang)}.</p>
          <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="back-to-top">
            {translate("backToTop", lang)}
          </button>
        </div>
      </div>




    </footer>


  );
}