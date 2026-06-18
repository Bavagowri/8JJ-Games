// src/components/mobile/MobileGameFilter/MobileGameFilter.jsx

import { useState, useEffect } from "react";
import { translate } from "../../../data/translations";
import { useLanguage } from "../../../context/LanguageContext";
import { filterOptions } from "../../../data/gameMetadata";
import "./MobileGameFilter.css";

export default function MobileGameFilter({ 
  isOpen,
  onClose,
  onFilterChange,
  totalGames,
  filteredCount,
  initialFilters
}) {
  const { lang } = useLanguage();
  
  const [filters, setFilters] = useState(initialFilters || {
    categories: [],
    tags: [],
    difficulty: [],
    players: [],
    ageRating: [],
    features: [],
    onlyTrending: false,
    onlyPopular: false
  });

  const [activeTab, setActiveTab] = useState('categories');
  const [searchQuery, setSearchQuery] = useState('');

  // Sync with parent initial filters
  useEffect(() => {
    if (initialFilters) {
      setFilters(initialFilters);
    }
  }, [initialFilters]);

  const handleCheckboxChange = (filterType, value) => {
    setFilters(prev => {
      const currentValues = prev[filterType];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      
      return { ...prev, [filterType]: newValues };
    });
  };

  const handleToggleChange = (filterType) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: !prev[filterType]
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      categories: [],
      tags: [],
      difficulty: [],
      players: [],
      ageRating: [],
      features: [],
      onlyTrending: false,
      onlyPopular: false
    });
  };

  const applyFilters = () => {
    onFilterChange(filters);
    onClose();
  };

  const getActiveFilterCount = () => {
    return filters.categories.length +
           filters.tags.length +
           filters.difficulty.length +
           filters.players.length +
           filters.ageRating.length +
           filters.features.length +
           (filters.onlyTrending ? 1 : 0) +
           (filters.onlyPopular ? 1 : 0);
  };

  const hasActiveFilters = getActiveFilterCount() > 0;

  // Filter options based on search
  const getFilteredOptions = (options) => {
    if (!searchQuery.trim()) return options;
    
    const query = searchQuery.toLowerCase();
    if (Array.isArray(options)) {
      return options.filter(opt => {
        const label = typeof opt === 'string' ? opt : opt.label;
        return label.toLowerCase().includes(query);
      });
    }
    return options;
  };

  const tabs = [
    { id: 'categories', label: translate('categories', lang) || 'Categories', icon: '📁' },
    { id: 'special', label: translate('special', lang) || 'Special', icon: '⭐' },
    { id: 'difficulty', label: translate('difficulty', lang) || 'Difficulty', icon: '🎯' },
    { id: 'players', label: translate('players', lang) || 'Players', icon: '👥' },
    { id: 'tags', label: translate('tags', lang) || 'Tags', icon: '🏷️' },
    { id: 'features', label: translate('features', lang) || 'Features', icon: '✨' }
  ];

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`mobile-filter-backdrop ${isOpen ? 'active' : ''}`}
        onClick={onClose}
      />

      {/* Bottom Sheet */}
      <div className={`mobile-filter-sheet ${isOpen ? 'open' : ''}`}>
        {/* Drag Handle */}
        <div className="mobile-filter-handle-area" onClick={onClose}>
          <div className="mobile-filter-handle" />
        </div>

        {/* Header */}
        <div className="mobile-filter-header">
          <div className="mobile-filter-header-top">
            <h2 className="mobile-filter-title">
              🎮 {translate('filters', lang) || 'Filters'}
            </h2>
            <button 
              className="mobile-filter-close"
              onClick={onClose}
              aria-label="Close filters"
            >
              ✕
            </button>
          </div>

          {/* Results Count */}
          <div className="mobile-filter-results">
            <span className="mobile-filter-count">
              {filteredCount} / {totalGames} {translate('games', lang) || 'games'}
            </span>
            {hasActiveFilters && (
              <button 
                className="mobile-filter-clear-all"
                onClick={clearAllFilters}
              >
                {translate('clearAll', lang) || 'Clear All'} ({getActiveFilterCount()})
              </button>
            )}
          </div>

          {/* Search within filters */}
          <div className="mobile-filter-search">
            <span className="mobile-filter-search-icon">🔍</span>
            <input
              type="search"
              className="mobile-filter-search-input"
              placeholder={`Search ${tabs.find(t => t.id === activeTab)?.label.toLowerCase()}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button 
                className="mobile-filter-search-clear"
                onClick={() => setSearchQuery('')}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mobile-filter-tabs">
          <div className="mobile-filter-tabs-scroll">
            {tabs.map(tab => {
              const count = filters[tab.id]?.length || 
                           (tab.id === 'special' ? 
                             (filters.onlyTrending ? 1 : 0) + (filters.onlyPopular ? 1 : 0) : 0);
              
              return (
                <button
                  key={tab.id}
                  className={`mobile-filter-tab ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSearchQuery('');
                  }}
                >
                  <span className="mobile-filter-tab-icon">{tab.icon}</span>
                  <span className="mobile-filter-tab-label">{tab.label}</span>
                  {count > 0 && (
                    <span className="mobile-filter-tab-badge">{count}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="mobile-filter-content">
          
          {/* Special Filters */}
          {activeTab === 'special' && (
            <div className="mobile-filter-section">
              <div className="mobile-filter-option-group">
                <label className="mobile-filter-toggle">
                  <input
                    type="checkbox"
                    checked={filters.onlyTrending}
                    onChange={() => handleToggleChange('onlyTrending')}
                  />
                  <div className="mobile-filter-toggle-track">
                    <div className="mobile-filter-toggle-thumb" />
                  </div>
                  <div className="mobile-filter-toggle-content">
                    <span className="mobile-filter-toggle-icon">🔥</span>
                    <div className="mobile-filter-toggle-text">
                      <span className="mobile-filter-toggle-label">
                        {translate('trending', lang) || 'Trending'}
                      </span>
                      <span className="mobile-filter-toggle-desc">
                        Popular games right now
                      </span>
                    </div>
                  </div>
                </label>

                <label className="mobile-filter-toggle">
                  <input
                    type="checkbox"
                    checked={filters.onlyPopular}
                    onChange={() => handleToggleChange('onlyPopular')}
                  />
                  <div className="mobile-filter-toggle-track">
                    <div className="mobile-filter-toggle-thumb" />
                  </div>
                  <div className="mobile-filter-toggle-content">
                    <span className="mobile-filter-toggle-icon">⭐</span>
                    <div className="mobile-filter-toggle-text">
                      <span className="mobile-filter-toggle-label">
                        {translate('popular', lang) || 'Popular'}
                      </span>
                      <span className="mobile-filter-toggle-desc">
                        Most played games
                      </span>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Categories */}
          {activeTab === 'categories' && (
            <div className="mobile-filter-section">
              <div className="mobile-filter-chips">
                {getFilteredOptions(filterOptions.categories).map(category => (
                  <button
                    key={category}
                    className={`mobile-filter-chip ${filters.categories.includes(category) ? 'active' : ''}`}
                    onClick={() => handleCheckboxChange('categories', category)}
                  >
                    <span className="mobile-filter-chip-label capitalize">{category}</span>
                    {filters.categories.includes(category) && (
                      <span className="mobile-filter-chip-check">✓</span>
                    )}
                  </button>
                ))}
              </div>
              {searchQuery && getFilteredOptions(filterOptions.categories).length === 0 && (
                <div className="mobile-filter-empty">
                  No categories found for "{searchQuery}"
                </div>
              )}
            </div>
          )}

          {/* Difficulty */}
          {activeTab === 'difficulty' && (
            <div className="mobile-filter-section">
              <div className="mobile-filter-option-group">
                {getFilteredOptions(filterOptions.difficulty).map(({ value, label }) => (
                  <label key={value} className="mobile-filter-option">
                    <input
                      type="checkbox"
                      checked={filters.difficulty.includes(value)}
                      onChange={() => handleCheckboxChange('difficulty', value)}
                    />
                    <div className="mobile-filter-option-content">
                      <span className="mobile-filter-option-label">{label}</span>
                      {filters.difficulty.includes(value) && (
                        <span className="mobile-filter-option-check">✓</span>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Players */}
          {activeTab === 'players' && (
            <div className="mobile-filter-section">
              <div className="mobile-filter-option-group">
                {getFilteredOptions(filterOptions.players).map(({ value, label }) => (
                  <label key={value} className="mobile-filter-option">
                    <input
                      type="checkbox"
                      checked={filters.players.includes(value)}
                      onChange={() => handleCheckboxChange('players', value)}
                    />
                    <div className="mobile-filter-option-content">
                      <span className="mobile-filter-option-label">{label}</span>
                      {filters.players.includes(value) && (
                        <span className="mobile-filter-option-check">✓</span>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {activeTab === 'tags' && (
            <div className="mobile-filter-section">
              <div className="mobile-filter-chips">
                {getFilteredOptions(filterOptions.tags).map(tag => (
                  <button
                    key={tag}
                    className={`mobile-filter-chip ${filters.tags.includes(tag) ? 'active' : ''}`}
                    onClick={() => handleCheckboxChange('tags', tag)}
                  >
                    <span className="mobile-filter-chip-label capitalize">
                      {tag.replace(/-/g, ' ')}
                    </span>
                    {filters.tags.includes(tag) && (
                      <span className="mobile-filter-chip-check">✓</span>
                    )}
                  </button>
                ))}
              </div>
              {searchQuery && getFilteredOptions(filterOptions.tags).length === 0 && (
                <div className="mobile-filter-empty">
                  No tags found for "{searchQuery}"
                </div>
              )}
            </div>
          )}

          {/* Features */}
          {activeTab === 'features' && (
            <div className="mobile-filter-section">
              <div className="mobile-filter-chips">
                {getFilteredOptions(filterOptions.features).map(feature => (
                  <button
                    key={feature}
                    className={`mobile-filter-chip ${filters.features.includes(feature) ? 'active' : ''}`}
                    onClick={() => handleCheckboxChange('features', feature)}
                  >
                    <span className="mobile-filter-chip-label capitalize">
                      {feature.replace(/-/g, ' ')}
                    </span>
                    {filters.features.includes(feature) && (
                      <span className="mobile-filter-chip-check">✓</span>
                    )}
                  </button>
                ))}
              </div>
              {searchQuery && getFilteredOptions(filterOptions.features).length === 0 && (
                <div className="mobile-filter-empty">
                  No features found for "{searchQuery}"
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="mobile-filter-footer">
          <button 
            className="mobile-filter-btn mobile-filter-btn-secondary"
            onClick={clearAllFilters}
            disabled={!hasActiveFilters}
          >
            {translate('reset', lang) || 'Reset'}
          </button>
          <button 
            className="mobile-filter-btn mobile-filter-btn-primary"
            onClick={applyFilters}
          >
            {translate('apply', lang) || 'Apply Filters'}
            {hasActiveFilters && ` (${getActiveFilterCount()})`}
          </button>
        </div>
      </div>
    </>
  );
}