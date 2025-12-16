import { useEffect, useState, useLocation } from "react";
import GameSection from "../../components/GameSection/GameSection";
import TrendingSection from "../../components/TrendingSection/TrendingSection";
import TopPicksSection from "../../components/TopPicksSection/TopPicksSection";
import "./Home.css";
import { useLanguage } from "../../context/LanguageContext";
import { translate } from "../../data/translations";
import FAQ from "../../components/FAQ/FAQ";
import { fetchH5Games } from "../../api/fetchH5Games";
import { selfHostedGames } from "../../data/selfHostedGames";


export default function Home({ search }) {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const { lang } = useLanguage();
  // const location = useLocation();


  useEffect(() => {
    const load = async () => {
      const h5 = await fetchH5Games();
      const all = [...selfHostedGames, ...h5];

      setGames(all);
      localStorage.setItem("games", JSON.stringify(all));
      setLoading(false);
    };

    load();
  }, []);

  if (loading) {
    // Check if mobile
    const isMobile = window.innerWidth <= 750;

    return (
      <div className="home-wrapper">
        {/* Featured Section */}
        <div className="loading-section">
          <div className="skeleton-title"></div>
          <div className="grid">
            {Array.from({ length: 10 }).map((_, index) => (
              <div key={index} className="card loading">
                <div className="image"></div>
                <div className="content">
                  <h1></h1>
                  <h2></h2>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Only show these sections on desktop */}
        {!isMobile && (
          <>
            {/* Christmas Section */}
            <div className="loading-section">
              <div className="skeleton-title"></div>
              <div className="grid">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={`christmas-${index}`} className="card loading">
                    <div className="image"></div>
                    <div className="content">
                      <h1></h1>
                      <h2></h2>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Section */}
            <div className="loading-section">
              <div className="skeleton-title"></div>
              <div className="grid">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={`action-${index}`} className="card loading">
                    <div className="image"></div>
                    <div className="content">
                      <h1></h1>
                      <h2></h2>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Driving Section */}
            <div className="loading-section">
              <div className="skeleton-title"></div>
              <div className="grid">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={`driving-${index}`} className="card loading">
                    <div className="image"></div>
                    <div className="content">
                      <h1></h1>
                      <h2></h2>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  // Search filter
  const filteredGames = games.filter(g =>
    g.title.toLowerCase().includes(search.toLowerCase())
  );

  // CATEGORY ENGINE — matches your sidebar
  const categories = {
    // ⭐ FEATURED → H5 only
    featured: games.slice(0, 12),

    recent: games.slice(12, 50),

    christmas: games.filter(g => g.tagList.includes("christmas")),

    puzzles: games.filter(g => g.category === "puzzles"),

    action: games.filter(g => g.tagList.includes("action")),

    skill: games.filter(g => g.tagList.includes("skill")),

    driving: games.filter(g => g.tagList.includes("driving") || g.tagList.includes("cars")),

    basketball: games.filter(g => g.tagList.includes("basketball")),

    horror: games.filter(g => g.tagList.includes("zombie")),

    halloween: games.filter(g => g.tagList.includes("halloween")),

    football: games.filter(g => g.tagList.includes("football")),

    simulation: games.filter(g => g.tagList.includes("simulation")),

    endlessrunner: games.filter(g => g.tagList.includes("endless runner")),

    platformers: games.filter(g => g.tagList.includes("platformer")),

    card: games.filter(g => g.tagList.includes("card")),

    all: games,
  };

  return (
    <div className="home-wrapper">

      {search && (
        <GameSection
          id="searchResults"
          title={translate("searchResults", lang)}
          games={filteredGames} />
      )}

      <GameSection
        id="featuredSection"
        title={`⭐ ${translate("featuredGames", lang)}`}
        games={categories.featured}
        slider={true}
      />

      <GameSection
        id="driving"
        title={`🏎️ ${translate("driving", lang)}`}
        games={categories.driving}
      />

      {/* 🔥 TRENDING SECTION */}
      <TrendingSection
        id="trending"
        title={`🔥 ${translate("trendingGames", lang)}`}
        games={categories.featured.slice(0, 8)}
      />

      <GameSection
        id="christmas"
        title={`🎅🏻 ${translate("christmas", lang)} ${translate("games", lang)}`}
        games={categories.christmas}
      />

      <GameSection
        id="action"
        title={`🥊 ${translate("action", lang)}`}
        games={categories.action}
      />

      {/* 🎯 TOP PICKS FOR YOU SECTION */}
      <TopPicksSection
        id="top-picks"
        title={`🌶️ ${translate("topPicks", lang)}`}
        games={categories.recent.slice(0, 27)}
      />

      <GameSection
        id="halloween_games"
        title={`🎃 ${translate("halloween", lang)} ${translate("games", lang)}`}
        games={categories.halloween}
      />

      <GameSection
        id="card_games"
        title={`🃏 ${translate("card", lang)} ${translate("games", lang)}`}
        games={categories.card}
      />

      <GameSection
        id="football_games"
        title={`⚽ ${translate("football", lang)} ${translate("games", lang)}`}
        games={categories.football}
      />

      <GameSection
        id="basketball_games"
        title={`🏀 ${translate("basketball", lang)} ${translate("games", lang)}`}
        games={categories.basketball}
      />

      <GameSection
        id="simulation_games"
        title={`🎮 ${translate("simulation", lang)}`}
        games={categories.simulation}
      />

      <GameSection
        id="skill_games"
        title={`🎯 ${translate("skill", lang)}`}
        games={categories.skill}
      />

      <GameSection
        id="horror_games"
        title={`💀 ${translate("horror", lang)} ${translate("games", lang)}`}
        games={categories.horror}
      />

      <GameSection
        id="endless_runner"
        title={`🏃 ${translate("endlessRunner", lang)}`}
        games={categories.endlessrunner}
      />

      <GameSection
        id="platformer"
        title={`🏃 ${translate("platformer", lang)}`}
        games={categories.platformers}
      />

      <GameSection
        id="puzzles"
        title={`🧩 ${translate("puzzles", lang)}`}
        games={categories.puzzles}
      />

      <GameSection
        id="gamesAll"
        title={`🎮 ${translate("allGames", lang)}`}
        games={categories.all}
      />

      <FAQ />

    </div>
  );
}