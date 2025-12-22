import { useEffect, useState, useRef } from "react";
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
import CategoryGrid from "../../components/CategoryGrid/CategoryGrid";
import { useNavigate } from "react-router-dom";
import HeroBanner from "../../components/HeroBanner/HeroBanner";



export default function Home() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const prevSearchRef = useRef("");

    /* ================= LOAD GAMES ================= */
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

    // ----------------Scroll to top when search term changes and has value
  // useEffect(() => {
  //   const prev = prevSearchRef.current;
  //   const current = search?.trim() || "";

  //   // 🔑 Scroll ONLY when search starts (empty → non-empty)
  //   if (!prev && current) {
  //     window.scrollTo({ top: 0, behavior: "auto" });
  //   }

  //   // update previous value
  //   prevSearchRef.current = current;
  // }, [search]);

  //====================  mobile loading =============   
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
    makeup: games.filter(g => g.tagList?.includes("princess")|| g.tagList?.includes("makeover")),
    all: games,
  };


  // ---------------------- Hero Banner ------------------
  const bannerSlides = [
  {
    background: "/images/8JJ-GAMES1.jpg",
    badge: "INCREDIBLE EXCLUSIVE",
    titleHighlight: "PLAY FREE NOW!",
    title: "100% FREE ONLINE GAMES!",
    cta: "PLAY NOW",
    link: "/categories/adventure",
  },
  {
    background: "/images/8JJ-GAMES2.jpg",
    badge: "HALLOWEEN GAMES",
    titleHighlight: "HALLOWEEN",
    title: "UNLIMITED FREE HALLOWEEN GAMES",
    cta: "PLAY NOW",
    link: "/categories/halloween",
  },
  {
    background: "/images/8JJ-GAMES3.jpg",
    badge: "CARD GAMES",
    titleHighlight: "CARDS",
    title: "FREE CARD GAMES",
    cta: "PLAY NOW",
    link: "/categories/card",
  },
  {
    background: "/images/8JJ-GAMES4.jpg",
    badge: "CHRISTMAS GAMES",
    titleHighlight: "CHRISTMAS",
    title: "FREE CHRISTMAS GAMES",
    cta: "PLAY NOW",
    link: "/categories/CHRISTMAS",
  },
  {
    background: "/images/8JJ-GAMES5.jpg",
    badge: "HORROR GAMES",
    titleHighlight: "HORROR",
    title: "FREE HORROR GAMES",
    cta: "PLAY NOW",
    link: "/categories/zombie",
  },
  {
    background: "/images/8JJ-GAMES6.jpg",
    badge: "SIMULATOR GAMES",
    titleHighlight: "SIMULATOR",
    title: "FREE SIMULATOR GAMES",
    cta: "PLAY NOW",
    link: "/categories/simulator",
  },
  {
    background: "/images/8JJ-GAMES7.jpg",
    badge: "DRIVING GAMES",
    titleHighlight: "DRIVING",
    title: "FREE DRIVING GAMES",
    cta: "PLAY NOW",
    link: "/categories/driving",
  }
];

  
  return (
  <div className="home-wrapper">

    {/* <HeroBanner slides={bannerSlides} /> */}

    {/* ⏱️ RECENT */}
    <RecentSection
      id="recentSection"
      lang={lang}
      translate={translate}
    />

    {/* <TrendingSection
      id="trending"
      title={`⚡ ${translate("trendingGames", lang)}`}
      games={categories.featured.slice(0, 8)}
    /> */}

    <HeroBanner slides={bannerSlides} />

    <GameSection
      id="featuredSection"
      title={`⭐ ${translate("featuredGames", lang)}`}
      games={categories.featured}
      slider
      categoryId="featuredSection"
    />

    <GameSection
      id="christmas"
      title={`🎅🏻 ${translate("christmas", lang)} ${translate("games", lang)}`}
      games={categories.christmas}
      categoryId="christmas"
    />

    <GameSection
      id="makeup"
      title={`💄 ${translate("girlsGames", lang)}`}
      games={categories.makeup}
      categoryId="princess"
    />

    <GameSection
      id="driving"
      title={`🏎️ ${translate("driving", lang)}`}
      games={categories.driving}
      categoryId="driving"
    />

    <PopularSection
      id="popularSection"
      lang={lang}
      translate={translate}
    />

    <GameSection
      id="action"
      title={`🥊 ${translate("action", lang)}`}
      games={categories.action}
      categoryId="action"
    />

    <TopPicksSection
      id="top-picks"
      title={`🌶️ ${translate("topPicks", lang)}`}
      games={categories.recent.slice(0, 27)}
    />

    <GameSection
      id="platformer"
      title={`🧗 ${translate("platformer", lang)}`}
      games={categories.platformers}
      categoryId="platformer"
    />

    <GameSection
      id="halloween_games"
      title={`🎃 ${translate("halloween", lang)} ${translate("games", lang)}`}
      games={categories.halloween}
      categoryId="halloween"
    />

    <GameSection
      id="card_games"
      title={`🃏 ${translate("card", lang)}`}
      games={categories.card}
      categoryId="card"
    />

    <GameSection
      id="football_games"
      title={`⚽ ${translate("football", lang)} ${translate("games", lang)}`}
      games={categories.football}
      categoryId="football"
    />

    <GameSection
      id="basketball_games"
      title={`🏀 ${translate("basketball", lang)} ${translate("games", lang)}`}
      games={categories.basketball}
      categoryId="basketball"
    />

    <div className="ScrollSnap" id="categories">
      <div className="mosaic-page home-wrapper">
        <h2 className="Cat-title">
          🗂 {translate("Categories", lang)}
        </h2>

        <CategoryGrid limit={12} />

        <div className="container">
          <button
            className="btn"
            onClick={() => navigate("/categories")}
          >
            <span className="btnInner">
              {translate("viewMore", lang)}
            </span>
          </button>
        </div>
      </div>
    </div>

    <GameSection
      id="simulation_games"
      title={`🎮 ${translate("simulation", lang)}`}
      games={categories.simulation}
      categoryId="simulation"
    />

    <GameSection
      id="skill_games"
      title={`🎯 ${translate("skill", lang)}`}
      games={categories.skill}
      categoryId="skill"
    />

    <GameSection
      id="horror_games"
      title={`💀 ${translate("horror", lang)} ${translate("games", lang)}`}
      games={categories.horror}
      categoryId="zombie"
    />

    <GameSection
      id="endless_runner"
      title={`🏃 ${translate("endlessRunner", lang)}`}
      games={categories.endlessrunner}
      categoryId="endless runner"
    />

    <GameSection
      id="puzzles"
      title={`🧩 ${translate("puzzles", lang)}`}
      games={categories.puzzles}
      categoryId="puzzles"
    />

    <HotSection
      id="hotGames"
      games={categories.hot}
      lang={lang}
      translate={translate}
    />

    <GameSection
      id="gamesAll"
      title={`🎮 ${translate("allGames", lang)}`}
      games={categories.all}
      categoryId="gamesAll"
      allGamesPage
    />

    <FAQ />
  </div>
);

}