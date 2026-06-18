// react-app/src/pages/Profile/sections/Activity.jsx

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { loadRecent } from "../../../utils/localStorage";
import { getGameThumb } from "../../../utils/getGameThumb";
import "./Activity.css";

import { fetchMyCollection, addToCollectionDB, removeFromCollectionDB } from "../../../api/collection.api";
import { useLanguage } from "../../../context/LanguageContext";
import { translate } from "../../../data/translations";

const R2_BASE =
  import.meta.env.VITE_ASSETS_BASE_URL ||
  "https://assets.8jjgames.com";

const ICONS = {
  time: `${R2_BASE}/8jj_icons/icons/8jj-time.webp`,
  points: `${R2_BASE}/8jj_icons/icons/points.webp`,
  games: `${R2_BASE}/8jj_icons/icons/8jj-game-3.webp`,
  hint: `${R2_BASE}/8jj_icons/icons/hint.webp`
};

export default function Activity() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("recent");
  const [recentGames, setRecentGames] = useState([]);
  const [collectionGames, setCollectionGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const carouselRef = useRef(null);
  const collectionCarouselRef = useRef(null);
  const { lang } = useLanguage();

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [canScrollLeftCollection, setCanScrollLeftCollection] = useState(false);
  const [canScrollRightCollection, setCanScrollRightCollection] = useState(false);

  useEffect(() => {
    loadActivityData();
    window.addEventListener("recentGamesUpdated", loadActivityData);
    window.addEventListener("collectionUpdated", loadActivityData);
    return () => {
      window.removeEventListener("recentGamesUpdated", loadActivityData);
      window.removeEventListener("collectionUpdated", loadActivityData);
    };
  }, []);

  useEffect(() => {
    const checkScroll = () => {
      if (carouselRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
      }
    };
    checkScroll();
    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
    }
    return () => {
      if (carousel) carousel.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [recentGames]);

  useEffect(() => {
    const checkScroll = () => {
      if (collectionCarouselRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = collectionCarouselRef.current;
        setCanScrollLeftCollection(scrollLeft > 0);
        setCanScrollRightCollection(scrollLeft < scrollWidth - clientWidth - 1);
      }
    };
    checkScroll();
    const carousel = collectionCarouselRef.current;
    if (carousel) {
      carousel.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
    }
    return () => {
      if (carousel) carousel.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [collectionGames]);

  // FIX 1: Backend now returns full game objects via JOIN — no transform needed
  const loadActivityData = async () => {
    setLoading(true);
    const recent = loadRecent().slice(0, 30);
    setRecentGames(recent);
    try {
      const dbCollection = await fetchMyCollection();
      setCollectionGames(dbCollection);
    } catch {
      setCollectionGames([]);
    }
    setLoading(false);
  };

  const scroll = (direction, isCollection = false) => {
    const ref = isCollection ? collectionCarouselRef : carouselRef;
    if (ref.current) {
      const scrollAmount = ref.current.clientWidth * 0.8;
      ref.current.scrollTo({
        left: direction === 'left'
          ? ref.current.scrollLeft - scrollAmount
          : ref.current.scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleAddToCollection = async (game) => {
    try {
      setCollectionGames(prev => [...prev, game]);
      await addToCollectionDB(game);
      showToast(translate("profileActivity_toast_added", lang).replace("{game}", game.title), "success");
      window.dispatchEvent(new Event("collectionUpdated"));
    } catch {
      setCollectionGames(prev => prev.filter(g => g.provider_id !== game.provider_id));
      showToast(translate("profileActivity_toast_error", lang), "error");
    }
  };

  // FIX 3: Use provider_id for filtering and removal
  const handleRemoveFromCollection = async (game) => {
    try {
      setCollectionGames(prev => prev.filter(g => g.provider_id !== game.provider_id));
      await removeFromCollectionDB(game.provider_id);
      showToast(translate("profileActivity_toast_removed", lang).replace("{game}", game.title), "remove");
      window.dispatchEvent(new Event("collectionUpdated"));
    } catch {
      setCollectionGames(prev => [...prev, game]);
      showToast(translate("profileActivity_toast_error", lang), "error");
    }
  };

  const handleGameClick = (game) => {
    navigate(`/games/${game.provider_id}`, { state: { game } });
  };

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
  };

  if (loading) return (
    <div className="profile-activity">
      <h3 className="Profile-title">{translate("profileActivity_title", lang)}</h3>
      <div className="activity-loading">{translate("profileActivity_title", lang)}...</div>
    </div>
  );

  return (
    <div className="profile-activity">
      {toast.show && <div className={`activity-toast toast-${toast.type}`}>{toast.message}</div>}

      <h3 className="Profile-title">{translate("profileActivity_title", lang)}</h3>

      <div className="activity-tabs">
        <button
          className={activeTab === "recent" ? "active ThemeBox" : "ThemeBox"}
          onClick={() => setActiveTab("recent")}
        >
          <img
            src={ICONS.time}
            alt=""
            aria-hidden="true"
            className="activity-tab-icon"
          />
          {translate("profileActivity_tab_recent", lang)}
        </button>

        <button
          className={activeTab === "collection" ? "active ThemeBox" : "ThemeBox"}
          onClick={() => setActiveTab("collection")}
        >
          <img
            src={ICONS.points}
            alt=""
            aria-hidden="true"
            className="activity-tab-icon"
          />
          {translate("profileActivity_tab_collection", lang)}
        </button>
      </div>

      <div className="activity-content">
        {activeTab === "recent" && (
          <div className="activity-carousel-wrapper">
            {recentGames.length === 0 ? (
              <div className="activity-empty-state">
                <div className="empty-icon">
                  <img src={ICONS.games} alt="" aria-hidden="true" className="empty-icon-img" />
                </div>
                <div className="empty-title">{translate("profileActivity_noRecentGames", lang)}</div>
                <div className="empty-text-recent">{translate("profileActivity_noRecentGamesText", lang)}</div>
              </div>
            ) : (
              <>
                {canScrollLeft && (
                  <button className="activity-scroll-btn scroll-left" onClick={() => scroll('left')} aria-label="Scroll left" />
                )}
                <div className="activity-carousel" ref={carouselRef}>
                  {recentGames.map((game, index) => {
                    // FIX 2: Use provider_id for collection membership check
                    const isInCollection = collectionGames.some(
                      g => g.provider_id === (game.provider_id || game.id)
                    );
                    return (
                      <div
                        key={game.id}
                        className="activity-game-card ThemeBox"
                        style={{ animationDelay: `${index * 0.05}s` }}
                        onClick={() => handleGameClick(game)}
                      >
                        <div className="game-card-image-wrapper">
                          <img
                            src={getGameThumb(game)}
                            alt={game.title}
                            className="game-card-image"
                            onError={(e) => e.currentTarget.src = game.image}
                          />
                        </div>
                        <div className="game-card-info">
                          <div className="game-card-title">{game.title}</div>
                          {game.category && <div className="game-card-category">{game.category}</div>}
                        </div>
                        <button
                          className={`add-to-collection-btn ${isInCollection ? 'in-collection' : ''}`}
                          onClick={(e) => { e.stopPropagation(); handleAddToCollection(game); }}
                          disabled={isInCollection}
                        >
                          {isInCollection
                            ? translate("profileActivity_inCollection", lang)
                            : translate("profileActivity_addToCollection", lang)}
                        </button>
                      </div>
                    );
                  })}
                </div>
                {canScrollRight && (
                  <button className="activity-scroll-btn scroll-right" onClick={() => scroll('right')} aria-label="Scroll right" />
                )}
              </>
            )}
          </div>
        )}

        {activeTab === "collection" && (
          <div className="activity-carousel-wrapper">
            {collectionGames.length === 0 ? (
              <div className="activity-empty-state">
                <div className="empty-icon">
                  <img src={ICONS.points} alt="" aria-hidden="true" className="empty-icon-img" />
                </div>
                <div className="empty-title">{translate("profileActivity_noCollectionGames", lang)}</div>
                <div className="empty-text-collection">{translate("profileActivity_noCollectionGamesText", lang)}</div>
              </div>
            ) : (
              <>
                {canScrollLeftCollection && (
                  <button className="activity-scroll-btn scroll-left" onClick={() => scroll('left', true)} aria-label="Scroll left" />
                )}
                <div className="activity-carousel" ref={collectionCarouselRef}>
                  {collectionGames.map((game, index) => (
                    // FIX 4: Use provider_id as key
                    <div
                      key={game.provider_id}
                      className="activity-game-card ThemeBox collection-card"
                      style={{ animationDelay: `${index * 0.05}s` }}
                      onClick={() => handleGameClick(game)}
                    >
                      <button
                        className="remove-from-collection-btn"
                        onClick={(e) => { e.stopPropagation(); handleRemoveFromCollection(game); }}
                        aria-label={`Remove ${game.title}`}
                      >
                        ✕
                      </button>
                      <div className="game-card-image-wrapper">
                        <img
                          src={getGameThumb(game)}
                          alt={game.title}
                          className="game-card-image"
                          onError={(e) => {
                            e.currentTarget.src = game.image || '/images/default-game.png';
                          }}
                        />
                      </div>
                      <div className="game-card-info">
                        <div className="game-card-title">{game.title}</div>
                        {game.category && <div className="game-card-category">{game.category}</div>}
                      </div>
                      <button
                        className="play-now-btn"
                        onClick={(e) => { e.stopPropagation(); handleGameClick(game); }}
                      >
                        {translate("profileActivity_playNow", lang)}
                      </button>
                    </div>
                  ))}
                </div>
                {canScrollRightCollection && (
                  <button className="activity-scroll-btn scroll-right" onClick={() => scroll('right', true)} aria-label="Scroll right" />
                )}
              </>
            )}
          </div>
        )}
      </div>

      <div className="activity-tip">
        💡 {activeTab === 'recent'
          ? translate("profileActivity_tip_recent", lang)
          : translate("profileActivity_tip_collection", lang).replace("{count}", collectionGames.length)}
      </div>
    </div>
  );
}