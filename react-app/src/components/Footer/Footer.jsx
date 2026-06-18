// react-app/src/components/Footer/Footer.jsx
import "./Footer.css";
import { useLanguage } from "../../context/LanguageContext";
import { translate } from "../../data/translations";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

const R2_BASE =
  import.meta.env.VITE_ASSETS_BASE_URL ||
  "https://assets.8jjgames.com";

const FOOTER_ICONS = {
  games:  `${R2_BASE}/8jj_icons/icons/8jj-game-3.webp`,
  thunder:`${R2_BASE}/8jj_icons/icons/thunder.webp`,
  device: `${R2_BASE}/8jj_icons/icons/device.webp`,
};

const LEGAL_LINK_KEYS = [
  { key: "main_privacyPolicy",      path: "/privacy-policy"       },
  { key: "main_disclaimer",         path: "/disclaimer"            },
  { key: "main_termsAndConditions", path: "/terms-and-conditions"  },
  { key: "main_responsibleGaming",  path: "/responsible-gaming"    },
  { key: "main_termsOfService",     path: "/terms-of-service"      },
];

export default function Footer() {
  const { lang } = useLanguage();
  const [open, setOpen] = useState(null);
  const navigate  = useNavigate();
  const location  = useLocation();

  const legalLinks = LEGAL_LINK_KEYS.map(({ key, path }) => ({
    label: translate(key, lang),
    path,
  }));

  const goToSection = (id) => {
    if (location.pathname !== "/") {
      navigate("/", { state: { scrollTo: id } });
    } else {
      scrollToId(id);
    }
  };

  const scrollToId = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    window.scrollTo({ top: el.offsetTop - 80, behavior: "smooth" });
  };

  const toggleAccordion = (section) => {
    setOpen(open === section ? null : section);
  };

  return (
    <div className="Footer-Backdrop">
      <footer className="footer-container" role="contentinfo">

        {/* ==================== DESKTOP FOOTER ==================== */}
        <div className="FooterDesktop">
          <div className="footer-inner">

            {/* LEFT — brand + badges */}
            <section className="footer-left" aria-label="About 8JJ Games">
              <div className="footer-brand-row">
                <img
                  src="/images/8JJ_games.png"
                  alt="8JJ Games logo - Free online browser games"
                  className="footer-logo"
                  loading="lazy"
                />
                <div className="footer-tile-row">
                  <h3 className="footer-heading">8JJ GAMES</h3>
                  <p className="footer-description">
                    {translate("footerTagline", lang)}
                  </p>
                </div>
              </div>

              <ul className="footer-badges" aria-label="Site features">
                <li className="badge">
                  <img src={FOOTER_ICONS.games}   alt="" aria-hidden="true" className="footer-badge-icon" />
                  {translate("freeBadge", lang)}
                </li>
                <li className="badge">
                  <img src={FOOTER_ICONS.thunder} alt="" aria-hidden="true" className="footer-badge-icon" />
                  {translate("oneClick", lang)}
                </li>
                <li className="badge">
                  <img src={FOOTER_ICONS.device}  alt="" aria-hidden="true" className="footer-badge-icon" />
                  {translate("worksOnDevice", lang)}
                </li>
              </ul>
            </section>

            {/* RIGHT — nav columns */}
            <nav className="footer-right" aria-label="Footer navigation">

              {/* BROWSE */}
              <section className="footer-column footer-column-Color">
                <h4>{translate("browse", lang)}</h4>
                <ul>
                  <li><button onClick={() => navigate("/")}                 className="footer-link">{translate("home", lang)}</button></li>
                  <li><button onClick={() => navigate("/all-8jj-games")}    className="footer-link">{translate("allGames", lang)}</button></li>
                  <li><button onClick={() => goToSection("popularSection")} className="footer-link">{translate("popular", lang)}</button></li>
                  <li><button onClick={() => navigate("/my-collection")}    className="footer-link">{translate("myCollection", lang)}</button></li>
                </ul>
              </section>

              {/* CATEGORIES */}
              <section className="footer-column footer-column-Color">
                <h4>{translate("categories", lang)}</h4>
                <ul>
                  <li><button onClick={() => navigate("/categories/action")}    className="footer-link">{translate("categoryAction", lang)}</button></li>
                  <li><button onClick={() => navigate("/categories/adventure")} className="footer-link">{translate("categoryAdventure", lang)}</button></li>
                  <li><button onClick={() => navigate("/categories/puzzles")}   className="footer-link">{translate("categoryPuzzles", lang)}</button></li>
                  <li><button onClick={() => navigate("/categories")}           className="footer-link">{translate("viewAllCategories", lang)}</button></li>
                </ul>
              </section>

              {/* LEGAL */}
              {/* <section className="footer-column footer-column-Color">
                <h4>{translate("main_legalHeading", lang)}</h4>
                <ul>
                  {legalLinks.map(({ label, path }) => (
                    <li key={path}>
                      <button
                        onClick={() => navigate(path)}
                        className="footer-link"
                        aria-label={`Go to ${label}`}
                      >
                        {label}
                      </button>
                    </li>
                  ))}
                </ul>
              </section> */}

            </nav>
          </div>

          {/* DIVIDER */}
          <hr className="footer-divider" aria-hidden="true" />

          {/* BOTTOM ROW */}
          <section className="footer-bottom" aria-label="Copyright information">
            <div className="Left-Container-Footer">
              <p>© 2025 8JJ Games. All rights reserved.</p>

            {/* Legal pill links */}
            <nav className="footer-legal-pills" aria-label="Legal links">
              {legalLinks.map(({ label, path }) => (
                <button
                  key={path}
                  onClick={() => navigate(path)}
                  className="footer-legal-pill"
                >
                  {label}
                </button>
              ))}
            </nav>
            </div>

            <div className="footer-bottom-actions">
              <button onClick={() => navigate("/contact")} className="feedback-btn" aria-label="Give feedback">
                {translate("giveFeedback", lang)}
              </button>
              <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="back-to-top" aria-label="Scroll back to top">
                {translate("backToTop", lang)}
              </button>
            </div>
          </section>
        </div>

        {/* ==================== MOBILE FOOTER ==================== */}
        <div className="FooterMobile">

          {/* Brand */}
          <section className="footer-brand-section" aria-label="About 8JJ Games">
            <div className="footer-brand-row">
              <img
                src="/images/8JJ_games.png"
                alt="8JJ Games logo - Free online browser games"
                className="footer-logo"
                loading="lazy"
              />
              <div className="footer-tile-row">
                <h3 className="footer-heading">8JJ GAMES</h3>
                <p className="footer-description">{translate("footerTagline", lang)}</p>
              </div>
            </div>
          </section>

          {/* Badges */}
          <section className="footer-mobile-actions" aria-label="Site features">
            <ul className="footer-mobile-actions-list">
              <li className="badge">
                <img src={FOOTER_ICONS.games}   alt="" aria-hidden="true" className="footer-badge-mobile-icon" />
                {translate("freeBadge", lang)}
              </li>
              <li className="badge">
                <img src={FOOTER_ICONS.thunder} alt="" aria-hidden="true" className="footer-badge-mobile-icon" />
                {translate("oneClick", lang)}
              </li>
              <li className="badge">
                <img src={FOOTER_ICONS.device}  alt="" aria-hidden="true" className="footer-badge-mobile-icon" />
                {translate("worksOnDevice", lang)}
              </li>
            </ul>
          </section>

          {/* Accordions */}
          <nav className="footer-mobile-accordions" aria-label="Mobile footer navigation">

            {/* BROWSE */}
            <section className={`accordion ${open === "browse" ? "open" : ""}`}>
              <button
                className="accordion-header"
                onClick={() => toggleAccordion("browse")}
                aria-expanded={open === "browse"}
                aria-controls="browse-content"
              >
                <span>{translate("browse", lang)}</span>
                <span className="arrow" aria-hidden="true">
                  <svg className="faq-icon-chevron" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </button>
              <ul className="accordion-body" id="browse-content">
                <li><button onClick={() => { toggleAccordion(null); navigate("/"); }}                  className="footer-link">{translate("home", lang)}</button></li>
                <li><button onClick={() => { toggleAccordion(null); navigate("/all-8jj-games"); }}    className="footer-link">{translate("allGames", lang)}</button></li>
                <li><button onClick={() => { toggleAccordion(null); goToSection("popularSection"); }} className="footer-link">{translate("popular", lang)}</button></li>
                <li><button onClick={() => { toggleAccordion(null); navigate("/my-collection"); }}    className="footer-link">{translate("myCollection", lang)}</button></li>
              </ul>
            </section>

            {/* CATEGORIES */}
            <section className={`accordion ${open === "categories" ? "open" : ""}`}>
              <button
                className="accordion-header"
                onClick={() => toggleAccordion("categories")}
                aria-expanded={open === "categories"}
                aria-controls="categories-content"
              >
                <span>{translate("categories", lang)}</span>
                <span className="arrow" aria-hidden="true">
                  <svg className="faq-icon-chevron" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </button>
              <ul className="accordion-body" id="categories-content">
                <li><button onClick={() => { toggleAccordion(null); navigate("/categories/action"); }}    className="footer-link">{translate("categoryAction", lang)}</button></li>
                <li><button onClick={() => { toggleAccordion(null); navigate("/categories/adventure"); }} className="footer-link">{translate("categoryAdventure", lang)}</button></li>
                <li><button onClick={() => { toggleAccordion(null); navigate("/categories/puzzles"); }}   className="footer-link">{translate("categoryPuzzles", lang)}</button></li>
                <li><button onClick={() => { toggleAccordion(null); navigate("/categories"); }}           className="footer-link">{translate("viewAllCategories", lang)}</button></li>
              </ul>
            </section>

            {/* LEGAL */}
            <section className={`accordion ${open === "legal" ? "open" : ""}`}>
              <button
                className="accordion-header"
                onClick={() => toggleAccordion("legal")}
                aria-expanded={open === "legal"}
                aria-controls="legal-content"
              >
                <span className="accordion-legal-label">
                  <span className="accordion-legal-icon">⚖️</span>
                  {translate("legalHeading", lang)}
                </span>
                <span className="arrow" aria-hidden="true">
                  <svg className="faq-icon-chevron" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </button>
              <ul className="accordion-body" id="legal-content">
                {legalLinks.map(({ label, path }) => (
                  <li key={path}>
                    <button
                      onClick={() => { toggleAccordion(null); navigate(path); }}
                      className="footer-link footer-link-legal"
                    >
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </section>

          </nav>

          {/* Mobile legal pills */}
          <nav className="footer-mobile-legal-pills" aria-label="Legal links">
            {legalLinks.map(({ label, path }) => (
              <button key={path} onClick={() => navigate(path)} className="footer-mobile-legal-pill">
                {label}
              </button>
            ))}
          </nav>

          {/* COPYRIGHT */}
          <section className="footer-mobile-bottom" aria-label="Copyright information">
            <p>© 2025 8JJ Games. All rights reserved.</p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="back-to-top"
              aria-label="Scroll back to top of page"
            >
              {translate("backToTop", lang)}
            </button>
          </section>

        </div>
      </footer>
    </div>
  );
}