// src/pages/mobile/MobileLeaderboard/components/MobileUserPosition.jsx
// ENHANCED WITH LUCIDE ICONS & CREATIVE EFFECTS

import { Play, Zap } from 'lucide-react';
import { useLanguage } from "../../../../context/LanguageContext";
import { translate } from "../../../../data/translations";
import { useNavigate } from 'react-router-dom';

export default function MobileUserPosition({ user, totalPlayers, activeTab, leaderboard }) {
  const { lang } = useLanguage();
  const navigate = useNavigate();

  if (!user) return null;

  // ── Empty state: friends tab with 0 players ──
  const isEmpty = activeTab === 'friends' && totalPlayers === 0;
  if (isEmpty) {
    return (
      <div className="mobile-user-pos-card empty-state">
        <div className="mobile-user-pos-empty-rank">—</div>
        <p className="mobile-user-pos-empty-text">
          {translate("add_friends_message", lang)}
        </p>
      </div>
    );
  }

  // ── Scope label ──
  const getPositionText = () => {
    if (activeTab === "friends") return translate("leaderboard_scope_friends", lang);
    if (activeTab === "country") return translate("leaderboard_scope_country", lang);
    return translate("leaderboard_scope_global", lang);
  };

  // ── Progress calculation ──
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

  const handlePlayNow = () => navigate('/all-mosaic-games');

  return (
    <div className="mobile-user-pos-card">
      {/* Enhanced pulse ring when close to ranking up */}
      {user.rank > 1 && pointsToNextRank > 0 && pointsToNextRank <= 20 && (
        <div className="mobile-user-pos-pulse">
          <div className="mobile-user-pos-pulse-ring" />
        </div>
      )}

      <div className="mobile-user-pos-content">
        {/* Enhanced Rank */}
        <div className="mobile-user-pos-rank">
          <span className="mobile-user-pos-hash">#</span>
          <span className="mobile-user-pos-number">{user.rank}</span>
        </div>

        {/* Middle: info + progress */}
        <div className="mobile-user-pos-info">
          <div className="mobile-user-pos-header">
            <p className="mobile-user-pos-label">
              {translate("your_position", lang)}
            </p>
            {/* Enhanced points-to-next indicator */}
            {user.rank > 1 && nextRankPlayer && pointsToNextRank > 0 && (
              <div className="mobile-user-pos-progress-indicator">
                <Zap 
                  size={12} 
                  className="mobile-user-pos-zap" 
                  fill="currentColor"
                  strokeWidth={2.5}
                />
                <span className="mobile-user-pos-progress-text">
                  {pointsToNextRank} {translate("pts_to_rank", lang, {
                    rank: user.rank - 1
                  }).replace(`${pointsToNextRank} `, '')}
                </span>
              </div>
            )}
          </div>

          <p className="mobile-user-pos-context">
            {translate("out_of_players", lang, {
              count: totalPlayers.toLocaleString(),
            })}{" "}
            {getPositionText()}
          </p>

          {/* Enhanced progress bar */}
          {user.rank > 1 && nextRankPlayer && (
            <div className="mobile-user-pos-bar-wrap">
              <div className="mobile-user-pos-bar">
                <div 
                  className="mobile-user-pos-bar-fill" 
                  style={{ width: `${progressPercentage}%` }}
                >
                  <div className="mobile-user-pos-bar-shine" />
                </div>
              </div>
              <div className="mobile-user-pos-bar-labels">
                <span>{user.score}</span>
                <span>{nextRankPlayer.score}</span>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Score */}
        <div className="mobile-user-pos-score">
          <span className="mobile-user-pos-score-label">
            {translate("score", lang)}
          </span>
          <span className="mobile-user-pos-score-value">
            {user.score.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Enhanced Play Now CTA */}
      <button className="mobile-user-pos-play-btn" onClick={handlePlayNow}>
        <Play 
          size={14} 
          fill="currentColor" 
          strokeWidth={2.5}
        />
        <span>{translate("play_to_climb", lang)}</span>
      </button>
    </div>
  );
}