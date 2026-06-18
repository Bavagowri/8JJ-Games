

import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import '../styles/leaderboard-header.css';
import { useLeaderboard } from "../../../context/LeaderboardContext";
import { useLanguage } from "../../../context/LanguageContext";
import { translate } from "../../../data/translations";

const LeaderboardHeader = () => {
  const { timePeriod, setTimePeriod } = useLeaderboard();
  const { lang } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);

  const periods = [
    { id: "daily", label: `${translate("leaderboard_periods_daily", lang)}`, days: `${translate("leaderboard_periods_days", lang)}` },
    { id: "weekly", label: `${translate("leaderboard_periods_weekly", lang)}`, days: `${translate("leaderboard_periods_weekly_days", lang)}` },
    { id: "monthly", label: `${translate("leaderboard_periods_monthly", lang)}`, days: `${translate("leaderboard_periods_monthly_days", lang)}` },
    { id: "alltime", label: `${translate("leaderboard_periods_alltime", lang)}`, days: `${translate("leaderboard_periods_alltime_days", lang)}` }
  ];

  const activePeriod = periods.find(p => p.id === timePeriod) || periods[1];

  // Handle scroll for header effects
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`leaderboard-header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="header-top">
        <h1 className="header-title">{activePeriod.label} {translate("leaderboard", lang)}</h1>

        {/* Enhanced select with calendar icon */}
        <div className="period-select-wrapper">
          <Calendar size={18} className="period-icon" />
          <select
            className="leaderboard-select"
            value={timePeriod}
            onChange={(e) => setTimePeriod(e.target.value)}
            aria-label="Select time period"
          >
            {periods.map(p => (
              <option key={p.id} value={p.id}>
                {p.label} ({p.days})
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardHeader;