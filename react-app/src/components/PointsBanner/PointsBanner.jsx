// react-app/src/components/PointsBanner/PointsBanner.jsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./PointsBanner.css";


export default function PointsBanner({ slug }) {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    // Reset visibility state whenever the game changes
    setExiting(false);
    setVisible(false);

    // Only show for anonymous users
    const token = localStorage.getItem("token");
    if (token) return;

    // Per-game dismiss key — dismissing on Game A won't hide it on Game B
    const dismissKey = `pointsBannerDismissed_${slug}`;
    const dismissed = sessionStorage.getItem(dismissKey);
    if (dismissed) return;

    setVisible(true);
  }, [slug]); // re-runs every time the user navigates to a new game

  const handleDismiss = () => {
    setExiting(true);
    // Save dismiss only for this specific game
    const dismissKey = `pointsBannerDismissed_${slug}`;
    sessionStorage.setItem(dismissKey, "true");
    // Wait for exit animation before unmounting
    setTimeout(() => setVisible(false), 350);
  };

  if (!visible) return null;

  return (
    <div
      className={`points-banner${exiting ? " points-banner--exit" : ""}`}
      role="banner"
      aria-label="Earn points by logging in"
    >
      {/* Left — icon + message */}
      <div className="points-banner__left">
        <div className="points-banner__coin" aria-hidden="true">
          <img
            className="brand-logo"
            src="/8JJ_games.png"
            alt="8JJ Games logo - Free online games"
            title="8JJ Games Home"
          />
        </div>
        <div className="points-banner__text">
          <span className="points-banner__headline">🎮 Earn Points While You Play!</span>
          <span className="points-banner__sub">
            Log in or register — earn{" "}
            <strong>+10 pts</strong> per play &middot;{" "}
            <strong>+50 pts</strong> for sharing &middot;{" "}
            <strong>+20 pts</strong> per comment
          </span>
        </div>
      </div>

      {/* Right — CTAs + dismiss */}
      <div className="points-banner__right">
        <button
          className="points-banner__btn points-banner__btn--login"
          onClick={() => navigate("/login")}
          aria-label="Log in to earn points"
        >
          Log In
        </button>

        <button
          className="points-banner__btn points-banner__btn--register"
          onClick={() => navigate("/register")}
          aria-label="Register a free account to earn points"
        >
          Register Free
        </button>

        <button
          className="points-banner__dismiss"
          onClick={handleDismiss}
          aria-label="Dismiss this banner"
        >
          ✕
        </button>
      </div>
    </div>
  );
}