import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
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

  const [games, setGames] = useState([]);
  const [game, setGame] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

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

  /* 🔹 Normalize categories */
  const getGameCategories = (game) => {
    const cats = [];
    if (game.category) cats.push(game.category);
    if (Array.isArray(game.tagList)) cats.push(...game.tagList);
    return [...new Set(cats.map(c => c.toLowerCase()))];
  };

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

  const changeGame = (gameId) => {
    if (String(gameId) === String(id)) return;
    navigate(`/game/${gameId}`);
  };

  if (pageLoading || !game) {
    return (
      <>
        <ScrollToTop />
        <div className="page-loader">
          <div className="spinner" />
        </div>
      </>
    );
  }

  /* 🔹 RELATED GAME LOGIC */
  const currentCategories = getGameCategories(game);

  const sameCategoryGames = games.filter(g =>
    g.id !== game.id &&
    currentCategories.includes(g.category?.toLowerCase())
  );

  const relatedCategories = currentCategories.flatMap(
    c => RELATED_CATEGORIES[c] || []
  );

  const relatedGames = games.filter(g =>
    g.id !== game.id &&
    (
      relatedCategories.includes(g.category?.toLowerCase()) ||
      g.tagList?.some(t => relatedCategories.includes(t.toLowerCase()))
    )
  );

  const fallbackGames = games.filter(
    g =>
      g.id !== game.id &&
      !sameCategoryGames.includes(g) &&
      !relatedGames.includes(g)
  );

  const prioritizedGames = [
    ...sameCategoryGames,
    ...relatedGames,
    ...fallbackGames,
  ];

  const moreGames = prioritizedGames.slice(0, 12);
  const sideGames = prioritizedGames.slice(12, 24);

  const iframeSrc =
    game.source === "self"
      ? `${window.location.origin}${game.embed}`
      : game.embed;

  return (
    <div className="gamepage-layout">
      <ScrollToTop />

      {/* 🎮 CENTER */}
      <div className="center-column">
        <h2 className="play-title">
          {translate("clickPlayToStart", lang)} {game.title}
        </h2>

        <div className="game-frame-container">
          {playing ? (
            <iframe
              src={iframeSrc}
              className="game-iframe"
              allowFullScreen
              sandbox="allow-same-origin allow-scripts allow-pointer-lock allow-forms allow-modals"
            />
          ) : (
            <div
              className="game-poster"
              style={{ backgroundImage: `url(${game.image})` }}
              onClick={() => setPlaying(true)}
            >
              <div className="poster-overlay">
                <button className="big-play-btn">
                  ▶ {translate("playNow", lang)}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ℹ️ INFO */}
        <div className="game-info-bar">
          <div className="info-block">
            <span className="label">{translate("category", lang)}</span>
            <span className="value">
              {translate(game.category || game.tagList?.[0], lang)}
            </span>
          </div>
          <div className="info-block">
            <span className="label">{translate("rating", lang)}</span>
            <span className="value">4.5 ★</span>
          </div>
        </div>

        {/* 🔁 MORE GAMES */}
        <h3 className="more-title section-title">
          {translate("moreGames", lang)}
        </h3>

        <div className="more-games-grid">
          {moreGames.map(g => (
            <div
              key={g.id}
              className="game-card"
              onClick={() => changeGame(g.id)}
            >
              <img src={g.image} alt={g.title} />
              <div className="play-button">
                {translate("playNow", lang)}
              </div>
              <div className="game-overlay">
                <div className="game-title">{g.title}</div>
                {g.category && (
                  <div className="game-category">
                    {translate(g.category, lang)}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 📌 SIDE */}
      <div className="side-column">
        {sideGames.map(g => (
          <div
            key={g.id}
            className="game-card game-card-side"
            onClick={() => changeGame(g.id)}
          >
            <img src={g.image} alt={g.title} />
            <div className="play-button">
              {translate("playNow", lang)}
            </div>
            <div className="game-overlay">
              <div className="game-title">{g.title}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
