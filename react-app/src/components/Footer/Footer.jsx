import "./Footer.css";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="footer-container">

      {/* MAIN CONTENT */}
      <div className="footer-inner">

        {/* LEFT SECTION */}
        <div className="footer-left">

          {/* LOGO + TITLE INLINE */}
          <div className="footer-brand-row">
            <img src="/images/8JJ_games.png" alt="8JJ Games" className="footer-logo" />
            <div className="footer-tile-row">
                <h2 className="footer-heading">8JJ GAMES</h2>
                <p className="footer-description">
                    Fast, free browser games — no downloads, no sign-ups.
                    Just tap Play Now and start.
                </p>
            </div>
          </div>

          <div className="footer-badges">
            <span className="badge">🎮 100% Free</span>
            <span className="badge">⚡ One-Click Start</span>
            <span className="badge">📱 Works on Any Device</span>
          </div>
        </div>

        {/* RIGHT SECTION (COLUMNS) */}
        <div className="footer-right">

          <div className="footer-column">
            <h3>Browse</h3>
            <ul>
              <li>Popular Games</li>
              <li>Hot Games</li>
              <li>Featured</li>
              <li>All Games</li>
              <li>Recently Played</li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>Categories</h3>
            <ul>
              <li>Cricket Games</li>
              <li>Football Games</li>
              <li>Basketball Games</li>
              <li>Racing Games</li>
              <li>Card & Puzzle</li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>Support</h3>
            <ul>
              <li>FAQ</li>
            </ul>
          </div>

        </div>
      </div>

      {/* DIVIDER */}
      <div className="footer-divider"></div>

      {/* BOTTOM COPYRIGHT ROW */}
      <div className="footer-bottom">
        <p>© 2025 8JJ Games — Free Online Games.</p>
        <button onClick={scrollToTop} className="back-to-top">Back to top ↑</button>
      </div>

    </footer>
  );
}
