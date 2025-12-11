import "./GameCard.css";
import { useNavigate } from "react-router-dom";

export default function GameCard({ game, onClick }) {
  return (
    <div className="game-card" onClick={onClick}>
      <img src={game.image} alt={game.title} className="game-card-img" />
      <div className="game-card-info">
        <h4 className="game-title">{game.title}</h4>
      </div>
    </div>
  );
}