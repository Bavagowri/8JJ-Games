


// react-app/src/pages/Auth/AuthPage/ResetPassword.jsx - SEO OPTIMIZED

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { translate } from "../../../data/translations";
import { useLanguage } from "../../../context/LanguageContext";
import "./ResetPassword.css";

// SEO: Import SEO component
import SEO from "../../../components/SEO/SEO";
import { generateKeywords } from "../../../config/seoKeywords";

const API_BASE = import.meta.env.VITE_API_URL;
if (!API_BASE) {
  throw new Error("❌ VITE_API_URL is not defined");
}

export default function ResetPassword() {
  const { lang } = useLanguage();
  const token = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("token") : null;
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  // Flipping Grid State
  const [gridCells, setGridCells] = useState([]);
  const [flippedCells, setFlippedCells] = useState(new Set());

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

  // SEO: JSON-LD Schema Markup
  useEffect(() => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Reset Password - 8JJ Games",
      "description": "Create a new password for your 8JJ Games account. Secure password reset to regain access to your gaming profile.",
      "url": `https://8jjgames.com/reset-password${token ? `?token=${token}` : ''}`,
      "breadcrumb": {
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
            "name": "Reset Password",
            "item": "https://8jjgames.com/reset-password"
          }
        ]
      },
      "potentialAction": {
        "@type": "Action",
        "name": "Reset Password",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://8jjgames.com/reset-password",
          "actionPlatform": [
            "http://schema.org/DesktopWebPlatform",
            "http://schema.org/MobileWebPlatform"
          ]
        }
      }
    };

    const schemaScript = document.createElement('script');
    schemaScript.type = 'application/ld+json';
    schemaScript.text = JSON.stringify(schema);
    schemaScript.id = 'reset-password-schema';
    document.head.appendChild(schemaScript);

    return () => {
      const existingScript = document.getElementById('reset-password-schema');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, [token]);

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

  // Password strength calculator
  const calculatePasswordStrength = (password) => {
    if (!password) {
      return { score: 0, feedback: [], label: "", color: "" };
    }

    let score = 0;
    const feedback = [];

    if (password.length >= 8) {
      score += 1;
      feedback.push({ text: translate("passwordStrength8Chars", lang), met: true });
    } else {
      feedback.push({ text: translate("passwordStrength8Chars", lang), met: false });
    }

    if (/[A-Z]/.test(password)) {
      score += 1;
      feedback.push({ text: translate("passwordStrengthUppercase", lang), met: true });
    } else {
      feedback.push({ text: translate("passwordStrengthUppercase", lang), met: false });
    }

    if (/[a-z]/.test(password)) {
      score += 1;
      feedback.push({ text: translate("passwordStrengthLowercase", lang), met: true });
    } else {
      feedback.push({ text: translate("passwordStrengthLowercase", lang), met: false });
    }

    if (/[0-9]/.test(password)) {
      score += 1;
      feedback.push({ text: translate("passwordStrengthNumber", lang), met: true });
    } else {
      feedback.push({ text: translate("passwordStrengthNumber", lang), met: false });
    }

    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      score += 1;
      feedback.push({ text: translate("passwordStrengthSpecial", lang), met: true });
    } else {
      feedback.push({ text: translate("passwordStrengthSpecial", lang), met: false });
    }

    let label = "";
    let color = "";
    if (score === 0) {
      label = "";
      color = "";
    } else if (score <= 2) {
      label = translate("passwordStrengthWeak", lang);
      color = "#ff4444";
    } else if (score === 3) {
      label = translate("passwordStrengthFair", lang);
      color = "#ffa500";
    } else if (score === 4) {
      label = translate("passwordStrengthGood", lang);
      color = "#00d9ff";
    } else {
      label = translate("passwordStrengthStrong", lang);
      color = "#00ff88";
    }

    return { score, feedback, label, color };
  };

  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: [],
    label: "",
    color: ""
  });

  const validatePassword = (password) => {
    if (!password) return translate("errPasswordRequired", lang);
    if (password.length < 8) {
      return translate("errPasswordLength", lang);
    }
    if (!/[A-Z]/.test(password)) {
      return translate("errPasswordUppercase", lang);
    }
    if (!/[a-z]/.test(password)) {
      return translate("errPasswordLowercase", lang);
    }
    if (!/[0-9]/.test(password)) {
      return translate("errPasswordNumber", lang);
    }
    return "";
  };

  const validateConfirmPassword = (confirmPassword, password) => {
    if (!confirmPassword) return translate("errConfirmPasswordRequired", lang);
    if (confirmPassword !== password) {
      return translate("errPasswordsDoNotMatch", lang);
    }
    return "";
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordStrength(calculatePasswordStrength(newPassword));
    
    if (fieldErrors.password) {
      setFieldErrors({ ...fieldErrors, password: "" });
    }
    
    if (confirmPassword) {
      const confirmError = validateConfirmPassword(confirmPassword, newPassword);
      setFieldErrors({ ...fieldErrors, confirmPassword: confirmError });
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);
    
    if (fieldErrors.confirmPassword) {
      setFieldErrors({ ...fieldErrors, confirmPassword: "" });
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    let error = "";

    if (name === "password") {
      error = validatePassword(value);
    } else if (name === "confirmPassword") {
      error = validateConfirmPassword(value, password);
    }

    setFieldErrors({ ...fieldErrors, [name]: error });
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const errors = {
      password: validatePassword(password),
      confirmPassword: validateConfirmPassword(confirmPassword, password),
    };

    setFieldErrors(errors);

    if (Object.values(errors).some(err => err !== "")) {
      setError(translate("errFixErrors", lang));
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password })
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || translate("errResetFailed", lang));
      }

      setSuccess(translate("successPasswordUpdated", lang));
      setPassword("");
      setConfirmPassword("");
      setPasswordStrength({ score: 0, feedback: [], label: "", color: "" });
      
      setTimeout(() => {
        window.location.href = "/login";
      }, 3000);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* SEO: Enhanced Meta Tags */}
      <SEO
        title="Reset Your Password | 8JJ Games"
        description="Create a new password for your 8JJ Games account. Secure password reset to regain access to your saved games, achievements, and gaming profile."
        keywords={generateKeywords('pages', 'reset-password')}
        url="/reset-password"
        type="website"
      />

      <main className="reset-password-page" role="main">
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

        {/* Animated Background */}
        <div className="reset-background" aria-hidden="true">
          <div className="gradient-overlay-reset OVERLAYY"></div>
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
        </div>

        {/* SEO: Breadcrumb Navigation */}
        <nav className="sr-only" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span> / </span>
          <span>Reset Password</span>
        </nav>

        {/* Main Content */}
        <div className="reset-container">
          <article className="reset-card">
            {/* Icon & Header */}
            <header className="reset-header">
              <div className="reset-icon-wrapper" aria-hidden="true">
                <svg className="reset-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
              <h1 className="reset-title">{translate("resetPasswordTitle", lang)}</h1>
              <p className="reset-subtitle">{translate("resetPasswordSubtitle", lang)}</p>
            </header>

            {/* Messages */}
            {error && (
              <div className="message-box error-message" role="alert" aria-live="assertive">
                <svg className="message-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="message-box success-message" role="status" aria-live="polite">
                <svg className="message-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <span>{success}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={submit} className="reset-form" noValidate>
              {/* Password Field */}
              <div className="input-group">
                <label htmlFor="password" className="input-label">
                  {translate("newPasswordLabel", lang)}
                </label>
                <div className="password-input-wrapper">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={translate("newPasswordPlaceholder", lang)}
                    value={password}
                    onChange={handlePasswordChange}
                    onBlur={handleBlur}
                    className={`reset-input ${fieldErrors.password ? 'input-error' : ''}`}
                    required
                    aria-required="true"
                    aria-invalid={!!fieldErrors.password}
                    aria-describedby={fieldErrors.password ? "password-error" : password ? "password-strength" : undefined}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={translate("togglePasswordVisibility", lang)}
                  >
                    {showPassword ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    )}
                  </button>
                </div>
                {fieldErrors.password && (
                  <span id="password-error" className="field-error" role="alert">
                    {fieldErrors.password}
                  </span>
                )}

                {/* Password Strength Indicator */}
                {password && (
                  <div id="password-strength" className="password-strength-container" aria-live="polite">
                    <div className="password-strength-bars" role="progressbar" aria-valuenow={passwordStrength.score} aria-valuemin="0" aria-valuemax="5">
                      {[1, 2, 3, 4, 5].map((bar) => (
                        <div
                          key={bar}
                          className={`strength-bar ${bar <= passwordStrength.score ? 'active' : ''}`}
                          style={{
                            backgroundColor: bar <= passwordStrength.score ? passwordStrength.color : 'rgba(255, 255, 255, 0.1)'
                          }}
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                    {passwordStrength.label && (
                      <span
                        className="password-strength-label"
                        style={{ color: passwordStrength.color }}
                      >
                        {passwordStrength.label}
                      </span>
                    )}
                  </div>
                )}

                {/* Password Requirements */}
                {password && (
                  <div className="password-requirements" role="list" aria-label="Password requirements">
                    {passwordStrength.feedback.map((item, index) => (
                      <div key={index} className={`requirement-item ${item.met ? 'met' : ''}`} role="listitem">
                        <span className="requirement-icon" aria-hidden="true">{item.met ? '✓' : '○'}</span>
                        <span className="requirement-text">{item.text}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="input-group">
                <label htmlFor="confirmPassword" className="input-label">
                  {translate("confirmPasswordLabel", lang)}
                </label>
                <div className="password-input-wrapper">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder={translate("confirmPasswordPlaceholder", lang)}
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    onBlur={handleBlur}
                    className={`reset-input ${fieldErrors.confirmPassword ? 'input-error' : ''}`}
                    required
                    aria-required="true"
                    aria-invalid={!!fieldErrors.confirmPassword}
                    aria-describedby={fieldErrors.confirmPassword ? "confirm-password-error" : undefined}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={translate("toggleConfirmPasswordVisibility", lang)}
                  >
                    {showConfirmPassword ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    )}
                  </button>
                </div>
                {fieldErrors.confirmPassword && (
                  <span id="confirm-password-error" className="field-error" role="alert">
                    {fieldErrors.confirmPassword}
                  </span>
                )}
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={loading || success} 
                className="reset-submit-btn"
                aria-busy={loading}
              >
                {loading ? (
                  <>
                    <span className="button-spinner" aria-hidden="true"></span>
                    <span>{translate("resettingPasswordBtn", lang)}</span>
                  </>
                ) : success ? (
                  <>
                    <span>{translate("passwordResetBtn", lang)}</span>
                  </>
                ) : (
                  <>
                    <span>{translate("resetPasswordBtn", lang)}</span>
                  </>
                )}
              </button>

              {/* Back to Login */}
              <Link to="/login" className="back-to-login">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <line x1="19" y1="12" x2="5" y2="12"></line>
                  <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
                <span>{translate("backToLoginBtn", lang)}</span>
              </Link>
            </form>
          </article>
        </div>

        {/* SEO: Hidden content for search engines */}
        <div className="sr-only">
          <h2>Password Reset Security</h2>
          <p>
            Reset your 8JJ Games account password securely. Our password reset process uses encrypted tokens 
            to ensure your account remains safe. Create a strong password with at least 8 characters, including 
            uppercase letters, lowercase letters, numbers, and special characters. Once reset, you'll regain 
            full access to your saved games, achievements, and gaming profile.
          </p>
          <p>
            Password security tips: Use a unique password for your gaming account, never share your password, 
            enable two-factor authentication if available, and update your password regularly to keep your 
            account secure.
          </p>
        </div>
      </main>
    </>
  );
}