import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import "./GamePageV2.css";
import { fetchH5Games } from "../../api/fetchH5Games";
import { selfHostedGames } from "../../data/selfHostedGames";
import ScrollToTop from "../../components/ScrollToTop";
import { useLanguage } from "../../context/LanguageContext";
import { translate } from "../../data/translations";

export default function GamePageV2() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { lang } = useLanguage();

  const frameRef = useRef(null);
  const iframeRef = useRef(null);

  const [games, setGames] = useState([]);
  const [game, setGame] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);


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

  const getGameCategories = (game) => {
    const cats = [];
    if (game.category) cats.push(game.category);
    if (Array.isArray(game.tagList)) cats.push(...game.tagList);
    return [...new Set(cats.map(c => c.toLowerCase()))];
  };

  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

  /* =======================
     LOAD GAME DATA
  ======================== */
  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setPageLoading(true);

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
      setPageLoading(false);
    };

    load();
    return () => { mounted = false; };
  }, [id]);

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

  const startGame = () => {
    // Only start the game in-page
    setPlaying(true);
  };

  const changeGame = (gameId) => {
    if (String(gameId) === String(id)) return;
    navigate(`/game/${gameId}`);
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

  if (pageLoading || !game) return <SkeletonLoader />;

  /* =======================
     RELATED GAMES LOGIC
  ======================== */
  const currentCategories = getGameCategories(game);

  const sameCategoryGames = games.filter(
    g => g.id !== game.id && currentCategories.includes(g.category?.toLowerCase())
  );

  const relatedCategories = currentCategories.flatMap(c => RELATED_CATEGORIES[c] || []);

  const relatedGames = games.filter(
    g =>
      g.id !== game.id &&
      (relatedCategories.includes(g.category?.toLowerCase()) ||
        g.tagList?.some(t => relatedCategories.includes(t.toLowerCase())))
  );

  const fallbackGames = games.filter(
    g => g.id !== game.id && !sameCategoryGames.includes(g) && !relatedGames.includes(g)
  );

  const prioritizedGames = [...sameCategoryGames, ...relatedGames, ...fallbackGames];
  const moreGames = prioritizedGames.slice(0, 12);
  const sideGames = prioritizedGames.slice(12, 24);

  const iframeSrc =
    game.source === "self"
      ? `${window.location.origin}${game.embed}`
      : game.embed;

  /* =======================
     RENDER
  ======================== */
  return (
    <div className="gamepage-layout">
      <ScrollToTop />

      <div className="center-column">
        <h2 className="play-title">
          {translate("clickPlayToStart", lang)} {game.title}
        </h2>

        <div
          className={`game-frame-container ${isFullscreen ? "fullscreen" : ""}`}
          ref={frameRef}
          key={game.id}
        >
          {playing ? (
            <>
              <iframe
                ref={iframeRef}
                src={iframeSrc}
                className="game-iframe"
                allow="fullscreen; autoplay; gamepad; accelerometer; gyroscope"
                allowFullScreen
                sandbox="allow-same-origin allow-scripts allow-pointer-lock allow-forms allow-modals"
              />
              <button
                className="fullscreen-btn"
                onClick={isFullscreen ? exitFullscreen : enterFullscreen}
              >
                {isFullscreen ? "⤢ Exit Fullscreen" : "⤢ Fullscreen"}
              </button>
            </>
          ) : (
            <div
              className="game-poster"
              style={{ backgroundImage: `url(${game.image})` }}
              onClick={startGame}
            >
              <div className="poster-overlay">
                <button className="big-play-btn">
                  {translate("playNow", lang)}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ℹ️ INFO */}
        <div className="game-info-bar">
          <div className="info-block">
            <span className="label">{translate("category", lang)}</span>
            <span className="value">{game.category || game.tagList?.[0]}</span>
          </div>
          <div className="info-block">
            <span className="label">{translate("plays", lang)}</span>
            <span className="value">{Math.floor(Math.random() * 8000 + 2000)}</span>
          </div>
          <div className="info-block">
            <span className="label">{translate("rating", lang)}</span>
            <span className="value">4.5 ★</span>
          </div>
          <div className="info-block">
            <span className="label">{translate("added", lang)}</span>
            <span className="value">2025</span>
          </div>
        </div>

        {/* 🔁 MORE GAMES */}
        <h3 className="more-title section-title">{translate("moreGames", lang)}</h3>
        <div className="more-games-grid">
          {moreGames.map(g => (
            <div key={g.id} className="game-card" onClick={() => changeGame(g.id)}>
              <img src={g.image} alt={g.title} />
              <div className="play-button">{translate("playNow", lang)}</div>
              <div className="game-overlay">
                <div className="game-title">{g.title}</div>
                {g.category && <div className="game-category">{g.category}</div>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 📌 SIDE COLUMN */}
      <div className="side-column">
        {sideGames.map(g => (
          <div key={g.id} className="game-card game-card-side" onClick={() => changeGame(g.id)}>
            <img src={g.image} alt={g.title} />
            <div className="play-button">{translate("playNow", lang)}</div>
            <div className="game-overlay">
              <div className="game-title">{g.title}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
