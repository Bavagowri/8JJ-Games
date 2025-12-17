import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./GamePageV2.css";
import { fetchH5Games } from "../../api/fetchH5Games";
import { selfHostedGames } from "../../data/selfHostedGames";
import ScrollToTop from "../../components/ScrollToTop";

export default function GamePageV2() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [games, setGames] = useState([]);
  const [game, setGame] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      const start = Date.now();
      setPageLoading(true);

      let list = JSON.parse(localStorage.getItem("games"));

      if (!Array.isArray(list) || list.length === 0) {
        const h5 = await fetchH5Games();
        list = [...selfHostedGames, ...h5];
        localStorage.setItem("games", JSON.stringify(list));
      }

      const selected = list.find(
        g => String(g.id) === String(id)
      );

      if (!mounted) return;

      if (!selected) {
        console.warn("Game not found:", id);
        setPageLoading(false);
        return;
      }

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
  }, [id]);

  const changeGame = (gameId) => {
    if (String(gameId) === String(id)) return;
    navigate(`/game/${gameId}`);
  };

  // Skeleton Loading Component
  const SkeletonLoader = () => (
    <div className="gamepage-layout">
      <div className="center-column">
        {/* Title Skeleton */}
        <div className="skeleton skeleton-title"></div>

        {/* Game Frame Skeleton */}
        <div className="skeleton skeleton-game-frame"></div>

        {/* Info Bar Skeleton */}
        <div className="skeleton-info-bar">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="skeleton-info-block">
              <div className="skeleton skeleton-label"></div>
              <div className="skeleton skeleton-value"></div>
            </div>
          ))}
        </div>

        {/* More Games Title Skeleton */}
        <div className="skeleton skeleton-section-title"></div>

        {/* More Games Grid Skeleton */}
        <div className="more-games-grid">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="skeleton skeleton-game-card"></div>
          ))}
        </div>
      </div>

      {/* Side Column Skeleton */}
      <div className="side-column">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="skeleton skeleton-side-card"></div>
        ))}
      </div>
    </div>
  );

  // Show skeleton while loading
  if (pageLoading || !game) {
    return (
      <>
        <ScrollToTop />
        <SkeletonLoader />
      </>
    );
  }

  const otherGames = games.filter(
    g => String(g.id) !== String(id)
  );

  const moreGames = otherGames.slice(0, 12);
  const sideGames = otherGames.slice(12, 24);

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
          Click Play to Start {game.title}
        </h2>

        <div className="game-frame-container" key={game.id}>
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
                <button className="big-play-btn">▶ Play Now</button>
              </div>
            </div>
          )}
        </div>

        {/* ℹ️ INFO */}
        <div className="game-info-bar">
          <div className="info-block">
            <span className="label">CATEGORY</span>
            <span className="value">
              {game.category || game.tagList?.[0]}
            </span>
          </div>
          <div className="info-block">
            <span className="label">PLAYS</span>
            <span className="value">
              {Math.floor(Math.random() * 8000 + 2000)}
            </span>
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
                {g.category && (
                  <div className="game-category">{g.category}</div>
                )}
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