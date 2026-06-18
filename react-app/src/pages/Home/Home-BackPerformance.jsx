/* react-app/src/pages/Home/Home.jsx - 02/03/2026 */
import { useEffect, useState, useRef } from "react";

//  NEW: Import mobile home component
import MobileHome from "../mobile/MobileHome/MobileHome";

import UniversalBanner from "../../components/UniversalBanner/UniversalBanner";

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
import { getPopularGames, getAllGames, getFeaturedGames, getRecentGames, getGamesByCategory, getGamesByTag, getTopPickGames } from "../../api/games.api";

import CategoryGrid from "../../components/CategoryGrid/CategoryGrid";
import { useNavigate, Link, useLocation } from "react-router-dom";
import HeroBanner from "../../components/HeroBanner/HeroBanner";
import { BLOCKED_GAME_IDS } from "../../utils/blockedGames";

//  SEO: Import SEO component and keywords
import SEO from "../../components/SEO/SEO";
import { generateKeywords } from "../../config/seoKeywords";

import { useProfile } from "../../context/ProfileContext";
import CountrySelectModal from "../../components/CountrySelectModal/CountrySelectModal";


const R2_BASE =
  import.meta.env.VITE_ASSETS_BASE_URL ||
  "https://assets.8jjgames.com";

const HOME_ICONS = {
  home: `${R2_BASE}/8jj_icons/sidebar-icons-2/home.webp`,
  featured: `${R2_BASE}/8jj_icons/sidebar-icons-2/star.webp`,
  hot: `${R2_BASE}/8jj_icons/sidebar-icons-2/fire.webp`,
  christmas: `${R2_BASE}/8jj_icons/sidebar-icons-2/christmas.webp`,
  girls: `${R2_BASE}/8jj_icons/sidebar-icons-2/makeup.webp`,
  driving: `${R2_BASE}/8jj_icons/sidebar-icons-2/driving.webp`,
  popular: `${R2_BASE}/8jj_icons/sidebar-icons-2/rocket.webp`,
  action: `${R2_BASE}/8jj_icons/sidebar-icons-2/action.webp`,
  topPicks: `${R2_BASE}/8jj_icons/sidebar-icons-2/chili.webp`,
  platformer: `${R2_BASE}/8jj_icons/sidebar-icons-2/platformer.webp`,
  halloween: `${R2_BASE}/8jj_icons/sidebar-icons-2/halloween.webp`,
  card: `${R2_BASE}/8jj_icons/sidebar-icons-2/card.webp`,
  football: `${R2_BASE}/8jj_icons/sidebar-icons-2/football.webp`,
  basketball: `${R2_BASE}/8jj_icons/sidebar-icons-2/basketball.webp`,
  categories: `${R2_BASE}/8jj_icons/sidebar-icons-2/categories.webp`,
  simulation: `${R2_BASE}/8jj_icons/sidebar-icons-2/simulation.webp`,
  skill: `${R2_BASE}/8jj_icons/sidebar-icons-2/target.webp`,
  horror: `${R2_BASE}/8jj_icons/sidebar-icons-2/horror.webp`,
  endless: `${R2_BASE}/8jj_icons/sidebar-icons-2/runner.webp`,
  puzzles: `${R2_BASE}/8jj_icons/sidebar-icons-2/puzzle.webp`,
  allGames: `${R2_BASE}/8jj_icons/sidebar-icons-2/all.webp`,
  faq: `${R2_BASE}/8jj_icons/sidebar-icons-2/help.webp`,
  games: `${R2_BASE}/8jj_icons/sidebar-icons-2/all.webp`,
};


//  MODIFIED: Add isMobile prop
export default function Home({ isMobile }) {
  const { profile, loading: profileLoading, refreshProfile } = useProfile();
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [countryCompleted, setCountryCompleted] = useState(
    localStorage.getItem("countryCompleted") === "true"
  );

  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const prevSearchRef = useRef("");

  const location = useLocation();

  useEffect(() => {
    const scrollTo = location.state?.scrollTo;
    if (!scrollTo || loading) return;

    const timer = setTimeout(() => {
      const el = document.getElementById(scrollTo);
      if (!el) return;

      const header = document.querySelector("header.header");
      const headerHeight = header ? header.offsetHeight : 0;

      const rect = el.getBoundingClientRect();
      const absoluteTop = rect.top + window.scrollY;

      window.scrollTo({
        top: absoluteTop - headerHeight - 16,
        behavior: "smooth",
      });

      window.history.replaceState({}, document.title);
    }, 1500);

    return () => clearTimeout(timer);
  }, [location.state, loading]);

  //categories
  const [featured, setFeatured] = useState([]);
  const [popular, setPopular] = useState([]);
  const [top, setTopPick] = useState([]);
  const [hot, setHot] = useState([]);
  const [christmas, setChristmas] = useState([]);
  const [puzzles, setPuzzles] = useState([]);
  const [action, setAction] = useState([]);
  const [skill, setSkill] = useState([]);
  const [driving, setDriving] = useState([]);
  const [basketball, setBasketball] = useState([]);
  const [horror, setHorror] = useState([]);
  const [halloween, setHalloween] = useState([]);
  const [simulation, setSimulation] = useState([]);
  const [endlessrunner, setEndlessrunner] = useState([]);
  const [platformers, setPlatformers] = useState([]);
  const [card, setCard] = useState([]);
  const [makeup, setMakeup] = useState([]);
  const [football, setFootball] = useState([]);

  useEffect(() => {
    // console.log("PROFILE FROM API:", profile);
  }, [profile]);

  useEffect(() => {
    if (profileLoading) return;

    if (
      profile &&
      !profile.country &&
      !countryCompleted
    ) {
      setShowCountryModal(true);
    }
  }, [profile, profileLoading, countryCompleted]);

  /* ================= LOAD GAMES ================= */
  useEffect(() => {
    async function loadHomeSections() {
      try {
        const [
          featuredRes,
          popularRes,
          topRes,
          hotRes,
          christmasRes,
          puzzlesRes,
          actionRes,
          skillRes,
          drivingRes,
          basketballRes,
          horrorRes,
          halloweenRes,
          footballRes,
          simulationRes,
          endlessRes,
          platformerRes,
          cardRes,
          makeupRes
        ] = await Promise.all([
          getFeaturedGames(),
          getPopularGames(12),
          getTopPickGames(12),
          getPopularGames(12), // temporary hot logic
          getGamesByTag("christmas"),
          getGamesByCategory("puzzles"),
          getGamesByTag("action"),
          getGamesByTag("skill"),
          getGamesByTag("driving"),
          getGamesByTag("basketball"),
          getGamesByTag("zombie"), // horror
          getGamesByTag("halloween"),
          getGamesByTag("football"),
          getGamesByTag("simulation"),
          getGamesByTag("endless runner"),
          getGamesByTag("platformer"),
          getGamesByTag("card"),
          getGamesByTag("princess")
        ]);

        setFeatured(featuredRes);
        setPopular(popularRes);
        setTopPick(topRes);
        setHot((hotRes || []).slice(0, 12));
        setChristmas(christmasRes);
        setPuzzles(puzzlesRes);
        setAction(actionRes);
        setSkill(skillRes);
        setDriving(drivingRes);
        setBasketball(basketballRes);
        setHorror(horrorRes);
        setHalloween(halloweenRes);
        setFootball(footballRes);
        setSimulation(simulationRes);
        setEndlessrunner(endlessRes);
        setPlatformers(platformerRes);
        setCard(cardRes);
        setMakeup(makeupRes);

      } catch (err) {
        console.error("Home load error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadHomeSections();
  }, []);

  /* =================  SEO: JSON-LD SCHEMA MARKUP ================= */
  useEffect(() => {
    const websiteSchema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "8JJ Games",
      "alternateName": "8jj-games",
      "url": "https://8jjgames.com",
      "description": "Play thousands of free online games on 8JJ Games. Browse action, puzzle, racing, sports games and more. No download, no registration - play instantly in your browser!",
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://8jjgames.com/search?q={search_term_string}"
        },
        "query-input": "required name=search_term_string"
      },
      "publisher": {
        "@type": "Organization",
        "name": "8JJ Games",
        "url": "https://8jjgames.com",
        "logo": {
          "@type": "ImageObject",
          "url": "https://8jjgames.com/8JJ_games.png"
        }
      }
    };

    const organizationSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "8JJ Games",
      "alternateName": "8jj-games",
      "url": "https://8jjgames.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://8jjgames.com/8JJ_games.png",
        "width": 250,
        "height": 250
      },
      "description": "Free online gaming platform offering thousands of browser-based games across all genres. No downloads, no registration required.",
      "sameAs": [
        "https://twitter.com/8jjgames",
        "https://facebook.com/8jjgames"
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "Customer Service",
        "url": "https://8jjgames.com/contact"
      }
    };

    const itemListSchema = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "Featured Free Online Games",
      "description": "Top featured games on 8JJ Games",
      "numberOfItems": Math.min(games.length, 12),
      "itemListElement": games.slice(0, 12).map((game, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "VideoGame",
          "name": game.title,
          "url": `https://8jjgames.com/game/${game.id}`,
          "image": game.image,
          "genre": game.category || "Casual",
          "gamePlatform": "Web Browser"
        }
      }))
    };

    const schemaScript = document.createElement('script');
    schemaScript.type = 'application/ld+json';
    schemaScript.text = JSON.stringify([websiteSchema, organizationSchema, itemListSchema]);
    schemaScript.id = 'homepage-schema';
    document.head.appendChild(schemaScript);

    return () => {
      const existingScript = document.getElementById('homepage-schema');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, [games]);

  //  NEW: If mobile, return mobile version BEFORE desktop loading
  if (isMobile) {
    return <MobileHome games={games} loading={loading} />;
  }

  //==================== Desktop Loading (Skeleton) =============
  if (loading) {
    const isMobileCheck = window.innerWidth <= 750;

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

        {!isMobileCheck && (
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

  //  SEO: Top categories for internal linking
  const topCategories = [
    { name: "Action", link: "/categories/action", icon: "🥊", count: action.length },
    { name: "Puzzle", link: "/categories/puzzles", icon: "🧩", count: puzzles.length },
    { name: "Racing", link: "/categories/driving", icon: "🏎️", count: driving.length },
    { name: "Sports", link: "/categories/basketball", icon: "🏀", count: basketball.length },
    { name: "Card", link: "/categories/card", icon: "🃏", count: card.length },
    { name: "Horror", link: "/categories/zombie", icon: "💀", count: horror.length }
  ];

  const bannerSlides = [
    {
      background: "/images/8JJ-GAMES1.webp",
      badge: translate("heroBannerIncredible", lang),
      titleHighlight: translate("playFreeNow", lang),
      title: translate("freeOnlineGames", lang),
      cta: translate("playNow", lang),
      link: "/categories/adventure",
    },
    {
      background: "/images/8JJ-GAMES2-1.webp",
      badge: translate("halloweenGamesBadge", lang),
      titleHighlight: translate("halloween", lang).toUpperCase(),
      title: translate("unlimitedFreeHalloweenGames", lang),
      cta: translate("playNow", lang),
      link: "/categories/halloween",
    },
    {
      background: "/images/8JJ-GAMES3.webp",
      badge: translate("cardGamesBadge", lang),
      titleHighlight: translate("card", lang).toUpperCase(),
      title: translate("freeCardGames", lang),
      cta: translate("playNow", lang),
      link: "/categories/card",
    },
    {
      background: "/images/8JJ-GAMES4.webp",
      badge: translate("christmasGamesBadge", lang),
      titleHighlight: translate("christmas", lang).toUpperCase(),
      title: translate("freeChristmasGames", lang),
      cta: translate("playNow", lang),
      link: "/categories/christmas",
    },
    {
      background: "/images/8JJ-GAMES5.webp",
      badge: translate("horrorGamesBadge", lang),
      titleHighlight: translate("horror", lang).toUpperCase(),
      title: translate("freeHorrorGames", lang),
      cta: translate("playNow", lang),
      link: "/categories/zombie",
    },
    {
      background: "/images/8JJ-GAMES6.webp",
      badge: translate("simulatorGamesBadge", lang),
      titleHighlight: translate("simulation", lang).toUpperCase(),
      title: translate("freeSimulatorGames", lang),
      cta: translate("playNow", lang),
      link: "/categories/simulator",
    },
    {
      background: "/images/8JJ-GAMES7.webp",
      badge: translate("drivingGamesBadge", lang),
      titleHighlight: translate("driving", lang).toUpperCase(),
      title: translate("freeDrivingGames", lang),
      cta: translate("playNow", lang),
      link: "/categories/driving",
    }
  ];

  return (
    <>
      {/*  SEO: Enhanced Meta Tags */}
      <SEO
        title="Play Free Online Games | No Download Required"
        description="Play thousands of free online games on 8JJ Games. Browse action, puzzle, racing, sports games and more. No download, no registration - play instantly in your browser!"
        keywords={generateKeywords('pages', 'home')}
        image="https://8jjgames.com/images/8JJ-GAMES1.jpg"
        url="/"
        type="website"
      />

      {/*  SEO: Main wrapper with semantic HTML */}
      <main className="home-wrapper" role="main">
        {showCountryModal && (
          <CountrySelectModal
            onSaved={async () => {
              localStorage.setItem("countryCompleted", "true");
              setCountryCompleted(true);
              setShowCountryModal(false);
              await refreshProfile();
            }}
            onClose={() => {
              setShowCountryModal(false);
            }}
          />
        )}

        {/*  SEO: ONE H1 tag for homepage */}
        <h1 className="sr-only">
          Play Free Online Games - 8JJ Games | No Download, No Registration
        </h1>

        {/*  SEO: Value Proposition Section */}
        <section className="value-proposition" aria-labelledby="value-prop-heading">
          <div className="sr-only">
            <h2 id="value-prop-heading">Why Choose 8JJ Games</h2>
            <p>
              Welcome to 8JJ Games, your ultimate destination for free online gaming!
              Discover thousands of games across all genres - from action-packed adventures
              to brain-teasing puzzles, thrilling racing games to strategic challenges.
              Play instantly in your browser with no downloads, no registration, and no hassle.
              Whether you're on desktop, tablet, or mobile, enjoy seamless gaming experiences
              anytime, anywhere. Join millions of players and start your gaming adventure today!
            </p>
            <p>
              <strong>Featured Categories:</strong> Browse our extensive collection including {' '}
              {topCategories.map((cat, index) => (
                <span key={cat.name}>
                  <Link to={cat.link}>{cat.name} games ({cat.count}+)</Link>
                  {index < topCategories.length - 1 ? ', ' : '.'}
                </span>
              ))}
            </p>
          </div>
        </section>

        {/*  SEO: Recent Games Section */}
        <RecentSection
          id="recentSection"
          lang={lang}
          translate={translate}
        />

        {/* ==================== HERO BANNER ==================== */}
    
        <UniversalBanner
          placementKey="home_hero"
          fallbackComponent={<HeroBanner slides={bannerSlides} />}
        />

        {/* SEO: Featured Games Section */}
        <GameSection
          id="featuredSection"
          title={
            <>
              <img src={HOME_ICONS.featured} className="section-icon" alt="" />
              {translate("featuredGames", lang)}
            </>
          }
          titleText={translate("featuredGames", lang)}
          games={featured}
          slider
          categoryId="featuredSection"
        />

        {/* ==================== HOT GAMES SECTION ==================== */}
        <HotSection
          id="hotGames"
          games={hot}
          lang={lang}
          translate={translate}
        />

        {/* SEO: Christmas Games */}
        <GameSection
          id="christmas"
          title={
            <>
              <img src={HOME_ICONS.christmas} className="section-icon" alt="" />
              {translate("christmas", lang)} {translate("games", lang)}
            </>
          }
          titleText={`${translate("christmas", lang)} ${translate("games", lang)}`}
          games={christmas}
          categoryId="christmas"
        />

        {/* SEO: Girls Games */}
        <GameSection
          id="makeup"
          title={
            <>
              <img src={HOME_ICONS.girls} className="section-icon" alt="" />
              {translate("girlsGames", lang)}
            </>
          }
          titleText={translate("girlsGames", lang)}
          games={makeup}
          categoryId="princess"
        />

        {/* SEO: Driving Games */}
        <GameSection
          id="driving"
          title={
            <>
              <img src={HOME_ICONS.driving} className="section-icon" alt="" />
              {translate("driving", lang)}
            </>
          }
          titleText={translate("driving", lang)}
          games={driving}
          categoryId="driving"
        />

        {/* SEO: Popular Games Section */}
        <PopularSection
          id="popularSection"
          lang={lang}
          translate={translate}
        />

        {/* SEO: Action Games */}
        <GameSection
          id="action"
          title={
            <>
              <img src={HOME_ICONS.action} className="section-icon" alt="" />
              {translate("action", lang)}
            </>
          }
          titleText={translate("action", lang)}
          games={action}
          categoryId="action"
        />

        {/* Top Picks Section */}
        <TopPicksSection
          id="top-picks"
          title={
            <>
              <img src={HOME_ICONS.topPicks} className="section-icon" alt="" />
              {translate("topPicks", lang)}
            </>
          }
          titleText={translate("topPicks", lang)}
          games={top}
        />

        {/* SEO: Platformer Games */}
        <GameSection
          id="platformer"
          title={
            <>
              <img src={HOME_ICONS.platformer} className="section-icon" alt="" />
              {translate("platformer", lang)}
            </>
          }
          titleText={translate("platformer", lang)}
          games={platformers}
          categoryId="platformer"
        />

        {/* SEO: Halloween Games */}
        <GameSection
          id="halloween_games"
          title={
            <>
              <img src={HOME_ICONS.halloween} className="section-icon" alt="" />
              {translate("halloween", lang)} {translate("games", lang)}
            </>
          }
          titleText={`${translate("halloween", lang)} ${translate("games", lang)}`}
          games={halloween}
          categoryId="halloween"
        />

        {/* SEO: Card Games */}
        <GameSection
          id="card_games"
          title={
            <>
              <img src={HOME_ICONS.card} className="section-icon" alt="" />
              {translate("card", lang)}
            </>
          }
          titleText={translate("card", lang)}
          games={card}
          categoryId="card"
        />

        {/* SEO: Football Games */}
        <GameSection
          id="football_games"
          title={
            <>
              <img src={HOME_ICONS.football} className="section-icon" alt="" />
              {translate("football", lang)} {translate("games", lang)}
            </>
          }
          titleText={`${translate("football", lang)} ${translate("games", lang)}`}
          games={football}
          categoryId="football"
        />

        {/* SEO: Basketball Games */}
        <GameSection
          id="basketball_games"
          title={
            <>
              <img src={HOME_ICONS.basketball} className="section-icon" alt="" />
              {translate("basketball", lang)} {translate("games", lang)}
            </>
          }
          titleText={`${translate("basketball", lang)} ${translate("games", lang)}`}
          games={basketball}
          categoryId="basketball"
        />

        {/* SEO: Categories Section */}
        <section className="game-section" id="HomeCategories" aria-labelledby="categories-heading">
          <div className="content-anim">
            <div className="HomepageCat" id="categories">
              <div className="mosaic-page">
                <header className="Title-container-sections">
                  <img src={HOME_ICONS.categories} className="section-icon" alt="" />
                  <h2 id="categories-heading">
                    <span className="section-title Title-align">
                      {translate("Categories", lang)}
                    </span>
                  </h2>
                </header>

                <div className="sr-only">
                  <p>
                    Browse our complete game collection by category. Find exactly what you're looking for.
                  </p>
                </div>

                <CategoryGrid limit={12} />

                <nav className="container" aria-label="View all game categories">
                  <button
                    className="btn"
                    onClick={() => navigate("/categories")}
                    aria-label="View all game categories"
                  >
                    <span className="btnInner">
                      {translate("viewMore", lang)}
                    </span>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </section>

        {/* SEO: Simulation Games */}
        <GameSection
          id="simulation_games"
          title={
            <>
              <img src={HOME_ICONS.simulation} className="section-icon" alt="" />
              {translate("simulation", lang)}
            </>
          }
          titleText={translate("simulation", lang)}
          games={simulation}
          categoryId="simulation"
        />

        {/* SEO: Skill Games */}
        <GameSection
          id="skill_games"
          title={
            <>
              <img src={HOME_ICONS.skill} className="section-icon" alt="" />
              {translate("skill", lang)}
            </>
          }
          titleText={translate("skill", lang)}
          games={skill}
          categoryId="skill"
        />

        {/* SEO: Horror Games */}
        <GameSection
          id="horror_games"
          title={
            <>
              <img src={HOME_ICONS.horror} className="section-icon" alt="" />
              {translate("horror", lang)} {translate("games", lang)}
            </>
          }
          titleText={`${translate("horror", lang)} ${translate("games", lang)}`}
          games={horror}
          categoryId="zombie"
        />

        {/* SEO: Endless Runner Games */}
        <GameSection
          id="endless_runner"
          title={
            <>
              <img src={HOME_ICONS.endless} className="section-icon" alt="" />
              {translate("endlessRunner", lang)}
            </>
          }
          titleText={translate("endlessRunner", lang)}
          games={endlessrunner}
          categoryId="endless runner"
        />

        {/* SEO: Puzzle Games */}
        <GameSection
          id="puzzles"
          title={
            <>
              <img src={HOME_ICONS.puzzles} className="section-icon" alt="" />
              {translate("puzzles", lang)}
            </>
          }
          titleText={translate("puzzles", lang)}
          games={puzzles}
          categoryId="puzzles"
        />

        {/*  SEO: FAQ Section (already has schema in FAQ component) */}
        <FAQ />

        {/*  SEO: Additional Content Section for SEO */}
        <section className="homepage-content-seo" aria-labelledby="about-heading">
          <div className="sr-only">
            <h2 id="about-heading">About 8JJ Games</h2>
            <article>
              <h3>Free Online Games for Everyone</h3>
              <p>
                8JJ Games offers the largest collection of free online games playable directly
                in your browser. With over {games.length}+ games across dozens of categories,
                we provide entertainment for players of all ages and skill levels. Our platform
                is completely free - no downloads, no registration, no hidden costs.
              </p>

              <h3>Play Anywhere, Anytime</h3>
              <p>
                All our games are HTML5-based and work seamlessly across desktop, tablet, and
                mobile devices. Whether you're on a PC, Mac, Android, or iOS device, you can
                enjoy uninterrupted gaming experiences. Our responsive design ensures games
                look great and play smoothly on any screen size.
              </p>

              <h3>Top Game Categories</h3>
              <ul>
                <li><strong>Action Games:</strong> Fast-paced adventures, shooting games, and combat challenges</li>
                <li><strong>Puzzle Games:</strong> Brain teasers, logic games, and strategy challenges</li>
                <li><strong>Racing Games:</strong> High-speed car games, driving simulators, and racing competitions</li>
                <li><strong>Sports Games:</strong> Football, basketball, and other athletic competitions</li>
                <li><strong>Card Games:</strong> Solitaire, poker, and classic card game variations</li>
                <li><strong>Horror Games:</strong> Spooky adventures and survival challenges</li>
              </ul>

              <h3>Why Players Choose 8JJ Games</h3>
              <ul>
                <li>✓ 100% Free - No payments, no subscriptions</li>
                <li>✓ No Registration - Start playing immediately</li>
                <li>✓ No Downloads - All games run in your browser</li>
                <li>✓ Safe & Secure - Family-friendly content</li>
                <li>✓ Regular Updates - New games added weekly</li>
                <li>✓ Mobile Friendly - Play on any device</li>
                <li>✓ Fast Loading - Optimized for quick gameplay</li>
              </ul>

              <h3>Featured Game Highlights</h3>
              <p>
                Discover our curated selection of featured games, updated daily based on
                popularity and player ratings. From trending new releases to timeless classics,
                our featured section helps you find the best games quickly. Check out our
                "Hot Games" section for viral sensations and community favorites.
              </p>

              <h3>Start Playing Now</h3>
              <p>
                Browse our categories above, use the search function to find specific games,
                or explore our featured collections. Every game is just one click away -
                no barriers between you and instant entertainment. Join millions of players
                and discover why 8JJ Games is the ultimate free online gaming destination.
              </p>
            </article>
          </div>
        </section>
      </main>
    </>
  );
}