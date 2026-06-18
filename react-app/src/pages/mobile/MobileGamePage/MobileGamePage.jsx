// src/pages/mobile/MobileGamePage/MobileGamePage.jsx

import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState, useRef, useMemo } from "react";
import { fetchH5Games } from "../../../api/fetchH5Games";
import { selfHostedGames } from "../../../data/selfHostedGames";
import { useLanguage } from "../../../context/LanguageContext";
import { translate } from "../../../data/translations";
import MobileHeader from "../../../components/mobile/MobileHeader/MobileHeader";
import MobileBottomNav from "../../../components/mobile/MobileBottomNav/MobileBottomNav";
import { getGameThumb } from "../../../utils/getGameThumb";
import { addToCollectionDB, removeFromCollectionDB, fetchMyCollection } from "../../../api/collection.api";
import { API } from "../../../config/api";
import { useProfile } from "../../../context/ProfileContext";
import CommentSection from "../../../components/Comments/CommentSection";
import GameShareModal from "../../../components/GameShareModal/GameShareModal";
import SEO from "../../../components/SEO/SEO";
import { generateKeywords } from "../../../config/seoKeywords";
import "./MobileGamePage.css";

export default function MobileGamePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const iframeRef = useRef(null);
  const playTrackedRef = useRef(false);
  const { refreshProfile } = useProfile();

  const [game, setGame] = useState(null);
  const [games, setGames] = useState([]);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [inCollection, setInCollection] = useState(false);
  const [checkingCollection, setCheckingCollection] = useState(true);
  const [showAdded, setShowAdded] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "" });
  const [showShare, setShowShare] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [showMoreGames, setShowMoreGames] = useState(false);

  // ============================================
  // GAME URL & STATS
  // ============================================
  const gameUrl = useMemo(() => {
    if (!game) return "";
    return `${window.location.origin}/game/${game.id}`;
  }, [game]);

  const gameStats = useMemo(() => {
    if (!game) return { rating: "4.5", plays: 2000, ratingCount: 100 };
    const seed = parseInt(game.id) || 0;
    return {
      rating: (4.5 + (seed % 5) / 10).toFixed(1),
      plays: 2000 + (seed % 6000),
      ratingCount: 100 + (seed % 400)
    };
  }, [game?.id]);

  const gameDescription = useMemo(() => {
    if (!game) return "Play free online games on 8JJ Games. No download required!";
    const base = game.description || `${game.title} is a ${game.category || 'fun'} game`;
    const cta = `Play ${game.title} online for free at 8JJ Games`;
    const features = `${game.category ? `${game.category} game` : 'Browser game'} - No download, play instantly!`;
    return `${base}. ${cta}. ${features}`;
  }, [game]);

  const gameKeywords = useMemo(() => {
    if (!game) return generateKeywords('pages', 'home');
    const keywords = [
      game.title,
      `play ${game.title}`,
      `${game.title} online`,
      `${game.title} mobile`,
      `free ${game.title}`
    ];
    if (game.category) {
      keywords.push(`${game.category} games`, `mobile ${game.category} games`);
    }
    if (game.tagList && Array.isArray(game.tagList)) {
      game.tagList.forEach(tag => keywords.push(`${tag} games`));
    }
    keywords.push('free mobile games', 'play online', 'HTML5 games');
    return keywords.join(', ');
  }, [game]);

  const gameTags = useMemo(() => {
    const tags = new Set();
    if (!game) return [];
    if (game.category) tags.add(game.category);
    if (game.tagList) {
      if (Array.isArray(game.tagList)) {
        game.tagList.forEach(tag => {
          if (tag && tag.trim()) tags.add(tag.trim());
        });
      } else if (typeof game.tagList === 'string') {
        game.tagList.split(',').forEach(tag => {
          if (tag && tag.trim()) tags.add(tag.trim());
        });
      }
    }
    if (game.tags && typeof game.tags === 'string') {
      game.tags.split(',').forEach(tag => {
        if (tag && tag.trim()) tags.add(tag.trim());
      });
    }
    return Array.from(tags);
  }, [game]);

  // ============================================
  // LOAD GAMES
  // ============================================
  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      let list = JSON.parse(localStorage.getItem("games"));
      if (!Array.isArray(list) || list.length === 0) {
        const h5 = await fetchH5Games();
        list = [...selfHostedGames, ...h5];
        localStorage.setItem("games", JSON.stringify(list));
      }

      const selected = list.find(g => String(g.id) === String(id));
      if (!mounted) return;

      setGames(list);
      setGame(selected || null);
      setPlaying(false);
      setLoading(false);
    };

    load();
    return () => { mounted = false; };
  }, [id]);

  // ============================================
  // CHECK COLLECTION STATUS
  // ============================================
  useEffect(() => {
    if (!game) return;

    const checkCollection = async () => {
      setCheckingCollection(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setInCollection(false);
          setCheckingCollection(false);
          return;
        }

        const dbCollection = await fetchMyCollection();
        const isInDB = dbCollection.some(
          item => String(item.game_id) === String(game.id)
        );
        setInCollection(isInDB);
      } catch (err) {
        console.error("Failed to check collection:", err);
        setInCollection(false);
      } finally {
        setCheckingCollection(false);
      }
    };

    checkCollection();
  }, [game]);

  // ============================================
  // JSON-LD SCHEMA
  // ============================================
  useEffect(() => {
    if (!game) return;

    const gameSchema = {
      "@context": "https://schema.org",
      "@type": "VideoGame",
      "name": game.title,
      "description": gameDescription,
      "url": `https://8jjgames.com/game/${game.id}`,
      "image": getGameThumb(game) || game.image,
      "genre": game.category || "Casual",
      "gamePlatform": "Mobile Web Browser",
      "playMode": "SinglePlayer",
      "applicationCategory": "Game",
      "operatingSystem": "iOS, Android, Any",
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": gameStats.rating,
        "bestRating": "5",
        "worstRating": "1",
        "ratingCount": gameStats.ratingCount
      },
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock"
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
          "name": game.category || "Games",
          "item": `https://8jjgames.com/categories/${(game.category || 'all').toLowerCase()}`
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": game.title,
          "item": `https://8jjgames.com/game/${game.id}`
        }
      ]
    };

    const schemaScript = document.createElement('script');
    schemaScript.type = 'application/ld+json';
    schemaScript.text = JSON.stringify([gameSchema, breadcrumbSchema]);
    schemaScript.id = 'mobile-game-schema';
    document.head.appendChild(schemaScript);

    return () => {
      const existingScript = document.getElementById('mobile-game-schema');
      if (existingScript) document.head.removeChild(existingScript);
    };
  }, [game, gameStats, gameDescription]);

  // ============================================
  // FULLSCREEN HANDLING
  // ============================================
  const enterFullscreen = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    }
  };

  const exitFullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  };

  useEffect(() => {
    const onChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", onChange);
    document.addEventListener("webkitfullscreenchange", onChange);

    return () => {
      document.removeEventListener("fullscreenchange", onChange);
      document.removeEventListener("webkitfullscreenchange", onChange);
    };
  }, []);

  // ============================================
  // COLLECTION TOGGLE
  // ============================================
  const handleCollectionToggle = async () => {
    if (!game || checkingCollection) return;

    const token = localStorage.getItem("token");
    if (!token) {
      showToast("Please login to save games");
      return;
    }

    try {
      if (inCollection) {
        setInCollection(false);
        showToast(translate("removedFromCollection", lang));
        await removeFromCollectionDB(game.id);
      } else {
        setInCollection(true);
        setShowAdded(true);
        showToast(translate("addedToCollection", lang));
        await addToCollectionDB(game);
        setTimeout(() => setShowAdded(false), 1000);
      }
    } catch (err) {
      console.error("Collection error:", err);
      setInCollection(prev => !prev);
      showToast("Something went wrong");
    }
  };

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: "" }), 3000);
  };

  // ============================================
  // GAME START & TRACKING
  // ============================================
  const startGame = async () => {
    setPlaying(true);

    try {
      const token = localStorage.getItem("token");
      if (token) {
        const res = await fetch(API.ACTIVITY, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            activity_type: "play_game",
            game_id: game.id
          })
        });

        const data = await res.json();
        setSessionId(data.activityId);

        if (!playTrackedRef.current) {
          playTrackedRef.current = true;
          await refreshProfile();
        }
      }
    } catch (err) {
      console.error("Failed to track game play:", err);
    }
  };

  // ============================================
  // TAG CLICK HANDLER
  // ============================================
  const handleTagClick = (tag) => {
    navigate(`/categories/${tag.toLowerCase()}`);
  };

  // ============================================
  // RELATED GAMES
  // ============================================
  const relatedGames = useMemo(() => {
    if (!game || !games.length) return [];
    return games
      .filter(g => g.id !== game.id && g.category === game.category)
      .slice(0, 12);
  }, [game, games]);

  // ============================================
  // LOADING STATE
  // ============================================
  if (loading) {
    return (
      <>
        <SEO
          title="Loading Game..."
          description="Loading game - 8JJ Games"
          url={`/game/${id}`}
        />
        <div className="mobile-gamepage-wrapper">
          <div className="mobile-game-loader">
            <div className="mobile-spinner"></div>
            <p>{translate("loading", lang)}</p>
          </div>
        </div>
      </>
    );
  }

  if (!game) {
    return (
      <div className="mobile-gamepage-wrapper">
        <MobileHeader />
        <div className="mobile-game-error">
          <h2>Game Not Found</h2>
          <button onClick={() => navigate("/")} className="mobile-home-btn">
            Go Home
          </button>
        </div>
        <MobileBottomNav />
      </div>
    );
  }

  const iframeSrc = game.source === "self"
    ? `${window.location.origin}${game.embed}`
    : game.embed;

  const getCollectionButtonText = () => {
    if (checkingCollection) return "...";
    if (showAdded) return translate("added", lang);
    if (inCollection) return "★";
    return "☆";
  };

  return (
    <>
      <SEO
        title={`Play ${game.title} - Mobile Game | 8JJ Games`}
        description={gameDescription}
        keywords={gameKeywords}
        image={getGameThumb(game) || game.image}
        url={`/game/${game.id}`}
        type="game"
      />

      <div className="mobile-gamepage-wrapper">
         <MobileHeader />
        {/* Toast */}
        {toast.show && (
          <div className="mobile-game-toast">
            {toast.message}
          </div>
        )}

        {/* Header */}
        <header className="mobile-game-header">
          <button
            className="mobile-game-back-btn"
            onClick={() => navigate(-1)}
            aria-label="Go back"
          >
            ←
          </button>
          <h1 className="mobile-game-title-header">{game.title}</h1>
          <div className="mobile-game-actions">
            <button
              className={`mobile-game-collection-btn ${inCollection ? 'active' : ''} ${showAdded ? 'just-added' : ''}`}
              onClick={handleCollectionToggle}
              disabled={checkingCollection}
              aria-label={inCollection ? "Remove from collection" : "Add to collection"}
            >
              {getCollectionButtonText()}
            </button>
            <button
              className="mobile-game-share-btn"
              onClick={() => setShowShare(true)}
              aria-label="Share game"
            >
              📤
            </button>
          </div>
        </header>

        {/* Game Frame */}
        <div className={`mobile-game-frame-container ${isFullscreen ? 'fullscreen' : ''}`}>
          {playing ? (
            <>
              <iframe
                ref={iframeRef}
                src={iframeSrc}
                className="mobile-game-iframe"
                title={`Play ${game.title}`}
                allow="fullscreen; autoplay; gamepad; accelerometer; gyroscope"
                allowFullScreen
              />
              <button
                className="mobile-game-fullscreen-btn"
                onClick={isFullscreen ? exitFullscreen : enterFullscreen}
                aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
              >
                {isFullscreen ? "⤓" : "⤢"}
              </button>
            </>
          ) : (
            <div
              className="mobile-game-poster"
              style={{
                backgroundImage: `url(${getGameThumb(game)}), url(${game.image})`
              }}
              onClick={startGame}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => e.key === 'Enter' && startGame()}
              aria-label={`Start playing ${game.title}`}
            >
              <div className="mobile-game-play-overlay">
                <button className="mobile-game-big-play-btn">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-play-icon lucide-play"><path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z"/></svg> {translate("playNow", lang)}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Game Info Bar */}
        <div className="mobile-game-info-bar">
          <div className="mobile-info-block">
            <span className="mobile-info-label">{translate("category", lang)}</span>
            <span className="mobile-info-value">{game.category || "Casual"}</span>
          </div>
          <div className="mobile-info-block">
            <span className="mobile-info-label">{translate("plays", lang)}</span>
            <span className="mobile-info-value">{gameStats.plays.toLocaleString()}</span>
          </div>
          <div className="mobile-info-block">
            <span className="mobile-info-label">{translate("rating", lang)}</span>
            <span className="mobile-info-value">{gameStats.rating} ⭐</span>
          </div>
        </div>

        {/* Game Description */}
        {game.description && (
          <section className="mobile-game-description-section">
            <h2 className="mobile-section-title">
              {translate("aboutGame", lang) || "About This Game"}
            </h2>
            <p className="mobile-game-description">{game.description}</p>
          </section>
        )}

        {/* Tags */}
        {gameTags.length > 0 && (
          <section className="mobile-game-tags-section">
            <div className="mobile-tags-container">
              {gameTags.map((tag, index) => (
                <button
                  key={index}
                  className="mobile-game-tag"
                  onClick={() => handleTagClick(tag)}
                  aria-label={`View ${tag} games`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Comments */}
        <section className="mobile-game-comments-section">
          <CommentSection gameId={game.id} />
        </section>

        {/* Related Games */}
        {relatedGames.length > 0 && (
          <section className="mobile-related-games-section">
            <div className="mobile-related-header">
              <h2 className="mobile-section-title">
                {translate("moreGames", lang) || "More Games"}
              </h2>
              {relatedGames.length > 6 && (
                <button
                  className="mobile-show-more-btn"
                  onClick={() => setShowMoreGames(!showMoreGames)}
                >
                  {showMoreGames ? "Show Less" : "Show More"}
                </button>
              )}
            </div>

            <div className="mobile-related-grid">
              {(showMoreGames ? relatedGames : relatedGames.slice(0, 6)).map((g) => (
                <article
                  key={g.id}
                  className="mobile-related-card"
                  onClick={() => navigate(`/game/${g.id}`)}
                  role="button"
                  tabIndex={0}
                  onKeyPress={(e) => e.key === 'Enter' && navigate(`/game/${g.id}`)}
                >
                  <img
                    src={getGameThumb(g)}
                    alt={`${g.title} thumbnail`}
                    className="mobile-related-image"
                    onError={(e) => e.currentTarget.src = g.image}
                    loading="lazy"
                  />
                  <div className="mobile-related-overlay">
                    <h3 className="mobile-related-title">{g.title}</h3>
                    {g.category && (
                      <span className="mobile-related-category">{g.category}</span>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Share Modal */}
        {game && (
          <GameShareModal
            open={showShare}
            onClose={() => setShowShare(false)}
            title={game.title}
            url={gameUrl}
          />
        )}

        {/* Footer Space for Bottom Nav */}
        <div className="mobile-footer-space" />
        <MobileBottomNav />
      </div>
    </>
  );
}