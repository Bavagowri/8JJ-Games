import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./GamePage.css";

export default function GamePage() {
  const { index } = useParams();
  const [games, setGames] = useState([]);
  const [game, setGame] = useState(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("games");

    if (saved) {
      const list = JSON.parse(saved);
      setGames(list);
      setGame(list[index]);
    }
  }, [index]);

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
