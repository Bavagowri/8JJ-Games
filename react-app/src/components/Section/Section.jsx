import "./Section.css";
import { useLanguage } from "../../context/LanguageContext";
import { translate } from "../../data/translations";
import GameCard from "../GameCard/GameCard";

export default function Section({
  id,
  icon,
  translationKey,
  games,
  lockMode,
  showHotByDefault = false,
}) {
  const { lang } = useLanguage();

  if (!games || !games.length) return null;

  // Example: in popular section, only first 3 are unlocked
  const isLocked = (index) => {
    if (lockMode === "popular") {
      return index >= 3;
    }
    return false;
  };

  return (
    <section className="section" id={id}>
      <div className="section-header">
        <span className="section-icon">{icon}</span>
        <h2 className="section-title">{translate(translationKey, lang)}</h2>
      </div>

      <div className="games-grid">
        {games.map((game, idx) => (
          <GameCard
            key={game.id}
            game={game}
            locked={isLocked(idx)}
            showHot={showHotByDefault || idx < 3}
          />
        ))}
      </div>
    </section>
  );
}
