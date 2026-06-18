// src/pages/mobile/MobileProfile/sections/MobileActivity.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loadRecent } from "../../../../utils/localStorage";
import { getGameThumb } from "../../../../utils/getGameThumb";
import { fetchMyCollection, addToCollectionDB, removeFromCollectionDB } from "../../../../api/collection.api";
import { useLanguage } from "../../../../context/LanguageContext";
import { translate } from "../../../../data/translations";
import MobileHeader from "../../../../components/mobile/MobileHeader/MobileHeader";
import MobileBottomNav from "../../../../components/mobile/MobileBottomNav/MobileBottomNav";
import "./MobileActivity.css";

const R2_BASE =
  import.meta.env.VITE_ASSETS_BASE_URL ||
  "https://assets.8jjgames.com";

const ICONS = {
  time: `${R2_BASE}/8jj_icons/icons/8jj-time.webp`,
  points: `${R2_BASE}/8jj_icons/icons/points.webp`,
  games: `${R2_BASE}/8jj_icons/icons/8jj-game-3.webp`,
};

export default function MobileActivity() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("recent");
  const [recentGames, setRecentGames] = useState([]);
  const [collectionGames, setCollectionGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const { lang } = useLanguage();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    loadActivityData();
    window.addEventListener("recentGamesUpdated", loadActivityData);
    window.addEventListener("collectionUpdated", loadActivityData);
    return () => {
      window.removeEventListener("recentGamesUpdated", loadActivityData);
      window.removeEventListener("collectionUpdated", loadActivityData);
    };
  }, []);

  const loadActivityData = async () => {
    setLoading(true);
    const recent = loadRecent().slice(0, 30);
    setRecentGames(recent);
    try {
      const dbCollection = await fetchMyCollection();
      const transformedCollection = dbCollection.map(item => ({
        id: item.game_id,
        title: item.game_title || 'Unknown Game',
        source: item.game_source || '',
        image: item.game_source || '/images/default-game.png',
        category: item.category || '',
        collection_id: item.id
      }));
      setCollectionGames(transformedCollection);
    } catch {
      setCollectionGames([]);
    }
    setLoading(false);
  };

  const handleAddToCollection = async (game) => {
    try {
      setCollectionGames(prev => [...prev, game]);
      await addToCollectionDB(game);
      showToast(translate("profileActivity_toast_added", lang).replace("{game}", game.title), "success");
      window.dispatchEvent(new Event("collectionUpdated"));
    } catch {
      setCollectionGames(prev => prev.filter(g => g.id !== game.id));
      showToast(translate("profileActivity_toast_error", lang), "error");
    }
  };

  const handleRemoveFromCollection = async (game) => {
    try {
      setCollectionGames(prev => prev.filter(g => g.id !== game.id));
      await removeFromCollectionDB(game.id);
      showToast(translate("profileActivity_toast_removed", lang).replace("{game}", game.title), "remove");
      window.dispatchEvent(new Event("collectionUpdated"));
    } catch {
      setCollectionGames(prev => [...prev, game]);
      showToast(translate("profileActivity_toast_error", lang), "error");
    }
  };

  const handleGameClick = (game) => {
    navigate(`/game/${game.id}`, { state: { game } });
  };

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
  };

  const handleBackToMain = () => {
    navigate("/profile", { replace: true });
  };

  if (loading) {
    return (
      <div className="mobile-activity-wrapper">
        <MobileHeader title={translate("profileActivity_title", lang)} showBack />
        <div className="mobile-content">
          <div className="mobile-loading">
            <div className="mobile-spinner"></div>
            <p>Loading...</p>
          </div>
        </div>
        <MobileBottomNav />
      </div>
    );
  }

  return (
    <div className="mobile-activity-wrapper">
      <MobileHeader title={translate("profileActivity_title", lang)} showBack />

      {toast.show && (
        <div className={`mobile-toast toast-${toast.type}`}>
          {toast.message}
        </div>
      )}

      <div className="mobile-content">
        {/* Mobile Top-bar */}
        <div className="mobile-top-bar">
          <button
            onClick={handleBackToMain}
            className="premium-mobile-back-button"
            aria-label="Go back"
          >
            ←
          </button>

          <h1 className="mobile-top-title">
            {translate("profileActivity_title", lang)}
          </h1>

          <div className="mobile-top-spacer" />
        </div>

        {/* Tabs */}
        <div className="mobile-activity-tabs">
          <button
            className={`mobile-tab ${activeTab === "recent" ? "active" : ""}`}
            onClick={() => setActiveTab("recent")}
          >
            <img src={ICONS.time} alt="" className="tab-icon" />
            <span>{translate("profileActivity_tab_recent", lang)}</span>
          </button>
          <button
            className={`mobile-tab ${activeTab === "collection" ? "active" : ""}`}
            onClick={() => setActiveTab("collection")}
          >
            <img src={ICONS.points} alt="" className="tab-icon" />
            <span>{translate("profileActivity_tab_collection", lang)}</span>
          </button>
        </div>

        {/* Content */}
        <div className="mobile-activity-content">
          {activeTab === "recent" && (
            <div className="mobile-games-section">
              {recentGames.length === 0 ? (
                <div className="mobile-empty-state">
                  <img src={ICONS.games} alt="" className="empty-icon" />
                  <h3>{translate("profileActivity_noRecentGames", lang)}</h3>
                  <p>{translate("profileActivity_noRecentGamesText", lang)}</p>
                </div>
              ) : (
                <div className="mobile-games-grid">
                  {recentGames.map((game, index) => {
                    const isInCollection = collectionGames.some(g => g.id === game.id);
                    return (
                      <div
                        key={game.id}
                        className="mobile-game-card"
                        style={{ animationDelay: `${index * 0.1}s` }}
                        onClick={() => handleGameClick(game)}
                      >
                        <div className="mobile-game-imagez">
                          <img
                            src={getGameThumb(game)}
                            alt={game.title}
                            onError={(e) => {
                              e.currentTarget.src = game.image || game.source || '/images/default-game.png';
                            }}
                          />
                        </div>
                        <div className="mobile-game-info">
                          <h4>{game.title}</h4>
                          {game.category && <span className="mobile-game-category">{game.category}</span>}
                        </div>
                        <button
                          className={`mobile-add-btn ${isInCollection ? 'added' : ''}`}
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            handleAddToCollection(game); 
                          }}
                          disabled={isInCollection}
                        >
                          {isInCollection ? "★" : "☆"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === "collection" && (
            <div className="mobile-games-section">
              {collectionGames.length === 0 ? (
                <div className="mobile-empty-state">
                  <img src={ICONS.points} alt="" className="empty-icon" />
                  <h3>{translate("profileActivity_noCollectionGames", lang)}</h3>
                  <p>{translate("profileActivity_noCollectionGamesText", lang)}</p>
                </div>
              ) : (
                <div className="mobile-games-grid">
                  {collectionGames.map((game, index) => (
                    <div
                      key={game.collection_id || game.id}
                      className="mobile-game-card collection"
                      style={{ animationDelay: `${index * 0.1}s` }}
                      onClick={() => handleGameClick(game)}
                    >
                      <button
                        className="mobile-remove-btn"
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          handleRemoveFromCollection(game); 
                        }}
                      >
                        ✕
                      </button>
                      <div className="mobile-game-imagez">
                        <img
                          src={getGameThumb(game)}
                          alt={game.title}
                          onError={(e) => {
                            e.currentTarget.src = game.image || game.source || '/images/default-game.png';
                          }}
                        />
                      </div>
                      <div className="mobile-game-info">
                        <h4>{game.title}</h4>
                        {game.category && <span className="mobile-game-category">{game.category}</span>}
                      </div>
                      <button
                        className="mobile-play-btn"
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          handleGameClick(game); 
                        }}
                      >
                        {translate("profileActivity_playNow", lang)}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mobile-footer-space" />
      </div>

      <MobileBottomNav />
    </div>
  );
}