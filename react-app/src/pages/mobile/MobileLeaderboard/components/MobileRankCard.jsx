// src/pages/mobile/MobileLeaderboard/components/MobileRankCard.jsx
// ENHANCED WITH LUCIDE ICONS & IMPROVED STYLING

import { TrendingUp, TrendingDown, Minus, Gamepad2, Star, Crown, Trophy } from 'lucide-react';

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
    label: 'Rookie' 
  },
  pro:      { 
    icon: Star, 
    color: '#FF8A3D', 
    label: 'Pro' 
  },
  master:   { 
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

export default function MobileRankCard({ player, index, isCurrentUser = false }) {
  // ── Rank change helpers with enhanced icons ──
  const getRankChangeIcon = () => {
    if (player.change > 0) {
      return <TrendingUp size={11} className="mobile-rank-change-up" strokeWidth={3} />;
    }
    if (player.change < 0) {
      return <TrendingDown size={11} className="mobile-rank-change-down" strokeWidth={3} />;
    }
    return <Minus size={11} className="mobile-rank-change-same" strokeWidth={3} />;
  };
  
  const getRankChangeText = () => {
    if (player.change > 0) return `+${player.change}`;
    if (player.change < 0) return `${player.change}`;
    return '—';
  };

  const isAlternate = index % 2 === 1;
  const tierData = tierInfo[player.tier] || tierInfo.rookie;
  const TierIcon = tierData.icon;

  return (
    <div className={`mobile-rank-card ${isCurrentUser ? 'current-user' : ''} ${isAlternate ? 'alternate' : ''}`}>
      {/* Enhanced YOU glow */}
      {isCurrentUser && <div className="mobile-rank-card-glow" />}

      {/* Rank number */}
      <div className="mobile-rank-number-wrap">
        <span className="mobile-rank-number">{player.rank}</span>
      </div>

      {/* Avatar */}
      <div className="mobile-rank-avatar-wrap">
        <img 
          src={getAvatarUrl(player.avatar)} 
          alt={player.username} 
          className="mobile-rank-avatar" 
        />
      </div>

      {/* User info */}
      <div className="mobile-rank-info">
        <div className="mobile-rank-username-row">
          <h4 className="mobile-rank-username">{player.username}</h4>
          {isCurrentUser && (
            <span className="mobile-you-badge">YOU</span>
          )}
        </div>
        {/* Enhanced tier badge with Lucide icon */}
        <div className="mobile-rank-tier-badge" style={{ color: tierData.color }}>
          <TierIcon size={12} strokeWidth={2.5} />
          <span>{tierData.label}</span>
        </div>
      </div>

      {/* Score + change (right side) */}
      <div className="mobile-rank-score-wrap">
        <span className={`mobile-rank-score ${isCurrentUser ? 'highlighted' : ''}`}>
          {player.score.toLocaleString()}
        </span>
        {player.change !== undefined && player.change !== 0 && (
          <div className={`mobile-rank-change ${player.change > 0 ? 'up' : 'down'}`}>
            {getRankChangeIcon()}
            <span>{getRankChangeText()}</span>
          </div>
        )}
      </div>
    </div>
  );
}