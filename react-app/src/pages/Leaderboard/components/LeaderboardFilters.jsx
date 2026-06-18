// react-app/src/pages/Leaderboard/components/LeaderboardFilters.jsx
// ENHANCED WITH LUCIDE ICONS & CREATIVE STYLING

import React from 'react';
import { Filter, Gamepad2, Sword, Users, Zap } from 'lucide-react';
import '../styles/leaderboard.css';

const LeaderboardFilters = ({ selectedGame, onGameChange }) => {
  const games = [
    { id: 'all', label: 'All Games', icon: Gamepad2, color: '#4facfe' },
    { id: 'ffa', label: 'FFA Mode', icon: Sword, color: '#f59e0b' },
    { id: 'team', label: 'Team Mode', icon: Users, color: '#10b981' },
    { id: 'battle', label: 'Battle Royale', icon: Zap, color: '#ef4444' }
  ];

  return (
    <div className="leaderboard-filters">
      <div className="filters-header">
        <div className="filters-header-icon">
          <Filter size={18} strokeWidth={2.5} />
          <div className="filter-icon-pulse"></div>
        </div>
        <span>Game Mode</span>
      </div>
      
      <div className="filters-buttons">
        {games.map(game => {
          const Icon = game.icon;
          const isActive = selectedGame === game.id;
          
          return (
            <button
              key={game.id}
              className={`filter-button ${isActive ? 'active' : ''}`}
              onClick={() => onGameChange(game.id)}
              style={{
                '--filter-color': game.color,
                '--filter-glow': `${game.color}40`
              }}
            >
              <span className="filter-icon-wrapper">
                <Icon 
                  className="filter-icon" 
                  size={20} 
                  strokeWidth={2.5}
                />
                {isActive && <div className="filter-active-glow"></div>}
              </span>
              <span className="filter-label">{game.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default LeaderboardFilters;