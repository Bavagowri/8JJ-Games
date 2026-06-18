// react-app/src/components/mobile/MobileGameSectionV3/MobileGameSectionV3.jsx
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../../context/LanguageContext";
import { translate } from "../../../data/translations";
import { getGameThumb } from "../../../utils/getGameThumb";
import "./MobileGameSectionV3.css";

export default function MobileGameSectionV3({
  title,
  titleText,
  games,
  categoryId,
  showSeeAll = true
}) {
  const navigate = useNavigate();
  const { lang } = useLanguage();

  if (!games || games.length === 0) return null;

  // 2 rows × 3 columns
  const gridGames = games.slice(0, 6);

  const handleSeeAll = () => {
    if (categoryId) {
      navigate(`/categories/${categoryId}`);
    }
  };

  const handlePlay = (id) => {
    navigate(`/games/${id}`);
  };

  return (
    <section className="mobile-game-section-grid v3">
      {/* Header */}
      <div className="mobile-section-header">
        <h2 className="mobile-section-v3-title">{title}</h2>

        {showSeeAll && categoryId && (
          <button
            className="mobile-see-all-btn"
            onClick={handleSeeAll}
          >
            {translate("seeAll", lang) || "View All"}
          </button>
        )}
      </div>

      {/* Grid */}
      <div className="mobile-game-grid-rect">
        {gridGames.map((game) => (
          <div
            key={game.id}
            className="mobile-game-rect-card"
            onClick={() => handlePlay(game.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) =>
              e.key === "Enter" && handlePlay(game.id)
            }
          >
            <img
              src={getGameThumb(game)}
              alt={game.title}
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src = game.image;
              }}
            />
            <p>{game.title}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
