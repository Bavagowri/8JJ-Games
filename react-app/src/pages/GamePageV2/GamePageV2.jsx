// react-app/src/pages/GamePageV2/GamePageV2.jsx
import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState, useRef, useMemo } from "react";
import "./GamePageV2.css";
import ScrollToTop from "../../components/ScrollToTop";
import { useLanguage } from "../../context/LanguageContext"; 
import { translate } from "../../data/translations";
import { getGameThumb } from "../../utils/getGameThumb";
import GameShareModal from "../../components/GameShareModal/GameShareModal";
import CommentSection from '../../components/Comments/CommentSection';
import { useProfile } from "../../context/ProfileContext";
import { addToCollectionDB, removeFromCollectionDB, fetchMyCollection } from "../../api/collection.api";
import SEO from "../../components/SEO/SEO";
import { generateKeywords } from "../../config/seoKeywords";
import { API } from "../../config/api";
import WidgetLeaderboard from "../../components/Widgets/WidgetLeaderboard";
import WidgetMatchCard from "../../components/Widgets/WidgetMatchCard";
import { useAuth } from "../../context/AuthContext";

import PointsBanner from "../../components/PointsBanner/PointsBanner";
import PromoPopup from "../../components/PromoPopup/PromoPopup";

const API_BASE = import.meta.env.VITE_API_URL;
if (!API_BASE) {
  throw new Error("❌ VITE_API_URL is not defined");
}

const R2_BASE =
  import.meta.env.VITE_ASSETS_BASE_URL ||
  "https://assets.8jjgames.com";

export default function GamePageV2() {
  const { slug } = useParams();
  const { id } = useParams();
  const navigate = useNavigate();
  const { lang } = useLanguage();

  const frameRef = useRef(null);
  const iframeRef = useRef(null);

  const [games, setGames] = useState([]);
  const [relatedGames, setRelatedGames] = useState([]);
  const [game, setGame] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const [showShare, setShowShare] = useState(false);

  // Collection states
  const [inCollection, setInCollection] = useState(false);
  const [showAdded, setShowAdded] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "" });
  const [checkingCollection, setCheckingCollection] = useState(true);

  const [imgSrc, setImgSrc] = useState(getGameThumb(game));
  const { refreshProfile } = useProfile();

  const playTrackedRef = useRef(false);
  const [sessionId, setSessionId] = useState(null);

  const isLoggedIn = typeof window !== "undefined" && !!localStorage.getItem("token");

  //track activity
  const trackActivity = async (type, gameId) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(API.ACTIVITY, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          activity_type: type,
          game_id: gameId
        })
      });

      if (res.ok && type === "play_game") {
        await refreshProfile();
      }
    } catch (err) {
      console.error("Activity tracking failed", err);
    }
  };

  //for share game url
  const gameUrl = useMemo(() => {
    if (!game) return "";
    return `${window.location.origin}/games/${game.provider_id}`;
  }, [game]);

  //  IMPROVED: Consistent random values based on game ID
  const gameStats = useMemo(() => {
    if (!game) return { rating: "4.5", plays: 2000, ratingCount: 100 };

    const seed = parseInt(game.provider_id) || 0;
    return {
      rating: (4.5 + (seed % 5) / 10).toFixed(1),
      plays: 2000 + (seed % 6000),
      ratingCount: 100 + (seed % 400)
    };
  }, [game?.id]);

  //  MOVED: SEO data generation BEFORE early return
  const gameDescription = useMemo(() => {
    if (!game) {
      return "Play free online games instantly on 8JJ Games. No download, no registration required.";
    }

    const title = game.title;
    const category = game.category || "online";
    const description = game.description?.trim();

    const baseDescription =
      description && description.length > 40
        ? description
        : `${title} is an exciting ${category} game that you can play directly in your browser.`;

    return `${baseDescription} Play ${title} online for free at 8JJ Games. No download required – enjoy instant HTML5 gameplay on desktop and mobile devices.`;
  }, [game]);


  const gameKeywords = useMemo(() => {
    if (!game) return "free online games, browser games, HTML5 games";

    const keywords = new Set();

    const title = game.title;
    const category = game.category;

    keywords.add(title);
    keywords.add(`play ${title}`);
    keywords.add(`${title} online`);
    keywords.add(`free ${title}`);

    if (category) {
      keywords.add(`${category} games`);
      keywords.add(`free ${category} games`);
      keywords.add(`online ${category} games`);
    }

    // Handle DB tag string (GROUP_CONCAT)
    if (game.tags && typeof game.tags === "string") {
      game.tags.split(",").forEach(tag => {
        const cleanTag = tag.trim();
        if (cleanTag) {
          keywords.add(`${cleanTag} games`);
        }
      });
    }

    keywords.add("free online games");
    keywords.add("HTML5 games");
    keywords.add("browser games");
    keywords.add("play online");
    keywords.add("no download games");

    return Array.from(keywords).join(", ");
  }, [game]);


  // NEW: Get all unique tags for the game (MOVED BEFORE EARLY RETURN)
  const gameTags = useMemo(() => {
    if (!game) return [];

    const tags = new Set();

    if (game.category) {
      tags.add(game.category.toLowerCase());
    }

    if (game.tags && typeof game.tags === "string") {
      game.tags.split(",").forEach(tag => {
        const cleanTag = tag.trim().toLowerCase();
        if (cleanTag) tags.add(cleanTag);
      });
    }

    return Array.from(tags);
  }, [game]);

  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

  /* =========================
     LOAD GAME FROM DATABASE
  ========================== */
  useEffect(() => {
    const loadGame = async () => {
      try {
        setPageLoading(true);

        const res = await fetch(`${API_BASE}/api/games/${slug}`);
        const data = await res.json();

        setGame(data.data || null);
      } catch (err) {
        console.error("Failed to load game", err);
      } finally {
        setPageLoading(false);
      }
    };

    loadGame();
  }, [slug]);

  /* =========================
    LOAD RELATED FROM DB
 ========================== */
  useEffect(() => {
    if (!game?.provider_id) return;

    const fetchRelated = async () => {
      try {
        const res = await fetch(
          `${API_BASE}/api/games/${game.provider_id}/related`
        );
        const data = await res.json();
        setRelatedGames(data.data || []);
      } catch (err) {
        console.error("Failed to fetch related games", err);
      }
    };

    fetchRelated();
  }, [game]);


  /* =======================
     CHECK COLLECTION STATUS FROM DATABASE
  ======================== */
  useEffect(() => {
    if (!game) return;

    const checkCollectionStatus = async () => {
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
          item => String(item.provider_id) === String(game.provider_id)
        );

        setInCollection(isInDB);
      } catch (err) {
        console.error("Failed to check collection status:", err);
        setInCollection(false);
      } finally {
        setCheckingCollection(false);
      }
    };

    checkCollectionStatus();
  }, [game?.provider_id, slug]);

  /* =======================
      NEW: JSON-LD SCHEMA MARKUP
  ======================== */
  useEffect(() => {
    if (!game) return;

    // Game Schema
    const gameSchema = {
      "@context": "https://schema.org",
      "@type": "VideoGame",
      "name": game.title,
      "description": gameDescription,
      "url": `https://8jjgames.com/games/${game.provider_id}`,
      "image": getGameThumb(game) || game.image,
      "screenshot": getGameThumb(game) || game.image,
      "genre": game.category || "Casual",
      "gamePlatform": "Web Browser",
      "playMode": "SinglePlayer",
      "applicationCategory": "Game",
      "operatingSystem": "Any",
      "browserRequirements": "HTML5 compatible browser",
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
      },
      "author": {
        "@type": "Organization",
        "name": "8jj-games",
        "url": "https://8jjgames.com"
      },
      "publisher": {
        "@type": "Organization",
        "name": "8jj-games",
        "url": "https://8jjgames.com"
      }
    };

    // Breadcrumb Schema
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
          "item": `https://8jjgames.com/games/${game.provider_id}`
        }
      ]
    };

    // Website Schema
    const websiteSchema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "8jj-games",
      "url": "https://8jjgames.com",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://8jjgames.com/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    };

    // Add all schemas
    const schemaScript = document.createElement('script');
    schemaScript.type = 'application/ld+json';
    schemaScript.text = JSON.stringify([gameSchema, breadcrumbSchema, websiteSchema]);
    schemaScript.id = 'game-schema';
    document.head.appendChild(schemaScript);

    // Cleanup
    return () => {
      const existingScript = document.getElementById('game-schema');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, [game, gameStats, gameDescription]);

  /* =======================
      NEW: CANONICAL URL
  ======================== */
  useEffect(() => {
    if (!game) return;

    const canonicalLink = document.createElement('link');
    canonicalLink.rel = 'canonical';
    canonicalLink.href = `https://8jjgames.com/games/${game.provider_id}`;
    canonicalLink.id = 'canonical-link';
    document.head.appendChild(canonicalLink);

    return () => {
      const existingLink = document.getElementById('canonical-link');
      if (existingLink) {
        document.head.removeChild(existingLink);
      }
    };
  }, [game]);

  /* =======================
     COLLECTION HANDLERS
  ======================== */
  const handleCollectionToggle = async () => {
    if (!game || checkingCollection) return;

    const token = localStorage.getItem("token");
    if (!token) {
      showToast("Please login to save games to your collection");
      return;
    }

    try {
      if (inCollection) {
        // Optimistic UI update
        setInCollection(false);
        showToast(translate("removedFromCollection", lang));

        // DB call
        await removeFromCollectionDB(game.provider_id);
      } else {
        // Optimistic UI update
        setInCollection(true);
        setShowAdded(true);
        showToast(translate("addedToCollection", lang));

        // DB call
        await addToCollectionDB(game);

        setTimeout(() => setShowAdded(false), 1000);
      }
    } catch (err) {
      console.error("Collection error:", err);

      // rollback UI if DB fails
      setInCollection(prev => !prev);
      showToast("Something went wrong. Please try again.");
    }
  };

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => {
      setToast({ show: false, message: "" });
    }, 3000);
  };

  /* =======================
     FULLSCREEN HANDLING
  ======================== */
  const enterFullscreen = () => {
    if (!game) return;

    if (isIOS) {
      // iOS Safari cannot do native fullscreen: open game in new tab
      window.open(game.embed, "_blank");
      return;
    }

    const el = frameRef.current;
    if (!el) return;

    if (el.requestFullscreen) el.requestFullscreen();
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
    else if (el.msRequestFullscreen) el.msRequestFullscreen();
  };

  const exitFullscreen = () => {
    if (document.exitFullscreen) document.exitFullscreen();
    else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
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

  const startGame = async () => {
    if (!game) return;

    setPlaying(true);

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(API.ACTIVITY, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          activity_type: "play_game",
          game_id: game.provider_id
        })
      });

      const data = await res.json();

      if (data.success) {
        setSessionId(data.activityId);
      }

    } catch (err) {
      console.error("Failed to start game session", err);
    }
  };

  const endGameSession = async () => {
    if (!sessionId) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE}/api/activity/end-game`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ activityId: sessionId })
      });

      const data = await res.json();

      if (data.pointsAwarded > 0) {
        toast.success(`🎉 +${data.pointsAwarded} points earned!`);

        window.dispatchEvent(
          new CustomEvent("wallet-update", {
            detail: {
              totalPoints: data.totalPoints,
              level: data.level,
              tier: data.tier
            }
          })
        );
      } 3

      setSessionId(null); // prevent double calls
      await refreshProfile();

    } catch (err) {
      console.error("Failed to end game session", err);
    }
  };

  useEffect(() => {
    return () => {
      endGameSession();
    };
  }, [sessionId]);

  useEffect(() => {
    const handleUnload = () => {
      if (!sessionId) return;

      const blob = new Blob(
        [JSON.stringify({ activityId: sessionId })],
        { type: "application/json" }
      );

      navigator.sendBeacon(
        `${API_BASE}/api/activity/end-game`,
        blob
      );
    };

    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, [sessionId]);

  const changeGame = async (slug) => {
    if (!slug) return;

    // End current session first
    if (sessionId) {
      await endGameSession();
    }

    setPlaying(false); // reset playing state
    navigate(`/games/${slug}`);
  };

  useEffect(() => {
    // when game changes, reset state
    setPlaying(false);
    setSessionId(null);
  }, [slug]);

  const handleBack = () => {
    navigate(-1);
  };

  // NEW: Handle tag click to navigate to category/search
  const handleTagClick = (tag) => {
    navigate(`/categories/${tag.toLowerCase()}`);
  };

  /* =======================
     SKELETON LOADER
  ======================== */
  const SkeletonLoader = () => (
    <div className="gamepage-layout">
      <div className="center-column">
        <div className="skeleton skeleton-title"></div>
        <div className="skeleton skeleton-game-frame">
          <div className="skeleton-preloader">
            <div className="spinner"></div>
            <div className="loading-text">{translate("loading", lang)}</div>
          </div>
        </div>
        <div className="skeleton-info-bar">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="skeleton-info-block">
              <div className="skeleton skeleton-label"></div>
              <div className="skeleton skeleton-value"></div>
            </div>
          ))}
        </div>
        <div className="skeleton skeleton-section-title"></div>
        <div className="more-games-grid">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="skeleton skeleton-game-card"></div>
          ))}
        </div>
      </div>
      <div className="side-column">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="skeleton skeleton-side-card"></div>
        ))}
      </div>
    </div>
  );

  //  FIXED: Early return is now AFTER all hooks
  if (pageLoading || !game) return <SkeletonLoader />;

  /* =======================
     RELATED GAMES LOGIC
  ======================== */
  const moreGames = relatedGames.slice(0, 12);
  const sideGames = relatedGames.slice(12, 24);

  const iframeSrc =
    game.source === "self"
      ? `${window.location.origin}${game.embed}`
      : game.embed;

  // Button text logic
  const getCollectionButtonText = () => {
    if (checkingCollection) return "...";
    if (showAdded) return translate("added", lang);
    if (inCollection) return translate("removeFromCollection", lang);
    return translate("addToCollection", lang);
  };

  /* =======================
     RENDER
  ======================== */
  return (
    <>
      {/*   IMPROVED: Enhanced SEO Meta Tags */}
      <SEO
        title={`Play ${game.title} Online Free - ${game.category || 'Browser Game'} | 8jj-games`}
        description={gameDescription}
        keywords={gameKeywords}
        image={getGameThumb(game) || game.image}
        url={`/game/${game.provider_id}`}
        type="game"
      />

      <div className="gamepage-layout">
        <ScrollToTop />

        {/* Toast Notification */}
        {toast.show && (
          <div className="toast-notification">
            {toast.message}
          </div>
        )}

        <div className="center-column">
          {/*  NEW: Breadcrumb Navigation */}

          <div className='breadcrumb-container-back'>
            <div className='BackBTNcontainer'>
              <button
                onClick={handleBack}
                className="premium-back-buttonzzz game-back-button"
                aria-label="Go back to previous page"
              >
                <span className="back-arrow">←</span>
              </button>
            </div>

            <nav className="breadcrumb max-width" aria-label="Breadcrumb">
              <Link to="/" className="breadcrumb-link">Home</Link>
              <span className="breadcrumb-separator">/</span>
              <Link
                to={`/categories/${(game.category || 'all').toLowerCase()}`}
                className="breadcrumb-link"
              >
                {game.category || 'Games'}
              </Link>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-current">{game.title}</span>
            </nav>
          </div>

          <div className="DesktopHeaderGameplay">
            <div className="game-header CommomTheme-Section">
              <div className="game-header-content">
                {/*  Proper H1 with game title */}
                <h1 className="play-title">{game.title}</h1>

                <div className="game-header-buttons">
                  <button
                    className={`game-collection-btn ${inCollection ? "in-collection" : ""} ${showAdded ? "just-added" : ""}`}
                    onClick={handleCollectionToggle}
                    disabled={checkingCollection}
                    title={inCollection ? translate("removeFromCollection", lang) : translate("addToCollection", lang)}
                    aria-label={inCollection ? translate("removeFromCollection", lang) : translate("addToCollection", lang)}
                  >
                    <img
                      src="/images/collection.png"
                      alt="Collection icon"
                      className="collection-header-icon"
                    />
                    {getCollectionButtonText()}
                  </button>

                  <button
                    className="game-share-btn"
                    onClick={() => setShowShare(true)}
                    title={translate("shareThisGame", lang)}
                    aria-label={translate("shareThisGame", lang)}
                  >
                    <img
                      src="/images/shared.png"
                      alt="Share icon"
                      className="share-header-icon"
                    /> {translate("share", lang)}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="game-header MobileHeaderGameplay CommomTheme-Section">
            <button
              onClick={handleBack}
              className="premium-back-buttonzzz game-back-button"
              aria-label="Go back to previous page"
            >
              <span className="back-arrow">←</span>
            </button>

            <h1 className="play-title">{game.title}</h1>

            <div className="game-header-buttons">
              <button
                className={`game-collection-btn ${inCollection ? "in-collection" : ""} ${showAdded ? "just-added" : ""}`}
                onClick={handleCollectionToggle}
                disabled={checkingCollection}
                title={inCollection ? translate("removeFromCollection", lang) : translate("addToCollection", lang)}
                aria-label={inCollection ? translate("removeFromCollection", lang) : translate("addToCollection", lang)}
              >
                <img
                  src="/images/collection.png"
                  alt="Collection icon"
                  className="collection-header-icon"
                />
                {getCollectionButtonText()}
              </button>

              <button
                className="game-share-btn"
                onClick={() => setShowShare(true)}
                title={translate("shareThisGame", lang)}
                aria-label={translate("shareThisGame", lang)}
              >
                <img
                  src="/images/shared.png"
                  alt="Share icon"
                  className="share-header-icon"
                /> {translate("share", lang)}
              </button>
            </div>
          </div>

          {/* ── POINTS BANNER (2 of 2) ──────────────────────────────────────
              Renders only for anonymous users (token check is inside the
              component). Sits between the title header and the game frame.
              No existing styles or logic are affected.
          ─────────────────────────────────────────────────────────────── */}
          <PointsBanner slug={slug} />

          <div
            className={`game-frame-container ${isFullscreen ? "fullscreen" : ""}`}
            ref={frameRef}
            key={game.provider_id}
          >
            {playing ? (
              <>
                {/*  IMPROVED: Better iframe accessibility */}
                <iframe
                  ref={iframeRef}
                  src={iframeSrc}
                  className="game-iframe"
                  title={`Play ${game.title} - ${game.category || 'Browser'} Game`}
                  aria-label={`${game.title} game iframe`}
                  allow="fullscreen; autoplay; gamepad; accelerometer; gyroscope"
                  allowFullScreen
                  sandbox="allow-same-origin allow-scripts allow-pointer-lock allow-forms allow-modals"
                />
                <button
                  className="fullscreen-btn"
                  onClick={isFullscreen ? exitFullscreen : enterFullscreen}
                  aria-label={isFullscreen ? translate("exitFullscreen", lang) : translate("fullscreen", lang)}
                >
                  {isFullscreen ? translate("exitFullscreen", lang) : translate("fullscreen", lang)}
                </button>
              </>
            ) : (
              <div
                className="game-poster"
                onClick={startGame}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => e.key === 'Enter' && startGame()}
                aria-label={`Start playing ${game.title}`}
              >
                <img
                  src={getGameThumb(game)}
                  alt={game.title}
                  className="game-poster-img"
                  onError={(e) => {
                    e.currentTarget.src = game.image || "/images/game-placeholder.png";
                  }}
                />
                <div className="poster-overlay">
                  <button className="big-play-btn">
                    {translate("playNow", lang)}
                  </button>
                </div>
              </div>
            )}
          </div>

          {!isLoggedIn && (
            <PromoPopup
              image={`${R2_BASE}/images/register-refer.webp`}
              title={translate("promo_popup_register_title", lang)}
              description={translate("promo_popup_register_description", lang)}
              buttonText={translate("promo_popup_register_button", lang)}
              buttonLink="/register"
              storageKey="hide_register_popup"
            />
          )}

          {isLoggedIn && (
            <PromoPopup
              image={`${R2_BASE}/images/share-earn.webp`}
              title={translate("promo_popup_share_title", lang)}
              description={translate("promo_popup_share_description", lang)}
              buttonText={translate("promo_popup_share_button", lang)}
              onButtonClick={() => setShowShare(true)}
              storageKey="hide_share_popup"
            />
          )}
                      

          {/* Game Share Modal */}
          {game && (
            <GameShareModal
              open={showShare}
              onClose={() => setShowShare(false)}
              title={game.title}
              url={gameUrl}
              gameId={game.provider_id}
            />
          )}

          {/*  IMPROVED: Game Info with consistent stats */}
          <div className="game-info-bar CommomTheme-Section">
            <div className="info-block">
              <span className="label">{translate("category", lang)}</span>
              <span className="value">{game.category || game.tagList?.[0]}</span>
            </div>
            <div className="info-block">
              <span className="label">{translate("plays", lang)}</span>
              <span className="value">{gameStats.plays.toLocaleString()}</span>
            </div>
            <div className="info-block">
              <span className="label">{translate("rating", lang)}</span>
              <span className="value">{gameStats.rating} ⭐</span>
            </div>
            <div className="info-block">
              <span className="label">{translate("addedz", lang)}</span>
              <span className="value">2025</span>
            </div>
          </div>

          {/*  IMPROVED: Game description with proper heading hierarchy */}
          {game.description && (
            <section className="game-description-section" aria-labelledby="about-heading">
              <h2 id="about-heading" className="section-title">
                {translate("aboutGame", lang) || "About This Game"}
              </h2>
              <p className="game-description-text">{game.description}</p>
            </section>
          )}

          {/*  NEW: Tags Section with proper semantic markup */}
          {gameTags.length > 0 && (
            <section className="game-tags-section CommomTheme-Section" aria-labelledby="tags-heading">
              <h2 id="tags-heading" className="sr-only">Game Tags</h2>
              <div className="tags-container">
                {gameTags.map((tag, index) => (
                  <button
                    key={index}
                    className="game-tag"
                    onClick={() => handleTagClick(tag)}
                    aria-label={`View more ${tag} games`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </section>
          )}

          {/*  NEW: Comments Section */}
          <section className="game-comments-wrapper" aria-labelledby="comments-heading">
            <CommentSection gameId={game.provider_id} />
          </section>

          {/*  IMPROVED: Related games section with semantic HTML */}
          <section className="related-games-section" aria-labelledby="related-heading">
            <h2 id="related-heading" className="section-title">
              {translate("moreGames", lang) || "More Games You'll Love"}
            </h2>
            <div className="more-games-grid">
              {moreGames.map((g, index) => (
                <article
                  key={`${g.id}-${index}`}
                  className="game-card"
                  onClick={() => changeGame(g.provider_id || g.id)}
                  role="button"
                  tabIndex={0}
                  onKeyPress={(e) => e.key === 'Enter' && changeGame(g.provider_id || g.id)}
                >
                  <img
                    src={getGameThumb(g)}
                    alt={`Play ${g.title} - ${g.category || 'Free'} online game`}
                    className="game-image"
                    onError={(e) => {
                      e.currentTarget.src = g.image;
                    }}
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="play-button" aria-hidden="true">
                    {translate("playNow", lang)}
                  </div>
                  <div className="game-overlay">
                    <h3 className="game-title">{g.title}</h3>
                    {g.category && <div className="game-category">{g.category}</div>}
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>


        <div className="RightContain">

          <div className="prediction-widgets-col">
            <WidgetLeaderboard
              activePeriod="weekly"
              showBonus={true}
              myRankLabel="#5 of 1,247"
              rows={[
                { rank: 1, username: "CricketKing", avatarLetter: "C", pointsLabel: "1,840", winsLabel: "23 wins", isPodium: true, isMe: false },
                { rank: 2, username: "PredictPro", avatarLetter: "P", pointsLabel: "1,720", winsLabel: "21 wins", isPodium: true, isMe: false },
                { rank: 3, username: "SportsBoss", avatarLetter: "S", pointsLabel: "1,590", winsLabel: "19 wins", isPodium: true, isMe: false },
                { rank: 4, username: "Akila99", avatarLetter: "A", pointsLabel: "1,430", winsLabel: "18 wins", isPodium: false, isMe: false },
              ]}
            />
          </div>

          {/*  IMPROVED: Side column with proper semantic markup */}
          <aside className="side-column" aria-label="More recommended games">
            <h2 className="sr-only">Recommended Games</h2>
            {sideGames.map((g, index) => (
              <article
                key={`${g.id}-${index}`}
                className="game-card game-card-side"
                onClick={() => changeGame(g.provider_id || g.id)}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => e.key === 'Enter' && changeGame(g.provider_id || g.id)}
              >
                <img
                  src={getGameThumb(g)}
                  alt={`Play ${g.title} - ${g.category || 'Free'} online game`}
                  className="game-image"
                  onError={(e) => {
                    e.currentTarget.src = g.image;
                  }}
                  loading="lazy"
                  decoding="async"
                />
                <div className="play-button" aria-hidden="true">
                  {translate("playNow", lang)}
                </div>
                <div className="game-overlay">
                  <h3 className="game-title">{g.title}</h3>
                  {g.category && <div className="game-category">{g.category}</div>}
                </div>
              </article>
            ))}
          </aside>

        </div>

      </div>
    </>
  );
}