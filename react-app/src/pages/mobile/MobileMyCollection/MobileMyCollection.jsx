// src/pages/mobile/MobileMyCollection/MobileMyCollection.jsx

import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useLanguage } from "../../../context/LanguageContext";
import { translate } from "../../../data/translations";
import MobileHeader from "../../../components/mobile/MobileHeader/MobileHeader";
import MobileBottomNav from "../../../components/mobile/MobileBottomNav/MobileBottomNav";
import { fetchMyCollection, removeFromCollectionDB } from "../../../api/collection.api";
import { getGameThumb } from "../../../utils/getGameThumb";
import SEO from "../../../components/SEO/SEO";
import { generateKeywords } from "../../../config/seoKeywords";
import "./MobileMyCollection.css";
import MobileBreadcrumb from "../../../components/mobile/MobileBreadcrumb/MobileBreadcrumb";

// ── Auth ──────────────────────────────────────────────────────────────────────
import { useAuth } from "../../../context/AuthContext";

// ── Guest banner ──────────────────────────────────────────────────────────────
import MobileGuestCollectionBanner from "../../../components/mobile/MobileGuestCollectionBanner/MobileGuestCollectionBanner";

const ICONS = {
  collection: "/images/home-icons-2/all.png",
};

export default function MobileMyCollection() {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [collection, setCollection] = useState([]);
  const [allGames, setAllGames] = useState([]);
  const [recommendedGames, setRecommendedGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: "" });
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [sortBy, setSortBy] = useState("recent");
  const [viewMode, setViewMode] = useState("grid"); // grid or mosaic

  useEffect(() => {
    loadCollection();
  }, []);

  // JSON-LD Schema
  useEffect(() => {
    if (loading || collection.length === 0) return;

    const collectionSchema = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "My Game Collection",
      "description": `Personal mobile game collection with ${collection.length} saved games`,
      "url": "https://8jjgames.com/my-collection",
      "mainEntity": {
        "@type": "ItemList",
        "name": "Saved Games",
        "numberOfItems": collection.length,
        "itemListElement": collection.slice(0, 10).map((game, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "item": {
            "@type": "VideoGame",
            "name": game.title,
            "url": `https://8jjgames.com/games/${game.provider_id}`,
            "image": getGameThumb(game.id) || game.image,
            "genre": game.category || "Casual",
            "gamePlatform": "Mobile Web Browser"
          }
        }))
      }
    };

    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://8jjgames.com"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "My Collection",
          "item": "https://8jjgames.com/my-collection"
        }
      ]
    };

    const schemaScript = document.createElement('script');
    schemaScript.type = 'application/ld+json';
    schemaScript.text = JSON.stringify([collectionSchema, breadcrumbSchema]);
    schemaScript.id = 'mobile-collection-schema';
    document.head.appendChild(schemaScript);

    return () => {
      const existingScript = document.getElementById('mobile-collection-schema');
      if (existingScript) document.head.removeChild(existingScript);
    };
  }, [collection, loading]);

  const loadCollection = async () => {
    try {
      setLoading(true);

      const games = await fetchMyCollection();

      setCollection(games);

      setRecommendedGames(games.slice(0, 10));

    } catch (err) {
      console.error("Failed to load collection:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (gameId, gameTitle) => {
    try {
      // Optimistic UI update
      const previousCollection = [...collection];
      setCollection(prev => prev.filter(g => g.id !== gameId));
      showToast(`"${gameTitle}" ${translate("removedFromCollection", lang)}`);

      // DB call
      await removeFromCollectionDB(gameId);

      // Update recommendations
      const newRecommended = [
        ...recommendedGames,
        allGames.find(g => g.id === gameId)
      ].filter(Boolean).slice(0, 12);
      setRecommendedGames(newRecommended);
    } catch (err) {
      console.error("Failed to remove game:", err);
      // Rollback on error
      setCollection(previousCollection);
      showToast("Failed to remove game");
    }
  };

  const handlePlayGame = (games) => {
    navigate(`/games/${games.provider_id}`);
  };

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: "" }), 3000);
  };

  const sortCollection = (games) => {
    const sorted = [...games];
    switch (sortBy) {
      case "title-asc":
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case "title-desc":
        return sorted.sort((a, b) => b.title.localeCompare(a.title));
      case "category":
        return sorted.sort((a, b) => (a.category || "").localeCompare(b.category || ""));
      case "recent":
      default:
        return sorted;
    }
  };

  const sortedCollection = sortCollection(collection);

  // ── Loading State ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <>
        <SEO
          title="My Collection - Loading"
          description="Loading your game collection"
          keywords={generateKeywords('pages', 'collection')}
          url="/my-collection"
        />

        <div className="mobile-collection-wrapper">
          <MobileHeader />
          <div className="mobile-content">
            <div className="mobile-collection-loader">
              <div className="mobile-spinner"></div>
              <p>{translate("loading", lang)}</p>
            </div>
          </div>
          <MobileBottomNav />
        </div>
      </>
    );
  }

  // ── Empty State ───────────────────────────────────────────────────────────
  // Logged-out → premium guest banner.
  // Logged-in with empty collection → original prompt UI.
  if (collection.length === 0) {
    return (
      <>
        <SEO
          title="My Collection - Empty"
          description="Start building your game collection on 8JJ Games"
          keywords={generateKeywords('pages', 'collection')}
          url="/my-collection"
          type="website"
        />

        <meta name="robots" content="noindex, follow" />

        <div className="mobile-collection-wrapper">
          <MobileHeader />

          <div className="mobile-content">

            <MobileBreadcrumb
              items={[
                { label: "Home", path: "/", icon: "" },
                { label: "My Collection", icon: "" }
              ]}
            />

            {/* Category Header */}
            <div className="mobile-all-games-header">
              <div className="mobile-all-games-header-content">
                <div className="mobile-all-games-header-icon-box">
                  <img src={ICONS.collection} className="mobile-all-games-header-icon" alt="" />
                </div>
                <div className="mobile-all-games-header-info">
                  <h1 className="mobile-all-games-header-title">
                    {translate("myCollection", lang) || "My Collection"}
                  </h1>
                  <p className="mobile-all-games-header-count">
                    0 {translate("games", lang) || "Games"}
                  </p>
                </div>
              </div>
            </div>

            {/* ── Guest: premium sign-in banner ── */}
            {!user ? (
              <MobileGuestCollectionBanner />
            ) : (
              /* ── Logged-in but empty ── */
              <div className="mobile-empty-collection">
                <div className="mobile-empty-icon-wrapper">
                  <div className="mobile-empty-icon-circle">
                    <span className="mobile-empty-icon">🎮</span>
                  </div>
                </div>
                <h2 className="mobile-empty-title">
                  {translate("collectionEmpty", lang) || "Your collection is empty"}
                </h2>
                <p className="mobile-empty-text">
                  {translate("startAddingGames", lang) || "Start adding games to build your personal collection!"}
                </p>
                <button
                  className="mobile-browse-btn"
                  onClick={() => navigate("/all-8jj-games")}
                >
                  <span className="mobile-btn-icon">🔍</span>
                  {translate("browseGames", lang) || "Browse Games"}
                </button>
              </div>
            )}

            <div className="mobile-footer-space" />
          </div>

          <MobileBottomNav />
        </div>
      </>
    );
  }

  // ── Main Render with Collection ───────────────────────────────────────────
  return (
    <>
      <SEO
        title={`My Collection (${collection.length} ${collection.length === 1 ? 'Game' : 'Games'})`}
        description={`Your personal mobile game collection - ${collection.length} saved games ready to play`}
        keywords={generateKeywords('pages', 'collection')}
        url="/my-collection"
        type="website"
      />

      <meta name="robots" content="noindex, follow" />

      <div className="mobile-collection-wrapper">
        <MobileHeader />

        <div className="mobile-content">
          {/* Toast */}
          {toast.show && (
            <div className="mobile-collection-toast" role="status" aria-live="polite">
              <span className="toast-icon">✓</span>
              {toast.message}
            </div>
          )}


          <MobileBreadcrumb
            items={[
              { label: "Home", path: "/", icon: "" },
              { label: "My Collection", icon: "" }
            ]}
          />

          {/* Category Header */}
          <div className="mobile-all-games-header">
            <div className="mobile-all-games-header-content">
              <div className="mobile-all-games-header-icon-box">
                <img src={ICONS.collection} className="mobile-all-games-header-icon" alt="" />
              </div>
              <div className="mobile-all-games-header-info">
                <h1 className="mobile-all-games-header-title">
                  {translate("myCollection", lang) || "My Collection"}
                </h1>
                <p className="mobile-all-games-header-count">
                  {collection.length} {collection.length === 1 ? translate("game", lang) : translate("games", lang)}
                </p>
              </div>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="mobile-controls-bar">
            <div className="mobile-controls-left">
              <button
                className={`mobile-view-toggle ${viewMode === 'mosaic' ? 'active' : ''}`}
                onClick={() => setViewMode(viewMode === 'grid' ? 'mosaic' : 'grid')}
              >
                <span className="mobile-view-icon">
                  {viewMode === 'grid' ? '⊞' : '⊟'}
                </span>
                <span className="mobile-view-text">
                  {viewMode === 'grid' ? 'Mosaic' : 'Grid'}
                </span>
              </button>
            </div>

            <div className="mobile-controls-right">
              <select
                className="mobile-sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Sort collection"
              >
                <option value="recent">{translate("recent", lang) || "Recent"}</option>
                <option value="title-asc">{translate("titleAZ", lang) || "A-Z"}</option>
                <option value="title-desc">{translate("titleZA", lang) || "Z-A"}</option>
                <option value="category">{translate("category", lang) || "Category"}</option>
              </select>
            </div>
          </div>

          {/* Collection Grid */}
          <div className={`mobile-collection-grid ${viewMode === 'mosaic' ? 'mosaic-mode' : ''}`}>
            {sortedCollection.map((game, index) => {
              const isBig = viewMode === 'mosaic' && index % 6 === 0;

              return (
                <article
                  key={game.provider_id}
                  className={`mobile-collection-card ${isBig ? 'big' : ''}`}
                  role="listitem"
                >
                  <button
                    className="mobile-collection-remove-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(game.provider_id, game.title);
                    }}
                    aria-label={`Remove ${game.title} from collection`}
                    title="Remove from collection"
                  >
                    <span aria-hidden="true">✕</span>
                  </button>

                  <div
                    className="mobile-collection-card-content"
                    onClick={() => handlePlayGame(game.provider_id)}
                    role="button"
                    tabIndex={0}
                    onKeyPress={(e) => e.key === 'Enter' && handlePlayGame(game.provider_id)}
                    aria-label={`Play ${game.title}`}
                  >
                    <img
                      src={getGameThumb(game)}
                      alt={game.title}
                      className="mobile-collection-image"
                      onError={(e) => e.currentTarget.src = game.image}
                      loading="lazy"
                      decoding="async"
                    />

                    <div className="mobile-collection-overlay">
                      <span className="mobile-collection-game-title">
                        {game.title}
                      </span>
                      {game.category && (
                        <span className="mobile-collection-game-category">
                          {game.category}
                        </span>
                      )}
                    </div>

                    <div className="mobile-collection-play-overlay">
                      <div className="mobile-play-button">
                        <span className="play-icon">▶</span>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Recommendations Section */}
          {recommendedGames.length > 0 && (
            <div className="mobile-recommendations-section">
              <div className="mobile-recommendations-header">
                <h2 className="mobile-section-title">
                  {translate("youMightLike", lang) || "You Might Like"}
                  <span className="section-iconzz">✨</span>
                </h2>
                <button
                  className="mobile-show-recommendations-btn"
                  onClick={() => setShowRecommendations(!showRecommendations)}
                  aria-expanded={showRecommendations}
                >
                  {showRecommendations ? (
                    <>
                      <span>Hide</span>
                      <span className="btn-arrow">▲</span>
                    </>
                  ) : (
                    <>
                      <span>Show</span>
                      <span className="btn-arrow">▼</span>
                    </>
                  )}
                </button>
              </div>

              {showRecommendations && (
                <div className="mobile-recommendations-grid">
                  {recommendedGames.map((game) => (
                    <article
                      key={game.provider_id}
                      className="mobile-recommendation-card"
                      onClick={() => handlePlayGame(game.provider_id)}
                      role="button"
                      tabIndex={0}
                      onKeyPress={(e) => e.key === 'Enter' && handlePlayGame(game.provider_id)}
                      aria-label={`Play ${game.title}`}
                    >
                      <img
                        src={getGameThumb(game)}
                        alt={game.title}
                        className="mobile-recommendation-image"
                        onError={(e) => e.currentTarget.src = game.image}
                        loading="lazy"
                      />
                      <div className="mobile-recommendation-overlay">
                        <h3 className="mobile-recommendation-title">{game.title}</h3>
                        {game.category && (
                          <span className="mobile-recommendation-category">
                            {game.category}
                          </span>
                        )}
                      </div>
                      <div className="mobile-recommendation-badge">NEW</div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Hidden content for SEO */}
          <div className="sr-only">
            <h2>Manage Your Mobile Game Collection</h2>
            <p>
              Your personal mobile game collection on 8JJ Games stores all your favorite games.
              Access saved games instantly, organize by category, and discover new games with
              personalized recommendations. Perfect for gaming on the go!
            </p>
          </div>

          <div className="mobile-footer-space" />
        </div>

        <MobileBottomNav />
      </div>
    </>
  );
}