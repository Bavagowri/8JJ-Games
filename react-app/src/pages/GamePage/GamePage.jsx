import { useParams } from "react-router-dom";
import { useState, useMemo } from "react";
import "./GamePage.css";

export default function GamePage() {
  const { index } = useParams();
  const idx = useMemo(() => Number(index) || 0, [index]);
  const [games] = useState(() => {
    try {
      const saved = localStorage.getItem("games");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const game = games[idx] || null;
  const [playing, setPlaying] = useState(false);
  const [plays] = useState(() => Math.floor(Math.random() * 8000 + 2000));

  if (!game) return <p style={{ color: "white", marginTop: 80, textAlign: "center" }}>Loading game…</p>;

  return (
  <div className="gamepage-layout">

    {/* LEFT SIDE GAMES */}
    <div className="side-column left-column">
      {games.slice(0, 12).map((g, i) => (
        <img
          key={i}
          src={g.image}
          alt={g.title}
          className="side-thumb"
        />
      ))}
    </div>

    {/* CENTER GAME CONTENT */}
    <div className="center-column">

      <h2 className="play-title">Click Play to Start</h2>

      <div className="game-frame-container">
        {playing ? (
          <iframe
            src={game.embed}
            title={game.title}
            allowFullScreen
            frameBorder="0"
            className="game-iframe"
          ></iframe>
        ) : (
          <button className="big-play-btn" onClick={() => setPlaying(true)}>
            ▶ Play now
          </button>
        )}
      </div>

      {/* INFO BAR */}
      <div className="game-info-bar">
        <div className="info-block">
          <span className="label">CATEGORY</span>
          <span className="value">{game.tagList[0]}</span>
        </div>
        <div className="info-block">
          <span className="label">PLAYS</span>
          <span className="value">{plays}</span>
        </div>
<<<<<<< Updated upstream
        <div className="info-block">
          <span className="label">RATING</span>
          <span className="value">4.5 ★</span>
        </div>
        <div className="info-block">
          <span className="label">ADDED</span>
          <span className="value">2025</span>
=======

        <h3 className="more-title">More Games</h3>
        <div className="more-games-grid">
          {games.slice(0, 10).map((g, i) => (
            <img
            key={i}
            src={g.image}
            alt={g.title}
            className="more-game-thumb"
            onClick={() => window.location.href = `/game/${i}`}
            />
          ))}
>>>>>>> Stashed changes
        </div>
      </div>

      {/* More Games (optional bottom grid) */}
      <h3 className="more-title">More Games</h3>
      <div className="more-games-grid">
        {games.slice(0, 12).map((g, i) => (
          <img key={i} src={g.image} alt={g.title} className="more-game-thumb" />
        ))}
      </div>

    </div>

    {/* RIGHT SIDE GAMES */}
    <div className="side-column right-column">
      {games.slice(12, 24).map((g, i) => (
        <img
          key={i}
          src={g.image}
          alt={g.title}
          className="side-thumb"
        />
      ))}
    </div>

  </div>
);

}
