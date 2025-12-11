import "./GameCard.css";
import { useNavigate } from "react-router-dom";

export default function GameCard({ game, index, games }) {
  const navigate = useNavigate();

  const openGame = () => {
    // ALWAYS store full list so GamePage works on Vercel
    localStorage.setItem("games", JSON.stringify(games));
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
