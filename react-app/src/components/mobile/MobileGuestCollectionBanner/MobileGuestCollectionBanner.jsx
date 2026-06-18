// react-app/src/components/mobile/MobileGuestCollectionBanner/MobileGuestCollectionBanner.jsx
// Shown on Mobile My Collection page for logged-out users

import { useNavigate } from "react-router-dom";
import "./MobileGuestCollectionBanner.css";

const EARN_ITEMS = [
  { icon: "🎮", pts: "+10", label: "Play" },
  { icon: "🏏", pts: "+50", label: "Predict" },
  { icon: "📚", pts: "+5",  label: "Save" },
  { icon: "🔥", pts: "×2",  label: "Streak" },
  { icon: "📅", pts: "+15", label: "Daily" },
  { icon: "🔗", pts: "+50", label: "Share" },
];

export default function MobileGuestCollectionBanner() {
  const navigate = useNavigate();

  return (
    <div className="mgcb-root">
      {/* ── Ambient background ── */}
      <div className="mgcb-orb mgcb-orb--cyan"  aria-hidden="true" />
      <div className="mgcb-orb mgcb-orb--gold"  aria-hidden="true" />
      <div className="mgcb-grid"                aria-hidden="true" />
      <div className="mgcb-border-spin"         aria-hidden="true" />

      <div className="mgcb-inner">

        {/* ── TOP: Icon + Badge ── */}
        <div className="mgcb-top">
          <div className="mgcb-icon-wrap">
            <span className="mgcb-icon">🏆</span>
            <div className="mgcb-icon-ring" />
          </div>

          <div className="mgcb-badge">
            <span className="mgcb-badge-dot" />
            MEMBERS ONLY
          </div>
        </div>

        {/* ── HEADLINE ── */}
        <h2 className="mgcb-title">
          Play. Predict.<br />
          <span className="mgcb-title-accent">Earn Points.</span>
        </h2>

        <p className="mgcb-desc">
          Sign in to save games, make predictions &amp; climb the leaderboard.
        </p>

        {/* ── EARN CHIPS ── */}
        <div className="mgcb-earn-row">
          {EARN_ITEMS.map((item, i) => (
            <div key={i} className="mgcb-earn-chip" style={{ animationDelay: `${i * 0.07}s` }}>
              <span className="mgcb-earn-icon">{item.icon}</span>
              <span className="mgcb-earn-pts">{item.pts}</span>
              <span className="mgcb-earn-lbl">{item.label}</span>
            </div>
          ))}
        </div>

        {/* ── PREDICTION STRIP ── */}
        <div className="mgcb-pred-strip">
          <div className="mgcb-pred-left">
            <span className="mgcb-pred-icon">🏏</span>
            <div>
              <div className="mgcb-pred-title">Predictions Arena</div>
              <div className="mgcb-pred-sub">Pick winners · Earn big points</div>
            </div>
          </div>
          <div className="mgcb-pred-pts-group">
            <span className="mgcb-pred-pts">+Points</span>
            <span className="mgcb-pred-pts-label">per win</span>
          </div>
        </div>

        {/* ── CTA BUTTONS ── */}
        <div className="mgcb-ctas">
          <button
            className="mobile-auth-button"
            onClick={() => navigate("/login")}
          >
            Sign In &amp; Earn Points
          </button>
          <button
            className="mgcb-btn-ghost"
            onClick={() => navigate("/register")}
          >
            Create Free Account
          </button>
        </div>

        {/* ── Social proof ── */}
        <div className="mgcb-social-proof">
          <div className="mgcb-avatars">
            {["C","P","S","A"].map((l, i) => (
              <div key={i} className="mgcb-avatar" style={{ zIndex: 4 - i }}>{l}</div>
            ))}
          </div>
          <span className="mgcb-proof-text">
            <strong>2,400+</strong> players earning now
          </span>
        </div>

      </div>
    </div>
  );
}