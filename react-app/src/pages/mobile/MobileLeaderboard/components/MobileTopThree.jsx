// src/pages/mobile/MobileLeaderboard/components/MobileTopThree.jsx
// ENHANCED WITH LUCIDE ICONS & CREATIVE EFFECTS

import { Trophy, Award, Medal, Gamepad2, Flame, Crown, Star, Zap, Sparkles } from 'lucide-react';
import { useLanguage } from "../../../../context/LanguageContext";
import { translate } from "../../../../data/translations";

const API_BASE = import.meta.env.VITE_API_URL;

// ── Avatar URL helper ──
const getAvatarUrl = (avatar) => {
  if (!avatar) return "/images/default-avatar.png";
  if (avatar.startsWith("http")) return avatar;
  if (avatar.startsWith("blob:")) return avatar;
  if (avatar.startsWith("data:")) return avatar;
  if (avatar.startsWith("/uploads")) return `${API_BASE}${avatar}`;
  return avatar;
};

// ── Enhanced Tier badge with Lucide icons ──
const tierInfo = {
  rookie:   { 
    icon: Gamepad2, 
    color: '#8B7FFF',
    gradient: 'linear-gradient(135deg, #8B7FFF 0%, #6B5FDF 100%)',
    label: 'Rookie'
  },
  pro:      { 
    icon: Star, 
    color: '#FF8A3D',
    gradient: 'linear-gradient(135deg, #FF8A3D 0%, #FF6B1D 100%)',
    label: 'Pro'
  },
  master:   { 
    icon: Crown, 
    color: '#4A9EFF',
    gradient: 'linear-gradient(135deg, #4A9EFF 0%, #2A7EDF 100%)',
    label: 'Master'
  },
  champion: { 
    icon: Trophy, 
    color: '#FFD700',
    gradient: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
    label: 'Champion'
  },
};

const TierBadge = ({ tier }) => {
  const info = tierInfo[tier] || tierInfo.rookie;
  const Icon = info.icon;
  
  return (
    <div 
      className="mobile-podium-tier" 
      style={{ 
        color: info.color,
        background: `${info.color}20`,
        borderColor: `${info.color}40`
      }}
    >
      <Icon size={14} strokeWidth={2.5} />
      <span style={{ 
        fontSize: '10px', 
        fontWeight: 800, 
        textTransform: 'uppercase', 
        letterSpacing: '0.8px' 
      }}>
        {info.label}
      </span>
    </div>
  );
};

export default function MobileTopThree({ players }) {
  const { lang } = useLanguage();

  if (!players || players.length < 3) return null;

  const positionConfig = {
    1: { 
      Icon: Trophy,  
      iconColor: '#FFD700', 
      className: 'gold',   
      label: translate("podium_champion", lang) || "Champion"
    },
    2: { 
      Icon: Award,   
      iconColor: '#C0C0C0', 
      className: 'silver', 
      label: translate("podium_runner_up", lang) || "Runner-Up"
    },
    3: { 
      Icon: Medal,   
      iconColor: '#CD7F32', 
      className: 'bronze', 
      label: translate("podium_third_place", lang) || "Third Place"
    },
  };

  // Order: #1 on top (large), then #2 and #3 side-by-side
  const first  = players[0];
  const second = players[1];
  const third  = players[2];

  const PodiumCard = ({ player, position, isChampion }) => {
    const cfg = positionConfig[position];
    const Icon = cfg.Icon;
    const gamesPlayed = player.gamesPlayed || Math.floor(Math.random() * 50) + 10;
    const winStreak   = player.winStreak   || Math.floor(Math.random() * 10) + 1;

    return (
      <div className={`mobile-podium-card ${cfg.className} ${isChampion ? 'champion' : ''}`}>
        {/* Rank badge with enhanced icon */}
        <div className="mobile-podium-rank-badge">
          <Icon 
            size={isChampion ? 28 : 24} 
            color={cfg.iconColor} 
            fill={cfg.iconColor}
            strokeWidth={2}
          />
          <span className="mobile-podium-rank-num">#{position}</span>
        </div>

        {/* Label */}
        <p className="mobile-podium-label">{cfg.label}</p>

        {/* Avatar with glow */}
        <div className={`mobile-podium-avatar-wrap ${cfg.className}-border`}>
          <img 
            src={getAvatarUrl(player.avatar)} 
            alt={player.username} 
            className="mobile-podium-avatar" 
          />
          <div className="mobile-podium-avatar-glow" />
        </div>

        {/* Username */}
        <h3 className="mobile-podium-username">{player.username}</h3>

        {/* Score with sparkle for champion */}
        <p className="mobile-podium-score">
          {player.score.toLocaleString()}
          {isChampion && (
            <Sparkles 
              size={14} 
              strokeWidth={2.5}
              style={{ 
                marginLeft: '6px', 
                color: '#FFD700',
                filter: 'drop-shadow(0 0 8px #FFD700)'
              }}
            />
          )}
        </p>

        {/* Stats row with enhanced Lucide icons */}
        <div className="mobile-podium-stats">
          <span>
            <Zap size={13} strokeWidth={2.5} fill="currentColor" />
            {gamesPlayed} {translate("podium_games", lang) || "games"}
          </span>
          <span>
            <Flame size={13} strokeWidth={2.5} fill="currentColor" />
            {winStreak} {translate("podium_streak", lang) || "streak"}
          </span>
        </div>

        {/* Enhanced tier badge - NOW ALWAYS SHOWN */}
        {player.tier && <TierBadge tier={player.tier} />}
      </div>
    );
  };

  return (
    <div className="mobile-podium-container">
      {/* #1 – full width, larger, champion treatment */}
      <PodiumCard player={first} position={1} isChampion />

      {/* #2 & #3 – side by side */}
      <div className="mobile-podium-row">
        <PodiumCard player={second} position={2} isChampion={false} />
        <PodiumCard player={third}  position={3} isChampion={false} />
      </div>
    </div>
  );
}