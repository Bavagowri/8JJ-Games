import { useNavigate } from "react-router-dom";
import "./MosaicGameCard.css";

export default function MosaicGameCard({ game }) {
  const navigate = useNavigate();

  return (
    <div
      className={`mosaic-card ${game.size || "small"}`}
      onClick={() => navigate(`/game/${game.id}`)}
    >
      <img src={game.image} alt={game.title} />

      <div className="mosaic-overlay">
        <span className="title">{game.title}</span>
      </div>
    </div>
  );
}
