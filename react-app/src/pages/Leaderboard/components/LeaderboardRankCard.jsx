// react-app/src/pages/Leaderboard/components/LeaderboardRankCard.jsx
// ENHANCED WITH LUCIDE ICONS & TIER BADGES

import React from 'react';
import { TrendingUp, TrendingDown, Minus, Gamepad2, Star, Crown, Trophy } from 'lucide-react';
import '../styles/leaderboard-card.css';

const LeaderboardRankCard = ({ player, index, isCurrentUser = false }) => {
  
  const API_BASE = import.meta.env.VITE_API_URL;
  if (!API_BASE) {
    throw new Error("❌ VITE_API_URL is not defined");
  }

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
      label: 'Rookie'
    },
    pro: {
      icon: Star,
      color: '#FF8A3D',
      label: 'Pro'
    },
    master: {
      icon: Crown,
      color: '#4A9EFF',
      label: 'Master'
    },
    champion: {
      icon: Trophy,
      color: '#FFD700',
      label: 'Champion'
    },
  };

  const TierBadge = ({ tier }) => {
    const info = tierInfo[tier] || tierInfo.rookie;
    const Icon = info.icon;

    return (
      <div className="rank-tier-badge-custom" style={{ color: info.color }}>
        <Icon size={14} strokeWidth={2.5} />
        <span>{info.label}</span>
      </div>
    );
  };

  const getRankChangeIcon = () => {
    if (player.change > 0) {
      return <TrendingUp size={14} className="rank-change-up" strokeWidth={3} />;
    } else if (player.change < 0) {
      return <TrendingDown size={14} className="rank-change-down" strokeWidth={3} />;
    }
    return <Minus size={14} className="rank-change-same" strokeWidth={3} />;
  };

  const getRankChangeText = () => {
    if (player.change > 0) {
      return `+${player.change}`;
    } else if (player.change < 0) {
      return `${player.change}`;
    }
    return '—';
  };

  // Determine if row should have alternate background
  const isAlternate = index % 2 === 1;

  return (
    <div 
      className={`rank-card ${isCurrentUser ? 'current-user' : ''} ${isAlternate ? 'alternate' : ''} animate-slide-up stagger-${Math.min(index + 1, 10)}`}
    >
      {/* Current user spotlight effect */}
      {isCurrentUser && (
        <div className="current-user-glow"></div>
      )}

      <div className="rank-card-left">
        <div className="rank-number-container">
          <div className="rank-number">
            {player.rank}
          </div>
        </div>
        
        <div className="rank-avatar-container">
          <img
            src={getAvatarUrl(player.avatar)}
            alt={player.username}
            className="rank-avatar"
          />
          <div className="leaderboard-avatar-ring"></div>
        </div>

        <div className="rank-user-info">
          <div className="username-container">
            <h4 className="rank-username">{player.username}</h4>
            {isCurrentUser && (
              <span className="you-badge-ultra">
                <span className="you-badge-text">YOU</span>
                <span className="you-badge-shine"></span>
                <span className="you-badge-glow-ring"></span>
              </span>
            )}
          </div>
          {/* Enhanced tier badge */}
          {player.tier && <TierBadge tier={player.tier} />}
        </div>
      </div>

      <div className="rank-card-right">
        <div className="rank-score-container">
          <p className={`rank-score ${isCurrentUser ? 'highlighted' : ''}`}>
            {player.score.toLocaleString()}
          </p>
          
          {/* Rank Change Indicator */}
          {player.change !== undefined && player.change !== 0 && (
            <div className={`rank-change ${player.change > 0 ? 'up' : player.change < 0 ? 'down' : 'same'}`}>
              {getRankChangeIcon()}
              <span className="rank-change-value">{getRankChangeText()}</span>
            </div>
          )}
        </div>
      </div>

      {/* Hover shine effect */}
      <div className="card-shine"></div>
    </div>
  );
};

export default LeaderboardRankCard;