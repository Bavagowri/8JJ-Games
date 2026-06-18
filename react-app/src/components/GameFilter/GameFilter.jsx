// react-app/src/components/GameFilter/GameFilter.jsx

import { useState, useEffect } from "react";
import { translate } from "../../data/translations";
import { useLanguage } from "../../context/LanguageContext";
import { filterOptions } from "../../data/gameMetadata";
import "./GameFilter.css";

export default function GameFilter({ 
  onFilterChange, 
  totalGames, 
  filteredCount,
  isOpen,
  onClose,
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange
}) {
  const { lang } = useLanguage();
  
  const [filters, setFilters] = useState({
    categories: [],
    tags: [],
    difficulty: [],
    players: [],
    ageRating: [],
    features: [],
    onlyTrending: false,
    onlyPopular: false
  });

  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    difficulty: false,
    players: false,
    tags: false,
    features: false,
    special: false
  });

  // Send filter changes to parent
  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

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

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const hasActiveFilters = () => {
    return filters.categories.length > 0 ||
           filters.tags.length > 0 ||
           filters.difficulty.length > 0 ||
           filters.players.length > 0 ||
           filters.ageRating.length > 0 ||
           filters.features.length > 0 ||
           filters.onlyTrending ||
           filters.onlyPopular;
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

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div className="filter-overlay" onClick={onClose} />
      )}

      {/* Filter Panel */}
      <aside className={`game-filter ${isOpen ? 'open' : 'ThemeBox'}`}>
        {/* Header */}
        <div className="filter-header">
          <h3 className="filter-title">
            {translate("filters", lang) || "Filters"}
          </h3>
          <button 
            className="filter-close-btn"
            onClick={onClose}
            aria-label="Close filters"
          >
            ✕
          </button>
        </div>

        {/* Active Filters Summary */}
        <div className="filter-summary">
          <div className="filter-count">
            <span className="count-text">
              {translate("showing", lang) || "Showing"} <strong>{filteredCount}</strong> {translate("of", lang) || "of"} <strong>{totalGames}</strong> {translate("games", lang) || "games"}
            </span>
          </div>
          
          {hasActiveFilters() && (
            <button 
              className="clear-all-btn"
              onClick={clearAllFilters}
            >
              {translate("clearAll", lang) || "Clear All"} ({getActiveFilterCount()})
            </button>
          )}
        </div>

        {/* Filter Sections */}
        <div className="filter-sections">
          
          {/* Special Filters */}
          <div className="filter-section">
            <button 
              className="filter-section-header"
              onClick={() => toggleSection('special')}
            >
              <span>{translate("special", lang) || "Special"}</span>
              <span className={`expand-icon ${expandedSections.special ? 'expanded' : ''}`}>▼</span>
            </button>
            
            {expandedSections.special && (
              <div className="filter-options">
                <label className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={filters.onlyTrending}
                    onChange={() => handleToggleChange('onlyTrending')}
                  />
                  <span>{translate("trending", lang) || "Trending"}</span>
                </label>
                
                <label className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={filters.onlyPopular}
                    onChange={() => handleToggleChange('onlyPopular')}
                  />
                  <span>{translate("popular", lang) || "Popular"}</span>
                </label>
              </div>
            )}
          </div>

          {/* Categories */}
          <div className="filter-section">
            <button 
              className="filter-section-header"
              onClick={() => toggleSection('categories')}
            >
              <span>{translate("categories", lang) || "Categories"}</span>
              <span className={`expand-icon ${expandedSections.categories ? 'expanded' : ''}`}>▼</span>
            </button>
            
            {expandedSections.categories && (
              <div className="filter-options scrollable">
                {filterOptions.categories.map(category => (
                  <label key={category} className="filter-checkbox">
                    <input
                      type="checkbox"
                      checked={filters.categories.includes(category)}
                      onChange={() => handleCheckboxChange('categories', category)}
                    />
                    <span className="capitalize">{category}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Difficulty */}
          <div className="filter-section">
            <button 
              className="filter-section-header"
              onClick={() => toggleSection('difficulty')}
            >
              <span>{translate("difficulty", lang) || "Difficulty"}</span>
              <span className={`expand-icon ${expandedSections.difficulty ? 'expanded' : ''}`}>▼</span>
            </button>
            
            {expandedSections.difficulty && (
              <div className="filter-options">
                {filterOptions.difficulty.map(({ value, label }) => (
                  <label key={value} className="filter-checkbox">
                    <input
                      type="checkbox"
                      checked={filters.difficulty.includes(value)}
                      onChange={() => handleCheckboxChange('difficulty', value)}
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Players */}
          <div className="filter-section">
            <button 
              className="filter-section-header"
              onClick={() => toggleSection('players')}
            >
              <span>{translate("players", lang) || "Players"}</span>
              <span className={`expand-icon ${expandedSections.players ? 'expanded' : ''}`}>▼</span>
            </button>
            
            {expandedSections.players && (
              <div className="filter-options">
                {filterOptions.players.map(({ value, label }) => (
                  <label key={value} className="filter-checkbox">
                    <input
                      type="checkbox"
                      checked={filters.players.includes(value)}
                      onChange={() => handleCheckboxChange('players', value)}
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="filter-section">
            <button 
              className="filter-section-header"
              onClick={() => toggleSection('tags')}
            >
              <span>{translate("tags", lang) || "Tags"}</span>
              <span className={`expand-icon ${expandedSections.tags ? 'expanded' : ''}`}>▼</span>
            </button>
            
            {expandedSections.tags && (
              <div className="filter-options scrollable">
                {filterOptions.tags.map(tag => (
                  <label key={tag} className="filter-checkbox">
                    <input
                      type="checkbox"
                      checked={filters.tags.includes(tag)}
                      onChange={() => handleCheckboxChange('tags', tag)}
                    />
                    <span className="capitalize">{tag.replace(/-/g, ' ')}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Features */}
          <div className="filter-section">
            <button 
              className="filter-section-header"
              onClick={() => toggleSection('features')}
            >
              <span>{translate("features", lang) || "Features"}</span>
              <span className={`expand-icon ${expandedSections.features ? 'expanded' : ''}`}>▼</span>
            </button>
            
            {expandedSections.features && (
              <div className="filter-options scrollable">
                {filterOptions.features.map(feature => (
                  <label key={feature} className="filter-checkbox">
                    <input
                      type="checkbox"
                      checked={filters.features.includes(feature)}
                      onChange={() => handleCheckboxChange('features', feature)}
                    />
                    <span className="capitalize">{feature.replace(/-/g, ' ')}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

        </div>
      </aside>
    </>
  );
}