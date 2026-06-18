// react-app/src/components/predictions/PredictionCountdown.jsx
import { useState, useEffect } from "react";

function getTimeLeft(closeTime) {
  const diff = new Date(closeTime) - new Date();
  if (diff <= 0) return null;
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return { h, m, s, totalMs: diff };
}

export default function PredictionCountdown({ closeTime }) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(closeTime));

  useEffect(() => {
    const interval = setInterval(() => setTimeLeft(getTimeLeft(closeTime)), 1000);
    return () => clearInterval(interval);
  }, [closeTime]);

  if (!timeLeft) {
    return <span className="prediction-countdown closed-label">Closed</span>;
  }

  const isUrgent = timeLeft.totalMs < 60 * 60 * 1000;

  const display = isUrgent
    ? `${timeLeft.m}m ${String(timeLeft.s).padStart(2, "0")}s`
    : `${timeLeft.h}h ${String(timeLeft.m).padStart(2, "0")}m`;

  return (
    <span className={`prediction-countdown${isUrgent ? " urgent" : ""}`}>
      {isUrgent ? "⚡" : "⏱"} {display}
    </span>
  );
}