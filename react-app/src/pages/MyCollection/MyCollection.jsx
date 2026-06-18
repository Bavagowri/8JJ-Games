// react-app/src/pages/MyCollection/MyCollection.jsx - SEO OPTIMIZED

import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./MyCollection.css";
import { fetchMyCollection, removeFromCollectionDB, addToCollectionDB } from "../../api/collection.api";
import { useLanguage } from "../../context/LanguageContext";
import { translate } from "../../data/translations";
import { getGameThumb } from "../../utils/getGameThumb";
import ScrollToTop from "../../components/ScrollToTop";

//  SEO: Import SEO component
import SEO from "../../components/SEO/SEO";
import { generateKeywords } from "../../config/seoKeywords";

// ── Auth ──────────────────────────────────────────────────────────────────────
import { useAuth } from "../../context/AuthContext";

// ── Guest banner ──────────────────────────────────────────────────────────────
import GuestCollectionBanner from "../../components/GuestCollectionBanner/GuestCollectionBanner";

export default function MyCollection() {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const { user } = useAuth();

  const [collection, setCollection] = useState([]);
  const [allGames, setAllGames] = useState([]);
  const [recommendedGames, setRecommendedGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: "" });

  useEffect(() => {
    loadCollection();
  }, []);

  /* =================  SEO: JSON-LD SCHEMA MARKUP ================= */
  useEffect(() => {
    if (loading || collection.length === 0) return;

    // CollectionPage Schema
    const collectionSchema = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "My Game Collection",
      "description": `Personal collection of ${collection.length} saved games on 8JJ Games`,
      "url": "https://8jjgames.com/my-collection",
      "mainEntity": {
        "@type": "ItemList",
        "name": "Saved Games",
        "numberOfItems": collection.length,
        "itemListElement": collection.slice(0, 12).map((game, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "item": {
            "@type": "VideoGame",
            "name": game.title,
            "url": `https://8jjgames.com/game/${game.provider_id}`,
            "image": getGameThumb(game) || game.image,
            "genre": game.category || "Casual",
            "gamePlatform": "Web Browser"
          }
        }))
      }
    };

    // BreadcrumbList Schema
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

    // Add schemas to document head
    const schemaScript = document.createElement('script');
    schemaScript.type = 'application/ld+json';
    schemaScript.text = JSON.stringify([collectionSchema, breadcrumbSchema]);
    schemaScript.id = 'collection-schema';
    document.head.appendChild(schemaScript);

    // Cleanup
    return () => {
      const existingScript = document.getElementById('collection-schema');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
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
      await removeFromCollectionDB(gameId);
      setCollection(prev => prev.filter(g => g.id !== gameId));
      showToast(`"${gameTitle}" ${translate("removedFromCollection", lang)}`);
    } catch {
      showToast("Failed to remove game");
    }
  };

  const handlePlayGame = (gameId) => {
    navigate(`/games/${gameId}`);
  };

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => {
      setToast({ show: false, message: "" });
    }, 3000);
  };

  //  SEO: Loading skeleton with proper meta
  if (loading) {
    return (
      <>
        <SEO
          title="My Collection - Loading"
          description="View and manage your saved games collection on 8JJ Games. Quick access to your favorite online games."
          keywords={generateKeywords('pages', 'collection')}
          url="/my-collection"
          type="website"
        />
        
        <main className="collection-page" aria-busy="true">
          <ScrollToTop />
          <div className="collection-container">
            <div className="collection-header">
              <div className="skeleton skeleton-title" aria-hidden="true"></div>
              <div className="skeleton skeleton-count" aria-hidden="true"></div>
            </div>
            <div className="collection-grid">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="skeleton skeleton-game-card" aria-hidden="true"></div>
              ))}
            </div>
            <div className="sr-only" role="status" aria-live="polite">
              Loading your game collection...
            </div>
          </div>
        </main>
      </>
    );
  }

  // ── Empty state ───────────────────────────────────────────────────────────
  // Logged-out users see the premium GuestCollectionBanner.
  // Logged-in users with an empty collection see the original prompt.
  if (collection.length === 0) {
    return (
      <>
        <SEO
          title="My Collection - Empty"
          description="Start building your game collection on 8JJ Games. Save your favorite games for quick access anytime!"
          keywords={generateKeywords('pages', 'collection')}
          url="/my-collection"
          type="website"
        />
        
        <main className="collection-page">
          <ScrollToTop />
          
          {/*  SEO: Breadcrumb Navigation */}
          <nav className="breadcrumb collection-layout" aria-label="Breadcrumb">
            <Link to="/" className="breadcrumb-link">Home</Link>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">My Collection</span>
          </nav>

          <div className="collection-container">
            <header className="collection-header">
              <h1 className="collection-title">{translate("myCollection", lang)}</h1>
              <div className="collection-count" aria-label="0 games in collection">
                0 {translate("games", lang)}
              </div>
            </header>

            {/* ── Guest: premium sign-in banner ── */}
            {!user ? (
              <GuestCollectionBanner />
            ) : (
              /* ── Logged-in but empty ── */
              <section className="empty-state" aria-labelledby="empty-heading">
                <div className="empty-icon" aria-hidden="true">🎮</div>
                <h2 id="empty-heading" className="empty-title">
                  {translate("collectionEmpty", lang) || "Your collection is empty"}
                </h2>
                <p className="empty-text">
                  {translate("startAddingGames", lang) || "Start adding games to your collection by clicking the heart icon on any game!"}
                </p>
                <button
                  className="browse-games-btn"
                  onClick={() => navigate("/")}
                  aria-label="Browse all games to add to your collection"
                >
                  {translate("browseGames", lang) || "Browse Games"}
                </button>
              </section>
            )}

            {/*  SEO: Hidden content for search engines */}
            <div className="sr-only">
              <h2>About Game Collections</h2>
              <p>
                Your personal game collection on 8JJ Games allows you to save and organize 
                your favorite online games in one convenient place. Add games to your collection 
                by clicking the heart icon, and access them anytime from this page. Build your 
                perfect gaming library with games from all categories - action, puzzle, racing, 
                sports, and more!
              </p>
            </div>
          </div>
        </main>
      </>
    );
  }

  // Split collection for display
  const mainGames = collection.slice(0, 12);
  const hasMoreGames = collection.length > 12;

  return (
    <>
      {/*  SEO: Enhanced Meta Tags with NOINDEX for privacy */}
      <SEO
        title={`My Collection (${collection.length} ${collection.length === 1 ? 'Game' : 'Games'})`}
        description={`Your personal game collection on 8JJ Games. ${collection.length} saved games ready to play instantly. Manage your favorite online games in one place.`}
        keywords={generateKeywords('pages', 'collection')}
        url="/my-collection"
        type="website"
      />

      {/*  IMPORTANT: Add noindex meta tag for privacy */}
      <meta name="robots" content="noindex, follow" />

      <main className="collection-page">
        <ScrollToTop />

        {/*  SEO: Breadcrumb Navigation */}
        <nav className="breadcrumb collection-layout asdasd" aria-label="Breadcrumb">
          <Link to="/" className="breadcrumb-link">Home</Link>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">My Collection</span>
        </nav>

        {/* Toast Notification */}
        {toast.show && (
          <div 
            className="toast-notification toast-remove" 
            role="status" 
            aria-live="polite"
            aria-atomic="true"
          >
            {toast.message}
          </div>
        )}

        <div className="collection-layout">
          {/*  SEO: Main Content Section */}
          <div className="collection-main">
            <header className="collection-header">
              <h1 className="collection-title">{translate("myCollection", lang)}</h1>
              <div 
                className="collection-count" 
                aria-label={`${collection.length} ${collection.length === 1 ? translate("game", lang) : translate("games", lang)} in your collection`}
              >
                {collection.length} {collection.length === 1 ? translate("game", lang) : translate("games", lang)}
              </div>
            </header>

            {/*  SEO: Main Games Section with Schema */}
            <section 
              className="collection-grid" 
              aria-label="Your saved games"
              role="list"
              itemScope
              itemType="https://schema.org/ItemList"
            >
              <meta itemProp="name" content="My Saved Games" />
              <meta itemProp="numberOfItems" content={mainGames.length} />

              {mainGames.map((game, index) => (
                <article 
                  key={game.provider_id} 
                  className="collection-game-card"
                  role="listitem"
                  itemProp="itemListElement"
                  itemScope
                  itemType="https://schema.org/ListItem"
                >
                  <meta itemProp="position" content={index + 1} />

                  <div
                    className="game-card-content"
                    onClick={() => handlePlayGame(game.provider_id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handlePlayGame(game.provider_id);
                      }
                    }}
                    aria-label={`Play ${game.title}${game.category ? ` - ${game.category} game` : ''}`}
                    itemScope
                    itemType="https://schema.org/VideoGame"
                  >
                    <meta itemProp="name" content={game.title} />
                    <meta itemProp="url" content={`https://8jjgames.com/games/${game.provider_id}`} />
                    {game.category && <meta itemProp="genre" content={game.category} />}

                    <img
                      src={getGameThumb(game)}
                      alt={`${game.title} - ${game.category || 'Online'} game thumbnail`}
                      className="game-image"
                      onError={(e) => {
                        e.currentTarget.src = game.image;
                      }}
                      loading="lazy"
                      decoding="async"
                      itemProp="image"
                    />
                    <div className="play-button" aria-hidden="true">
                      {translate("playNow", lang)}
                    </div>
                    <div className="game-overlay">
                      <h3 className="game-title" itemProp="name">{game.title}</h3>
                      {game.category && (
                        <div className="game-category" itemProp="genre">
                          {game.category}
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    className="remove-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(game.provider_id, game.title);
                    }}
                    aria-label={`Remove ${game.title} from collection`}
                    title={translate("removeFromCollection", lang)}
                    type="button"
                  >
                    <span aria-hidden="true">✕</span>
                    <span className="sr-only">Remove</span>
                  </button>
                </article>
              ))}
            </section>

            {/*  SEO: Additional Games Section */}
            {hasMoreGames && (
              <section 
                className="more-games-section" 
                aria-labelledby="more-games-heading"
                itemScope
                itemType="https://schema.org/ItemList"
              >
                <h2 id="more-games-heading" className="more-section-title">
                  {translate("moreInCollection", lang) || "More Games"}
                </h2>
                <meta itemProp="name" content="Additional Saved Games" />
                <meta itemProp="numberOfItems" content={collection.length - 12} />

                <div className="collection-grid" role="list">
                  {collection.slice(12).map((game, index) => (
                    <article 
                      key={game.provider_id} 
                      className="collection-game-card"
                      role="listitem"
                      itemProp="itemListElement"
                      itemScope
                      itemType="https://schema.org/ListItem"
                    >
                      <meta itemProp="position" content={index + 13} />

                      <div
                        className="game-card-content"
                        onClick={() => handlePlayGame(game.provider_id)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handlePlayGame(game.provider_id);
                          }
                        }}
                        aria-label={`Play ${game.title}${game.category ? ` - ${game.category} game` : ''}`}
                      >
                        <img
                          src={getGameThumb(game)}
                          alt={`${game.title} - ${game.category || 'Online'} game thumbnail`}
                          className="game-image"
                          onError={(e) => {
                            e.currentTarget.src = game.image;
                          }}
                          loading="lazy"
                          decoding="async"
                        />
                        <div className="play-button" aria-hidden="true">
                          {translate("playNow", lang)}
                        </div>
                        <div className="game-overlay">
                          <h3 className="game-title">{game.title}</h3>
                          {game.category && <div className="game-category">{game.category}</div>}
                        </div>
                      </div>

                      <button
                        className="remove-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemove(game.provider_id, game.title);
                        }}
                        aria-label={`Remove ${game.title} from collection`}
                        title={translate("removeFromCollection", lang)}
                        type="button"
                      >
                        <span aria-hidden="true">✕</span>
                        <span className="sr-only">Remove</span>
                      </button>
                    </article>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/*  SEO: Sidebar - Recommended Games */}
          {recommendedGames.length > 0 && (
            <aside 
              className="collection-aside"
              aria-labelledby="recommendations-heading"
            >
              <header className="sidebar-header">
                <h2 id="recommendations-heading" className="sidebar-title">
                  {translate("youMightLike", lang) || "You Might Like"}
                </h2>
              </header>

              <div 
                className="collection-sidebar" 
                role="list"
                aria-label="Recommended games"
              >
                {recommendedGames.map((game) => (
                  <article 
                    key={game.provider_id} 
                    className="collection-side-card"
                    role="listitem"
                  >
                    <div
                      className="side-card-content"
                      onClick={() => handlePlayGame(game.provider_id)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handlePlayGame(game.provider_id);
                        }
                      }}
                      aria-label={`Play ${game.title}${game.category ? ` - ${game.category} game` : ''}`}
                    >
                      <img
                        src={getGameThumb(game)}
                        alt={`${game.title} - ${game.category || 'Online'} game thumbnail`}
                        className="game-image"
                        onError={(e) => {
                          e.currentTarget.src = game.image;
                        }}
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="play-button" aria-hidden="true">
                        {translate("playNow", lang)}
                      </div>
                      <div className="game-overlay">
                        <h3 className="game-title">{game.title}</h3>
                        {game.category && <div className="game-category">{game.category}</div>}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </aside>
          )}
        </div>

        {/*  SEO: Hidden content for search engines */}
        <div className="sr-only">
          <h2>Manage Your Game Collection</h2>
          <p>
            Your personal game collection on 8JJ Games stores all your favorite games in one place. 
            Access your saved games instantly without searching. Build your perfect gaming library 
            with unlimited saves. Remove games you no longer want or add new ones as you discover them.
          </p>
          <p>
            Collection features: Quick access to favorite games, organize by category, track your gaming preferences, 
            discover similar games with personalized recommendations, and never lose track of games you love.
          </p>
        </div>
      </main>
    </>
  );
}