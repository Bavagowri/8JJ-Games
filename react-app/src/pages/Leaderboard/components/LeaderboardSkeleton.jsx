// react-app/src/pages/Leaderboard/components/LeaderboardSkeleton.jsx

import React from 'react';
import '../styles/leaderboard.css';

const LeaderboardSkeleton = () => {
  return (
    <div className="leaderboard-skeleton">
      {/* Podium Skeleton */}
      <div className="skeleton-podium">
        <div className="skeleton-podium-card">
          <div className="skeleton-avatar"></div>
          <div className="skeleton-text skeleton-text-short"></div>
          <div className="skeleton-text skeleton-text-mini"></div>
        </div>
        <div className="skeleton-podium-card skeleton-podium-first">
          <div className="skeleton-avatar skeleton-avatar-large"></div>
          <div className="skeleton-text skeleton-text-short"></div>
          <div className="skeleton-text skeleton-text-mini"></div>
        </div>
        <div className="skeleton-podium-card">
          <div className="skeleton-avatar"></div>
          <div className="skeleton-text skeleton-text-short"></div>
          <div className="skeleton-text skeleton-text-mini"></div>
        </div>
      </div>

      {/* List Skeleton */}
      <div className="skeleton-list">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="skeleton-rank-card">
            <div className="skeleton-rank-number"></div>
            <div className="skeleton-avatar skeleton-avatar-small"></div>
            <div className="skeleton-text skeleton-text-medium"></div>
            <div className="skeleton-badge"></div>
            <div className="skeleton-text skeleton-text-mini"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeaderboardSkeleton;