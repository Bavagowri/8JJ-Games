import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
// import { fetchGames } from "../../api/fetchGames";  // USE YOUR WORKING FETCH!
import "./GamePage.css";
import { fetchH5Games } from "../../api/fetchH5Games";
import { useNavigate } from "react-router-dom";



export default function GamePage() {
  const { index } = useParams();
  const [games, setGames] = useState([]);
  const [game, setGame] = useState(null);
  const [playing, setPlaying] = useState(false);

  const isLocal = window.location.hostname === "localhost";

  const [pageLoading, setPageLoading] = useState(false);
  const navigate = useNavigate();

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

    // Ensure loader stays at least 200ms
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



  // useEffect(() => {
  //   const load = async () => {
  //     let saved = localStorage.getItem("games");
  //     let list;

  //     if (saved) {
  //       list = JSON.parse(saved);
  //     } else {
  //       list = await fetchH5Games();   // <-- REAL FIX (works on Vercel)
  //       localStorage.setItem("games", JSON.stringify(list));
  //     }

  //     setGames(list);
  //     setGame(list[Number(index)]);
  //     console.log("Loaded game:", list[Number(index)]);
  //   };

  //   load();
  // }, [index]);


  const changeGame = (newIndex) => {
  if (newIndex === Number(index)) return;
  navigate(`/game/${newIndex}`);
};

  if (!game) {
    return (
      <p style={{ color: "white", marginTop: 80, textAlign: "center" }}>
        Loading game…
      </p>
    );
  }

  return (
    
    <div className="gamepage-layout">

      {pageLoading && (
  <div className="page-loader">
    <div className="spinner"></div>
    <p>Loading game…</p>
  </div>
)}

      <div className="side-column left-column">
        {games.slice(0, 12).map((g, i) => (
        <img
        key={i}
        src={g.image}
        alt={g.title}
        className="side-thumb"
        // onClick={() => window.location.href = `/game/${i}`}
        onClick={() => changeGame(i)}
        />
        ))}
      </div>

      <div className="center-column">
        <h2 className="play-title">Click Play to Start</h2>

        <div className="game-frame-container">
          {playing ? (
            <iframe
            src={game.embed}
            className="game-iframe"
            allowFullScreen
            sandbox="allow-same-origin allow-scripts allow-pointer-lock allow-forms allow-modals"
            ></iframe>


          ) : (
            <button className="big-play-btn" onClick={() => setPlaying(true)}>
              ▶ Play now
            </button>
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

        <h3 className="more-title">More Games</h3>
        <div className="more-games-grid">
          {games.slice(0, 10).map((g, i) => (
            <img
            key={i}
            src={g.image}
            alt={g.title}
            className="more-game-thumb"
            // onClick={() => window.location.href = `/game/${i}`}
            onClick={() => changeGame(12 + i)}
            />
          ))}
        </div>
      </div>

      <div className="side-column right-column">
        {games.slice(12, 24).map((g, i) => (
        <img
        key={i}
        src={g.image}
        alt={g.title}
        className="side-thumb"
        // onClick={() => window.location.href = `/game/${12 + i}`}
        onClick={() => changeGame(i)}
        />
        ))}
      </div>

    </div>
  );
}