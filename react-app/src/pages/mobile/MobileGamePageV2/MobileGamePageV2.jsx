// react-app/src/pages/mobile/MobileGamePageV2/MobileGamePageV2.jsx


import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState, useRef, useMemo } from "react";
import { useLanguage } from "../../../context/LanguageContext";
import { translate } from "../../../data/translations";
import MobileBottomNav from "../../../components/mobile/MobileBottomNav/MobileBottomNav";
import { getGameThumb } from "../../../utils/getGameThumb";
import { addToCollectionDB, removeFromCollectionDB, fetchMyCollection } from "../../../api/collection.api";
import { API } from "../../../config/api";
import { useProfile } from "../../../context/ProfileContext";
import CommentSection from "../../../components/Comments/CommentSection";
import GameShareModal from "../../../components/GameShareModal/GameShareModal";
import SEO from "../../../components/SEO/SEO";
import { generateKeywords } from "../../../config/seoKeywords";
import "./MobileGamePageV2.css";
import MobileHeader from "../../../components/mobile/MobileHeader/MobileHeader";
import {
  ArrowLeft,
  Heart,
  Share2,
  Star,
  Play,
  Maximize,
  Minimize,
  Eye,
  Gamepad2,
  Tag,
  MessageCircle
} from "lucide-react";

// ── POINTS BANNER 
import MobilePointsBanner from "../../../components/PointsBanner/MobilePointsBanner";
import RegisterPromoPopup from "../../../components/RegisterPromoPopup/RegisterPromoPopup";
import PromoPopup from "../../../components/PromoPopup/PromoPopup";
import { useAuth } from "../../../context/AuthContext";
const API_BASE = import.meta.env.VITE_API_URL;
if (!API_BASE) {
  throw new Error("❌ VITE_API_URL is not defined");
}

const R2_BASE =
  import.meta.env.VITE_ASSETS_BASE_URL ||
  "https://assets.8jjgames.com";


export default function MobileGamePageV2() {
  const { id } = useParams();
  const { slug } = useParams();
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const iframeRef = useRef(null);
  const frameRef = useRef(null);
  const playTrackedRef = useRef(false);
  const { refreshProfile } = useProfile();

  const [game, setGame] = useState(null);
  const [games, setGames] = useState([]);
  const [playing, setPlaying] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [inCollection, setInCollection] = useState(false);
  const [checkingCollection, setCheckingCollection] = useState(true);
  const [showAdded, setShowAdded] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "" });
  const [showShare, setShowShare] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [showMoreGames, setShowMoreGames] = useState(false);
  const [relatedGames, setRelatedGames] = useState([]);
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  const { user } = useAuth();
  const isLoggedIn = typeof window !== "undefined" && !!localStorage.getItem("token");

  // ============================================
  // RELATED CATEGORIES LOGIC
  // ============================================
  const RELATED_CATEGORIES = {
    shooting: ["action", "war", "fps", "gun"],
    driving: ["racing", "car", "truck"],
    racing: ["driving", "car"],
    action: ["shooting", "fighting", "war"],
    horror: ["halloween", "scary"],
    puzzle: ["brain", "logic"],
    kids: ["girls", "fun", "educational"],
    arcade: ["fun", "classic"],
    platformer: ["endless_runner", "skill"],
  };

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

  const getGameCategories = (game) => {
    const cats = [];
    if (game.category) cats.push(game.category);
    if (Array.isArray(game.tagList)) cats.push(...game.tagList);
    return [...new Set(cats.map((c) => c.toLowerCase()))];
  };

  // ============================================
  // GAME URL & STATS
  // ============================================
  const gameUrl = useMemo(() => {
    if (!game) return "";
    return `${window.location.origin}/games/${game.provider_id}`;
  }, [game]);

  const gameStats = useMemo(() => {
    if (!game) return { rating: "4.5", plays: 2000, ratingCount: 100 };
    const seed = parseInt(game.provider_id) || 0;
    return {
      rating: (4.5 + (seed % 5) / 10).toFixed(1),
      plays: 2000 + (seed % 6000),
      ratingCount: 100 + (seed % 400),
    };
  }, [game?.id]);

  const gameDescription = useMemo(() => {
    if (!game) return "Play free online games on 8JJ Games. No download required!";
    const base = game.description || `${game.title} is a ${game.category || "fun"} game`;
    const cta = `Play ${game.title} online for free at 8JJ Games`;
    const features = `${game.category ? `${game.category} game` : "Browser game"} - No download, play instantly!`;
    return `${base}. ${cta}. ${features}`;
  }, [game]);

  const gameKeywords = useMemo(() => {
    if (!game) return generateKeywords("pages", "home");
    const keywords = [
      game.title,
      `play ${game.title}`,
      `${game.title} online`,
      `${game.title} mobile`,
      `free ${game.title}`,
    ];
    if (game.category) {
      keywords.push(`${game.category} games`, `mobile ${game.category} games`);
    }
    if (game.tagList && Array.isArray(game.tagList)) {
      game.tagList.forEach((tag) => keywords.push(`${tag} games`));
    }
    keywords.push("free mobile games", "play online", "HTML5 games");
    return keywords.join(", ");
  }, [game]);

  const gameTags = useMemo(() => {
    const tags = new Set();
    if (!game) return [];
    if (game.category) tags.add(game.category);
    if (game.tagList) {
      if (Array.isArray(game.tagList)) {
        game.tagList.forEach((tag) => {
          if (tag && tag.trim()) tags.add(tag.trim());
        });
      } else if (typeof game.tagList === "string") {
        game.tagList.split(",").forEach((tag) => {
          if (tag && tag.trim()) tags.add(tag.trim());
        });
      }
    }
    if (game.tags && typeof game.tags === "string") {
      game.tags.split(",").forEach((tag) => {
        if (tag && tag.trim()) tags.add(tag.trim());
      });
    }
    return Array.from(tags);
  }, [game]);

  // ============================================
  // SCROLL TO TOP ON PAGE LOAD/REFRESH
  // ============================================
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [id]);

  // ============================================
  // LOAD GAMES
  // ============================================
  useEffect(() => {
    const loadGame = async () => {
      try {
        setPageLoading(true);

        const res = await fetch(`${API_BASE}/api/games/${slug}`);
        const data = await res.json();

        setGame(data.data || null);
        setPlaying(false);
      } catch (err) {
        console.error("Failed to load game:", err);
        setGame(null);
      } finally {
        setPageLoading(false);
      }
    };

    if (slug) loadGame();
  }, [slug]);

  /* =========================
     LOAD RELATED FROM DB
  ========================== */
  useEffect(() => {
    if (!game?.provider_id) return;

    const fetchRelated = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/games/${game.provider_id}/related`);
        const data = await res.json();
        setRelatedGames(data.data || []);
      } catch (err) {
        console.error("Failed to fetch related games", err);
      }
    };

    fetchRelated();
  }, [game]);

  // ============================================
  // CHECK COLLECTION STATUS
  // ============================================
  useEffect(() => {
    if (!game?.provider_id) return;

    const checkCollection = async () => {
      setCheckingCollection(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setInCollection(false);
          return;
        }

        const dbCollection = await fetchMyCollection();
        const isInDB = dbCollection.some(
          (item) => String(item.provider_id) === String(game.provider_id)
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
  }, [game?.provider_id, slug]);

  // ============================================
  // JSON-LD SCHEMA
  // ============================================
  useEffect(() => {
    if (!game) return;

    const gameSchema = {
      "@context": "https://schema.org",
      "@type": "VideoGame",
      name: game.title,
      description: gameDescription,
      url: `https://8jjgames.com/games/${game.provider_id}`,
      image: getGameThumb(game) || game.image,
      genre: game.category || "Casual",
      gamePlatform: "Mobile Web Browser",
      playMode: "SinglePlayer",
      applicationCategory: "Game",
      operatingSystem: "iOS, Android, Any",
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: gameStats.rating,
        bestRating: "5",
        worstRating: "1",
        ratingCount: gameStats.ratingCount,
      },
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
      },
    };

    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://8jjgames.com" },
        {
          "@type": "ListItem",
          position: 2,
          name: game.category || "Games",
          item: `https://8jjgames.com/categories/${(game.category || "all").toLowerCase()}`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: game.title,
          item: `https://8jjgames.com/games/${game.provider_id}`,
        },
      ],
    };

    const schemaScript = document.createElement("script");
    schemaScript.type = "application/ld+json";
    schemaScript.text = JSON.stringify([gameSchema, breadcrumbSchema]);
    schemaScript.id = "mobile-game-schema";
    document.head.appendChild(schemaScript);

    return () => {
      const existingScript = document.getElementById("mobile-game-schema");
      if (existingScript) document.head.removeChild(existingScript);
    };
  }, [game, gameStats, gameDescription]);

  // ============================================
  // FULLSCREEN HANDLING
  // ============================================
  const enterFullscreen = () => {
    if (!game) return;
    const el = frameRef.current;
    if (!el) return;

    if (el.requestFullscreen) {
      el.requestFullscreen().catch(() => {});
    } else if (el.webkitRequestFullscreen) {
      el.webkitRequestFullscreen();
    } else if (el.mozRequestFullScreen) {
      el.mozRequestFullScreen();
    } else if (el.msRequestFullscreen) {
      el.msRequestFullscreen();
    } else if (isIOS) {
      const iframe = iframeRef.current;
      if (iframe && iframe.webkitEnterFullscreen) {
        iframe.webkitEnterFullscreen();
      } else {
        setIsFullscreen(true);
      }
    }
  };

  const exitFullscreen = () => {
    if (document.exitFullscreen) document.exitFullscreen();
    else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
    else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
    else if (document.msExitFullscreen) document.msExitFullscreen();
    else if (isIOS) setIsFullscreen(false);
  };

  useEffect(() => {
    const onChange = () => {
      const isInFullscreen = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      );
      setIsFullscreen(isInFullscreen);
    };

    document.addEventListener("fullscreenchange", onChange);
    document.addEventListener("webkitfullscreenchange", onChange);
    document.addEventListener("mozfullscreenchange", onChange);
    document.addEventListener("msfullscreenchange", onChange);

    return () => {
      document.removeEventListener("fullscreenchange", onChange);
      document.removeEventListener("webkitfullscreenchange", onChange);
      document.removeEventListener("mozfullscreenchange", onChange);
      document.removeEventListener("msfullscreenchange", onChange);
    };
  }, []);

  // ============================================
  // COLLECTION TOGGLE
  // ============================================
  const handleCollectionToggle = async () => {
    if (!game || checkingCollection) return;

    const token = localStorage.getItem("token");
    if (!token) {
      showToast(translate("pleaseLogin", lang));
      return;
    }

    try {
      if (inCollection) {
        setInCollection(false);
        showToast(translate("removedFromCollection", lang));
        await removeFromCollectionDB(game.provider_id);
      } else {
        setInCollection(true);
        setShowAdded(true);
        showToast(translate("addedToCollection", lang));
        await addToCollectionDB(game);
        setTimeout(() => setShowAdded(false), 1000);
      }
    } catch (err) {
      console.error("Collection error:", err);
      setInCollection((prev) => !prev);
      showToast(translate("somethingWentWrong", lang));
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
      if (data.success) setSessionId(data.activityId);
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
        window.dispatchEvent(
          new CustomEvent("wallet-update", {
            detail: {
              totalPoints: data.totalPoints,
              level: data.level,
              tier: data.tier
            }
          })
        );
      }

      setSessionId(null);
      await refreshProfile();
    } catch (err) {
      console.error("Failed to end game session", err);
    }
  };

  useEffect(() => {
    return () => {
      if (sessionId) endGameSession();
    };
  }, []);

  useEffect(() => {
    const handleUnload = () => {
      if (!sessionId) return;
      const blob = new Blob(
        [JSON.stringify({ activityId: sessionId })],
        { type: "application/json" }
      );
      navigator.sendBeacon(`${API_BASE}/api/activity/end-game`, blob);
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
    setPlaying(false);
    setSessionId(null);
  }, [slug]);

  // ============================================
  // TAG CLICK HANDLER
  // ============================================
  const handleTagClick = (tag) => {
    navigate(`/categories/${tag.toLowerCase()}`);
  };

  /* =======================
     RELATED GAMES LOGIC
  ======================== */
  const moreGames = relatedGames.slice(0, 12);

  // ============================================
  // LOADING STATE
  // ============================================
  if (pageLoading || !game) {
    return (
      <>
        <SEO title="Loading Game..." description="Loading game - 8JJ Games" url={`/game/${id}`} />
        <div className="mobile-gamepage-wrapper">
          <div className="premium-loader">
            <div className="premium-spinner"></div>
            <p>{translate("loading", lang)}</p>
          </div>
        </div>
      </>
    );
  }

  const iframeSrc =
    game.source === "self" ? `${window.location.origin}${game.embed}` : game.embed;

  return (
    <>
      <SEO
        title={`Play ${game.title} - Mobile Game | 8JJ Games`}
        description={gameDescription}
        keywords={gameKeywords}
        image={getGameThumb(game) || game.image}
        url={`/games/${game.provider_id}`}
        type="game"
      />

      <div className="mobile-gamepage-wrapper">
        <MobileHeader />

        {/* Toast Notification */}
        {toast.show && <div className="premium-toast">{toast.message}</div>}

        <div className="mobile-content">
          {/* Premium Back Button */}
          <button
            className="premium-back-buttonzz"
            onClick={() => navigate(-1)}
            aria-label={translate("goBack", lang)}
          >
            <ArrowLeft />
          </button>

          {/* Hero Section */}
          <section className="game-hero-section">
            <div className="game-hero-container">
              {/* Game Thumbnail/Poster */}
              {!playing ? (
                <div className="game-thumbnail-card">
                  <div className="game-poster-wrapper">
                    <img
                      src={getGameThumb(game)}
                      alt={game.title}
                      className="game-poster-image"
                      onError={(e) => (e.currentTarget.src = game.image)}
                    />
                    <div className="game-poster-overlay">
                      <button
                        className="premium-play-button"
                        onClick={startGame}
                        aria-label={`${translate("playNow", lang)} ${game.title}`}
                      >
                        <Play fill="currentColor" />
                        {translate("playNow", lang)}
                      </button>
                    </div>
                    <div className="game-fullscreen-badge">
                      <Maximize size={14} />
                      <span>{translate("fullscreenAvailable", lang)}</span>
                    </div>
                  </div>
                </div>
              ) : null}

              {/* Game Info Header */}
              <div className="game-info-header">
                <div className="game-title-row">
                  <div className="game-title-section">
                    <h1>{game.title}</h1>
                    <span className="game-category-badge">
                      {game.category || translate("casual", lang)}
                    </span>
                  </div>

                  <div className="game-action-buttons">
                    <button
                      className={`game-action-btn ${inCollection ? "favorite-active" : ""} ${showAdded ? "just-favorited" : ""}`}
                      onClick={handleCollectionToggle}
                      disabled={checkingCollection}
                      aria-label={inCollection
                        ? translate("removeFromCollection", lang)
                        : translate("addToCollection", lang)}
                    >
                      <Heart fill={inCollection ? "currentColor" : "none"} />
                    </button>

                    <button
                      className="game-action-btn"
                      onClick={() => setShowShare(true)}
                      aria-label={translate("shareThisGame", lang)}
                    >
                      <Share2 />
                    </button>
                  </div>
                </div>

                {/* Stats Row */}
                <div className="game-stats-row">
                  <div className="game-stat-item">
                    <Star fill="#fbbf24" />
                    <span className="game-stat-value">{gameStats.rating}/5</span>
                  </div>
                  <div className="game-stat-item">
                    <Eye />
                    <span className="game-stat-value">{gameStats.plays.toLocaleString()}</span>
                    <span>{translate("plays", lang)}</span>
                  </div>
                  <div className="game-stat-item">
                    <Gamepad2 />
                    <span className="game-stat-value">{translate("pc_free", lang)}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <MobilePointsBanner slug={slug} />

          {/* Game iFrame Section (when playing) */}
          {playing && (
            <section className="game-iframe-section active">
              <div
                className={`game-iframe-container ${isFullscreen ? "fullscreen" : ""}`}
                ref={frameRef}
              >
                <div className="game-iframe-wrapper">
                  <iframe
                    ref={iframeRef}
                    src={iframeSrc}
                    title={`${translate("playNow", lang)} ${game.title}`}
                    allow="fullscreen; autoplay; gamepad; accelerometer; gyroscope"
                    allowFullScreen
                  />
                </div>

                <button
                  className="game-fullscreen-control"
                  onClick={isFullscreen ? exitFullscreen : enterFullscreen}
                  aria-label={isFullscreen
                    ? translate("exitFullscreen", lang)
                    : translate("fullscreen", lang)}
                >
                  {isFullscreen ? <Minimize /> : <Maximize />}
                </button>
              </div>
            </section>
          )}

          <RegisterPromoPopup isLoggedIn={user != null} />

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

          {/* Description Section */}
          {game.description && (
            <section className="game-content-section">
              <div className="section-card">
                <h2 className="section-titleyy">
                  <Gamepad2 />
                  {translate("aboutGame", lang)}
                </h2>
                <p className="game-description-text">{game.description}</p>
              </div>
            </section>
          )}

          {/* Tags Section */}
          {gameTags.length > 0 && (
            <section className="game-content-section">
              <div className="section-card">
                <h2 className="section-titleyy">
                  <Tag />
                  {translate("tags", lang)}
                </h2>
                <div className="game-tags-grid">
                  {gameTags.map((tag, index) => (
                    <button
                      key={index}
                      className="game-tag-chip"
                      onClick={() => handleTagClick(tag)}
                      aria-label={`${translate("viewTagGames", lang)} ${tag}`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Comments Section */}
          <section className="game-content-section mobile-comments-section">
            <div className="section-card">
              <h2 className="section-titleyy">
                <MessageCircle />
                {translate("comments", lang)}
              </h2>
              <CommentSection gameId={game.id} />
            </div>
          </section>

          {/* Related Games */}
          {moreGames.length > 0 && (
            <section className="related-games-section">
              <div className="related-games-header">
                <h2>{translate("moreGames", lang)}</h2>
                {moreGames.length > 6 && (
                  <button
                    className="show-more-toggle"
                    onClick={() => setShowMoreGames(!showMoreGames)}
                  >
                    {showMoreGames
                      ? translate("showLess", lang)
                      : translate("showMore", lang)}
                  </button>
                )}
              </div>

              <div className="related-games-grid">
                {(showMoreGames ? moreGames : moreGames.slice(0, 6)).map((g) => {
                  const relatedStats = {
                    rating: (4.5 + ((parseInt(g.id) || 0) % 5) / 10).toFixed(1),
                  };

                  return (
                    <article
                      key={g.provider_id}
                      className="premium-game-card"
                      onClick={() => changeGame(g.provider_id || g.id)}
                      role="button"
                      tabIndex={0}
                      onKeyPress={(e) => e.key === 'Enter' && changeGame(g.provider_id || g.id)}
                    >
                      <div className="premium-game-card-image-wrapper">
                        <img
                          src={getGameThumb(g)}
                          alt={`${g.title} thumbnail`}
                          className="premium-game-card-image"
                          onError={(e) => (e.currentTarget.src = g.image)}
                          loading="lazy"
                        />
                        <div className="premium-game-card-overlay">
                          <h3 className="premium-game-card-title">{g.title}</h3>
                          <div className="premium-game-card-meta">
                            {g.category && (
                              <span className="premium-game-card-category">
                                {g.category}
                              </span>
                            )}
                            <div className="premium-game-card-rating">
                              <Star size={14} fill="currentColor" />
                              <span>{relatedStats.rating}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          )}
        </div>

        {/* Share Modal */}
        {game && (
          <GameShareModal
            open={showShare}
            onClose={() => setShowShare(false)}
            title={game.title}
            url={gameUrl}
            gameId={game.provider_id}
          />
        )}

        {/* Bottom Navigation */}
        <MobileBottomNav />
      </div>
    </>
  );
}