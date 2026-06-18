// src/pages/mobile/MobileLeaderboard/components/MobileHowItWorks.jsx
// ENHANCED WITH LUCIDE ICONS & CREATIVE STYLING

import { Trophy, Gamepad2, Clock, TrendingUp } from "lucide-react";
import { useLanguage } from "../../../../context/LanguageContext";
import { translate } from "../../../../data/translations";

export default function MobileHowItWorks() {
  const { lang } = useLanguage();

  // ── Enhanced items array with color schemes ──
  const items = [
    {
      icon: Gamepad2,
      title: translate("leaderboard_how_play", lang),
      desc: translate("leaderboard_how_play_desc", lang),
      color: '#4facfe'
    },
    {
      icon: Clock,
      title: translate("leaderboard_how_time", lang),
      desc: translate("leaderboard_how_time_desc", lang),
      color: '#a78bfa'
    },
    {
      icon: TrendingUp,
      title: translate("leaderboard_how_level", lang),
      desc: translate("leaderboard_how_level_desc", lang),
      color: '#34d399'
    },
    {
      icon: Trophy,
      title: translate("leaderboard_how_tier", lang),
      desc: translate("leaderboard_how_tier_desc", lang),
      color: '#fbbf24'
    },
  ];

  return (
    <section className="mobile-how-section">
      <h3 className="mobile-how-title">
        {translate("leaderboard_how_title", lang)}
      </h3>

      <div className="mobile-how-grid">
        {items.map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={i} className="mobile-how-card">
              <div 
                className="mobile-how-icon-wrap"
                style={{
                  background: `linear-gradient(135deg, ${item.color}40, ${item.color}20)`,
                  boxShadow: `0 4px 16px ${item.color}30`,
                  borderColor: `${item.color}30`
                }}
              >
                <Icon 
                  size={20} 
                  className="mobile-how-icon" 
                  strokeWidth={2.5}
                  style={{ color: item.color }}
                />
              </div>
              <div className="mobile-how-content">
                <h4 className="mobile-how-card-title">{item.title}</h4>
                <p className="mobile-how-card-desc">{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}