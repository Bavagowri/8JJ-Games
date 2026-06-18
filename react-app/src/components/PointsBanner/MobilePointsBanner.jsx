// react-app/src/components/PointsBanner/MobilePointsBanner.jsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn, UserPlus, X, Coins } from "lucide-react";
import "./MobilePointsBanner.css";


export default function MobilePointsBanner({ slug }) {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    // Reset on every game change
    setExiting(false);
    setVisible(false);

    // Only for anonymous users
    const token = localStorage.getItem("token");
    if (token) return;

    // Per-game dismiss key
    const dismissKey = `pointsBannerDismissed_${slug}`;
    if (sessionStorage.getItem(dismissKey)) return;

    setVisible(true);
  }, [slug]);

  const handleDismiss = () => {
    setExiting(true);
    sessionStorage.setItem(`pointsBannerDismissed_${slug}`, "true");
    setTimeout(() => setVisible(false), 320);
  };

  if (!visible) return null;

  return (
    <div
      className={`mobile-pts-banner${exiting ? " mobile-pts-banner--exit" : ""}`}
      role="banner"
      aria-label="Earn points by logging in"
    >
      {/* Top accent line */}
      <div className="mobile-pts-banner__accent" aria-hidden="true" />

      {/* Main row */}
      <div className="mobile-pts-banner__body">

        {/* Coin icon */}
        <div className="mobile-pts-banner__coin" aria-hidden="true">
            <img
            className="brand-logo"
            src="/8JJ_games.png"
            alt="8JJ Games logo - Free online games"
            title="8JJ Games Home"
          />
        </div>

        {/* Text */}
        <div className="mobile-pts-banner__text">
          <span className="mobile-pts-banner__headline">
            🎮 Earn Points While You Play!
          </span>
          <span className="mobile-pts-banner__sub">
            <strong>+10</strong> play &middot; <strong>+50</strong> share &middot; <strong>+20</strong> comment
          </span>
        </div>

        {/* Dismiss */}
        <button
          className="mobile-pts-banner__dismiss"
          onClick={handleDismiss}
          aria-label="Dismiss banner"
        >
          <X size={16} />
        </button>
      </div>

      {/* CTA row */}
      <div className="mobile-pts-banner__ctas">
        <button
          className="mobile-pts-banner__btn mobile-pts-banner__btn--login"
          onClick={() => navigate("/login")}
          aria-label="Log in to earn points"
        >
          <LogIn size={15} />
          Log In
        </button>

        <button
          className="mobile-pts-banner__btn mobile-pts-banner__btn--register"
          onClick={() => navigate("/register")}
          aria-label="Register free to earn points"
        >
          <UserPlus size={15} />
          Register Free
        </button>

        {/* Reward pills */}
        <div className="mobile-pts-banner__pills" aria-hidden="true">
          <span className="mobile-pts-banner__pill">+10</span>
          <span className="mobile-pts-banner__pill">+50</span>
        </div>
      </div>
    </div>
  );
}