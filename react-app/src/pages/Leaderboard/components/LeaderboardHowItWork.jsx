// react-app/src/pages/Leaderboard/components/LeaderboardHowItWork.jsx
// ENHANCED WITH LUCIDE ICONS & CREATIVE ANIMATIONS

import { Trophy, Gamepad2, Clock, TrendingUp, Zap, Target, Award, Users } from "lucide-react";
import "./leaderboard-how-it-works.css";
import { useLanguage } from "../../../context/LanguageContext";
import { translate } from "../../../data/translations";

export default function LeaderboardHowItWorks() {
  const { lang } = useLanguage();

  const items = [
    {
      icon: Gamepad2,
      title: translate("leaderboard_how_play", lang),
      desc: translate("leaderboard_how_play_desc", lang),
      color: '#4facfe',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    },
    {
      icon: Clock,
      title: translate("leaderboard_how_time", lang),
      desc: translate("leaderboard_how_time_desc", lang),
      color: '#a78bfa',
      gradient: 'linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)'
    },
    {
      icon: TrendingUp,
      title: translate("leaderboard_how_level", lang),
      desc: translate("leaderboard_how_level_desc", lang),
      color: '#34d399',
      gradient: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)'
    },
    {
      icon: Trophy,
      title: translate("leaderboard_how_tier", lang),
      desc: translate("leaderboard_how_tier_desc", lang),
      color: '#fbbf24',
      gradient: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)'
    },
  ];

  return (
    <section className="leaderboard-how">
      <div className="how-header">
        <div className="how-header-icon">
          <Target size={24} strokeWidth={2.5} />
          <div className="header-icon-glow"></div>
        </div>
        <h3 className="how-title">
          {translate("leaderboard_how_title", lang)}
        </h3>
      </div>

      <div className="how-grid">
        {items.map((item, i) => {
          const Icon = item.icon;
          return (
            <div 
              key={i} 
              className="how-card"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="how-card-inner">
                <div 
                  className="how-icon"
                  style={{ 
                    background: item.gradient,
                    boxShadow: `0 4px 20px ${item.color}40`
                  }}
                >
                  <Icon size={22} strokeWidth={2.5} />
                  <div 
                    className="icon-pulse"
                    style={{ background: item.color }}
                  ></div>
                </div>
                <div className="how-content">
                  <h4>{item.title}</h4>
                  <p>{item.desc}</p>
                </div>
              </div>
              <div 
                className="how-card-shine"
                style={{ 
                  background: `linear-gradient(135deg, transparent, ${item.color}20, transparent)` 
                }}
              ></div>
            </div>
          );
        })}
      </div>

      {/* Decorative Elements */}
      <div className="how-decorations">
        <Zap className="decoration decoration-1" size={16} />
        <Award className="decoration decoration-2" size={14} />
        <Users className="decoration decoration-3" size={12} />
      </div>
    </section>
  );
}