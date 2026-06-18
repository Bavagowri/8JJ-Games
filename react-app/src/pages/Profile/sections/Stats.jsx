// react-app/src/pages/Profile/sections/Stats.jsx

import { useState } from "react";
import { useProfile } from "../../../context/ProfileContext";
import { useLanguage } from "../../../context/LanguageContext";
import { translate } from "../../../data/translations";

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

// Import level configuration
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

const ROWS_PER_PAGE = 10;

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

export default function Stats() {
  const { profile, activityLogs } = useProfile();
  const { lang } = useLanguage();

  const [currentPage, setCurrentPage] = useState(1);

  const { percent, remaining, currentName, nextName } =
    getLevelProgress(profile.points, profile.level);

  const overallStats = [
    { label: translate("profileStats_overall_playtime", lang), value: profile.stats.playtime + " " + translate("hrs", lang), icon: "time", color: "#4facfe" },
    { label: translate("profileStats_overall_games", lang), value: profile.stats?.gamesPlayed, icon: "games", color: "#667eea" },
    { label: translate("profileStats_overall_points", lang), value: profile.points.toLocaleString(), icon: "star", color: "#f5576c" },
    { label: translate("profileStats_overall_level", lang), value: profile.level, icon: "level", color: "#00f2fe" },
  ];

  // Pagination logic
  const logs = Array.isArray(activityLogs) ? activityLogs : [];
  const totalPages = Math.max(1, Math.ceil(logs.length / ROWS_PER_PAGE));
  const paginatedLogs = logs.slice(
    (currentPage - 1) * ROWS_PER_PAGE,
    currentPage * ROWS_PER_PAGE
  );

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Generate page numbers to show (with ellipsis logic)
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="profile-stats-page">
      <h3 className="Profile-title">{translate("profileStats_title", lang)}</h3>

      {/* Overall Stats */}
      <div className="stats-overview">
        {overallStats.map((stat, index) => (
          <div key={index} className="stat-card ThemeBox" style={{ animationDelay: `${index * 0.1}s` }}>
            <img
              src={ICONS[stat.icon]}
              alt={stat.label}
              className="stat-icon"
              style={{ filter: `drop-shadow(0 0 8px ${stat.color})` }}
            />
            <h4>{stat.label}</h4>
            <span style={{ color: stat.color }}>{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Level Progress */}
      <div className="overview-about ThemeBox" style={{ marginTop: "32px", marginBottom: "32px" }}>
        <h4 className="stat-title">
          <img src={ICONS.level} alt="" className="inline-icon" />
          {translate("profileStats_levelProgress", lang)}
        </h4>

        <div style={{ marginBottom: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "14px", fontWeight: "600" }}>
            <span>
              {translate("profileStats_overall_level", lang)} {profile.level} · {currentName}
            </span>

            <span style={{ color: "var(--text-muted)" }}>
              {translate("profileStats_levelXP", lang).replace("{xp}", profile.points.toLocaleString())}
            </span>

            {nextName && (
              <span>
                {translate("profileStats_overall_level", lang)} {profile.level + 1} · {nextName}
              </span>
            )}
          </div>

          <div style={{ height: "12px", background: "rgba(79, 172, 254, 0.2)", borderRadius: "12px", overflow: "hidden" }}>
            <div style={{ 
              height: "100%", 
              width: `${percent}%`, 
              background: "var(--primary-gradient)", 
              borderRadius: "12px", 
              transition: "width 0.8s ease", 
              boxShadow: "0 0 12px rgba(79, 172, 254, 0.5)" 
            }} />
          </div>
        </div>

        <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
          {nextName 
            ? `${percent}% complete · ${remaining.toLocaleString()} points to ${nextName}`
            : translate("profileStats_maxLevel", lang) || "🎉 Maximum level reached! You are Immortal!"
          }
        </p>
      </div>

      {/* Game Specific Stats */}
      <div className="stats-table ThemeBox">
        <h4 className="stat-title">
          <img src={ICONS.performance} alt="" className="inline-icon" />
          {translate("profileStats_achievedPoints", lang)}
        </h4>
        <table>
          <thead>
            <tr>
              <th>{translate("profileStats_table_activity", lang)}</th>
              <th>{translate("profileStats_table_points", lang)}</th>
              <th>{translate("profileStats_table_date", lang)}</th>
            </tr>
          </thead>
          <tbody>
            {paginatedLogs.length > 0 ? (
              paginatedLogs.map((log, index) => (
                <tr key={log.id || index} style={{ animation: `slideInLeft 0.5s ease-out ${index * 0.05}s backwards` }}>
                  <td
                    style={{
                      fontWeight: "700",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <img
                      src={ICONS[log.game_id ? "games" : getActivityIcon(log.activity_type)]}
                      alt=""
                      aria-hidden="true"
                      className="activity-icon"
                    />
                    {log.game_id
                      ? log.game_id
                          .replace(/-/g, " ")
                          .replace(/\b\w/g, (l) => l.toUpperCase())
                      : log.activity_type
                          .replaceAll("_", " ")
                          .replace(/\b\w/g, (l) => l.toUpperCase())
                    }
                  </td>

                  <td>
                    <span style={{ 
                      padding: "4px 12px", 
                      background: log.points_awarded > 0 ? "rgba(79, 172, 254, 0.15)" : "rgba(160, 174, 192, 0.15)", 
                      borderRadius: "8px", 
                      fontWeight: "600", 
                      color: log.points_awarded > 0 ? "#4facfe" : "var(--text-muted)" 
                    }}>
                      {log.points_awarded > 0 ? `+${log.points_awarded}` : '0'} pts
                    </span>
                  </td>
                  <td style={{ color: "var(--text-muted)" }}>
                    {new Date(log.created_at).toLocaleDateString(undefined, { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" style={{ textAlign: "center", opacity: 0.6, padding: "32px" }}>
                  {translate("profileStats_table_noActivity", lang)}
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {logs.length > ROWS_PER_PAGE && (
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "20px",
            flexWrap: "wrap",
            gap: "12px",
          }}>
            {/* Info text */}
            <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>
              Showing {((currentPage - 1) * ROWS_PER_PAGE) + 1}–{Math.min(currentPage * ROWS_PER_PAGE, logs.length)} of {logs.length}
            </span>

            {/* Page controls */}
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              {/* Prev button */}
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                style={{
                  padding: "6px 12px",
                  borderRadius: "8px",
                  border: "1px solid rgba(79, 172, 254, 0.3)",
                  background: currentPage === 1 ? "transparent" : "rgba(79, 172, 254, 0.1)",
                  color: currentPage === 1 ? "var(--text-muted)" : "#4facfe",
                  cursor: currentPage === 1 ? "not-allowed" : "pointer",
                  fontSize: "13px",
                  fontWeight: "600",
                  transition: "all 0.2s ease",
                  opacity: currentPage === 1 ? 0.4 : 1,
                }}
              >
                ← Prev
              </button>

              {/* Page numbers */}
              {getPageNumbers().map((page, i) =>
                page === "..." ? (
                  <span key={`ellipsis-${i}`} style={{ color: "var(--text-muted)", padding: "0 4px", fontSize: "13px" }}>…</span>
                ) : (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    style={{
                      minWidth: "34px",
                      height: "34px",
                      borderRadius: "8px",
                      border: page === currentPage
                        ? "1px solid #4facfe"
                        : "1px solid rgba(79, 172, 254, 0.2)",
                      background: page === currentPage
                        ? "var(--primary-gradient)"
                        : "transparent",
                      color: page === currentPage ? "#fff" : "var(--text-muted)",
                      cursor: "pointer",
                      fontSize: "13px",
                      fontWeight: page === currentPage ? "700" : "500",
                      transition: "all 0.2s ease",
                      boxShadow: page === currentPage ? "0 0 10px rgba(79, 172, 254, 0.4)" : "none",
                    }}
                  >
                    {page}
                  </button>
                )
              )}

              {/* Next button */}
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                style={{
                  padding: "6px 12px",
                  borderRadius: "8px",
                  border: "1px solid rgba(79, 172, 254, 0.3)",
                  background: currentPage === totalPages ? "transparent" : "rgba(79, 172, 254, 0.1)",
                  color: currentPage === totalPages ? "var(--text-muted)" : "#4facfe",
                  cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                  fontSize: "13px",
                  fontWeight: "600",
                  transition: "all 0.2s ease",
                  opacity: currentPage === totalPages ? 0.4 : 1,
                }}
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper function to get activity icons
function getActivityIcon(activityType) {
  const icons = {
    login: "lock",
    play_game: "games",
    code_redemption: "gift",
    referral_signup: "users",
    referral_first_game: "refer",
    achievement_unlocked: "trophy",
  };

  return icons[activityType] || "stats";
}