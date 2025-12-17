import { useEffect, useState } from "react";
import GameSection from "../../components/GameSection/GameSection";
import TrendingSection from "../../components/TrendingSection/TrendingSection";
import TopPicksSection from "../../components/TopPicksSection/TopPicksSection";
import CategoriesSection from "../../components/CategoriesSection/CategoriesSection";
import RecentSection from "../../components/RecentSection/RecentSection";
import PopularSection from "../../components/PopularSection/PopularSection";
import HotSection from "../../components/HotSection/HotSection";
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
    const isMobile = window.innerWidth <= 750;

    return (
      <div className="home-wrapper">
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

        {!isMobile && (
          <>
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

  // Define categories
  const categories = {
    featured: games.slice(0, 12),
    recent: games.slice(12, 50),
    popular: games.slice(0, 30).sort(() => Math.random() - 0.5),
    hot: games.slice(30, 42).sort(() => Math.random() - 0.5),
    // top100: games.slice(0, 100),
    christmas: games.filter(g => g.tagList?.includes("christmas")),
    puzzles: games.filter(g => g.category === "puzzles"),
    action: games.filter(g => g.tagList?.includes("action")),
    skill: games.filter(g => g.tagList?.includes("skill")),
    driving: games.filter(g => g.tagList?.includes("driving") || g.tagList?.includes("cars")),
    basketball: games.filter(g => g.tagList?.includes("basketball")),
    horror: games.filter(g => g.tagList?.includes("zombie")),
    halloween: games.filter(g => g.tagList?.includes("halloween")),
    football: games.filter(g => g.tagList?.includes("football")),
    simulation: games.filter(g => g.tagList?.includes("simulation")),
    endlessrunner: games.filter(g => g.tagList?.includes("endless runner")),
    platformers: games.filter(g => g.tagList?.includes("platformer")),
    card: games.filter(g => g.tagList?.includes("card")),
    all: games,
  };

  // Search filter
  const filteredGames = games.filter(g =>
    g.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="home-wrapper">

      {search && (
        <GameSection
          id="searchResults"
          title={translate("searchResults", lang)}
          games={filteredGames}
        />
      )}

      <GameSection
        id="featuredSection"
        title={`⭐ ${translate("featuredGames", lang)}`}
        games={categories.featured}
        slider={true}
      />

      <CategoriesSection 
        title="📂 Browse Categories"
        id="categoriesSection"
      />

      {/* ⏱️ RECENT SECTION - 12 games from localStorage */}
      <RecentSection 
        id="recentSection"
      />

      {/* 💥 POPULAR SECTION - 12 games from localStorage */}
      <PopularSection 
        id="popularSection"
      />

      {/* 🔥 HOT SECTION - 12 games */}
      <HotSection 
        id="hotSection"
        games={categories.hot}
      />

      {/* ⭐ TOP 100 SECTION */}
      {/* <Top100Section 
        id="top100"
        games={categories.top100}
      /> */}

      <GameSection
        id="driving"
        title={`🏎️ ${translate("driving", lang)}`}
        games={categories.driving}
      />

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