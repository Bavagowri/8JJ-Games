// src/pages/mobile/MobileProfile/sections/MobileOverview.jsx
import { useEffect } from "react";
import { useProfile } from "../../../../context/ProfileContext";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../../../context/LanguageContext";
import { translate } from "../../../../data/translations";
import LeaderboardBanner from "../../../../components/LeaderboardBanner/LeaderboardBanner";
import MobileHeader from "../../../../components/mobile/MobileHeader/MobileHeader";
import MobileBottomNav from "../../../../components/mobile/MobileBottomNav/MobileBottomNav";
import "./MobileOverview.css";

const R2_BASE =
  import.meta.env.VITE_ASSETS_BASE_URL ||
  "https://assets.8jjgames.com";

const ACHIEVEMENT_ICONS = {
  time: `${R2_BASE}/8jj_icons/icons/8jj-time.webp`,
  points: `${R2_BASE}/8jj_icons/icons/8jj-points.webp`,
  games: `${R2_BASE}/8jj_icons/icons/8jj-game-3.webp`,
  level: `${R2_BASE}/8jj_icons/icons/8jj-level.webp`,
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

export default function MobileOverview() {
  const navigate = useNavigate();
  const { profile, activityLogs, loading } = useProfile();
  const { lang } = useLanguage();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, []);

  if (loading || !profile) {
    return (
      <div className="mobile-overview-wrapper">
        <MobileHeader title={translate("profileOverview_title", lang) || "Overview"} showBack />
        <div className="mobile-content">
          <div className="mobile-loading">
            <div className="mobile-spinner"></div>
          </div>
        </div>
        <MobileBottomNav />
      </div>
    );
  }

  const stats = [
    { label: translate("profileOverview_gamesPlayed", lang), value: profile.stats?.gamesPlayed, icon: "games" },
    { label: translate("profileOverview_totalPlaytime", lang), value: profile.stats?.playtime + " hrs", icon: "time" },
    { label: translate("profileOverview_totalPoints", lang), value: profile.points, icon: "points" },
    { label: translate("profileOverview_level", lang), value: profile.level, icon: "level" },
  ];

  const generateAchievements = () => {
    const achievements = [];

    // Points-based achievements
    if (profile.points >= 80000) {
      achievements.push({ icon: "🏆", title: translate("immortal_title", lang), desc: translate("immortal_desc", lang) });
    } else if (profile.points >= 50000) {
      achievements.push({ icon: "🌟", title: translate("mythic_legend_title", lang), desc: translate("mythic_legend_desc", lang) });
    } else if (profile.points >= 30000) {
      achievements.push({ icon: "👑", title: translate("living_legend_title", lang), desc: translate("living_legend_desc", lang) });
    } else if (profile.points >= 18000) {
      achievements.push({ icon: "🎭", title: translate("master_gamer_title", lang), desc: translate("master_gamer_desc", lang) });
    } else if (profile.points >= 10000) {
      achievements.push({ icon: "💎", title: translate("elite_status_title", lang), desc: translate("elite_status_desc", lang) });
    } else if (profile.points >= 6000) {
      achievements.push({ icon: "🎯", title: translate("strategist_title", lang), desc: translate("strategist_desc", lang) });
    }

    // Games played achievements
    if (profile.stats?.gamesPlayed >= 100) {
      achievements.push({ icon: "🎮", title: translate("century_club_title", lang), desc: translate("century_club_desc", lang) });
    } else if (profile.stats?.gamesPlayed >= 50) {
      achievements.push({ icon: "🕹️", title: translate("game_master_title", lang), desc: translate("game_master_desc", lang) });
    }

    // Level-based achievements
    if (profile.level >= 10) {
      achievements.push({ icon: "👑", title: translate("immortal_rank_title", lang), desc: translate("immortal_rank_desc", lang) });
    } else if (profile.level >= 7) {
      achievements.push({ icon: "🏅", title: translate("master_rank_title", lang), desc: translate("master_rank_desc", lang) });
    }

    return achievements.slice(0, 4);
  };

  const achievements = generateAchievements();

  const handleBackToMain = () => {
    navigate("/profile", { replace: true });
  };

  return (
    <div className="mobile-overview-wrapper">
      <MobileHeader title="Overview" showBack />

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
            {translate("profileOverview_title", lang)}
          </h1>

          {/* Right spacer (future icon / keeps title centered) */}
          <div className="mobile-top-spacer" />
        </div>


        {/* Stats Grid */}
        <div className="mobile-overview-stats">
          {stats.map((stat, index) => (
            <div key={index} className="overview-stat-card" style={{ animationDelay: `${index * 0.1}s` }}>
              <img
                src={ACHIEVEMENT_ICONS[stat.icon]}
                alt={stat.label}
                className="overview-stat-icon"
              />
              <h4>{stat.label}</h4>
              <span>{stat.value}</span>
            </div>
          ))}
        </div>

        {/* Achievements */}
        <div className="mobile-overview-section">
          <h3 className="section-titlezz">{translate("profileOverview_recentAchievements", lang)}</h3>
          <div className="achievements-grid">
            {achievements.length > 0 ? (
              achievements.map((achievement, i) => (
                <div key={i} className="achievement-card">
                  <span className="achievement-emoji">{achievement.icon}</span>
                  <span className="achievement-title">{achievement.title}</span>
                  <span className="achievement-desc">{achievement.desc}</span>
                </div>
              ))
            ) : (
              <p className="no-achievements">{translate("profileOverview_noAchievements", lang)}</p>
            )}
          </div>
        </div>

        {/* Leaderboard */}
        <div className="mobile-overview-section">
          <h3 className="section-titlezz">Leaderboard</h3>
          <LeaderboardBanner
            rank={profile?.stats?.rank}
            points={profile?.stats?.points}
          />
        </div>

        {/* About Me */}
        <div className="mobile-overview-section">
          <h3 className="section-titlezz">{translate("profileOverview_aboutMe", lang)}</h3>
          <p className="about-text">
            {profile.about_me || translate("profileOverview_aboutMePlaceholder", lang)}
          </p>

          {(profile.interests?.length ?? 0) > 0 && (
            <div className="interests-tags">
              {profile.interests.map((tag, i) => (
                <span key={i} className="interest-tag">#{tag}</span>
              ))}
            </div>
          )}
        </div>

        <div className="mobile-footer-space" />
      </div>

      <MobileBottomNav />
    </div>
  );
}