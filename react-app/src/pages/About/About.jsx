

// react-app/src/pages/About/About.jsx

import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { translate } from "../../data/translations";
import SEO from "../../components/SEO/SEO";
import { generateKeywords } from "../../config/seoKeywords";
import './About.css';

export default function About() {
  const navigate = useNavigate();
  const { lang } = useLanguage();

  // All game thumbnails for background
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
    "cake-connect.jpg", "candy-blocks.jpg", "candy-forest.jpg", "candy-land.jpg", "candy-line.jpg",
    "captain-america-doctor.jpg", "captain-war-zombie-killer.jpg", "car-rush-2.jpg", "car-speed-booster.jpg",
    "car-traffic-racing.jpg", "carnival-shooter.jpg", "catch-dots.jpg", "caveman-hunt.jpg", "caveman-jumper.jpg",
    "chameleon.jpg", "charge-me.jpg", "chase-racing-cars.jpg", "cheesy-wars.jpg", "christmas-balls.jpg",
    "christmas-furious.jpg", "christmas-gift.jpg", "christmas-gravity-runner.jpg", "christmas-panda-run.jpg",
    "christmas-sweeper.jpg", "circle-pong.jpg", "circle-run.jpg", "circle-rush.jpg", "circuit-drifter.jpg",
    "classic-car-racing.jpg", "clever-frog.jpg", "cliff-diving.jpg", "color-bump-online.jpg", "color-circle.jpg",
    "color-tower.jpg", "coloring-book.jpg", "combat-penguin.jpg", "combat-squad.jpg", "connect-lines.jpg",
    "cowboy-shoot-zombies.jpg", "cpl-tournament.jpg", "crazy-balls.jpg", "crazy-driver.jpg", "crazy-freekick.jpg",
    "crazy-parking.jpg", "crystal-ball-zuma.jpg", "cube-jump.jpg", "cyber-soldier.jpg", "dangerous-rescue.jpg",
    "dangerous.jpg", "darts-pro.jpg", "dash-man.jpg", "dd-release.jpg", "def-island-.jpg", "desconstruct.jpg",
    "desert-run.jpg", "dino-jump.jpg", "divide.jpg", "dodge.jpg", "dogi-bubble-shooter.jpg", "don-t-crash.jpg"
  ];

  const [gridCells, setGridCells] = useState([]);
  const [flippedCells, setFlippedCells] = useState(new Set());

  /* =======================
      NEW: JSON-LD SCHEMA MARKUP
  ======================== */
  useEffect(() => {
    // AboutPage Schema
    const aboutPageSchema = {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      "name": "About 8JJ Games",
      "description": "Learn about 8JJ Games - your destination for free online gaming. Discover our mission, values, and commitment to providing the best browser-based gaming experience.",
      "url": "https://8jjgames.com/about",
      "mainEntity": {
        "@type": "Organization",
        "name": "8JJ Games",
        "alternateName": "8jj-games",
        "url": "https://8jjgames.com",
        "logo": "https://8jjgames.com/8JJ_games.png",
        "description": "Free online gaming platform featuring over 1000 browser-based games across multiple genres. Play action, puzzle, racing, sports games and more without download.",
        "foundingDate": "2020",
        "numberOfEmployees": {
          "@type": "QuantitativeValue",
          "value": "10-50"
        },
        "slogan": "Your Ultimate Destination for Free Online Gaming",
        "knowsAbout": [
          "Online Gaming",
          "Browser Games",
          "HTML5 Games",
          "Free Games",
          "Casual Gaming",
          "Action Games",
          "Puzzle Games",
          "Racing Games",
          "Sports Games"
        ],
        "areaServed": {
          "@type": "Place",
          "name": "Worldwide"
        },
        "audience": {
          "@type": "Audience",
          "audienceType": "Gamers of all ages"
        }
      }
    };

    // Organization Schema (detailed)
    const organizationSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "8JJ Games",
      "alternateName": "8jj-games",
      "url": "https://8jjgames.com",
      "logo": "https://8jjgames.com/8JJ_games.png",
      "description": "Free online gaming platform with 1000+ browser games. No download required - play instantly!",
      "foundingDate": "2020",
      "email": "support@8jjgames.com",
      "sameAs": [
        "https://www.facebook.com/games8jj/",
        "https://www.instagram.com/8jjgames/",
        "https://t.me/+EqU2725tjvthYWRl",
        "https://chat.whatsapp.com/Jj2GX9riQWxLEErESqbiNQ"
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "email": "support@8jjgames.com",
        "contactType": "Customer Support",
        "availableLanguage": ["English", "Spanish", "French", "German"],
        "areaServed": "Worldwide"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.7",
        "bestRating": "5",
        "ratingCount": "15000"
      },
      "offers": {
        "@type": "AggregateOffer",
        "offerCount": "1000",
        "lowPrice": "0",
        "highPrice": "0",
        "priceCurrency": "USD"
      }
    };

    // Breadcrumb Schema
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://8jjgames.com"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "About",
          "item": "https://8jjgames.com/about"
        }
      ]
    };

    // Add all schemas
    const schemaScript = document.createElement('script');
    schemaScript.type = 'application/ld+json';
    schemaScript.text = JSON.stringify([aboutPageSchema, organizationSchema, breadcrumbSchema]);
    schemaScript.id = 'about-schema';
    document.head.appendChild(schemaScript);

    // Cleanup
    return () => {
      const existingScript = document.getElementById('about-schema');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

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

  return (
    <>
      {/*  IMPROVED: Enhanced SEO Meta Tags */}
      <SEO
        title="About 8JJ Games - Free Online Gaming Platform"
        description="Learn about 8JJ Games, your destination for 1000+ free online games. Discover our mission to provide accessible, quality browser gaming. No download, no registration - play instantly!"
        keywords="about 8jj games, gaming platform, free games site, online games platform, browser games, HTML5 gaming, 8jj games mission, free gaming website"
        url="/about"
        type="website"
        image="/8JJ_games.png"
      />

      <main className="AboutMainWrapper">
        {/* Flipping Grid Background */}
        <div className="flipping-grid" aria-hidden="true">
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

        {/* Main Content */}
        <div className="about-container">
          {/*  NEW: Breadcrumb Navigation */}
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/" className="breadcrumb-link">Home</Link>
            <span className="breadcrumb-separator" aria-hidden="true">/</span>
            <span className="breadcrumb-current">About</span>
          </nav>

          {/*  IMPROVED: Hero Section with proper semantic HTML */}
          <header className="about-hero">
            <div className="about-hero-content">
              <div className="logo-section">
                <img
                  src="/8JJ_games.png"
                  alt="8JJ Games - Free Online Gaming Platform Logo"
                  className="about-logo"
                  loading="eager"
                />
              </div>
              {/*  Proper H1 tag */}
              <h1 className="about-hero-title">
                {translate("about_welcome_title", lang) || "About 8JJ Games"}
              </h1>
              <p className="about-hero-subtitle">
                {translate("about_welcome_subtitle", lang) || "Your ultimate destination for free online gaming entertainment"}
              </p>
            </div>
          </header>

          {/*  IMPROVED: Story Section with enhanced content */}
          <section className="about-section story-section" aria-labelledby="story-heading">
            <div className="section-content">
              <header className="section-header">
                {/*  Proper H2 heading */}
                <h2 id="story-heading" className="section-title">
                  {translate("about_story_title", lang) || "Our Story"}
                </h2>
                <div className="title-underline" aria-hidden="true"></div>
              </header>
              <p className="section-text">
                {translate("about_story_paragraph_1", lang) || 
                "Founded in 2020, 8JJ Games was born from a simple passion: making quality gaming accessible to everyone, everywhere. We believe that great games shouldn't require expensive consoles, powerful computers, or lengthy downloads. Every person with an internet connection deserves access to engaging, fun, and diverse gaming experiences."}
              </p>
              <p className="section-text">
                {translate("about_story_paragraph_2", lang) || 
                "Today, we're proud to offer over 1,000 carefully curated games across dozens of genres. From action-packed shooters to brain-teasing puzzles, relaxing casual games to competitive sports titles - we've built a library that serves gamers of all ages and preferences. Our platform has welcomed millions of players from over 150 countries, creating a truly global gaming community."}
              </p>
              <p className="section-text">
                What sets us apart is our commitment to quality and accessibility. Every game on our platform is handpicked, tested, and optimized for browser play. We work tirelessly to ensure fast loading times, smooth gameplay, and a seamless experience across all devices - whether you're playing on a desktop computer, tablet, or smartphone.
              </p>
            </div>
          </section>

          {/*  IMPROVED: Stats Section with proper semantic markup */}
          <section className="stats-section" aria-labelledby="stats-heading">
            <h2 id="stats-heading" className="sr-only">8JJ Games By The Numbers</h2>
            <div className="stats-grid">
              <article className="stat-card">
                <div className="stat-icon" aria-hidden="true">🎮</div>
                <div className="stat-number">1000+</div>
                <div className="stat-label">{translate("about_stat_free_games", lang) || "Free Games"}</div>
              </article>
              <article className="stat-card">
                <div className="stat-icon" aria-hidden="true">👥</div>
                <div className="stat-number">1M+</div>
                <div className="stat-label">{translate("about_stat_happy_players", lang) || "Happy Players"}</div>
              </article>
              <article className="stat-card">
                <div className="stat-icon" aria-hidden="true">🌍</div>
                <div className="stat-number">150+</div>
                <div className="stat-label">{translate("about_stat_countries", lang) || "Countries"}</div>
              </article>
              <article className="stat-card">
                <div className="stat-icon" aria-hidden="true">⚡</div>
                <div className="stat-number">24/7</div>
                <div className="stat-label">{translate("about_stat_available", lang) || "Available"}</div>
              </article>
            </div>
          </section>

          {/*  IMPROVED: Mission Section with proper heading hierarchy */}
          <section className="about-section mission-section" aria-labelledby="mission-heading">
            <div className="section-content">
              <header className="section-header">
                {/*  Proper H2 heading */}
                <h2 id="mission-heading" className="section-title">
                  {translate("about_mission_title", lang) || "Our Mission"}
                </h2>
                <div className="title-underline" aria-hidden="true"></div>
              </header>
              <div className="mission-grid">
                <article className="mission-card">
                  <div className="mission-icon" aria-hidden="true">🎯</div>
                  {/*  Proper H3 heading */}
                  <h3 className="mission-title">
                    {translate("about_mission_accessibility_title", lang) || "Accessibility First"}
                  </h3>
                  <p className="mission-text">
                    {translate("about_mission_accessibility_text", lang) || 
                    "We believe gaming should be accessible to everyone. No downloads, no installations, no barriers - just instant fun in your browser."}
                  </p>
                </article>
                <article className="mission-card">
                  <div className="mission-icon" aria-hidden="true">✨</div>
                  <h3 className="mission-title">
                    {translate("about_mission_quality_title", lang) || "Quality Content"}
                  </h3>
                  <p className="mission-text">
                    {translate("about_mission_quality_text", lang) || 
                    "Every game is carefully selected and tested to ensure the best possible gaming experience for our community."}
                  </p>
                </article>
                <article className="mission-card">
                  <div className="mission-icon" aria-hidden="true">🚀</div>
                  <h3 className="mission-title">
                    {translate("about_mission_innovation_title", lang) || "Continuous Innovation"}
                  </h3>
                  <p className="mission-text">
                    {translate("about_mission_innovation_text", lang) || 
                    "We're constantly evolving, adding new games, features, and improvements based on community feedback."}
                  </p>
                </article>
              </div>
            </div>
          </section>

          {/*  IMPROVED: Values Section with proper semantic structure */}
          <section className="about-section values-section" aria-labelledby="values-heading">
            <div className="section-content">
              <header className="section-header">
                {/*  Proper H2 heading */}
                <h2 id="values-heading" className="section-title">
                  {translate("about_values_title", lang) || "What Makes Us Special"}
                </h2>
                <div className="title-underline" aria-hidden="true"></div>
              </header>
              <div className="values-grid">
                <article className="value-item">
                  <div className="value-icon" aria-hidden="true">🎲</div>
                  <h3>{translate("about_value_diverse_title", lang) || "Diverse Library"}</h3>
                  <p>
                    {translate("about_value_diverse_text", lang) || 
                    "From action to puzzle games, we offer something for every type of gamer across all age groups."}
                  </p>
                </article>
                <article className="value-item">
                  <div className="value-icon" aria-hidden="true">📱</div>
                  <h3>{translate("about_value_crossplatform_title", lang) || "Cross-Platform"}</h3>
                  <p>
                    {translate("about_value_crossplatform_text", lang) || 
                    "Play seamlessly on desktop, tablet, or mobile. Your games work everywhere, anytime."}
                  </p>
                </article>
                <article className="value-item">
                  <div className="value-icon" aria-hidden="true">🔒</div>
                  <h3>{translate("about_value_safe_title", lang) || "Safe & Secure"}</h3>
                  <p>
                    {translate("about_value_safe_text", lang) || 
                    "Your privacy and security matter. We never ask for unnecessary personal information."}
                  </p>
                </article>
                <article className="value-item">
                  <div className="value-icon" aria-hidden="true">🆓</div>
                  <h3>{translate("about_value_free_title", lang) || "100% Free"}</h3>
                  <p>
                    {translate("about_value_free_text", lang) || 
                    "All our games are completely free to play. No hidden costs, no subscriptions required."}
                  </p>
                </article>
                <article className="value-item">
                  <div className="value-icon" aria-hidden="true">🔄</div>
                  <h3>{translate("about_value_updates_title", lang) || "Regular Updates"}</h3>
                  <p>
                    {translate("about_value_updates_text", lang) || 
                    "Fresh content added regularly. New games, categories, and features to keep things exciting."}
                  </p>
                </article>
                <article className="value-item">
                  <div className="value-icon" aria-hidden="true">💬</div>
                  <h3>{translate("about_value_community_title", lang) || "Community Driven"}</h3>
                  <p>
                    {translate("about_value_community_text", lang) || 
                    "Your feedback shapes our platform. We listen to our players and continuously improve."}
                  </p>
                </article>
              </div>
            </div>
          </section>

          {/*  IMPROVED: CTA Section with proper semantic markup */}
          <section className="cta-section" aria-labelledby="cta-heading">
            <div className="cta-content">
              {/*  Proper H2 heading */}
              <h2 id="cta-heading" className="cta-title">
                {translate("about_cta_title", lang) || "Ready to Start Playing?"}
              </h2>
              <p className="cta-text">
                {translate("about_cta_text", lang) || 
                "Join millions of players worldwide and discover your next favorite game. It's completely free!"}
              </p>
              <div className="cta-buttons">
                <button 
                  onClick={() => navigate('/')} 
                  className="cta-button primary"
                  aria-label="Explore our game collection"
                >
                  {translate("about_cta_explore", lang) || "Explore Games"}
                </button>
                <button 
                  onClick={() => navigate('/contact')} 
                  className="cta-button secondary"
                  aria-label="Contact 8JJ Games support"
                >
                  {translate("about_cta_contact", lang) || "Contact Us"}
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}