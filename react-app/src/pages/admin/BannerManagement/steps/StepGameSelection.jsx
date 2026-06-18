

// react-app/src/pages/admin/BannerManagement/steps/StepGameSelection.jsx


import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Search, X, Grid3x3, CheckCircle2, Sparkles, Loader2 } from 'lucide-react';
import { fetchH5Games } from '../../../../api/fetchH5Games';
import { selfHostedGames } from '../../../../data/selfHostedGames';
import { BLOCKED_GAME_IDS } from '../../../../utils/blockedGames';
import './Steps.css';

const PAGE_SIZE = 20;

function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function StepGameSelection({ formData, onChange, errors = {} }) {
  const [allGames, setAllGames]       = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  const [searchQuery, setSearchQuery]           = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedGames, setSelectedGames]       = useState(formData.games || []);

  const [page, setPage]               = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  const sentinelRef = useRef(null);
  const loaderTimer = useRef(null);

  const debouncedQuery = useDebounce(searchQuery, 300);

  /* ─── Load all games (once) ─── */
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setDataLoading(true);
        const h5  = await fetchH5Games();
        const all = [...selfHostedGames, ...h5];
        const available = all.filter(
          g => !BLOCKED_GAME_IDS.includes(String(g.id).toLowerCase())
        );
        if (!cancelled) setAllGames(available);
      } catch (err) {
        console.error('Failed to load games:', err);
      } finally {
        if (!cancelled) setDataLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  /* ─── Sync from parent (edit mode) ─── */
  useEffect(() => {
    if (formData.games?.length) setSelectedGames(formData.games);
  }, [formData.games]);

  /* ─── Filtered list ─── */
  const filteredGames = useMemo(() => {
    let list = allGames;
    if (selectedCategory !== 'all') {
      list = list.filter(g =>
        g.category === selectedCategory || g.tagList?.includes(selectedCategory)
      );
    }
    if (debouncedQuery.trim()) {
      const q = debouncedQuery.toLowerCase();
      list = list.filter(g =>
        g.title.toLowerCase().includes(q) ||
        g.description?.toLowerCase().includes(q) ||
        g.tagList?.some(tag => tag.toLowerCase().includes(q))
      );
    }
    return list;
  }, [allGames, selectedCategory, debouncedQuery]);

  useEffect(() => { setPage(1); }, [filteredGames]);

  const visibleGames = useMemo(
    () => filteredGames.slice(0, page * PAGE_SIZE),
    [filteredGames, page]
  );

  const hasMore = visibleGames.length < filteredGames.length;

  /* ─── Infinite scroll ─── */
  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    loaderTimer.current = setTimeout(() => {
      setPage(p => p + 1);
      setLoadingMore(false);
    }, 250);
  }, [loadingMore, hasMore]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) loadMore(); },
      { rootMargin: '200px' }
    );
    observer.observe(sentinel);
    return () => {
      observer.disconnect();
      clearTimeout(loaderTimer.current);
    };
  }, [loadMore]);

  /* ─── Selection handlers ─── */
  const isSelected = useCallback(
    (id) => selectedGames.some(g => g.id === id),
    [selectedGames]
  );

  //  FIX: compute `next` array first, then call setSelectedGames and onChange
  //    as two separate statements — never call onChange inside a setState updater.
  const toggleGame = useCallback((game) => {
    const next = selectedGames.some(g => g.id === game.id)
      ? selectedGames.filter(g => g.id !== game.id)
      : [...selectedGames, game];
    setSelectedGames(next);
    onChange({ games: next });
  }, [selectedGames, onChange]);

  const removeGame = useCallback((id) => {
    const next = selectedGames.filter(g => g.id !== id);
    setSelectedGames(next);
    onChange({ games: next });
  }, [selectedGames, onChange]);

  const clearSelection = useCallback(() => {
    setSelectedGames([]);
    onChange({ games: [] });
  }, [onChange]);

  /* ─── Categories ─── */
  const categories = [
    { id: 'all',       name: 'All Games',  icon: '🎮' },
    { id: 'action',    name: 'Action',     icon: '⚔️' },
    { id: 'adventure', name: 'Adventure',  icon: '🗺️' },
    { id: 'puzzles',   name: 'Puzzles',    icon: '🧩' },
    { id: 'racing',    name: 'Racing',     icon: '🏎️' },
    { id: 'sports',    name: 'Sports',     icon: '⚽' },
    { id: 'arcade',    name: 'Arcade',     icon: '🕹️' },
    { id: 'strategy',  name: 'Strategy',   icon: '♟️' },
  ];

  if (dataLoading) {
    return (
      <div className="premium-step-container">
        <div className="premium-loading">
          <div className="loading-spinner-large" />
          <p>Loading games...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="premium-step-container">
      <div className="premium-step-header">
        <div className="step-icon-wrapper">
          <Grid3x3 size={32} />
        </div>
        <div>
          <h3>Select Games</h3>
          <p>Choose games to feature in your banner</p>
        </div>
      </div>

      <div className="premium-step-content">

        {errors.games && (
          <div className="premium-error-banner">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>{errors.games}</span>
          </div>
        )}

        <div className="premium-search-section">
          <div className="premium-search-wrapper">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              className="premium-search-input"
              placeholder="Search games by name, category, or tags..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="search-clear-btn" onClick={() => setSearchQuery('')}>
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        <div className="premium-category-filters">
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`premium-category-btn ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              <span className="category-icon">{cat.icon}</span>
              <span className="category-name">{cat.name}</span>
            </button>
          ))}
        </div>

        {selectedGames.length > 0 && (
          <div className="premium-selected-section">
            <div className="selected-header">
              <div className="selected-title">
                <CheckCircle2 size={20} />
                <h4>Selected Games ({selectedGames.length})</h4>
              </div>
              <button className="clear-all-btn" onClick={clearSelection}>
                <X size={16} />
                Clear All
              </button>
            </div>
            <div className="premium-selected-grid">
              {selectedGames.map(game => (
                <div key={game.id} className="premium-selected-chip">
                  <img src={game.image} alt={game.title} loading="lazy" />
                  <span className="chip-title">{game.title}</span>
                  <button className="chip-remove-btn" onClick={() => removeGame(game.id)}>
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="premium-games-section">
          <div className="games-section-header">
            <h4>
              <Sparkles size={18} />
              Available Games
            </h4>
            <span className="games-count">
              {visibleGames.length}{hasMore ? '+' : ''} / {filteredGames.length} game{filteredGames.length !== 1 ? 's' : ''}
            </span>
          </div>

          {filteredGames.length === 0 ? (
            <div className="premium-no-results">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                <path d="M3 3L21 21M18 18H6C4.89543 18 4 17.1046 4 16V8C4 6.89543 4.89543 6 6 6H7M21 14V8C21 6.89543 20.1046 6 19 6H14M21 14L14 7"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <p>No games found matching your filters</p>
              <button
                className="reset-filters-btn"
                onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <>
              <div className="premium-games-grid">
                {visibleGames.map(game => (
                  <GameCard
                    key={game.id}
                    game={game}
                    selected={isSelected(game.id)}
                    onToggle={toggleGame}
                  />
                ))}
                {loadingMore && Array.from({ length: 8 }).map((_, i) => (
                  <div key={`sk-${i}`} className="premium-game-card game-skeleton">
                    <div className="game-card-image skeleton-image" />
                    <div className="game-card-contentz">
                      <div className="skeleton-line skeleton-title" />
                      <div className="skeleton-line skeleton-badge" />
                    </div>
                  </div>
                ))}
              </div>
              <div ref={sentinelRef} className="scroll-sentinel">
                {loadingMore && (
                  <div className="load-more-indicator">
                    <Loader2 size={22} className="spin-icon" />
                    <span>Loading more games…</span>
                  </div>
                )}
                {!hasMore && filteredGames.length > PAGE_SIZE && (
                  <p className="all-loaded-msg">All {filteredGames.length} games loaded</p>
                )}
              </div>
            </>
          )}
        </div>

        <div className="premium-info-box">
          <div className="info-box-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 16V12M12 8H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="info-box-content">
            <strong>Game Selection Tips</strong>
            <ul>
              <li>Select 6–12 games for optimal display</li>
              <li>Choose games from similar categories for better theming</li>
              <li>Mix popular titles with new releases</li>
              <li>Click a game to select / deselect it</li>
              <li>Scroll down to load more games automatically</li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}

const GameCard = ({ game, selected, onToggle }) => (
  <div
    className={`premium-game-card ${selected ? 'selected' : ''}`}
    onClick={() => onToggle(game)}
  >
    <div className="game-card-image">
      <img src={game.image} alt={game.title} loading="lazy" decoding="async" />
      {selected && (
        <div className="game-selected-overlay">
          <CheckCircle2 size={32} />
        </div>
      )}
    </div>
    <div className="game-card-contentz">
      <h5>{game.title}</h5>
      {game.category && (
        <span className="game-category-badge">{game.category}</span>
      )}
    </div>
  </div>
);