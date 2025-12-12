import { useEffect, useState } from "react";
// import { fetchGames } from "../../../api/fetchGames";
import GameSection from "../../components/GameSection/GameSection";
import "./Home.css";
import { useLanguage } from "../../context/LanguageContext";
import { translate } from "../../data/translations";
import FAQ from "../../components/FAQ/FAQ";
import { fetchH5Games } from "../../../api/fetchH5Games";



export default function Home({ search }) {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const { lang } = useLanguage();

  useEffect(() => {
  fetchH5Games().then(data => {
    setGames(data);
    localStorage.setItem("games", JSON.stringify(data)); // ADD THIS
    setLoading(false);
  });
}, []);


  if (loading) {
    return (
      <p style={{ textAlign: "center", color: "white", marginTop: 40 }}>
        Loading games…
      </p>
    );
  }

  // Search filter
  const filteredGames = games.filter(g =>
    g.title.toLowerCase().includes(search.toLowerCase())
  );

  // CATEGORY ENGINE — matches your sidebar
  // const categories = {
  //   featured: games.slice(0, 12),
  //   recent: games.slice(12, 24),

  //   popular: games.filter(g =>
  //     g.tagList.includes("free") || g.tagList.includes("1-player")
  //   ),

  //   hot: games.filter(g =>
  //     g.tagList.includes("crazy") ||
  //     g.tagList.includes("drift") ||
  //     g.tagList.includes("speed")
  //   ),

  //   top100: games.slice(0, 100),

  //   all: games,

  //   cricket: games.filter(g => g.tagList.includes("cricket")),
  //   football: games.filter(g => g.tagList.includes("soccer")),
  //   basketball: games.filter(g => g.tagList.includes("basketball")),
  //   halloween: games.filter(g => g.tagList.includes("halloween")),
  //   horror: games.filter(g => g.tagList.includes("horror")),
  //   shooting: games.filter(g => g.tagList.includes("shooting")),

  // };

  const categories = {
  // ⭐ FEATURED → H5 only
  featured: games.slice(0, 12),

  recent: games.slice(12, 24),

  puzzles: games.filter(g => g.category === "puzzles"),

  action: games.filter(g => g.tagList.includes("action")),

  skill: games.filter(g => g.tagList.includes("skill")),

  driving: games.filter(g => g.tagList.includes("driving") || g.tagList.includes("cars")),

  basketball: games.filter(g => g.tagList.includes("basketball")),

  horror: games.filter(g => g.tagList.includes("zombie")),

  halloween: games.filter(g => g.tagList.includes("halloween")),

  football: games.filter(g => g.tagList.includes("football")),

  all: games,
};

  return (
    <div className="home-wrapper">

      {search && (
        <GameSection 
        id="searchResults" 
        title="Search Results" 
        games={filteredGames} />
      )}

      {/* <GameSection
        id="featuredSection"
        title={`⭐ ${translate("featuredGames", lang)}`}
        games={categories.featured}
        slider={true}
      />


      <GameSection
        id="recentSection"
        title={`⏱ ${translate("recentGames", lang)}`}
        games={categories.recent}
      />

      <GameSection
        id="popularSection"
        title={`💥 ${translate("popularGames", lang)}`}
        games={categories.popular}
      />

      <GameSection
        id="hotSection"
        title={`🔥 ${translate("hotGames", lang)}`}
        games={categories.hot}
      />

      <GameSection
        id="top100"
        title={`⭐ ${translate("top100Games", lang)}`}
        games={categories.top100}
      />

      <GameSection
        id="gamesAll"
        title={`🎮 ${translate("allGames", lang)}`}
        games={categories.all}
      />

      <GameSection
        id="number_games"
        title={`🏏 ${translate("cricket", lang)} ${translate("games", lang)}`}
        games={categories.cricket}
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
        id="halloween_games"
        title={`🎃 ${translate("halloween", lang)} ${translate("games", lang)}`}
        games={categories.halloween}
      />

      <GameSection
        id="horror_games"
        title={`💀 ${translate("horror", lang)} ${translate("games", lang)}`}
        games={categories.horror}
      />

      <GameSection
        id="shooting_games"
        title={`🔫 ${translate("shooting", lang)} ${translate("games", lang)}`}
        games={categories.shooting}
      /> */}

      <GameSection
        id="featuredSection"
        title={`⭐ ${translate("featuredGames", lang)}`}
        games={categories.featured}
        slider={true}
      />

      <GameSection
        id="puzzles"
        title="🧩 Puzzle Games"
        games={categories.puzzles}
      />

      <GameSection
        id="action"
        title="🔥 Action Games"
        games={categories.action}
      />

      <GameSection
        id="skill"
        title="🎯 Skill Games"
        games={categories.skill}
      />

      <GameSection
        id="driving"
        title="🚗 Driving Games"
        games={categories.driving}
      />

      <GameSection
        id="halloween_games"
        title={`🎃 ${translate("halloween", lang)} ${translate("games", lang)}`}
        games={categories.halloween}
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
        id="horror_games"
        title={`💀 ${translate("horror", lang)} ${translate("games", lang)}`}
        games={categories.horror}
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
