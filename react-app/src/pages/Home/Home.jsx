import { useEffect, useState } from "react";
// import { fetchGames } from "../../../api/fetchGames";
import GameSection from "../../components/GameSection/GameSection";
import "./Home.css";
import { useLanguage } from "../../context/LanguageContext";
import { translate } from "../../data/translations";
import FAQ from "../../components/FAQ/FAQ";
import { fetchH5Games } from "../../api/fetchH5Games";



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
  const categories = {
  // ⭐ FEATURED → H5 only
  featured: games.slice(0, 12),

  recent: games.slice(12, 24),

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

  platformers: games.filter(g => g.tagList.includes("platformers")),

  card: games.filter(g => g.tagList.includes("card")),

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

      <GameSection
        id="featuredSection"
        title={`⭐ ${translate("featuredGames", lang)}`}
        games={categories.featured}
        slider={true}
      />

      <GameSection
        id="christmas"
        title={`🎅🏻 ${translate("christmas", lang)} ${translate("games", lang)}`}
        games={categories.christmas}
      />

      <GameSection
        id="action"
        title={`🔥 ${translate("action", lang)}`}
        games={categories.action}
      />

      <GameSection
        id="driving"
        title={`🚗 ${translate("driving", lang)}`}
        games={categories.driving}
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
        title={`💀 ${translate("endlessRunner", lang)}`}
        games={categories.endlessrunner}
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
