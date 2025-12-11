import "./FeaturedCarousel.css";
import { useLanguage } from "../../context/LanguageContext";
import { translate } from "../../data/translations";
import { featuredGames } from "../../data/games";
import { pushRecent } from "../../utils/localStorage";

function openFeatured(game) {
  pushRecent(game);
  if (game.externalUrl) {
    window.open(game.externalUrl, "_blank", "noopener");
  } else if (game.gameId) {
    window.location.href =
      "game_detail_page.html?game=" + encodeURIComponent(game.gameId);
  }
}

export default function FeaturedCarousel() {
  const { lang } = useLanguage();

  return (
    <section className="section" id="collectionsSection">
      <h2 className="section-header">
        <span className="section-icon">⭐</span>
        <span className="section-title">
          {translate("featured", lang)}
        </span>
      </h2>
      <div className="featured-strip">
        <div className="featured-track">
          {[...featuredGames, ...featuredGames].map((game, idx) => (
            <button
              key={game.id + idx}
              type="button"
              className="f-card"
              onClick={() => openFeatured(game)}
            >
              <div
                className="f-thumb"
                style={{ backgroundImage: `url(${game.image})` }}
              />
              <div className="f-title">{game.title}</div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
