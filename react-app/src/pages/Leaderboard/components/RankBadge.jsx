// react-app/src/pages/Leaderboard/components/RankBadge.jsx
// ENHANCED WITH LUCIDE ICONS & CREATIVE STYLING

import React from 'react';
import { Gamepad2, Star, Crown, Trophy, Zap, Sparkles } from 'lucide-react';
import '../styles/rank-badge.css';

const RankBadge = ({ tier, size = 'default', showPercentage = false }) => {
  const tierInfo = {
    rookie: {
      name: 'Rookie',
      percentage: '90% players',
      icon: Gamepad2,
      color: '#8B7FFF',
      gradient: 'linear-gradient(135deg, #8B7FFF 0%, #6B5FDF 100%)',
      glow: 'rgba(139, 127, 255, 0.4)'
    },
    pro: {
      name: 'Pro',
      percentage: 'Top 10%',
      icon: Star,
      color: '#FF8A3D',
      gradient: 'linear-gradient(135deg, #FF8A3D 0%, #FF6B1D 100%)',
      glow: 'rgba(255, 138, 61, 0.4)'
    },
    master: {
      name: 'Master',
      percentage: 'Top 5%',
      icon: Crown,
      color: '#4A9EFF',
      gradient: 'linear-gradient(135deg, #4A9EFF 0%, #2A7EDF 100%)',
      glow: 'rgba(74, 158, 255, 0.4)'
    },
    champion: {
      name: 'Champion',
      percentage: 'Top 1%',
      icon: Trophy,
      color: '#FFD700',
      gradient: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
      glow: 'rgba(255, 215, 0, 0.5)'
    }
  };

  const info = tierInfo[tier] || tierInfo.rookie;
  const IconComponent = info.icon;

  if (size === 'large') {
    return (
      <div className={`rank-badge-large rank-badge-Leader ${tier}`}>
        <div className="badge-icon-wrapper">
          <div className="icon-glow" style={{ background: info.glow }}></div>
          <IconComponent 
            className="badge-icon" 
            size={40} 
            strokeWidth={2.5}
            style={{ color: info.color }}
          />
          {tier === 'champion' && (
            <>
              <Sparkles 
                className="sparkle sparkle-1" 
                size={16} 
                style={{ color: info.color }}
              />
              <Sparkles 
                className="sparkle sparkle-2" 
                size={14} 
                style={{ color: info.color }}
              />
              <Zap 
                className="sparkle sparkle-3" 
                size={12} 
                style={{ color: info.color }}
              />
            </>
          )}
        </div>
        <p className="badge-name">{info.name}</p>
        {showPercentage && <p className="badge-percentage">{info.percentage}</p>}
      </div>
    );
  }

  if (size === 'mini') {
    return (
      <div className={`rank-badge-mini rank-badge-Leader ${tier}`}>
        <IconComponent 
          size={18} 
          strokeWidth={2.5}
          style={{ color: tier === 'champion' ? '#1A1F2E' : '#FFFFFF' }}
        />
      </div>
    );
  }

  return (
    <span className={`rank-badge-Leader ${tier}`}>
      <IconComponent size={16} strokeWidth={2.5} />
      <span className="badge-text">{info.name}</span>
    </span>
  );
};

export default RankBadge;