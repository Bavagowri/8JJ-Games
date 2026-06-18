// src/pages/mobile/MobileHome/MobileHome.jsx   ----- 02/03/2026 ----

import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "../../../context/LanguageContext";
import { translate } from "../../../data/translations";
import MobileHeader from "../../../components/mobile/MobileHeader/MobileHeader";
import MobileBottomNav from "../../../components/mobile/MobileBottomNav/MobileBottomNav";
import MobileGameSection from "../../../components/mobile/MobileGameSection/MobileGameSection";
import MobileCategoryGrid from "../../../components/mobile/MobileCategoryGrid/MobileCategoryGrid";
import MobileGameSectionV2 from "../../../components/mobile/MobileGameSectionV2/MobileGameSectionV2";
import MobileGameSectionV3 from "../../../components/mobile/MobileGameSectionV3/MobileGameSectionV3";
import MobileGameSectionScroll from "../../../components/mobile/MobileGameSectionScroll/MobileGameSectionScroll";
import MobileFeaturedGameSection from "../../../components/mobile/MobileFeaturedGameSection/MobileFeaturedGameSection";
import MobileGameSwiperSection from "../../../components/mobile/MobileGameSwiperSection/MobileGameSwiperSection";
import MobileRecentSection from "../../../components/mobile/MobileRecentSection/MobileRecentSection";
import MobilePopularSection from "../../../components/mobile/MobilePopularSection/MobilePopularSection";
import MobileFAQ from "../../../components/mobile/MobileFAQ/MobileFAQ";
import MobilePreloader from "../../../components/mobile/MobilePreloader/MobilePreloader";
import MobileHeroBanner from "../../../components/mobile/MobileHeroBanner/MobileHeroBanner";
import SEO from "../../../components/SEO/SEO";
import { generateKeywords } from "../../../config/seoKeywords";
import UniversalBanner from "../../../components/UniversalBanner/UniversalBanner";
import "./MobileHome.css";

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


export default function MobileHome({ games = [], loading = false }) {
  const { lang } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // console.log("📱 Mobile Home Loaded - Games:", games.length);
  }, [games]);

  
  const bannerSlides = useMemo(() => [
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
    },
  ], [lang]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const filteredGames = useMemo(() => {
    if (!searchQuery.trim()) return games;
    const query = searchQuery.toLowerCase().trim();
    return games.filter(game =>
      game.title?.toLowerCase().includes(query) ||
      game.description?.toLowerCase().includes(query) ||
      game.category?.toLowerCase().includes(query) ||
      game.tagList?.some(tag => tag.toLowerCase().includes(query))
    );
  }, [games, searchQuery]);

  const [sections, setSections] = useState({
    hot: [], featured: [], topPicks: [], popular: [],
    basketball: [], action: [], puzzles: [], driving: [],
    halloween: [], card: [], simulation: [], skill: [],
    football: [], horror: [], platformer: [], christmas: [], princess: [],
  });

  useEffect(() => {
    const loadSections = async () => {
      const API = import.meta.env.VITE_API_URL;

      // V2 PERF FIX: Single /home-bundle request instead of 17 individual calls.
      // Falls back to individual calls automatically if bundle isn't deployed.

      try {
        // ── Primary: single bundle request ──────────────────────────────
        const res = await fetch(`${API}/api/games/home-bundle`);
        const json = await res.json();

        if (json.success && json.data) {
          setSections({
            hot:        json.data.hot        || [],
            featured:   json.data.featured   || [],
            topPicks:   json.data.topPicks   || [],
            popular:    json.data.popular    || [],
            basketball: json.data.basketball || [],
            action:     json.data.action     || [],
            puzzles:    json.data.puzzles    || [],
            driving:    json.data.driving    || [],
            halloween:  json.data.halloween  || [],
            card:       json.data.card       || [],
            simulation: json.data.simulation || [],
            skill:      json.data.skill      || [],
            football:   json.data.football   || [],
            horror:     json.data.horror     || [],
            platformer: json.data.platformer || [],
            christmas:  json.data.christmas  || [],
            princess:   json.data.princess   || [],
          });
          return; //  success — skip fallback
        }

        throw new Error("Bundle returned success: false");

      } catch (bundleErr) {
        // ── Fallback: original 17 individual calls ───────────────────────
        console.warn("Home bundle failed, falling back to individual calls:", bundleErr.message);

        try {
          const [
            hot, featured, topPicks, popular,
            basketball, action, puzzles, driving,
            halloween, card, simulation, skill,
            football, horror, platformer, christmas, princess
          ] = await Promise.all([
            fetch(`${API}/api/games/hot`).then(r => r.json()),
            fetch(`${API}/api/games/featured`).then(r => r.json()),
            fetch(`${API}/api/games/top-picks`).then(r => r.json()),
            fetch(`${API}/api/games/popular`).then(r => r.json()),
            fetch(`${API}/api/games/tag/basketball`).then(r => r.json()),
            fetch(`${API}/api/games/tag/action`).then(r => r.json()),
            fetch(`${API}/api/games/category/puzzles`).then(r => r.json()),
            fetch(`${API}/api/games/tag/driving`).then(r => r.json()),     // V1: tag/driving (not category)
            fetch(`${API}/api/games/tag/halloween`).then(r => r.json()),
            fetch(`${API}/api/games/tag/card`).then(r => r.json()),
            fetch(`${API}/api/games/tag/simulation`).then(r => r.json()),
            fetch(`${API}/api/games/tag/skill`).then(r => r.json()),
            fetch(`${API}/api/games/tag/football`).then(r => r.json()),
            fetch(`${API}/api/games/tag/zombie`).then(r => r.json()),
            fetch(`${API}/api/games/tag/platformer`).then(r => r.json()),
            fetch(`${API}/api/games/tag/christmas`).then(r => r.json()),
            fetch(`${API}/api/games/tag/princess`).then(r => r.json()),    // V1: tag/princess (not category)
          ]);

          setSections({
            hot:        hot.data        || [],
            featured:   featured.data   || [],
            topPicks:   topPicks.data   || [],
            popular:    popular.data    || [],
            basketball: basketball.data || [],
            action:     action.data     || [],
            puzzles:    puzzles.data    || [],
            driving:    driving.data    || [],
            halloween:  halloween.data  || [],
            card:       card.data       || [],
            simulation: simulation.data || [],
            skill:      skill.data      || [],
            football:   football.data   || [],
            horror:     horror.data     || [],
            platformer: platformer.data || [],
            christmas:  christmas.data  || [],
            princess:   princess.data   || [],
          });
        } catch (fallbackErr) {
          console.error("Mobile home fallback load also failed:", fallbackErr);
        }
      }
    };

    loadSections();
  }, []);

  
  // Skeleton 
  // if (loading) {
  //   return (
  //     <div className="mobile-home-wrapper">
  //       <MobileHeader onSearch={handleSearch} />
  //       <div className="mobile-contentz">
  //         <div
  //           className="mobile-skeleton-swiper"
  //           style={{
  //             height: '280px', margin: '16px', borderRadius: '12px',
  //             background: 'rgba(255,255,255,0.1)', animation: 'pulse 1.5s infinite',
  //           }}
  //         />
  //         {[1, 2, 3].map(i => (
  //           <div key={i} className="mobile-skeleton-section"
  //             style={{
  //               height: '160px', margin: '16px', borderRadius: '8px',
  //               background: 'rgba(255,255,255,0.07)', animation: 'pulse 1.5s infinite',
  //             }}
  //           />
  //         ))}
  //       </div>
  //       <MobileBottomNav />
  //     </div>
  //   );
  // }
  if (loading) {
    return <MobilePreloader />;
  }

  const isSearching = searchQuery.trim() !== "";

  return (
    <>
      <SEO
        title="Play Free Online Games on Mobile | 8JJ Games"
        description={`Play ${games.length}+ free mobile games instantly! Action, puzzle, racing, sports and more. No download required - play directly in your mobile browser.`}
        keywords={generateKeywords('pages', 'home')}
        image="https://8jjgames.com/images/8JJ-GAMES1.jpg"
        url="/"
        type="website"
      />

      <div className="mobile-home-wrapper">
        <MobileHeader onSearch={handleSearch} />

        <div className="mobile-contentz">

          {isSearching ? (
            <>
              <div style={{ padding: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', margin: '16px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px', color: '#fff' }}>
                  {translate("searchResults", lang) || "Search Results"}
                </h2>
                <p style={{ fontSize: '14px', opacity: 0.7, color: '#fff' }}>
                  {filteredGames.length} {translate("gamesFound", lang) || "games found"} for "{searchQuery}"
                </p>
              </div>

              {filteredGames.length > 0 ? (
                <MobileGameSectionScroll
                  title={<><img src={HOME_ICONS.games} className="mobile-home-section-icon" alt="" />{translate("searchResults", lang) || "Search Results"}</>}
                  titleText={translate("searchResults", lang) || "Search Results"}
                  games={filteredGames}
                  categoryId="search-results"
                />
              ) : (
                <div style={{ padding: '40px 16px', textAlign: 'center', color: '#fff' }}>
                  <p style={{ fontSize: '16px', opacity: 0.7 }}>{translate("noGamesFound", lang) || "No games found"}</p>
                  <p style={{ fontSize: '14px', opacity: 0.5, marginTop: '8px' }}>{translate("tryDifferentSearch", lang) || "Try a different search term"}</p>
                </div>
              )}
            </>
          ) : (
            <>
              {/* Recently Played Games */}
              <MobileRecentSection id="recent" lang={lang} translate={translate} />

              {/* ── Hero Banner — CMS-driven, falls back to MobileHeroBanner ── */}
              <UniversalBanner
                placementKey="home_hero"
                className="mobile-banner-hero"
                fallbackComponent={<MobileHeroBanner slides={bannerSlides} />}
              />

              {/* ── Hot Section ── */}
              <MobileGameSwiperSection
                title={<><img src={HOME_ICONS.hot} className="mobile-home-section-icon" alt="" />{translate("hotGames", lang)}</>}
                titleText={translate("hotGames", lang)}
                games={sections.hot}
                categoryId="hotGames"
                isHot
              />

              {/* Basketball Games */}
              <MobileGameSectionScroll
                title={<><img src={HOME_ICONS.basketball} className="mobile-home-section-icon" alt="" />{translate("basketball", lang)}</>}
                titleText={translate("basketball", lang)}
                games={sections.basketball}
                categoryId="basketball"
                isTag
              />

              {/* Action Games */}
              <MobileGameSectionScroll
                title={<><img src={HOME_ICONS.action} className="mobile-home-section-icon" alt="" />{translate("action", lang)}</>}
                titleText={translate("action", lang)}
                games={sections.action}
                categoryId="action"
                isTag
              />

              {/* ── Top Picks ── */}
              <MobileFeaturedGameSection
                title={<><img src={HOME_ICONS.topPicks} className="mobile-home-section-icon" alt="" />{translate("topPicks", lang)}</>}
                titleText={translate("topPicks", lang)}
                games={sections.featured}
                categoryId="featuredSection"
              />

              {/* Platformer Games */}
              <MobileGameSectionV2
                title={<><img src={HOME_ICONS.platformer} className="mobile-home-section-icon" alt="" />{translate("platformer", lang)}</>}
                titleText={translate("platformer", lang)}
                games={sections.platformer}
                categoryId="platformer"
              />

              {/* Popular Games */}
              <MobilePopularSection
                title={<><img src={HOME_ICONS.popular} className="mobile-home-section-icon" alt="" />{translate("popular", lang)}</>}
                id="popular-mobile"
              />

              {/* Christmas Games */}
              <MobileGameSectionV2
                title={<><img src={HOME_ICONS.christmas} className="mobile-home-section-icon" alt="" />{translate("christmas", lang)}</>}
                titleText={translate("christmas", lang)}
                games={sections.christmas}
                categoryId="christmas"
              />

              {/* Football Games */}
              <MobileGameSectionScroll
                title={<><img src={HOME_ICONS.football} className="mobile-home-section-icon" alt="" />{translate("football", lang)}</>}
                titleText={translate("football", lang)}
                games={sections.football}
                categoryId="football"
              />

              {/* Girls Games */}
              <MobileGameSectionScroll
                title={<><img src={HOME_ICONS.girls} className="mobile-home-section-icon" alt="" />{translate("girlsGames", lang)}</>}
                titleText={translate("girlsGames", lang)}
                games={sections.princess}
                categoryId="princess"
                isTag
              />

              {/* Categories */}
              <MobileCategoryGrid />

              {/* ── Featured Carousel ── */}
              <MobileFeaturedGameSection
                title={<><img src={HOME_ICONS.featured} className="mobile-home-section-icon" alt="" />{translate("featuredGames", lang)}</>}
                titleText={translate("featuredGames", lang)}
                games={sections.featured}
                categoryId="featuredSection"
              />

              {/* Driving Games */}
              <MobileGameSectionScroll
                title={<><img src={HOME_ICONS.driving} className="mobile-home-section-icon" alt="" />{translate("driving", lang)}</>}
                titleText={translate("driving", lang)}
                games={sections.driving}
                categoryId="driving"
              />

              {/* Halloween Games */}
              <MobileGameSectionScroll
                title={<><img src={HOME_ICONS.halloween} className="mobile-home-section-icon" alt="" />{translate("halloween", lang)}</>}
                titleText={translate("halloween", lang)}
                games={sections.halloween}
                categoryId="halloween"
              />

              {/* Card Games */}
              <MobileGameSectionScroll
                title={<><img src={HOME_ICONS.card} className="mobile-home-section-icon" alt="" />{translate("card", lang)}</>}
                titleText={translate("card", lang)}
                games={sections.card}
                categoryId="card"
              />

              {/* Simulation Games */}
              <MobileGameSectionScroll
                title={<><img src={HOME_ICONS.simulation} className="mobile-home-section-icon" alt="" />{translate("simulation", lang)}</>}
                titleText={translate("simulation", lang)}
                games={sections.simulation}
                categoryId="simulation"
              />

              {/* Skill Games */}
              <MobileGameSectionScroll
                title={<><img src={HOME_ICONS.skill} className="mobile-home-section-icon" alt="" />{translate("skill", lang)}</>}
                titleText={translate("skill", lang)}
                games={sections.skill}
                categoryId="skill"
              />

              {/* Horror Games */}
              <MobileGameSectionScroll
                title={<><img src={HOME_ICONS.horror} className="mobile-home-section-icon" alt="" />{translate("horror", lang)}</>}
                titleText={translate("horror", lang)}
                games={sections.horror}
                categoryId="zombie"
              />

              {/* Puzzle Games */}
              <MobileGameSectionScroll
                title={<><img src={HOME_ICONS.puzzles} className="mobile-home-section-icon" alt="" />{translate("puzzles", lang)}</>}
                titleText={translate("puzzles", lang)}
                games={sections.puzzles}
                categoryId="puzzles"
              />

              {/* FAQ Section */}
              <MobileFAQ />
            </>
          )}

          <div className="mobile-footer-space" />
        </div>

        <MobileBottomNav />
      </div>
    </>
  );
}