// react-app/src/components/GameOverModal/GameOverModal.jsx


import { useState, useEffect } from "react";
import "./GameOverModal.css";

// Confetti dot config
const CONFETTI = [
  { color: "#ffd700", top: 18,  left: 14,  delay: 0    },
  { color: "#00d4ff", top: 28,  left: 80,  delay: 0.45 },
  { color: "#00e676", top: 70,  left: 20,  delay: 0.9  },
  { color: "#818cf8", top: 58,  left: 78,  delay: 1.3  },
  { color: "#ffd700", top: 82,  left: 52,  delay: 0.65 },
  { color: "#ff6b35", top: 12,  left: 60,  delay: 1.0  },
  { color: "#00d4ff", top: 42,  left: 8,   delay: 1.6  },
  { color: "#00e676", top: 48,  left: 92,  delay: 0.2  },
];

export default function GameOverModal({
  open,
  onClose,
  onPlayAgain,
  onShare,
  gameTitle   = "this game",
  breakdown   = { play: 10, timeBonus: 0, streakBonus: 0 },
  multiplier  = 1,
}) {
  const [closing, setClosing]       = useState(false);
  const [revealed, setRevealed]     = useState(false);
  const [countedTotal, setCountedTotal] = useState(0);

  const rawTotal   = (breakdown.play || 0) + (breakdown.timeBonus || 0) + (breakdown.streakBonus || 0);
  const finalTotal = Math.round(rawTotal * multiplier);

  // Staggered number count-up when modal opens
  useEffect(() => {
    if (!open) { setRevealed(false); setCountedTotal(0); return; }

    setClosing(false);
    // slight delay so the card animation settles first
    const revealTimer = setTimeout(() => setRevealed(true), 300);

    // count-up for the total
    let start = 0;
    const step = Math.max(1, Math.ceil(finalTotal / 28));
    const countTimer = setInterval(() => {
      start += step;
      if (start >= finalTotal) { setCountedTotal(finalTotal); clearInterval(countTimer); }
      else setCountedTotal(start);
    }, 40);

    return () => { clearTimeout(revealTimer); clearInterval(countTimer); };
  }, [open, finalTotal]);

  const triggerClose = () => {
    setClosing(true);
    setTimeout(() => { setClosing(false); onClose?.(); }, 380);
  };
  const handlePlayAgain = () => { triggerClose(); setTimeout(() => onPlayAgain?.(), 400); };
  const handleShare     = () => { triggerClose(); setTimeout(() => onShare?.(), 400); };

  if (!open) return null;

  const hasMultiplier = multiplier && multiplier !== 1;

  return (
    <div
      className={`gom-overlay${closing ? " gom-overlay--out" : ""}`}
      onClick={(e) => e.target === e.currentTarget && triggerClose()}
      role="dialog"
      aria-modal="true"
      aria-label="Game session complete"
    >
      {/* ambient blobs */}
      <div className="gom-blob gom-blob--a" />
      <div className="gom-blob gom-blob--b" />

      <div className={`gom-card${closing ? " gom-card--out" : ""}`}>

        {/* top bar */}
        <div className="gom-topbar" />

        {/* close */}
        <button className="gom-close" onClick={triggerClose} aria-label="Close">✕</button>

        {/* ── Hero ── */}
        <div className="gom-hero">
          {/* confetti */}
          <div className="gom-confetti" aria-hidden="true">
            {CONFETTI.map((c, i) => (
              <span
                key={i}
                className="gom-confetti-dot"
                style={{
                  background: c.color,
                  top: `${c.top}%`,
                  left: `${c.left}%`,
                  animationDelay: `${c.delay}s`,
                  boxShadow: `0 0 8px ${c.color}`,
                }}
              />
            ))}
          </div>

          {/* corner accents */}
          <div className="gom-corner gom-corner--tl" />
          <div className="gom-corner gom-corner--tr" />

          <span className="gom-trophy" role="img" aria-label="Trophy">🏆</span>

          <div className="gom-badge">
            <span className="gom-badge-dot" />
            SESSION COMPLETE
          </div>

          <h2 className="gom-title">Great Game!</h2>
          <p className="gom-game-name">{gameTitle}</p>
        </div>

        {/* ── Points breakdown ── */}
        <div className="gom-breakdown">
          <div className={`gom-row${revealed ? " gom-row--in" : ""}`} style={{ transitionDelay: "0.05s" }}>
            <span className="gom-row-lbl">
              <span className="gom-row-icon">🎮</span> Play session
            </span>
            <span className="gom-row-pts">+{breakdown.play || 0}</span>
          </div>

          {(breakdown.timeBonus > 0) && (
            <div className={`gom-row${revealed ? " gom-row--in" : ""}`} style={{ transitionDelay: "0.15s" }}>
              <span className="gom-row-lbl">
                <span className="gom-row-icon">⏱</span> Time bonus
              </span>
              <span className="gom-row-pts">+{breakdown.timeBonus}</span>
            </div>
          )}

          {(breakdown.streakBonus > 0) && (
            <div className={`gom-row${revealed ? " gom-row--in" : ""}`} style={{ transitionDelay: "0.25s" }}>
              <span className="gom-row-lbl">
                <span className="gom-row-icon">🔥</span> Streak bonus
              </span>
              <span className="gom-row-pts">+{breakdown.streakBonus}</span>
            </div>
          )}

          {hasMultiplier && (
            <div className={`gom-row gom-row--multiplier${revealed ? " gom-row--in" : ""}`} style={{ transitionDelay: "0.35s" }}>
              <span className="gom-row-lbl">
                <span className="gom-row-icon">⚡</span> Event multiplier
              </span>
              <span className="gom-row-pts gom-row-pts--mult">×{multiplier}</span>
            </div>
          )}

          {/* divider */}
          <div className="gom-divider" />

          {/* total */}
          <div className={`gom-total-row${revealed ? " gom-total-row--in" : ""}`}>
            <span className="gom-total-lbl">Total Earned</span>
            <span className="gom-total-pts">+{countedTotal} <span className="gom-pts-unit">PTS</span></span>
          </div>
        </div>

        {/* ── Anonymous nudge (shown if user would have lost points) ── */}
        <div className={`gom-anon-strip${revealed ? " gom-anon-strip--in" : ""}`}>
          <span className="gom-anon-icon">💡</span>
          <span className="gom-anon-text">
            Log in to <strong>keep these points</strong> and climb the leaderboard
          </span>
        </div>

        {/* ── CTAs ── */}
        <div className="gom-actions">
          <button className="gom-btn-primary" onClick={handlePlayAgain}>
            <span>Play Again 🎮</span>
            <span className="gom-btn-shine" />
          </button>
          <button className="gom-btn-share" onClick={handleShare}>
            <span className="gom-share-icon">🔗</span>
            Share &amp; Earn +50 More Points
          </button>
        </div>

      </div>
    </div>
  );
}