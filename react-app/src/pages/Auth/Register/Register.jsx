import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './Register.css'

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: [],
    label: "",
    color: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  const [gridCells, setGridCells] = useState([]);
  const [flippedCells, setFlippedCells] = useState(new Set());

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

  // Password strength calculator
  const calculatePasswordStrength = (password) => {
    if (!password) {
      return { score: 0, feedback: [], label: "", color: "" };
    }

    let score = 0;
    const feedback = [];

    // Length check
    if (password.length >= 8) {
      score += 1;
      feedback.push({ text: "8+ characters", met: true });
    } else {
      feedback.push({ text: "8+ characters", met: false });
    }

    // Uppercase check
    if (/[A-Z]/.test(password)) {
      score += 1;
      feedback.push({ text: "Uppercase letter", met: true });
    } else {
      feedback.push({ text: "Uppercase letter", met: false });
    }

    // Lowercase check
    if (/[a-z]/.test(password)) {
      score += 1;
      feedback.push({ text: "Lowercase letter", met: true });
    } else {
      feedback.push({ text: "Lowercase letter", met: false });
    }

    // Number check
    if (/[0-9]/.test(password)) {
      score += 1;
      feedback.push({ text: "Number", met: true });
    } else {
      feedback.push({ text: "Number", met: false });
    }

    // Special character check
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      score += 1;
      feedback.push({ text: "Special character", met: true });
    } else {
      feedback.push({ text: "Special character", met: false });
    }

    // Determine label and color
    let label = "";
    let color = "";
    if (score === 0) {
      label = "";
      color = "";
    } else if (score <= 2) {
      label = "Weak";
      color = "#ff4444";
    } else if (score === 3) {
      label = "Fair";
      color = "#ffa500";
    } else if (score === 4) {
      label = "Good";
      color = "#00d9ff";
    } else {
      label = "Strong";
      color = "#00ff88";
    }

    return { score, feedback, label, color };
  };

  // Validation functions
  const validateUsername = (username) => {
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!username) return "Username is required";
    if (!usernameRegex.test(username)) {
      return "Username must be 3-20 characters (letters, numbers, underscore only)";
    }
    return "";
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "Email is required";
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }
    return "";
  };

  const validatePassword = (password) => {
    if (!password) return "Password is required";
    if (password.length < 8) {
      return "Password must be at least 8 characters";
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter";
    }
    if (!/[0-9]/.test(password)) {
      return "Password must contain at least one number";
    }
    return "";
  };

  const validateConfirmPassword = (confirmPassword, password) => {
    if (!confirmPassword) return "Please confirm your password";
    if (confirmPassword !== password) {
      return "Passwords do not match";
    }
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors({ ...fieldErrors, [name]: "" });
    }

    // Calculate password strength in real-time
    if (name === "password") {
      setPasswordStrength(calculatePasswordStrength(value));
    }

    // Validate confirm password when password changes
    if (name === "password" && form.confirmPassword) {
      const confirmError = validateConfirmPassword(form.confirmPassword, value);
      setFieldErrors({ ...fieldErrors, confirmPassword: confirmError });
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    let error = "";

    switch (name) {
      case "username":
        error = validateUsername(value);
        break;
      case "email":
        error = validateEmail(value);
        break;
      case "password":
        error = validatePassword(value);
        break;
      case "confirmPassword":
        error = validateConfirmPassword(value, form.password);
        break;
      default:
        break;
    }

    setFieldErrors({ ...fieldErrors, [name]: error });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate all fields
    const errors = {
      username: validateUsername(form.username),
      email: validateEmail(form.email),
      password: validatePassword(form.password),
      confirmPassword: validateConfirmPassword(form.confirmPassword, form.password),
    };

    setFieldErrors(errors);

    // Check if there are any errors
    if (Object.values(errors).some(error => error !== "")) {
      setError("Please fix the errors above");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("http://localhost:5050/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.username,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const openTermsModal = (e) => {
    e.preventDefault();
    setShowTermsModal(true);
  };

  const closeTermsModal = () => {
    setShowTermsModal(false);
  };

  return (
    <div className="MainRegisterWrapper">
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

      {/* Terms & Conditions Modal */}
      {showTermsModal && (
        <div className="modal-overlay" onClick={closeTermsModal}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Terms & Conditions</h2>
              <button className="modal-close" onClick={closeTermsModal}>✕</button>
            </div>
            
            <div className="modal-content">
              <div className="terms-section">
                <h3 className="terms-heading">1. Acceptance of Terms</h3>
                <p className="terms-text">
                  By accessing and using 8JJ Games, you accept and agree to be bound by the terms and 
                  provision of this agreement. If you do not agree to these terms, please do not use our service.
                </p>
              </div>

              <div className="terms-section">
                <h3 className="terms-heading">2. User Account</h3>
                <p className="terms-text">
                  You are responsible for maintaining the confidentiality of your account and password. 
                  You agree to accept responsibility for all activities that occur under your account.
                </p>
              </div>

              <div className="terms-section">
                <h3 className="terms-heading">3. Privacy Policy</h3>
                <p className="terms-text">
                  We respect your privacy and are committed to protecting your personal data. We collect 
                  only necessary information to provide you with the best gaming experience.
                </p>
              </div>

              <div className="terms-section">
                <h3 className="terms-heading">4. User Conduct</h3>
                <p className="terms-text">
                  You agree not to use the service for any unlawful purpose or in any way that might harm, 
                  damage, or disparage any other party. Harassment, abuse, or cheating is strictly prohibited.
                </p>
              </div>

              <div className="terms-section">
                <h3 className="terms-heading">5. Intellectual Property</h3>
                <p className="terms-text">
                  All content on 8JJ Games, including games, graphics, logos, and text, is the property of 
                  8JJ Games or its content suppliers and is protected by copyright laws.
                </p>
              </div>

              <div className="terms-section">
                <h3 className="terms-heading">6. Game Access</h3>
                <p className="terms-text">
                  We provide access to thousands of free games. We reserve the right to modify, suspend, 
                  or discontinue any game or service at any time without notice.
                </p>
              </div>

              <div className="terms-section">
                <h3 className="terms-heading">7. Limitation of Liability</h3>
                <p className="terms-text">
                  8JJ Games shall not be liable for any indirect, incidental, special, consequential, or 
                  punitive damages resulting from your use of or inability to use the service.
                </p>
              </div>

              <div className="terms-section">
                <h3 className="terms-heading">8. Changes to Terms</h3>
                <p className="terms-text">
                  We reserve the right to modify these terms at any time. Continued use of the service 
                  after changes constitutes acceptance of the modified terms.
                </p>
              </div>

              <div className="terms-section">
                <h3 className="terms-heading">9. Contact Information</h3>
                <p className="terms-text">
                  If you have any questions about these Terms & Conditions, please contact us at 
                  support@8jjgames.com
                </p>
              </div>
            </div>

            <div className="modal-footer">
              <button className="modal-accept-btn" onClick={closeTermsModal}>
                I Understand
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="auth-page">
        {/* Left Side - Hero Section (60%) */}
        <div className="hero-section">
          <div className="hero-content">
            <div className="logo-container">
              <div className="logo-icon-auth">
                <img
                  className="logo-icon-auth-image"
                  src="/8JJ_games.png"
                  alt="8JJ Games logo - Free online games"
                  title="8JJ Games Home"
                />
              </div>
            </div>

            <h1 className="hero-title">
              Start Your Gaming
              <br />
              <span className="hero-highlight">Adventure Today</span>
            </h1>

            <p className="hero-description">
              Join thousands of players and dive into 9000+ free games. 
              No downloads, no waiting – just pure gaming fun!
            </p>

            <div className="features">
              <div className="feature">
                <span className="feature-icon">⚡</span>
                <span className="feature-text">Instant Play</span>
              </div>
              <div className="feature">
                <span className="feature-icon">🎮</span>
                <span className="feature-text">9000+ Games</span>
              </div>
              <div className="feature">
                <span className="feature-icon">📱</span>
                <span className="feature-text">No Downloads</span>
              </div>
            </div>

            <div className="floating-icon floating-icon-1">🎯</div>
            <div className="floating-icon floating-icon-2">🎲</div>
            <div className="floating-icon floating-icon-3">🏆</div>
            <div className="floating-icon floating-icon-4">⚽</div>
          </div>
        </div>

        {/* Right Side - Register Form (40%) */}
        <div className="form-section">
          <div className="form-container">
            <h2 className="form-title">Create Account</h2>
            <p className="form-subtitle">Sign up to unlock your gaming experience</p>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="input-group">
                <label className="label">Username</label>
                <input
                  name="username"
                  type="text"
                  placeholder="Choose a username"
                  value={form.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`input ${fieldErrors.username ? 'input-error' : ''}`}
                  required
                />
                {fieldErrors.username && (
                  <span className="field-error">{fieldErrors.username}</span>
                )}
              </div>

              <div className="input-group">
                <label className="label">Email</label>
                <input
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`input ${fieldErrors.email ? 'input-error' : ''}`}
                  required
                />
                {fieldErrors.email && (
                  <span className="field-error">{fieldErrors.email}</span>
                )}
              </div>

              <div className="input-group">
                <label className="label">Password</label>
                <div className="password-input-wrapper">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={form.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`input ${fieldErrors.password ? 'input-error' : ''}`}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    )}
                  </button>
                </div>
                {fieldErrors.password && (
                  <span className="field-error">{fieldErrors.password}</span>
                )}
                
                {/* Password Strength Indicator */}
                {form.password && (
                  <div className="password-strength-container">
                    <div className="password-strength-bars">
                      {[1, 2, 3, 4, 5].map((bar) => (
                        <div
                          key={bar}
                          className={`strength-bar ${
                            bar <= passwordStrength.score ? 'active' : ''
                          }`}
                          style={{
                            backgroundColor: bar <= passwordStrength.score ? passwordStrength.color : 'rgba(255, 255, 255, 0.1)'
                          }}
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
                {form.password && (
                  <div className="password-requirements">
                    {passwordStrength.feedback.map((item, index) => (
                      <div key={index} className={`requirement-item ${item.met ? 'met' : ''}`}>
                        <span className="requirement-icon">{item.met ? '✓' : '○'}</span>
                        <span className="requirement-text">{item.text}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="input-group">
                <label className="label">Confirm Password</label>
                <div className="password-input-wrapper">
                  <input
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`input ${fieldErrors.confirmPassword ? 'input-error' : ''}`}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    )}
                  </button>
                </div>
                {fieldErrors.confirmPassword && (
                  <span className="field-error">{fieldErrors.confirmPassword}</span>
                )}
              </div>

              <label className="checkbox-label">
                <input type="checkbox" className="checkbox" required />
                <span className="checkbox-text">
                  I agree to the <a href="#" onClick={openTermsModal} className="terms-link">Terms & Conditions</a>
                </span>
              </label>

              <button type="submit" disabled={loading} className="submit-button">
                {loading ? "Creating Account..." : "Sign Up"}
              </button>

              <div className="divider">
                <span className="divider-line"></span>
                <span className="divider-text">OR</span>
                <span className="divider-line"></span>
              </div>

              <button type="button" className="google-button">
                <svg className="google-icon" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign Up with Google
              </button>
            </form>

            <p className="login-text">
              Already have an account?{" "}
              <a href="/login" className="login-link">Log in</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}