// react-app/src/pages/Auth/AuthPage/EmailVerified.jsx

import { useState, useEffect } from 'react';
import './EmailVerified.css';
import { translate } from '../../../data/translations';
import { useLanguage } from '../../../context/LanguageContext';

export default function EmailVerified() {
  const { lang } = useLanguage();
  const [gridCells, setGridCells] = useState([]);
  const [flippedCells, setFlippedCells] = useState(new Set());
  const [pageLoaded, setPageLoaded] = useState(false);

  // All game thumbnails
  const gameImages = [
    "1-2-3.jpg", "1-line.jpg", "10x10.jpg", "2-cars.jpg", "20-punch.jpg", "2030.jpg", "2048-merge.jpg",
    "2cars-adventure.jpg", "4096.jpg", "8-ball-pool-billiards.jpg", "8-ball-pool.jpg", "adventure-of-olaf.jpg",
    "air-fight.jpg", "air-hockey.jpg", "alien-galaxy-war.jpg", "alien-hunter-2.jpg", "alien-shoot-zombies.jpg",
    "amazing-ninja.jpg", "amazon-adventures.jpg", "american-football-challenge.jpg", "angry-cat-shot.jpg",
    "animal-coloring-pages-for-kids.jpg", "animal-connect.jpg", "animal-memory-game.jpg", "annoying-fly.jpg",
    "arcade-darts.jpg", "arcade-golf.jpg", "arithmetic-line.jpg", "arrow-in-your-knee.jpg", "assotiation.jpg",
    "auto-road.jpg", "avoid-the-trash.jpg", "aztec-escape.jpg", "azure-defender.jpg", "bable.jpg",
    "balance-ball.jpg", "ball-run.jpg", "ball-way.jpg", "baseball-pro.jpg", "basketball-2.jpg",
    "battle-battle.jpg", "beautiful-world.jpg", "beer-rush.jpg", "biggest-gum.jpg", "biggy-race.jpg",
    "bird-red-gifts.jpg", "birds-of-war.jpg", "black-hole.jpg", "block-pile.jpg", "block-puzzle.jpg",
    "block-shooter.jpg", "blocks-super-match3.jpg", "book-of-treasures.jpg", "bottle-flip-challenge.jpg",
    "bounce-ball.jpg", "bouncing-dot.jpg", "box-adventure.jpg", "boxes-physic.jpg", "boxkid.jpg",
    "brave-triangle.jpg", "break-liner-online.jpg", "break-the-brick.jpg", "break-the-line.jpg",
    "bubble-sorcerer.jpg", "burger-fall.jpg", "burger-maker.jpg", "burger-now.jpg", "burn-matches.jpg",
    "cake-connect.jpg", "candy-blocks.jpg", "candy-forest.jpg", "candy-land.jpg", "candy-line.jpg"
  ];

  // Initialize Flipping Grid
  useEffect(() => {
    const calculateGrid = () => {
      const cellSize = 70;
      const cols = Math.ceil(window.innerWidth / cellSize);
      const rows = Math.ceil(window.innerHeight / cellSize);
      const totalCells = cols * rows;

      const cells = [];
      for (let i = 0; i < totalCells; i++) {
        const randomFront = gameImages[Math.floor(Math.random() * gameImages.length)];
        const randomBack = gameImages[Math.floor(Math.random() * gameImages.length)];
        
        cells.push({
          id: i,
          frontImage: randomFront,
          backImage: randomBack
        });
      }
      setGridCells(cells);
    };

    calculateGrid();
    
    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(calculateGrid, 250);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
    };
  }, []);

  // Random Flipping Animation
  useEffect(() => {
    if (gridCells.length === 0) return;

    const flipRandomCard = () => {
      const randomIndex = Math.floor(Math.random() * gridCells.length);
      setFlippedCells(prev => {
        const newSet = new Set(prev);
        if (newSet.has(randomIndex)) {
          newSet.delete(randomIndex);
        } else {
          newSet.add(randomIndex);
        }
        return newSet;
      });
    };

    const interval = setInterval(flipRandomCard, 200);
    return () => clearInterval(interval);
  }, [gridCells.length]);

  // Page load animation
  useEffect(() => {
    const timer = setTimeout(() => setPageLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`email-verify-page ${pageLoaded ? 'loaded' : ''}`}>
      {/* Flipping Grid Background */}
      <div className="flipping-grid">
        {gridCells.map((cell) => (
          <div key={cell.id} className={`flip-box ${flippedCells.has(cell.id) ? 'flipped' : ''}`}>
            <div className="flip-box-inner">
              <div 
                className="flip-box-front"
                style={{
                  backgroundImage: `url(/game-thumbs/${cell.frontImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              />
              <div 
                className="flip-box-back"
                style={{
                  backgroundImage: `url(/game-thumbs/${cell.backImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Floating Particles */}
      <div className="floating-particles">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${10 + Math.random() * 10}s`
            }}
          ></div>
        ))}
      </div>

      {/* Main Content */}
      <div className="email-verify-container">
        <div className="email-verify-card">
          {/* Success Icon with Animation */}
          <div className="success-icon-wrapper">
            <svg className="success-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path className="checkmark" d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline className="checkmark-check" points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>

          {/* Logo */}
          <a href="/" aria-label={translate("homeAriaLabel", lang)} title={translate("homeTitle", lang)} className="logo-link">
            <img
              className="AUTH-brand-logo"
              src="/8JJ_games.png"
              alt={translate("logoAlt", lang)}
              title={translate("homeTitle", lang)}
            />
          </a>

          {/* Success Content */}
          <h1 className="email-verify-h1">{translate("emailVerified", lang)}</h1>
          <p className="email-verify-subtitle">
            <span className="success-checkmark">✓</span> {translate("accountNowActive", lang)}
          </p>
          <p className="email-verify-description">
            {translate("welcomeToGames", lang)}
          </p>

          {/* Action Button */}
          <div className="email-verify-btn">
            <a href="/login" className="login-button">
              <span>{translate("continueToLogin", lang)}</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </a>
          </div>

          {/* Additional Actions */}
          <div className="additional-actions">
            <a href="/" className="secondary-link">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              <span>{translate("backToHome", lang)}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}