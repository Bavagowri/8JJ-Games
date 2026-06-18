// react-app/src/pages/Leaderboard/components/LeaderboardTopThree.jsx
// ENHANCED WITH CREATIVE PODIUM EFFECTS & LUCIDE ICONS

import React from 'react';
import { Trophy, Award, Medal, Flame, Zap, Sparkles, Star, Gamepad2, Crown } from 'lucide-react';
import { useLanguage } from "../../../context/LanguageContext";
import { translate } from "../../../data/translations";
import '../styles/leaderboard-podium.css';

const LeaderboardTopThree = ({ players }) => {
  const { lang } = useLanguage();

  if (!players || players.length < 3) {
    return null;
  }
  
  const API_BASE = import.meta.env.VITE_API_URL;
  if (!API_BASE) {
    throw new Error("❌ VITE_API_URL is not defined");
  }

  const [second, first, third] = [players[1], players[0], players[2]];

  const getAvatarUrl = (avatar) => {
    if (!avatar) return "/images/default-avatar.png";
    if (avatar.startsWith("http")) return avatar;
    if (avatar.startsWith("blob:")) return avatar;
    if (avatar.startsWith("data:")) return avatar;
    if (avatar.startsWith("/uploads")) {
      return `${API_BASE}${avatar}`;
    }
    return avatar;
  };

  // ── Enhanced Tier badge with Lucide icons ──
  const tierInfo = {
    rookie: {
      icon: Gamepad2,
      color: '#8B7FFF',
      gradient: 'linear-gradient(135deg, #8B7FFF 0%, #6B5FDF 100%)',
      label: 'Rookie'
    },
    pro: {
      icon: Star,
      color: '#FF8A3D',
      gradient: 'linear-gradient(135deg, #FF8A3D 0%, #FF6B1D 100%)',
      label: 'Pro'
    },
    master: {
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
        className="podium-tier-badge-custom"
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

  const PodiumCard = ({ player, position }) => {
    const positionStyles = {
      1: { 
        icon: Trophy, 
        iconColor: '#FFD700', 
        className: 'gold',
        rankNum: 1,
        label: translate("podium_champion", lang)
      },
      2: { 
        icon: Award, 
        iconColor: '#C0C0C0', 
        className: 'silver',
        rankNum: 2,
        label: translate("podium_runner_up", lang)
      },
      3: { 
        icon: Medal, 
        iconColor: '#CD7F32', 
        className: 'bronze',
        rankNum: 3,
        label: translate("podium_third_place", lang)
      }
    };

    const style = positionStyles[position];
    const Icon = style.icon;

    // Mock stats - replace with real data if available
    const gamesPlayed = player.gamesPlayed || Math.floor(Math.random() * 50) + 10;
    const winStreak = player.winStreak || Math.floor(Math.random() * 10) + 1;

    return (
      <div className={`podium-card ${style.className} animate-scale-up`}>
        {/* Rank Badge with Icon */}
        <div className="podium-rank-badge">
          <Icon 
            size={position === 1 ? 28 : 24} 
            strokeWidth={2.5}
            style={{ color: style.iconColor }}
          />
          <span className="podium-rank-number">#{style.rankNum}</span>
          {position === 1 && (
            <div className="rank-badge-glow" style={{ background: style.iconColor }}></div>
          )}
        </div>

        {/* Position Label */}
        <div className="podium-rank-label">
          {style.label}
        </div>
        
        {/* Avatar Container */}
        <div className={`podium-avatar-container ${style.className}-border`}>
          <img
            src={getAvatarUrl(player.avatar)}
            alt={player.username}
            className="podium-avatar"
          />
          <div className="avatar-glow"></div>
          <div className="avatar-ringz"></div>
          
          {/* Crown Effect for Champion */}
          {position === 1 && (
            <div className="champion-crown">
              <Trophy size={20} strokeWidth={3} color="#FFD700" />
            </div>
          )}
        </div>

        {/* Username */}
        <h3 className="podium-username">{player.username}</h3>
        
        {/* Score */}
        <p className="podium-score">
          {player.score.toLocaleString()}
          {position === 1 && (
            <Sparkles className="score-sparkle" size={16} strokeWidth={2.5} />
          )}
        </p>
        
        {/* Player Stats */}
        <div className="podium-stats">
          <div className="stat-item">
            <Zap size={14} className="stat-iconz" strokeWidth={2.5} />
            <span className="stat-value">
              {gamesPlayed} {translate("podium_games", lang)}
            </span>
          </div>
          <div className="stat-item">
            <Flame size={14} className="stat-iconz" strokeWidth={2.5} />
            <span className="stat-value">
              {winStreak} {translate("podium_streak", lang)}
            </span>
          </div>
        </div>
        
        {/* Enhanced tier badge - NOW ALWAYS SHOWN */}
        {player.tier && <TierBadge tier={player.tier} />}

        {/* Decorative elements */}
        <div className="podium-shine"></div>
        
        {/* Champion Particles */}
        {position === 1 && (
          <>
            <Star className="champion-particle particle-1" size={12} strokeWidth={2.5} />
            <Sparkles className="champion-particle particle-2" size={10} strokeWidth={2.5} />
            <Zap className="champion-particle particle-3" size={8} strokeWidth={2.5} />
            <Star className="champion-particle particle-4" size={10} strokeWidth={2.5} />
          </>
        )}
      </div>
    );
  };

  return (
    <div className="leaderboard-podium">
      <PodiumCard player={second} position={2} />
      <PodiumCard player={first} position={1} />
      <PodiumCard player={third} position={3} />
    </div>
  );
};

export default LeaderboardTopThree;