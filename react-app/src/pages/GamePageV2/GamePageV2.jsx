import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./GamePageV2.css";
import { fetchH5Games } from "../../api/fetchH5Games";
import { useLayoutEffect } from "react";


export default function GamePageV2() {
  const { id } = useParams();                // ✅ use ID, not index
  const navigate = useNavigate();

  const [games, setGames] = useState([]);
  const [game, setGame] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  // Scroll to top when page loads or game changes
useLayoutEffect(() => {
  window.scrollTo(0, 0);
}, [id]);

  // ✅ Load games + selected game by ID
  useEffect(() => {
    let mounted = true;

    const load = async () => {
      const start = Date.now();
      setPageLoading(true);

      let list = JSON.parse(localStorage.getItem("games"));
      if (!list) {
        list = await fetchH5Games();
        localStorage.setItem("games", JSON.stringify(list));
      }

      const selected = list.find(g => g.id === id);

      // ⛔ invalid game id → redirect home
      if (!selected) {
        navigate("/");
        return;
      }

      // Ensure loader visible at least 600ms
      const elapsed = Date.now() - start;
      const delay = Math.max(600 - elapsed, 0);

      setTimeout(() => {
        if (!mounted) return;

        setGames(list);
        setGame(selected);
        setPlaying(false);
        setPageLoading(false);
      }, delay);
    };

    load();
    return () => { mounted = false; };
  }, [id, navigate]);

  // ✅ Navigate by ID (not index)
  const changeGame = (gameId) => {
    if (gameId === id) return;
    navigate(`/game/${gameId}`);
  };

  if (!game) return null;

  // ✅ Exclude current game safely
  const otherGames = games.filter(g => g.id !== id);
  const moreGames = otherGames.slice(0, 12);
  const sideGames = otherGames.slice(12, 24);

  return (
    <div className="gamepage-layout">

      {/* 🔄 Page Loader */}
      {pageLoading && (
        <div className="page-loader">
          <div className="spinner"></div>
          <p>Loading game…</p>
        </div>
      )}

      {/* 🎮 CENTER */}
      <div className="center-column">
        <h2 className="play-title">
          Click Play to Start <span className="game-title-span">{game.title}</span>
        </h2>

        <div className="game-frame-container" key={game.id}>
          {playing ? (
            <iframe
              src={game.embed}
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
                <button className="big-play-btn">▶ Play Now</button>
              </div>
            </div>
          )}
        </div>

        {/* ℹ️ INFO */}
        <div className="game-info-bar">
          <div className="info-block">
            <span className="label">CATEGORY</span>
            <span className="value">{game.category || game.tagList?.[0]}</span>
          </div>
          <div className="info-block">
            <span className="label">PLAYS</span>
            <span className="value">{Math.floor(Math.random() * 8000 + 2000)}</span>
          </div>
          <div className="info-block">
            <span className="label">RATING</span>
            <span className="value">4.5 ★</span>
          </div>
          <div className="info-block">
            <span className="label">ADDED</span>
            <span className="value">2025</span>
          </div>
        </div>

        {/* 🔁 MORE GAMES */}
        <h3 className="more-title section-title">More Games</h3>
        <div className="more-games-grid">
          {moreGames.map(g => (
            <div
              key={g.id}
              className="game-card"
              onClick={() => changeGame(g.id)}
            >
              <img src={g.image} alt={g.title} className="game-image" />
              <div className="play-button">Play Now</div>
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
          <div
            key={g.id}
            className="game-card game-card-side"
            onClick={() => changeGame(g.id)}
          >
            <img src={g.image} alt={g.title} className="game-image" />
            <div className="play-button">Play Now</div>
            <div className="game-overlay">
              <div className="game-title">{g.title}</div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
