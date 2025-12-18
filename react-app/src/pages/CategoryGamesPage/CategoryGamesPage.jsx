import { useParams } from "react-router-dom";
import { useLayoutEffect, useEffect, useState } from "react";
import MosaicGameCard from "../../components/MosaicGameCard/MosaicGameCard";
import { translate } from "../../data/translations";
import { useLanguage } from "../../context/LanguageContext";
import "./CategoryGamesPage.css";

export default function CategoryGamesPage() {
  const { categoryId } = useParams();
  const { lang } = useLanguage();
  const [games, setGames] = useState([]);

  // ✅ FORCE scroll to top AFTER render
  useLayoutEffect(() => {
    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
    });
  }, [categoryId]);

  useEffect(() => {
    const cached = localStorage.getItem("games");
    if (!cached) return;

    const allGames = JSON.parse(cached);

    const filtered = allGames.filter(g =>
      g.category === categoryId ||
      g.tagList?.includes(categoryId)
    );

    setGames(filtered);
  }, [categoryId]);

  return (
    <div className="category-page">
        <h1 className="category-title">
         🎮 {translate(categoryId, lang)}
        </h1>
      <div className="mosaic-grid">
        {games.map(game => (
          <MosaicGameCard key={game.id} game={game} />
        ))}
      </div>
    </div>
  );
}
