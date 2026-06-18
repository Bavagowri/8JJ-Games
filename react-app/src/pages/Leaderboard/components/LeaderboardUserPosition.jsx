



// =====================================================
//  LeaderboardUserPosition.jsx 
// =====================================================

import React from 'react';
import { Play, Zap } from 'lucide-react';
import '../styles/leaderboard-user-position.css';
import { useLanguage } from "../../../context/LanguageContext";
import { translate } from "../../../data/translations";
import { useNavigate } from 'react-router-dom';

const LeaderboardUserPosition = ({ user, totalPlayers, activeTab, leaderboard }) => {
  const { lang } = useLanguage();
  const navigate = useNavigate();

  if (!user) {
    return null;
  }

  // Check if this is an empty state (no friends scenario)
  const isEmpty = activeTab === 'friends' && totalPlayers === 0;

  if (isEmpty) {
    return (
      <div className="user-position-card empty-state">
        <div className="empty-state-content">
          <div className="empty-rank">—</div>
          <p className="empty-text">
            {translate("add_friends_message", lang)}
          </p>
        </div>
      </div>
    );
  }

  const getPositionText = () => {
    if (activeTab === "friends") {
      return translate("leaderboard_scope_friends", lang);
    }
    if (activeTab === "country") {
      return translate("leaderboard_scope_country", lang);
    }
    return translate("leaderboard_scope_global", lang);
  };

  // Calculate next rank info
  const currentRankIndex = user.rank - 1;
  const nextRankPlayer = leaderboard && currentRankIndex > 0 
    ? leaderboard[currentRankIndex - 1] 
    : null;
  
  const pointsToNextRank = nextRankPlayer 
    ? Math.max(0, nextRankPlayer.score - user.score + 1)
    : 0;

  const progressPercentage = nextRankPlayer && nextRankPlayer.score > 0
    ? Math.min(100, (user.score / nextRankPlayer.score) * 100) 
    : 100;

  const handlePlayNow = () => {
    navigate('/all-mosaic-games');
  };

  return (
    <div className="user-position-card">
      <div className="user-position-content">
        {/* Rank Section */}
        <div className="user-position-rank">
          <span className="rank-hash">#</span>
          <span className="rank-number">{user.rank}</span>
        </div>

        {/* Info Section with Progress */}
        <div className="user-position-info">
          <div className="position-header">
            <p className="position-text">
              {translate("your_position", lang)}
            </p>
            
            {/* Progress Indicator - Only show if not #1 */}
            {user.rank > 1 && nextRankPlayer && pointsToNextRank > 0 && (
              <div className="rank-progress-indicator">
                <Zap size={14} className="progress-icon" fill="currentColor" />
                <span className="progress-text">
                  {pointsToNextRank} {translate("pts_to_rank", lang, { 
                    rank: user.rank - 1 
                  }).replace(`${pointsToNextRank} `, '')}
                </span>
              </div>
            )}
          </div>
          
          <p className="position-context">
            {translate("out_of_players", lang, {
              count: totalPlayers.toLocaleString(),
            })}{" "}
            {getPositionText()}
          </p>

          {/* Progress Bar - Only show if not #1 */}
          {user.rank > 1 && nextRankPlayer && (
            <div className="rank-progress-bar-container">
              <div className="rank-progress-bar">
                <div 
                  className="rank-progress-fill"
                  style={{ width: `${progressPercentage}%` }}
                >
                  <div className="progress-shine"></div>
                </div>
              </div>
              <div className="progress-labels">
                <span className="progress-label-current">{user.score}</span>
                <span className="progress-label-target">{nextRankPlayer.score}</span>
              </div>
            </div>
          )}
        </div>

        {/* Score Section */}
        <div className="user-position-score">
          <span className="score-label">
            {translate("score", lang)}
          </span>
          <span className="score-value">{user.score.toLocaleString()}</span>
        </div>

        {/* Play Now CTA Button */}
        <button className="play-now-btnz" onClick={handlePlayNow}>
          <Play size={16} fill="currentColor" className="play-icon" />
          <span className="play-text">
            {translate("play_to_climb", lang)}
          </span>
        </button>
      </div>

      {/* Motivational pulse effect */}
      {user.rank > 1 && pointsToNextRank > 0 && pointsToNextRank <= 20 && (
        <div className="close-to-rank-up">
          <div className="pulse-ring"></div>
        </div>
      )}
    </div>
  );
};

export default LeaderboardUserPosition;