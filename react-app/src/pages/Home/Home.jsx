import { useEffect, useState } from "react";
import { fetchGames } from "../../api/fetchGames";
import GameSection from "../../components/GameSection/GameSection";
import "./Home.css";

export default function Home({ search }) {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGames().then(data => {
      setGames(data);
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
    featured: games.slice(0, 12),
    recent: games.slice(12, 24),

    popular: games.filter(g =>
      g.tagList.includes("free") || g.tagList.includes("1-player")
    ),

    hot: games.filter(g =>
      g.tagList.includes("crazy") ||
      g.tagList.includes("drift") ||
      g.tagList.includes("speed")
    ),

    top100: games.slice(0, 100),

    all: games,

    cricket: games.filter(g => g.tagList.includes("cricket")),
    football: games.filter(g => g.tagList.includes("soccer")),
    basketball: games.filter(g => g.tagList.includes("basketball")),
    halloween: games.filter(g => g.tagList.includes("halloween")),
    horror: games.filter(g => g.tagList.includes("horror")),
    shooting: games.filter(g => g.tagList.includes("shooting")),

  };

  return (
    <div className="home-wrapper">

      {search && (
        <GameSection id="searchResults" title="Search Results" games={filteredGames} />
      )}

      <GameSection id="featuredSection" title="⭐ Featured Games" games={categories.featured} />

      <GameSection id="recentSection" title="⏱ Recent Games" games={categories.recent} />

      <GameSection id="popularSection" title="💥 Popular Games" games={categories.popular} />

      <GameSection id="hotSection" title="🔥 Hot Games" games={categories.hot} />

      <GameSection id="top100" title="⭐ Top 100" games={categories.top100} />

      <GameSection id="gamesAll" title="🎮 All Games" games={categories.all} />

      <GameSection id="number_games" title="🏏 Cricket Games" games={categories.cricket} />

      <GameSection id="football_games" title="⚽ Football Games" games={categories.football} />

      <GameSection id="basketball_games" title="🏀 Basketball Games" games={categories.basketball} />

      <GameSection id="halloween_games" title="🎃 Halloween Games" games={categories.halloween} />

      <GameSection id="horror_games" title="💀 Horror Games" games={categories.horror} />

      <GameSection id="shooting_games" title="🔫 Shooting Games" games={categories.shooting} />


    </div>
  );
}
