// react-app/src/components/mobile/MobileRecentSection/MobileRecentSection.jsx
import { useEffect, useState, useRef } from "react";
import MobileGameCard from "../MobileGameCard/MobileGameCard";
import "./MobileRecentSection.css";
import { useLanguage } from "../../../context/LanguageContext";
import { getRecentGames } from "../../../api/games.api";

export default function MobileRecentSection({ id, lang, translate }) {
  const [recentGames, setRecentGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const carouselRef = useRef(null);


  useEffect(() => {
    let mounted = true;

    async function fetchRecent() {
      try {
        setLoading(true);
        const games = await getRecentGames(12);

        if (mounted) {
          setRecentGames((games || []).slice(0, 12));
        }
      } catch (err) {
        console.error("Failed to load recent games:", err);
        if (mounted) setRecentGames([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchRecent();

    return () => {
      mounted = false;
    };
  }, []);

  if (!loading && recentGames.length === 0) return null;

  return (
    <section className="mobile-recent-section" id={id}>
      {/* Header */}


      <div className="mobile-section-header-recent">
        {/* <div className="underline">
          <div className="mobile-home-section-icon-recent" alt="" >⏱️</div>
          <div className="mobile-section-swiper-title-recent">

            {translate("recentlyPlayed", lang)}
          </div>
        </div> */}
      </div>

      {/* Scroll row */}
      <div className="mobile-recent-scroll" ref={carouselRef}>
        {/* Surprise Me */}
        <div className="mobile-recent-surprise">
          {/* <span>🔀</span> */}
          <p>{translate("recentlyPlayed", lang)}</p>
        </div>

        {/* Games */}
        {(loading ? Array.from({ length: 5 }) : recentGames).map(
          (game, index) => (
            <div
              key={game?.id || index}
              className="mobile-recent-item"
            >
              {loading ? (
                <div className="mobile-recent-skeleton" />
              ) : (
                <div className="mobile-recent-item">
                  <MobileGameCard game={game} index={index} />
                </div>
              )}
            </div>
          )
        )}
      </div>
    </section>
  );
}
