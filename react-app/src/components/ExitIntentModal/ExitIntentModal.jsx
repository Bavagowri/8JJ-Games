// react-app/src/components/ExitIntentModal/ExitIntentModal.jsx


import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./ExitIntentModal.css";

const COUNTDOWN_SECONDS = 299; // 4:59

export default function ExitIntentModal({
  open,
  onClose,
  onRegister,
  onLogin,
  sessionPoints = 80,
  gameTitle = "this game",
}) {
  const [closing, setClosing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(COUNTDOWN_SECONDS);
  const [particles, setParticles] = useState([]);
  const timerRef = useRef(null);
  const navigate = useNavigate();

  // ── Reset + start countdown whenever modal opens ──
  useEffect(() => {
    if (!open) return;

    setTimeLeft(COUNTDOWN_SECONDS);
    setClosing(false);

    // sparkle particles
    setParticles(
      Array.from({ length: 14 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3.5 + 2,
        delay: Math.random() * 1.6,
        dur: Math.random() * 2 + 1.4,
      }))
    );

    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [open]);

  const triggerClose = () => {
    setClosing(true);
    clearInterval(timerRef.current);
    setTimeout(() => {
      setClosing(false);
      onClose?.();
    }, 380);
  };

  const handleRegister = () => {
    triggerClose();
    setTimeout(() => onRegister?.(), 400);
  };

  const handleLogin = () => {
    triggerClose();
    setTimeout(() => onLogin?.(), 400);
  };

  const formatTime = (secs) => {
    const m = String(Math.floor(secs / 60)).padStart(2, "0");
    const s = String(secs % 60).padStart(2, "0");
    return { m, s };
  };

  const { m, s } = formatTime(timeLeft);
  const totalPts = sessionPoints + 100; // session pts + welcome bonus

  if (!open) return null;

  return (
    <div
      className={`eim-overlay${closing ? " eim-overlay--out" : ""}`}
      onClick={(e) => e.target === e.currentTarget && triggerClose()}
      role="dialog"
      aria-modal="true"
      aria-label="Don't lose your points"
    >
      {/* ambient blobs */}
      <div className="eim-blob eim-blob--a" />
      <div className="eim-blob eim-blob--b" />

      <div className={`eim-card${closing ? " eim-card--out" : ""}`}>

        {/* top accent bar */}
        <div className="eim-topbar" />

        {/* particles */}
        <div className="eim-particles" aria-hidden="true">
          {particles.map((p) => (
            <span
              key={p.id}
              className="eim-particle"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: p.size,
                height: p.size,
                animationDelay: `${p.delay}s`,
                animationDuration: `${p.dur}s`,
              }}
            />
          ))}
        </div>

        {/* close */}
        <button className="eim-close" onClick={triggerClose} aria-label="Close">
          ✕
        </button>

        {/* corner accents */}
        <div className="eim-corner eim-corner--tl" />
        <div className="eim-corner eim-corner--tr" />

        {/* ── Hero section ── */}
        <div className="eim-hero">
          <span className="eim-emoji" role="img" aria-label="Sad face">😢</span>
          <div className="eim-badge">
            <span className="eim-badge-dot" />
            LEAVING SO SOON?
          </div>
          <h2 className="eim-title">
            Wait! Don't Leave<br />
            <span className="eim-title-accent">Your Points Behind</span>
          </h2>
          <p className="eim-sub">
            You've been playing <strong>{gameTitle}</strong>. Register free
            and every point you earn is yours forever.
          </p>
        </div>

        {/* ── Countdown timer ── */}
        <div className="eim-timer-wrap">
          <div className="eim-timer-label">⏱ This offer expires in</div>
          <div className="eim-timer-digits">
            <div className="eim-digit-block">
              <span className="eim-digit">{m}</span>
              <span className="eim-digit-lbl">MIN</span>
            </div>
            <span className="eim-colon">:</span>
            <div className="eim-digit-block">
              <span className={`eim-digit${timeLeft < 60 ? " eim-digit--urgent" : ""}`}>{s}</span>
              <span className="eim-digit-lbl">SEC</span>
            </div>
          </div>
        </div>

        {/* ── Reward chips ── */}
        <div className="eim-chips">
          <div className="eim-chip">
            <span className="eim-chip-icon">🎮</span>
            <span className="eim-chip-pts">+{sessionPoints}</span>
            <span className="eim-chip-lbl">Session Pts</span>
          </div>
          <div className="eim-chip eim-chip--accent">
            <span className="eim-chip-icon">🎁</span>
            <span className="eim-chip-pts">+100</span>
            <span className="eim-chip-lbl">Welcome Bonus</span>
          </div>
          <div className="eim-chip eim-chip--total">
            <span className="eim-chip-icon">🪙</span>
            <span className="eim-chip-pts">{totalPts}</span>
            <span className="eim-chip-lbl">Total Waiting</span>
          </div>
        </div>

        {/* ── CTAs ── */}
        <div className="eim-actions">
          <button className="eim-btn-primary" onClick={handleRegister}>
            <span className="eim-btn-text">Claim My {totalPts} Points 🎁</span>
            <span className="eim-btn-shine" />
          </button>
          <button className="eim-btn-secondary" onClick={handleLogin}>
            Already have an account? Log In →
          </button>
        </div>

        <button className="eim-skip" onClick={triggerClose}>
          No thanks, I'll lose my points
        </button>

      </div>
    </div>
  );
}