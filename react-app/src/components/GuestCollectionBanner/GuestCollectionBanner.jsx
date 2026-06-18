// react-app/src/components/GuestCollectionBanner/GuestCollectionBanner.jsx
// Shown on My Collection page for logged-out users — Desktop version

import { useNavigate } from "react-router-dom";
import "./GuestCollectionBanner.css";

const EARN_ITEMS = [
  { icon: "🎮", pts: "+10", label: "Play a Game" },
  { icon: "🏏", pts: "+50", label: "Win Prediction" },
  { icon: "📚", pts: "+5",  label: "Save to Collection" },
  { icon: "🔗", pts: "+50", label: "Share Collection" },
  { icon: "📅", pts: "+15", label: "Daily Login" },
  { icon: "🔥", pts: "×2",  label: "7-Day Streak" },
];

export default function GuestCollectionBanner() {
  const navigate = useNavigate();

  return (
    <div className="gcb-root">
      {/* ── Ambient orbs ── */}
      <div className="gcb-orb gcb-orb--cyan"  aria-hidden="true" />
      <div className="gcb-orb gcb-orb--gold"  aria-hidden="true" />
      <div className="gcb-orb gcb-orb--green" aria-hidden="true" />

      {/* ── Grid noise texture ── */}
      <div className="gcb-grid" aria-hidden="true" />

      {/* ── Spinning conic border ── */}
      <div className="gcb-border-spin" aria-hidden="true" />

      <div className="gcb-inner">

        {/* ── LEFT: Hero copy ── */}
        <div className="gcb-hero">
          <div className="gcb-badge">
            <span className="gcb-badge-dot" />
            UNLOCK YOUR COLLECTION
          </div>

          <h2 className="gcb-title">
            Play. Predict.<br />
            <span className="gcb-title-accent">Earn Points.</span>
          </h2>

          <p className="gcb-desc">
            Sign in to save your favourite games, make match predictions
            and climb the leaderboard. Every action earns you points.
          </p>

          <div className="gcb-ctas">
            <button
              className="gcb-btn-primary"
              onClick={() => navigate("/login")}
            >
              Sign In &amp; Start Earning
            </button>
            <button
              className="gcb-btn-ghost"
              onClick={() => navigate("/register")}
            >
              Create Account
            </button>
          </div>

          {/* Social proof */}
          <div className="gcb-social-proof">
            <div className="gcb-avatars">
              {["C","P","S","A"].map((l, i) => (
                <div key={i} className="gcb-avatar" style={{ zIndex: 4 - i }}>
                  {l}
                </div>
              ))}
            </div>
            <span className="gcb-proof-text">
              <strong>2,400+</strong> players earning points this week
            </span>
          </div>
        </div>

        {/* ── DIVIDER ── */}
        <div className="gcb-divider" aria-hidden="true" />

        {/* ── RIGHT: Earn grid ── */}
        <div className="gcb-earn-panel">
          <div className="gcb-earn-header">
            <span className="gcb-earn-label">HOW TO EARN</span>
            <span className="gcb-earn-live">
              <span className="gcb-live-dot" /> LIVE
            </span>
          </div>

          <div className="gcb-earn-grid">
            {EARN_ITEMS.map((item, i) => (
              <div key={i} className="gcb-earn-chip" style={{ animationDelay: `${i * 0.08}s` }}>
                <span className="gcb-earn-icon">{item.icon}</span>
                <span className="gcb-earn-pts">{item.pts}</span>
                <span className="gcb-earn-lbl">{item.label}</span>
              </div>
            ))}
          </div>

          {/* Prediction teaser */}
          <div className="gcb-prediction-strip">
            <div className="gcb-pred-left">
              <span className="gcb-pred-icon">🏆</span>
              <div>
                <div className="gcb-pred-title">Predictions Arena</div>
                <div className="gcb-pred-sub">Pick winners · Earn big points</div>
              </div>
            </div>
            <div className="gcb-pred-right">
              <span className="gcb-pred-pts">+Points</span>
              <span className="gcb-pred-pts-label">per win</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}