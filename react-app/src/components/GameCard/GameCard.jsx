import "./GameCard.css";
import { useNavigate } from "react-router-dom";

export default function GameCard({ game, index }) {
  const navigate = useNavigate();

  const openGame = () => {
    const saved = localStorage.getItem("games");

    if (!saved) {
      console.warn("Saving full list temporarily");
      localStorage.setItem("games", JSON.stringify([game]));
    }

    navigate(`/game/${index}`);
  };

  return (
    <div className="game-card" onClick={openGame}>
      <img src={game.image} alt={game.title} className="game-card-img" />
      <div className="game-card-info">
        <h4 className="game-title">{game.title}</h4>
      </div>
    </div>
  );
}
