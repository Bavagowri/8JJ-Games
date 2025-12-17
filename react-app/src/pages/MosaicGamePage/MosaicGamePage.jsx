import { useEffect, useState } from "react";
import MosaicGameCard from "../../components/MosaicGameCard/MosaicGameCard";
import "./MosaicGamePage.css";

export default function MosaicGamePage() {
  const [games, setGames] = useState([]);

  useEffect(() => {
    const cached = localStorage.getItem("games");
    if (cached) {
      const parsed = JSON.parse(cached);

      // OPTIONAL: assign sizes for mosaic
      const withSizes = parsed.map((g, i) => ({
        ...g,
        size:
          i % 12 === 0 ? "large" :
          i % 8 === 0 ? "wide" :
          i % 7 === 0 ? "tall" :
          "small"
      }));

      setGames(withSizes);
    }
  }, []);

  if (!games.length) return null;

  return (
    <div className="mosaic-page">
      <div className="mosaic-grid">
        {games.map(game => (
          <MosaicGameCard key={game.id} game={game} />
        ))}
      </div>
    </div>
  );
}
