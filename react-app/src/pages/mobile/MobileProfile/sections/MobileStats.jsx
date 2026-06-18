// src/pages/mobile/MobileProfile/sections/MobileStats.jsx
import { useEffect } from "react";
import { useProfile } from "../../../../context/ProfileContext";
import { useLanguage } from "../../../../context/LanguageContext";
import { useNavigate } from "react-router-dom";
import { translate } from "../../../../data/translations";
import MobileHeader from "../../../../components/mobile/MobileHeader/MobileHeader";
import MobileBottomNav from "../../../../components/mobile/MobileBottomNav/MobileBottomNav";
import "./MobileStats.css";

const R2_BASE =
  import.meta.env.VITE_ASSETS_BASE_URL ||
  "https://assets.8jjgames.com";

const ICONS = {
  time: `${R2_BASE}/8jj_icons/icons/8jj-time.webp`,
  points: `${R2_BASE}/8jj_icons/icons/points.webp`,
  games: `${R2_BASE}/8jj_icons/icons/8jj-game-3.webp`,
  star: `${R2_BASE}/8jj_icons/icons/points.webp`,
  level: `${R2_BASE}/8jj_icons/icons/8jj-level.webp`,
  stats: `${R2_BASE}/8jj_icons/icons/stats.webp`,
  performance: `${R2_BASE}/8jj_icons/icons/performance.webp`,
  lock:`${R2_BASE}/8jj_icons/icons/login.webp`,
  gift: `${R2_BASE}/8jj_icons/icons/8jj-redeem.webp`,
  refer: `${R2_BASE}/8jj_icons/icons/refer.webp`,
  trophy: `${R2_BASE}/8jj_icons/icons/trophy.webp`,
};

const LEVELS = [
  { level: 1, name: "Rookie", minPoints: 0 },
  { level: 2, name: "Explorer", minPoints: 500 },
  { level: 3, name: "Challenger", minPoints: 1500 },
  { level: 4, name: "Pathfinder", minPoints: 3000 },
  { level: 5, name: "Strategist", minPoints: 6000 },
  { level: 6, name: "Elite Player", minPoints: 10000 },
  { level: 7, name: "Master Gamer", minPoints: 18000 },
  { level: 8, name: "Legend", minPoints: 30000 },
  { level: 9, name: "Mythic", minPoints: 50000 },
  { level: 10, name: "Immortal", minPoints: 80000 }
];

function getLevelProgress(points, currentLevel) {
  const current = LEVELS.find(l => l.level === currentLevel) || LEVELS[0];
  const next = LEVELS.find(l => l.level === currentLevel + 1);

  if (!next) {
    return {
      percent: 100,
      remaining: 0,
      currentName: current.name,
      nextName: null
    };
  }

  const pointsIntoLevel = points - current.minPoints;
  const pointsNeededForNext = next.minPoints - current.minPoints;
  const percent = Math.min(100, Math.floor((pointsIntoLevel / pointsNeededForNext) * 100));
  const remaining = next.minPoints - points;

  return {
    percent,
    remaining: remaining > 0 ? remaining : 0,
    currentName: current.name,
    nextName: next.name
  };
}

function getActivityIcon(activityType) {
  const icons = {
    login: "lock",
    play_game: "games",
    code_redemption: "gift",
    referral_signup: "refer",
    referral_first_game: "refer",
    achievement_unlocked: "trophy",
  };
  return icons[activityType] || "stats";
}

export default function MobileStats() {
  const navigate = useNavigate();
  const { profile, activityLogs } = useProfile();
  const { lang } = useLanguage();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, []);

  if (!profile) {
    return (
      <div className="mobile-stats-wrapper">
        <MobileHeader title={translate("profileStats_title", lang)} showBack />
        <div className="mobile-content">
          <div className="mobile-loading">
            <div className="mobile-spinner"></div>
          </div>
        </div>
        <MobileBottomNav />
      </div>
    );
  }

  const { percent, remaining, currentName, nextName } = getLevelProgress(profile.points, profile.level);

  const overallStats = [
    { label: translate("profileStats_overall_playtime", lang), value: profile.stats.playtime + " " + translate("hrs", lang), icon: "time", color: "#4facfe" },
    { label: translate("profileStats_overall_games", lang), value: profile.stats?.gamesPlayed, icon: "games", color: "#667eea" },
    { label: translate("profileStats_overall_points", lang), value: profile.points.toLocaleString(), icon: "star", color: "#f5576c" },
    { label: translate("profileStats_overall_level", lang), value: profile.level, icon: "level", color: "#00f2fe" },
  ];


  const handleBackToMain = () => {
    navigate("/profile", { replace: true });
  };

  return (
    <div className="mobile-stats-wrapper">
      <MobileHeader title={translate("profileStats_title", lang)} showBack />

      <div className="mobile-content">

        {/* Mobile Top-bar */}
        <div className="mobile-top-bar">
          {/* Back button */}
          <button
            onClick={handleBackToMain}
            className="premium-mobile-back-button"
            aria-label="Go back"
          >
            ←
          </button>

          {/* Page title */}
          <h1 className="mobile-top-title">
            {translate("profileStats_title", lang)}
          </h1>

          {/* Right spacer (future icon / keeps title centered) */}
          <div className="mobile-top-spacer" />
        </div>


        {/* Overall Stats */}
        <div className="mobile-stats-overview">
          {overallStats.map((stat, index) => (
            <div key={index} className="mobile-stat-box" style={{ animationDelay: `${index * 0.1}s` }}>
              <img
                src={ICONS[stat.icon]}
                alt={stat.label}
                className="stat-box-icon"
                style={{ filter: `drop-shadow(0 0 8px ${stat.color})` }}
              />
              <h4>{stat.label}</h4>
              <span style={{ color: stat.color }}>{stat.value}</span>
            </div>
          ))}
        </div>

        {/* Level Progress */}
        <div className="mobile-stats-card">
          <div className="stats-card-header">
            <img src={ICONS.level} alt="" className="header-icon" />
            <h3>{translate("profileStats_levelProgress", lang)}</h3>
          </div>

          <div className="level-progress-info">
            <div className="level-row">
              <span className="level-current">
                {translate("profileStats_overall_level", lang)} {profile.level} · {currentName}
              </span>
              <span className="level-xp">
                {profile.points.toLocaleString()} XP
              </span>
            </div>

            <div className="progress-bar-mobile">
              <div
                className="progress-fill-mobile"
                style={{ width: `${percent}%` }}
              />
            </div>

            <p className="progress-text">
              {nextName
                ? `${percent}% · ${remaining.toLocaleString()} pts to ${nextName}`
                : translate("profileStats_maxLevel", lang) || "🎉 Maximum level!"
              }
            </p>
          </div>
        </div>

        {/* Activity Table */}
        <div className="mobile-stats-card">
          <div className="stats-card-header">
            <img src={ICONS.performance} alt="" className="header-icon" />
            <h3>{translate("profileStats_gamePerformance", lang)}</h3>
          </div>

          <div className="mobile-activity-list">
            {Array.isArray(activityLogs) && activityLogs.length > 0 ? (
              activityLogs.slice(0, 15).map((log, index) => (
                <div key={log.id || index} className="activity-item">
                  <div className="activity-left">
                    <img
                      src={ICONS[getActivityIcon(log.activity_type)]}
                      alt=""
                      className="activity-icon-img"
                    />
                    <div className="activity-info">
                      <span className="activity-name">
                        {log.game_id
                          ? log.game_id.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
                          : log.activity_type.replaceAll("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())
                        }
                      </span>
                      <span className="activity-date">
                        {new Date(log.created_at).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="activity-points">
                    <span className={log.points_awarded > 0 ? "points-positive" : "points-zero"}>
                      {log.points_awarded > 0 ? `+${log.points_awarded}` : '0'} pts
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-activity">
                <p>{translate("profileStats_table_noActivity", lang)}</p>
              </div>
            )}
          </div>
        </div>

        <div className="mobile-footer-space" />
      </div>

      <MobileBottomNav />
    </div>
  );
}