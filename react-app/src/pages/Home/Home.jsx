import { useEffect, useState } from "react";
import { fetchH5Games } from "../../api/fetchH5Games";
import { selfHostedGames } from "../../data/selfHostedGames";
import GameSection from "../../components/GameSection/GameSection";
import FAQ from "../../components/FAQ/FAQ";
import "./Home.css";
import { useLanguage } from "../../context/LanguageContext";
import { translate } from "../../data/translations";
import { useLocation } from "react-router-dom";

export default function Home({ search }) {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const { lang } = useLanguage();
  const location = useLocation();

  // 🔹 Load games ONCE
  useEffect(() => {
    const load = async () => {
      try {
        const h5 = await fetchH5Games();
        const allGames = [...selfHostedGames, ...h5];

        setGames(allGames);
        localStorage.setItem("games", JSON.stringify(allGames));
      } catch (err) {
        console.error("Failed to load games", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // 🔹 Scroll from sidebar navigation
  useEffect(() => {
    if (!location.state?.scrollTo) return;

    const id = location.state.scrollTo;
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        window.scrollTo({
          top: el.offsetTop - 80,
          behavior: "smooth",
        });
      }
    }, 100);
  }, [location]);

  if (loading) {
    return (
      <p style={{ textAlign: "center", color: "white", marginTop: 40 }}>
        Loading games…
      </p>
    );
  }

  // 🔹 Search
  const filteredGames = search
    ? games.filter(g =>
        g.title.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  // 🔹 Categories
  const categories = {
    featured: games.slice(0, 12),
    recent: games.slice(12, 24),

    popular: games.filter(g =>
      g.tagList?.includes("free") || g.tagList?.includes("1-player")
    ),

    hot: games.filter(g =>
      g.tagList?.includes("crazy") ||
      g.tagList?.includes("drift") ||
      g.tagList?.includes("speed")
    ),

    top100: games.slice(0, 100),
    all: games,

    cricket: games.filter(g => g.tagList?.includes("cricket")),
    football: games.filter(g => g.tagList?.includes("football")),
    basketball: games.filter(g => g.tagList?.includes("basketball")),
    halloween: games.filter(g => g.tagList?.includes("halloween")),
    horror: games.filter(g => g.tagList?.includes("horror")),
    shooting: games.filter(g => g.tagList?.includes("shooting")),
  };

  return (
    <div className="home-wrapper">

      {search && (
        <GameSection
          id="searchResults"
          title="Search Results"
          games={filteredGames}
        />
      )}

      <GameSection
        id="featuredSection"
        title={`⭐ ${translate("featuredGames", lang)}`}
        games={categories.featured}
        slider
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
      />

      <FAQ />
    </div>
  );
}
