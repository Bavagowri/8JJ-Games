// src/pages/mobile/MobileLeaderboard/components/MobileLeaderboardHeader.jsx
// ENHANCED WITH LUCIDE ICONS & IMPROVED STYLING

import { ArrowLeft, Calendar } from "lucide-react";
import { useLanguage } from "../../../../context/LanguageContext";
import { translate } from "../../../../data/translations";
import { useLeaderboard } from "../../../../context/LeaderboardContext";

export default function MobileLeaderboardHeader() {
  const { lang } = useLanguage();
  const { timePeriod, setTimePeriod } = useLeaderboard();

  const periods = [
    { 
      id: "daily", 
      label: translate("leaderboard_periods_daily", lang) || "Daily",
      shortLabel: translate("leaderboard_periods_daily", lang) || "Daily"
    },
    { 
      id: "weekly", 
      label: translate("leaderboard_periods_weekly", lang) || "Weekly",
      shortLabel: translate("leaderboard_periods_weekly", lang) || "Weekly"
    },
    { 
      id: "monthly", 
      label: translate("leaderboard_periods_monthly", lang) || "Monthly",
      shortLabel: translate("leaderboard_periods_monthly", lang) || "Monthly"
    },
    { 
      id: "alltime", 
      label: translate("leaderboard_periods_alltime", lang) || "All Time",
      shortLabel: translate("leaderboard_periods_alltime", lang) || "All Time"
    },
  ];

  return (
    <div className="mobile-lb-header">
      {/* Title row */}
      <div className="mobile-lb-header-row">
        <button 
          className="mobile-lb-back-btn" 
          onClick={() => window.history.back()}
          aria-label="Go back"
        >
          <ArrowLeft size={22} strokeWidth={2.5} />
        </button>
        <h1 className="mobile-lb-header-title">
          {translate("leaderboard", lang) || "Leaderboard"}
        </h1>
        {/* Spacer to center title */}
        <div style={{ width: 44 }} />
      </div>

      {/* Time period pills */}
      <div className="mobile-lb-period-scroll">
        {periods.map(p => (
          <button
            key={p.id}
            className={`mobile-lb-period-pill ${timePeriod === p.id ? 'active' : ''}`}
            onClick={() => setTimePeriod(p.id)}
            aria-label={p.label}
          >
            {p.shortLabel}
          </button>
        ))}
      </div>
    </div>
  );
}