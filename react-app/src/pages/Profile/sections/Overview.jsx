// react-app/src/pages/Profile/sections/Overview.jsx
import { useProfile } from "../../../context/ProfileContext";
import { useLanguage } from "../../../context/LanguageContext";
import { translate } from "../../../data/translations";
import LeaderboardBanner from "../../../components/LeaderboardBanner/LeaderboardBanner";
import './Overview.css';

const R2_BASE = import.meta.env.VITE_ASSETS_BASE_URL || "https://assets.8jjgames.com";

// Achievement icon paths
const ACHIEVEMENT_ICONS = {
  // Stats icons
  time: `${R2_BASE}/8jj_icons/icons/8jj-time.webp`,
  points: `${R2_BASE}/8jj_icons/icons/8jj-points.webp`,
  games: `${R2_BASE}/8jj_icons/icons/8jj-game-3.webp`,
  level: `${R2_BASE}/8jj_icons/icons/8jj-level.webp`,
  
  // Achievement icons - Points based
  trophy: `${R2_BASE}/8jj_icons/icons/achievements/trophy.webp`,
  star: `${R2_BASE}/8jj_icons/icons/achievements/star.webp`,
  crown: `${R2_BASE}/8jj_icons/icons/achievements/crown.webp`,
  mask: `${R2_BASE}/8jj_icons/icons/achievements/mask.webp`,
  diamond: `${R2_BASE}/8jj_icons/icons/achievements/diamond.webp`,
  target: `${R2_BASE}/8jj_icons/icons/achievements/target.webp`,
  rocket: `${R2_BASE}/8jj_icons/icons/achievements/rocket.webp`,
  sword: `${R2_BASE}/8jj_icons/icons/achievements/sword.webp`,
  compass: `${R2_BASE}/8jj_icons/icons/achievements/compass.webp`,
  rising_star: `${R2_BASE}/8jj_icons/icons/achievements/rising-star.webp`,
  
  // Games played achievements
  gamepad: `${R2_BASE}/8jj_icons/icons/achievements/gamepad.webp`,
  joystick: `${R2_BASE}/8jj_icons/icons/achievements/joystick.webp`,
  dice: `${R2_BASE}/8jj_icons/icons/achievements/dice.webp`,
  circus: `${R2_BASE}/8jj_icons/icons/achievements/circus.webp`,
  
  // Playtime achievements
  clock: `${R2_BASE}/8jj_icons/icons/achievements/clock.webp`,
  stopwatch: `${R2_BASE}/8jj_icons/icons/achievements/stopwatch.webp`,
  watch: `${R2_BASE}/8jj_icons/icons/achievements/watch.webp`,
  timer: `${R2_BASE}/8jj_icons/icons/achievements/timer.webp`,
  
  // Level achievements
  sparkles: `${R2_BASE}/8jj_icons/icons/achievements/sparkles.webp`,
  medal: `${R2_BASE}/8jj_icons/icons/achievements/medal.webp`,
  
  // Activity achievements
  fire: `${R2_BASE}/8jj_icons/icons/achievements/fire.webp`,
  muscle: `${R2_BASE}/8jj_icons/icons/achievements/muscle.webp`,
  chart_up: `${R2_BASE}/8jj_icons/icons/achievements/chart-up.webp`,
  chart: `${R2_BASE}/8jj_icons/icons/achievements/chart.webp`,
  
  // Code redemption
  gift: `${R2_BASE}/8jj_icons/icons/achievements/gift.webp`,
  ticket: `${R2_BASE}/8jj_icons/icons/achievements/ticket.webp`,
  voucher: `${R2_BASE}/8jj_icons/icons/achievements/voucher.webp`,
  
  // Login streak
  calendar: `${R2_BASE}/8jj_icons/icons/achievements/calendar.webp`,
  calendar_month: `${R2_BASE}/8jj_icons/icons/achievements/calendar-month.webp`,
  calendar_week: `${R2_BASE}/8jj_icons/icons/achievements/calendar-week.webp`,
  clipboard: `${R2_BASE}/8jj_icons/icons/achievements/clipboard.webp`,
  
  // Referrals
  users: `${R2_BASE}/8jj_icons/icons/achievements/users.webp`,
  user_group: `${R2_BASE}/8jj_icons/icons/achievements/user-group.webp`,
  user: `${R2_BASE}/8jj_icons/icons/achievements/user.webp`,
  
  // Tier badges
  gold_medal: `${R2_BASE}/8jj_icons/8jjgames-tiers/gold.webp`,
  silver_medal: `${R2_BASE}/8jj_icons/8jjgames-tiers/silver.webp`,
  bronze_medal: `${R2_BASE}/8jj_icons/8jjgames-tiers/bronze.webp`,
  platinum_medal: `${R2_BASE}/8jj_icons/8jjgames-tiers/platinum.webp`,
  diamond_medal: `${R2_BASE}/8jj_icons/8jjgames-tiers/diamond.webp`,
  ascended_medal: `${R2_BASE}/8jj_icons/8jjgames-tiers/ascended.webp`
};

export default function Overview() {
  const { profile, activityLogs, loading } = useProfile();
  const { lang } = useLanguage();

  if (loading || !profile) {
    return (
      <div className="profile-header loading">
        Loading profile...
      </div>
    );
  }
  // if (loading) return null;
  const stats = [
    { label: translate("profileOverview_gamesPlayed", lang), value: profile.stats?.gamesPlayed, icon: "games" },
    { label: translate("profileOverview_totalPlaytime", lang), value: profile.stats?.playtime + " hrs", icon: "time" },
    { label: translate("profileOverview_totalPoints", lang), value: profile.points, icon: "points" },
    { label: translate("profileOverview_level", lang), value: profile.level, icon: "level" },
  ];

  // Generate dynamic achievements based on actual stats
  const generateAchievements = () => {
    const achievements = [];
    
    // Points-based achievements (matching levels.config.js)
    if (profile.points >= 80000) {
      achievements.push({ 
        icon: "🏆", 
        title: translate("immortal_title", lang), 
        desc: translate("immortal_desc", lang) 
      });
    } else if (profile.points >= 50000) {
      achievements.push({ 
        icon: "🌟", 
        title: translate("mythic_legend_title", lang), 
        desc: translate("mythic_legend_desc", lang) 
      });
    } else if (profile.points >= 30000) {
      achievements.push({ 
        icon: "👑", 
        title: translate("living_legend_title", lang), 
        desc: translate("living_legend_desc", lang) 
      });
    } else if (profile.points >= 18000) {
      achievements.push({ 
        icon: "🎭", 
        title: translate("master_gamer_title", lang), 
        desc: translate("master_gamer_desc", lang) 
      });
    } else if (profile.points >= 10000) {
      achievements.push({ 
        icon: "💎", 
        title: translate("elite_status_title", lang), 
        desc: translate("elite_status_desc", lang) 
      });
    } else if (profile.points >= 6000) {
      achievements.push({ 
        icon: "🎯", 
        title: translate("strategist_title", lang), 
        desc: translate("strategist_desc", lang) 
      });
    } else if (profile.points >= 3000) {
      achievements.push({ 
        icon: "🚀", 
        title: translate("pathfinder_title", lang), 
        desc: translate("pathfinder_desc", lang) 
      });
    } else if (profile.points >= 1500) {
      achievements.push({ 
        icon: "⚔️", 
        title: translate("challenger_title", lang), 
        desc: translate("challenger_desc", lang) 
      });
    } else if (profile.points >= 500) {
      achievements.push({ 
        icon: "🧭", 
        title: translate("explorer_title", lang), 
        desc: translate("explorer_desc", lang) 
      });
    } else if (profile.points >= 100) {
      achievements.push({ 
        icon: "⭐", 
        title: translate("rising_star_title", lang), 
        desc: translate("rising_star_desc", lang) 
      });
    }

    // Games played achievements
    if (profile.stats?.gamesPlayed >= 100) {
      achievements.push({ 
        icon: "🎮", 
        title: translate("century_club_title", lang), 
        desc: translate("century_club_desc", lang) 
      });
    } else if (profile.stats?.gamesPlayed >= 50) {
      achievements.push({ 
        icon: "🕹️", 
        title: translate("game_master_title", lang), 
        desc: translate("game_master_desc", lang) 
      });
    } else if (profile.stats?.gamesPlayed >= 25) {
      achievements.push({ 
        icon: "🎯", 
        title: translate("enthusiast_title", lang), 
        desc: translate("enthusiast_desc", lang) 
      });
    } else if (profile.stats?.gamesPlayed >= 10) {
      achievements.push({ 
        icon: "🎲", 
        title: translate("game_explorer_title", lang), 
        desc: translate("game_explorer_desc", lang) 
      });
    } else if (profile.stats?.gamesPlayed >= 5) {
      achievements.push({ 
        icon: "🎪", 
        title: translate("getting_started_title", lang), 
        desc: translate("getting_started_desc", lang) 
      });
    }

    // Playtime achievements
    const playtime = parseFloat(profile.stats?.playtime || 0);
    if (playtime >= 100) {
      achievements.push({ 
        icon: "⏰", 
        title: translate("time_traveler_title", lang), 
        desc: translate("time_traveler_desc", lang) 
      });
    } else if (playtime >= 50) {
      achievements.push({ 
        icon: "⏱️", 
        title: translate("dedicated_gamer_title", lang), 
        desc: translate("dedicated_gamer_desc", lang) 
      });
    } else if (playtime >= 20) {
      achievements.push({ 
        icon: "⌚", 
        title: translate("time_investor_title", lang), 
        desc: translate("time_investor_desc", lang) 
      });
    } else if (playtime >= 10) {
      achievements.push({ 
        icon: "🕐", 
        title: translate("active_player_title", lang), 
        desc: translate("active_player_desc", lang) 
      });
    } else if (playtime >= 1) {
      achievements.push({ 
        icon: "⏲️", 
        title: translate("first_hours_title", lang), 
        desc: translate("first_hours_desc", lang) 
      });
    }

    // Level-based achievements (matching levels.config.js)
    if (profile.level >= 10) {
      achievements.push({ 
        icon: "👑", 
        title: translate("immortal_rank_title", lang), 
        desc: translate("immortal_rank_desc", lang) 
      });
    } else if (profile.level >= 9) {
      achievements.push({ 
        icon: "✨", 
        title: translate("mythic_rank_title", lang), 
        desc: translate("mythic_rank_desc", lang) 
      });
    } else if (profile.level >= 8) {
      achievements.push({ 
        icon: "🌟", 
        title: translate("legend_rank_title", lang), 
        desc: translate("legend_rank_desc", lang) 
      });
    } else if (profile.level >= 7) {
      achievements.push({ 
        icon: "🏅", 
        title: translate("master_rank_title", lang), 
        desc: translate("master_rank_desc", lang) 
      });
    } else if (profile.level >= 6) {
      achievements.push({ 
        icon: "💎", 
        title: translate("elite_rank_title", lang), 
        desc: translate("elite_rank_desc", lang) 
      });
    } else if (profile.level >= 5) {
      achievements.push({ 
        icon: "🎯", 
        title: translate("strategist_rank_title", lang), 
        desc: translate("strategist_rank_desc", lang) 
      });
    } else if (profile.level >= 3) {
      achievements.push({ 
        icon: "⚔️", 
        title: translate("challenger_rank_title", lang), 
        desc: translate("challenger_rank_desc", lang) 
      });
    }

    // Activity-based achievements
    if (Array.isArray(activityLogs) && activityLogs.length > 0) {
      const totalActivities = activityLogs.length;
      
      if (totalActivities >= 100) {
        achievements.push({ 
          icon: "🔥", 
          title: translate("super_active_title", lang), 
          desc: translate("super_active_desc", lang) 
        });
      } else if (totalActivities >= 50) {
        achievements.push({ 
          icon: "💪", 
          title: translate("very_active_title", lang), 
          desc: translate("very_active_desc", lang) 
        });
      } else if (totalActivities >= 20) {
        achievements.push({ 
          icon: "📈", 
          title: translate("consistent_title", lang), 
          desc: translate("consistent_desc", lang) 
        });
      } else if (totalActivities >= 10) {
        achievements.push({ 
          icon: "📊", 
          title: translate("getting_active_title", lang), 
          desc: translate("getting_active_desc", lang) 
        });
      }

      // Check for code redemptions
      const redemptions = activityLogs.filter(log => log.activity_type === 'code_redemption').length;
      if (redemptions >= 10) {
        achievements.push({ 
          icon: "🎁", 
          title: translate("code_master_title", lang), 
          desc: translate("code_master_desc", lang) 
        });
      } else if (redemptions >= 5) {
        achievements.push({ 
          icon: "🎫", 
          title: translate("code_hunter_title", lang), 
          desc: translate("code_hunter_desc", lang) 
        });
      } else if (redemptions >= 1) {
        achievements.push({ 
          icon: "🎟️", 
          title: translate("first_redemption_title", lang), 
          desc: translate("first_redemption_desc", lang) 
        });
      }

      // Check for login streak
      const logins = activityLogs.filter(log => log.activity_type === 'login').length;
      if (logins >= 30) {
        achievements.push({ 
          icon: "📅", 
          title: translate("monthly_dedication_title", lang), 
          desc: translate("monthly_dedication_desc", lang) 
        });
      } else if (logins >= 14) {
        achievements.push({ 
          icon: "📆", 
          title: translate("two_week_streak_title", lang), 
          desc: translate("two_week_streak_desc", lang) 
        });
      } else if (logins >= 7) {
        achievements.push({ 
          icon: "🗓️", 
          title: translate("weekly_warrior_title", lang), 
          desc: translate("weekly_warrior_desc", lang) 
        });
      } else if (logins >= 3) {
        achievements.push({ 
          icon: "📋", 
          title: translate("regular_player_title", lang), 
          desc: translate("regular_player_desc", lang) 
        });
      }

      // Check for referrals
      const referralSignups = activityLogs.filter(log => log.activity_type === 'referral_signup').length;
      if (referralSignups >= 10) {
        achievements.push({ 
          icon: "👥", 
          title: translate("community_builder_title", lang), 
          desc: translate("community_builder_desc", lang) 
        });
      } else if (referralSignups >= 5) {
        achievements.push({ 
          icon: "👫", 
          title: translate("recruiter_title", lang), 
          desc: translate("recruiter_desc", lang) 
        });
      } else if (referralSignups >= 1) {
        achievements.push({ 
          icon: "👤", 
          title: translate("first_referral_title", lang), 
          desc: translate("first_referral_desc", lang) 
        });
      }
    }

    // Tier-based achievement (matching points.service.js)
    const tierAchievements = {
      'Ascended': { icon: "🌟", titleKey: "ascended_tier_title", descKey: "ascended_tier_desc" },
      'Diamond': { icon: "💎", titleKey: "diamond_tier_title", descKey: "diamond_tier_desc" },
      'Platinum': { icon: "🏆", titleKey: "platinum_tier_title", descKey: "platinum_tier_desc" },
      'Gold': { icon: "🥇", titleKey: "gold_tier_title", descKey: "gold_tier_desc" },
      'Silver': { icon: "🥈", titleKey: "silver_tier_title", descKey: "silver_tier_desc" },
      'Bronze': { icon: "🥉", titleKey: "bronze_tier_title", descKey: "bronze_tier_desc" }
    };

    if (profile.tier && tierAchievements[profile.tier]) {
      const tier = tierAchievements[profile.tier];
      achievements.push({ 
        icon: tier.icon, 
        title: translate(tier.titleKey, lang), 
        desc: translate(tier.descKey, lang) 
      });
    }

    // Return top 6 most impressive achievements
    return achievements.slice(0, 6);
  };

  const achievements = generateAchievements();

  return (
    <div className="profile-overview">
      <div className="overview-stats">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card ThemeBox" style={{ animationDelay: `${index * 0.1}s` }}>
            {/* <div style={{ fontSize: "32px", marginBottom: "8px" }}>{stat.icon}</div> */}
            <div className="profile-stat-icon-2">
              <img
                src={ACHIEVEMENT_ICONS[stat.icon]}
                alt={stat.label}
                width={70}
                height={70}
              />
            </div>
            <h4>{stat.label}</h4>
            <span>{stat.value}</span>
          </div>
        ))}
      </div>

      <div className="overview-about ThemeBox">
        <h3 className="Profile-title">{translate("profileOverview_recentAchievements", lang)}</h3>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "20px" }}>
          {achievements.length > 0 ? (
            achievements.map((achievement, i) => (
              <div 
                key={i} 
                className="achievement-badge"
                style={{ 
                  padding: "16px 20px", 
                  background: "linear-gradient(135deg, rgba(79, 172, 254, 0.15) 0%, rgba(102, 126, 234, 0.15) 100%)", 
                  border: "2px solid rgba(79, 172, 254, 0.3)", 
                  borderRadius: "16px", 
                  display: "flex", 
                  flexDirection: "column",
                  alignItems: "center", 
                  gap: "8px",
                  minWidth: "140px",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  animation: `scaleIn 0.5s ease ${i * 0.1}s backwards`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px) scale(1.02)";
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(79, 172, 254, 0.3)";
                  e.currentTarget.style.borderColor = "rgba(79, 172, 254, 0.6)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0) scale(1)";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.borderColor = "rgba(79, 172, 254, 0.3)";
                }}
              >
                <span style={{ fontSize: "32px", filter: "drop-shadow(0 0 8px rgba(79, 172, 254, 0.6))" }}>
                  {achievement.icon}
                </span>
                <span style={{ fontWeight: "700", fontSize: "14px", textAlign: "center" }}>
                  {achievement.title}
                </span>
                <span style={{ fontSize: "11px", color: "var(--text-muted)", textAlign: "center" }}>
                  {achievement.desc}
                </span>
              </div>
            ))
          ) : (
            <p style={{ opacity: 0.7 }}>{translate("profileOverview_noAchievements", lang)}</p>
          )}
        </div>
      </div>
      <div className="overview-about ThemeBox">
        <h3 className="Profile-title">Leaderboard</h3>
       <LeaderboardBanner
          rank={profile?.stats?.rank}
          points={profile?.stats?.points}
        />
      </div>

      <div className="overview-about ThemeBox">
        <h3 className="Profile-title">{translate("profileOverview_aboutMe", lang)}</h3>
        <p className="Profile-about">{profile.about_me || translate("profileOverview_aboutMePlaceholder", lang)}</p>

        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "16px" }}>
          {(profile.interests?.length ?? 0) > 0 &&
            profile.interests.map((tag, i) => (
              <span key={i} style={{ padding: "6px 14px", background: "rgba(79, 172, 254, 0.15)", borderRadius: "20px", fontSize: "13px", fontWeight: "600" }}>
                #{tag}
              </span>
            ))}
        </div>
      </div>
    </div>
  );
}