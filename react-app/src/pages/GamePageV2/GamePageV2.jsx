import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./GamePageV2.css";
import { fetchH5Games } from "../../api/fetchH5Games";
import { useNavigate } from "react-router-dom";

export default function GamePageV2() {
  const { index } = useParams();
  const [games, setGames] = useState([]);
  const [game, setGame] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const navigate = useNavigate();

  const isLocal = window.location.hostname === "localhost";

  // Scroll to top when page loads or game changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [index]);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      const start = Date.now();
      setPageLoading(true);

      let saved = localStorage.getItem("games");
      let list;

      if (saved) {
        list = JSON.parse(saved);
      } else {
        list = await fetchH5Games();
        localStorage.setItem("games", JSON.stringify(list));
      }

      const selectedGame = list[Number(index)];

      // Ensure loader stays at least 600ms
      const elapsed = Date.now() - start;
      const remaining = Math.max(600, 600 - elapsed);

      setTimeout(() => {
        if (!mounted) return;

        setGames(list);
        setGame(selectedGame);
        setPlaying(false);
        setPageLoading(false);
      }, remaining);
    };

    load();

    return () => {
      mounted = false;
    };
  }, [index]);

  const changeGame = (newIndex) => {
    if (newIndex === Number(index)) return;
    navigate(`/game/${newIndex}`);
  };

  // Get games excluding the current one
  const getFilteredGames = () => {
    return games.filter((_, i) => i !== Number(index));
  };

  // Get games for "More Games" section (first 10 excluding current)
  const getMoreGames = () => {
    const filtered = getFilteredGames();
    return filtered.slice(0, 12);
  };

  // Get games for side column (12 games excluding current)
  const getSideGames = () => {
    const filtered = getFilteredGames();
    return filtered.slice(12, 24);
  };

  if (!game) {
    return (
      <div className="gamepage-layout skeleton-layout">
        <div className="center-column">
          {/* Title Skeleton */}
          <div className="skeleton-game-title"></div>

          {/* Game Frame Skeleton */}
          <div className="skeleton-game-frame"></div>

          {/* Info Bar Skeleton */}
          <div className="skeleton-info-bar">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="skeleton-info-block"></div>
            ))}
          </div>

          {/* More Games Title Skeleton */}
          <div className="skeleton-more-title"></div>

          {/* More Games Grid Skeleton */}
          <div className="more-games-grid">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="skeleton-more-game"></div>
            ))}
          </div>
        </div>

        {/* Side Column Skeleton */}
        <div className="side-column">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="skeleton-side-thumb"></div>
          ))}
        </div>
      </div>
    );
  }

  const moreGames = getMoreGames();
  const sideGames = getSideGames();

  return (
    <div className="gamepage-layout">
      {pageLoading && (
        <div className="page-loader">
          <div className="spinner"></div>
          <p>Loading game…</p>
        </div>
      )}

      <div className="center-column">
        <h2 className="play-title">Click Play to Start <span className="game-title-span">{game.title}</span></h2>

        <div className="game-frame-container" key={game.id || index}>
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

        <div className="game-info-bar">
          <div className="info-block">
            <span className="label">CATEGORY</span>
            <span className="value">{game.tagList[0]}</span>
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

        <h3 className="more-title section-title">More Games</h3>
        <div className="more-games-grid">
          {moreGames.map((g) => {
            const originalIndex = games.findIndex(game => game === g);
            return (
              <div
                key={originalIndex}
                className="game-card"
                onClick={() => changeGame(originalIndex)}
              >
                <img src={g.image} alt={g.title} className="game-image" />

                {/* Play Now Button */}
                <div className="play-button">Play Now</div>

                {/* Hot Badge - only show if game.isHot is true */}
                {g.isHot && (
                  <div className="hot-badge">
                    <img src="/images/game.png" className="game-image-hot" alt="" />
                    Hot
                  </div>
                )}

                {/* Game Info Overlay */}
                <div className="game-overlay">
                  <div className="game-title">{g.title}</div>
                  {g.category && <div className="game-category">{g.category}</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="side-column">
        {sideGames.map((g) => {
          const originalIndex = games.findIndex(game => game === g);
          return (
            <div
              key={originalIndex}
              className="game-card game-card-side"
              onClick={() => changeGame(originalIndex)}
            >
              <img src={g.image} alt={g.title} className="game-image" />

              {/* Play Now Button */}
              <div className="play-button">Play Now</div>

              {/* Hot Badge - only show if game.isHot is true */}
              {g.isHot && (
                <div className="hot-badge">
                  <img src="/images/game.png" className="game-image-hot" alt="" />
                  Hot
                </div>
              )}

              {/* Game Info Overlay */}
              <div className="game-overlay">
                <div className="game-title">{g.title}</div>
                {g.category && <div className="game-category">{g.category}</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}