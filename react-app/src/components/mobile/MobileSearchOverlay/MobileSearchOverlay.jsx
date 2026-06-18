// react-app/src/components/mobile/MobileSearchOverlay/MobileSearchOverlay.jsx
import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../../context/LanguageContext";
import { translate } from "../../../data/translations";
import { getGameThumb } from "../../../utils/getGameThumb";
import { pushRecent } from "../../../utils/localStorage";
import { trackGameClick } from "../../../utils/popularGamesUtils";
import "./MobileSearchOverlay.css";

export default function MobileSearchOverlay({ isOpen, onClose, initialQuery = "" }) {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const inputRef = useRef(null);

  const [query, setQuery] = useState(initialQuery);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);

  const API = import.meta.env.VITE_API_URL;

  // ── Load recent searches from localStorage ────────────────────────
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("8jj_recent_searches") || "[]");
      setRecentSearches(stored);
    } catch {
      setRecentSearches([]);
    }
  }, [isOpen]);

  // ── Auto-focus input when overlay opens ───────────────────────────
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
      setQuery(initialQuery);
    } else {
      setQuery("");
      setGames([]);
    }
  }, [isOpen, initialQuery]);

  // ── Debounced search fetch ────────────────────────────────────────
  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setGames([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `${API}/api/games?search=${encodeURIComponent(trimmed)}&limit=40`
        );
        const data = await res.json();
        // Normalize provider_id fallback so navigation always works
        const normalized = (data.data || []).map((g) => ({
          ...g,
          provider_id: g.provider_id || g.id,
        }));
        setGames(normalized);
      } catch (err) {
        console.error("Search failed:", err);
        setGames([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, API]);

  // ── Save recent search ─────────────────────────────────────────────
  const saveRecentSearch = (term) => {
    try {
      const existing = JSON.parse(localStorage.getItem("8jj_recent_searches") || "[]");
      const updated = [term, ...existing.filter((s) => s !== term)].slice(0, 6);
      localStorage.setItem("8jj_recent_searches", JSON.stringify(updated));
      setRecentSearches(updated);
    } catch {}
  };

  const removeRecentSearch = (term, e) => {
    e.stopPropagation();
    try {
      const existing = JSON.parse(localStorage.getItem("8jj_recent_searches") || "[]");
      const updated = existing.filter((s) => s !== term);
      localStorage.setItem("8jj_recent_searches", JSON.stringify(updated));
      setRecentSearches(updated);
    } catch {}
  };

  const clearAllRecent = () => {
    localStorage.removeItem("8jj_recent_searches");
    setRecentSearches([]);
  };

  // ── Handle game click ─────────────────────────────────────────────
  const handleGameClick = (game) => {
    if (!game.provider_id) return;

    saveRecentSearch(query.trim());

    pushRecent({
      id: game.provider_id,
      title: game.title,
      image: game.image,
      category: game.category || "",
      gameId: game.provider_id,
    });

    trackGameClick({
      id: game.provider_id,
      title: game.title,
      image: game.image,
      category: game.category || "",
    });

    onClose();
    navigate(`/games/${game.provider_id}`);
  };

  // ── Handle recent search click ─────────────────────────────────────
  const handleRecentClick = (term) => {
    setQuery(term);
    inputRef.current?.focus();
  };

  // ── Handle form submit ────────────────────────────────────────────
  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed || !games.length) return;
    saveRecentSearch(trimmed);
    // Navigate to first result
    handleGameClick(games[0]);
  };

  // ── Handle close with Escape key ─────────────────────────────────
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  // ── Prevent body scroll while open ───────────────────────────────
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const trimmed = query.trim();
  const showEmpty = !trimmed && recentSearches.length === 0;
  const showRecent = !trimmed && recentSearches.length > 0;
  const showResults = !!trimmed;

  if (!isOpen) return null;

  return (
    <div className="mso-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="mso-panel">

        {/* ── Search Bar ── */}
        <div className="mso-search-bar">
          <div className="mso-search-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </div>

          <form onSubmit={handleSubmit} style={{ flex: 1 }}>
            <input
              ref={inputRef}
              className="mso-input"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={translate("searchGames", lang) || "Search games..."}
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
              aria-label="Search games"
            />
          </form>

          {query && (
            <button
              className="mso-clear-btn"
              onClick={() => { setQuery(""); setGames([]); inputRef.current?.focus(); }}
              aria-label="Clear search"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}

          <button className="mso-cancel-btn" onClick={onClose}>
            {translate("cancel", lang) || "Cancel"}
          </button>
        </div>

        {/* ── Body ── */}
        <div className="mso-body">

          {/* Loading */}
          {loading && (
            <div className="mso-loading">
              <div className="mso-spinner" />
              <span>{translate("loading", lang) || "Searching..."}</span>
            </div>
          )}

          {/* Empty state */}
          {!loading && showEmpty && (
            <div className="mso-empty">
              <div className="mso-empty-icon">🎮</div>
              <p className="mso-empty-title">{translate("searchGames", lang) || "Search for games"}</p>
              <p className="mso-empty-sub">{"Type a game name to get started"}</p>
            </div>
          )}

          {/* Recent Searches */}
          {!loading && showRecent && (
            <div className="mso-section">
              <div className="mso-section-header">
                <span className="mso-section-title">
                  {translate("recentSearches", lang) || "Recent Searches"}
                </span>
                <button className="mso-clear-all" onClick={clearAllRecent}>
                  {translate("clearAll", lang) || "Clear all"}
                </button>
              </div>
              <div className="mso-recent-list">
                {recentSearches.map((term) => (
                  <button
                    key={term}
                    className="mso-recent-item"
                    onClick={() => handleRecentClick(term)}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mso-recent-icon">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <span>{term}</span>
                    <button
                      className="mso-recent-remove"
                      onClick={(e) => removeRecentSearch(term, e)}
                      aria-label={`Remove ${term}`}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search Results */}
          {!loading && showResults && (
            <div className="mso-section">
              <div className="mso-section-header">
                <span className="mso-section-title">
                  {games.length > 0
                    ? `${games.length} ${translate("gamesFound", lang) || "games found"}`
                    : translate("noGamesFound", lang) || "No games found"}
                </span>
              </div>

              {games.length === 0 ? (
                <div className="mso-no-results">
                  <div className="mso-empty-icon">😕</div>
                  <p className="mso-empty-title">{`No results for "${trimmed}"`}</p>
                  <p className="mso-empty-sub">{"Try a different keyword"}</p>
                </div>
              ) : (
                <div className="mso-results-grid">
                  {games.map((game) => (
                    <button
                      key={game.provider_id || game.id}
                      className="mso-game-card"
                      onClick={() => handleGameClick(game)}
                      aria-label={`Play ${game.title}`}
                    >
                      <div className="mso-game-img-wrapper">
                        <img
                          src={getGameThumb(game)}
                          alt={game.title}
                          className="mso-game-img"
                          loading="lazy"
                          onError={(e) => { e.currentTarget.src = game.image; }}
                        />
                        <div className="mso-game-play-overlay">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <polygon points="5 3 19 12 5 21 5 3" />
                          </svg>
                        </div>
                      </div>
                      <p className="mso-game-title">{game.title}</p>
                      {game.category && (
                        <p className="mso-game-category">{game.category}</p>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}