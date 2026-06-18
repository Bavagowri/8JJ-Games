// react-app/src/pages/Leaderboard/components/RankTierInfo.jsx
// ENHANCED WITH LUCIDE ICONS & CREATIVE EFFECTS

import React from 'react';
import { ChevronDown, ChevronUp, Info, Sparkles } from 'lucide-react';
import RankBadge from './RankBadge';
import '../styles/leaderboard.css';

const RankTierInfo = ({ expanded, onToggle }) => {
  return (
    <div className="rank-tier-info">
      <button className="tier-info-toggle" onClick={onToggle}>
        <div className="tier-toggle-content">
          <div className="tier-toggle-icon">
            <Info size={20} strokeWidth={2.5} />
            <div className="info-icon-glow"></div>
          </div>
          <span className="tier-toggle-text">How to get ranked?</span>
          <Sparkles className="tier-sparkle" size={16} strokeWidth={2.5} />
        </div>
        <div className="tier-toggle-chevron">
          {expanded ? (
            <ChevronUp size={22} strokeWidth={2.5} />
          ) : (
            <ChevronDown size={22} strokeWidth={2.5} />
          )}
        </div>
      </button>
      
      {expanded && (
        <div className="tier-info-content animate-slide-down">
          <p className="tier-info-description">
            Get a Final score in FFA Mode to unlock your rank tier and climb the leaderboard!
          </p>
          
          <div className="tier-badges-grid">
            <RankBadge tier="rookie" size="large" showPercentage={true} />
            <RankBadge tier="pro" size="large" showPercentage={true} />
            <RankBadge tier="master" size="large" showPercentage={true} />
            <RankBadge tier="champion" size="large" showPercentage={true} />
          </div>
        </div>
      )}
    </div>
  );
};

export default RankTierInfo;