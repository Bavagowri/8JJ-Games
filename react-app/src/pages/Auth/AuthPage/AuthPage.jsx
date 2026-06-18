// react-app/src/pages/Auth/AuthPage/AuthPage.jsx - SEO OPTIMIZED

import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import HeroContent from "./HeroContent";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import ForgotPasswordForm from "./ForgotPasswordForm";
import "./AuthPage.css";

// SEO: Import SEO component
import SEO from "../../../components/SEO/SEO";
import { generateKeywords } from "../../../config/seoKeywords";

// ── R2 CDN base — same env var used across the whole app ──────
const R2_BASE =
  import.meta.env.VITE_ASSETS_BASE_URL || "https://assets.8jjgames.com";

// ── Thumb URL helper — mirrors getGameThumb for plain filenames ──
function getThumbUrl(filename) {
  return `${R2_BASE}/game-thumbs-webp/${filename}`;
}

export default function AuthPage({ mode: initialMode = "login" }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState(initialMode);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);

  // Flipping Grid State
  const [gridCells, setGridCells] = useState([]);
  const [flippedCells, setFlippedCells] = useState(new Set());

  // Game thumbnail filenames — these are webp files on the R2 CDN
  // under /game-thumbs-webp/ (same path used by getGameThumb)
  const gameImages = [
    "1-2-3.webp", "1-line.webp", "10x10.webp", "2-cars.webp", "20-punch.webp",
    "2030.webp", "2048-merge.webp", "2cars-adventure.webp", "4096.webp",
    "8-ball-pool-billiards.webp", "8-ball-pool.webp", "adventure-of-olaf.webp",
    "air-fight.webp", "air-hockey.webp", "alien-galaxy-war.webp",
    "alien-hunter-2.webp", "alien-shoot-zombies.webp", "amazing-ninja.webp",
    "amazon-adventures.webp", "american-football-challenge.webp",
    "angry-cat-shot.webp", "animal-connect.webp", "animal-memory-game.webp",
    "annoying-fly.webp", "arcade-darts.webp", "arcade-golf.webp",
    "arithmetic-line.webp", "arrow-in-your-knee.webp", "assotiation.webp",
    "auto-road.webp", "avoid-the-trash.webp", "aztec-escape.webp",
    "azure-defender.webp", "bable.webp", "balance-ball.webp", "ball-run.webp",
    "ball-way.webp", "baseball-pro.webp", "basketball-2.webp",
    "battle-battle.webp", "beautiful-world.webp", "beer-rush.webp",
    "biggest-gum.webp", "biggy-race.webp", "bird-red-gifts.webp",
    "birds-of-war.webp", "black-hole.webp", "block-pile.webp",
    "block-puzzle.webp", "block-shooter.webp", "blocks-super-match3.webp",
    "book-of-treasures.webp", "bottle-flip-challenge.webp", "bounce-ball.webp",
    "bouncing-dot.webp", "box-adventure.webp", "boxes-physic.webp",
    "boxkid.webp", "brave-triangle.webp", "break-liner-online.webp",
    "break-the-brick.webp", "break-the-line.webp", "bubble-sorcerer.webp",
    "burger-fall.webp", "burger-maker.webp", "burger-now.webp",
    "burn-matches.webp", "cake-connect.webp", "candy-blocks.webp",
    "candy-forest.webp", "candy-land.webp", "candy-line.webp",
    "car-rush-2.webp", "car-speed-booster.webp", "car-traffic-racing.webp",
    "carnival-shooter.webp", "catch-dots.webp", "caveman-hunt.webp",
    "caveman-jumper.webp", "chameleon.webp", "charge-me.webp",
    "chase-racing-cars.webp", "cheesy-wars.webp", "christmas-balls.webp",
    "christmas-furious.webp", "christmas-gift.webp",
    "christmas-gravity-runner.webp", "christmas-panda-run.webp",
    "christmas-sweeper.webp", "circle-pong.webp", "circle-run.webp",
    "circle-rush.webp", "circuit-drifter.webp", "classic-car-racing.webp",
    "clever-frog.webp", "cliff-diving.webp", "color-bump-online.webp",
    "color-circle.webp", "color-tower.webp", "coloring-book.webp",
    "combat-penguin.webp", "combat-squad.webp", "connect-lines.webp",
    "cowboy-shoot-zombies.webp", "crazy-balls.webp", "crazy-driver.webp",
    "crazy-freekick.webp", "crazy-parking.webp", "crystal-ball-zuma.webp",
    "cube-jump.webp", "cyber-soldier.webp", "dangerous-rescue.webp",
    "dangerous.webp", "darts-pro.webp", "dash-man.webp", "desert-run.webp",
    "dino-jump.webp", "divide.webp", "dodge.webp", "don-t-crash.webp",
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
        const randomBack  = gameImages[Math.floor(Math.random() * gameImages.length)];
        cells.push({ id: i, frontImage: randomFront, backImage: randomBack });
      }
      setGridCells(cells);
    };

    calculateGrid();

    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(calculateGrid, 250);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimer);
    };
  }, []);

  // Random Flipping Animation
  useEffect(() => {
    if (gridCells.length === 0) return;

    const flipRandomCard = () => {
      const randomIndex = Math.floor(Math.random() * gridCells.length);
      setFlippedCells((prev) => {
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

  // Update mode based on route
  useEffect(() => {
    if (location.pathname === "/login") {
      setMode("login");
    } else if (location.pathname === "/register") {
      setMode("register");
    } else if (location.pathname === "/forgot-password") {
      setMode("forgot-password");
    }
  }, [location.pathname]);

  // Page load animation
  useEffect(() => {
    const timer = setTimeout(() => setPageLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // SEO: JSON-LD Schema for LoginPage/RegisterPage
  useEffect(() => {
    const getSchemaData = () => {
      if (mode === "login") {
        return {
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Login - 8JJ Games",
          "description": "Sign in to your 8JJ Games account to access your saved games, track achievements, and continue your gaming journey.",
          "url": "https://8jjgames.com/login",
          "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://8jjgames.com" },
              { "@type": "ListItem", "position": 2, "name": "Login", "item": "https://8jjgames.com/login" },
            ],
          },
          "potentialAction": {
            "@type": "LoginAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": "https://8jjgames.com/login",
              "actionPlatform": [
                "http://schema.org/DesktopWebPlatform",
                "http://schema.org/MobileWebPlatform",
              ],
            },
          },
        };
      } else if (mode === "register") {
        return {
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Create Account - 8JJ Games",
          "description": "Join 8JJ Games today! Create a free account to save your favorite games, track progress, and unlock achievements.",
          "url": "https://8jjgames.com/register",
          "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home",     "item": "https://8jjgames.com" },
              { "@type": "ListItem", "position": 2, "name": "Sign Up",  "item": "https://8jjgames.com/register" },
            ],
          },
          "potentialAction": {
            "@type": "RegisterAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": "https://8jjgames.com/register",
              "actionPlatform": [
                "http://schema.org/DesktopWebPlatform",
                "http://schema.org/MobileWebPlatform",
              ],
            },
          },
        };
      } else if (mode === "forgot-password") {
        return {
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Reset Password - 8JJ Games",
          "description": "Forgot your password? Reset your 8JJ Games account password to regain access to your games and progress.",
          "url": "https://8jjgames.com/forgot-password",
          "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home",           "item": "https://8jjgames.com" },
              { "@type": "ListItem", "position": 2, "name": "Reset Password", "item": "https://8jjgames.com/forgot-password" },
            ],
          },
        };
      }
      return null;
    };

    const schemaData = getSchemaData();
    if (!schemaData) return;

    const existing = document.getElementById("auth-schema");
    if (existing) document.head.removeChild(existing);

    const schemaScript = document.createElement("script");
    schemaScript.type = "application/ld+json";
    schemaScript.text = JSON.stringify(schemaData);
    schemaScript.id = "auth-schema";
    document.head.appendChild(schemaScript);

    return () => {
      const s = document.getElementById("auth-schema");
      if (s) document.head.removeChild(s);
    };
  }, [mode]);

  // Handle mode switching with transition
  const handleSwitchMode = (newMode) => {
    if (newMode === mode || isTransitioning) return;
    setIsTransitioning(true);
    if (newMode === "login")            navigate("/login");
    else if (newMode === "register")    navigate("/register");
    else if (newMode === "forgot-password") navigate("/forgot-password");
    setTimeout(() => {
      setMode(newMode);
      setIsTransitioning(false);
    }, 800);
  };

  const switchToLogin          = () => handleSwitchMode("login");
  const switchToRegister       = () => handleSwitchMode("register");
  const switchToForgotPassword = () => handleSwitchMode("forgot-password");

  // SEO: Get dynamic meta content based on mode
  const getSEOContent = () => {
    switch (mode) {
      case "login":
        return {
          title: "Login - 8JJ Games",
          description: "Sign in to your 8JJ Games account to access your saved games, track achievements, and continue your gaming journey.",
          keywords: generateKeywords("pages", "login"),
          url: "/login",
        };
      case "register":
        return {
          title: "Sign Up - Create Your Account | 8JJ Games",
          description: "Join 8JJ Games today! Create a free account to save your favorite games, track progress, unlock achievements, and join our gaming community.",
          keywords: generateKeywords("pages", "register"),
          url: "/register",
        };
      case "forgot-password":
        return {
          title: "Reset Password - 8JJ Games",
          description: "Forgot your password? Reset your 8JJ Games account password to regain access to your games and progress.",
          keywords: generateKeywords("pages", "forgot-password"),
          url: "/forgot-password",
        };
      default:
        return {
          title: "Login - 8JJ Games",
          description: "Access your 8JJ Games account",
          keywords: generateKeywords("pages", "login"),
          url: "/login",
        };
    }
  };

  const seoContent = getSEOContent();

  return (
    <>
      {/* SEO: Dynamic Meta Tags */}
      <SEO
        title={seoContent.title}
        description={seoContent.description}
        keywords={seoContent.keywords}
        url={seoContent.url}
        type="website"
      />

      <main className={`auth-page ${pageLoaded ? "loaded" : ""}`} role="main">

        {/* ── Flipping Grid Background ── */}
        <div className="flipping-grid" aria-hidden="true">
          {gridCells.map((cell) => (
            <div
              key={cell.id}
              className={`flip-box ${flippedCells.has(cell.id) ? "flipped" : ""}`}
            >
              <div className="flip-box-inner">
                {/* Front face — R2 CDN webp */}
                <div
                  className="flip-box-front"
                  style={{
                    backgroundImage: `url(${getThumbUrl(cell.frontImage)})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                {/* Back face — R2 CDN webp */}
                <div
                  className="flip-box-back"
                  style={{
                    backgroundImage: `url(${getThumbUrl(cell.backImage)})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* ── Main Content Container ── */}
        <div className={`auth-container ${isTransitioning ? "transitioning" : ""}`}>

          {/* Left Side - Hero Section (60%) */}
          <div className="auth-hero-section">
            <HeroContent mode={mode} />
          </div>

          {/* Right Side - Form Section (40%) */}
          <div className="auth-form-section">
            <div className="form-carousel">

              {/* Login Form */}
              <div
                className={`form-panel ${
                  mode === "login" ? "active" : "inactive-left"
                } ${isTransitioning && (mode === "register" || mode === "forgot-password") ? "exit-left" : ""}`}
              >
                <LoginForm
                  onSwitchToRegister={switchToRegister}
                  onSwitchToForgotPassword={switchToForgotPassword}
                />
              </div>

              {/* Register Form */}
              <div
                className={`form-panel ${
                  mode === "register" ? "active" : "inactive-right"
                } ${isTransitioning && mode === "login" ? "exit-right" : ""}`}
              >
                <RegisterForm onSwitchToLogin={switchToLogin} />
              </div>

              {/* Forgot Password Form */}
              <div
                className={`form-panel ${
                  mode === "forgot-password" ? "active" : "inactive-right"
                } ${isTransitioning && mode === "login" ? "exit-right" : ""}`}
              >
                <ForgotPasswordForm onSwitchToLogin={switchToLogin} />
              </div>

            </div>
          </div>

        </div>

        {/* SEO: Hidden content for search engines */}
        <div className="sr-only">
          {mode === "login" && (
            <>
              <h2>Login to 8JJ Games</h2>
              <p>
                Access your personal gaming account on 8JJ Games. Sign in to view your game collection,
                track your achievements, save your progress, and continue your gaming journey. Your account
                gives you access to thousands of free online games across all categories.
              </p>
            </>
          )}
          {mode === "register" && (
            <>
              <h2>Create Your 8JJ Games Account</h2>
              <p>
                Join the 8JJ Games community today! Creating an account is free and gives you access to
                exclusive features: save your favorite games, track your progress and achievements,
                compete on leaderboards, and get personalized game recommendations. Start building your
                gaming profile now.
              </p>
            </>
          )}
          {mode === "forgot-password" && (
            <>
              <h2>Reset Your Password</h2>
              <p>
                Forgot your 8JJ Games password? No problem! Enter your email address and we'll send you
                a secure link to reset your password and regain access to your account, saved games,
                and achievements.
              </p>
            </>
          )}
        </div>

      </main>
    </>
  );
}