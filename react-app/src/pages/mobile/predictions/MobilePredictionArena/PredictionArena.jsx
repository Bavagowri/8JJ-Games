// PredictionArena.jsx — main mobile Predictions hub
// react-app/src/pages/mobile/predictions/MobilePredictionArena/PredictionArena.jsx
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { matchesAPI }  from "../../../../api/matches.api";
import { predictionAPI } from "../../../../api/prediction.api";
import { matchesPreviewAPI } from "../../../../api/liveScores.api";
import { useAuth }     from "../../../../context/AuthContext";
import MobileBottomNav from "../../../../components/mobile/MobileBottomNav/MobileBottomNav";
import { TeamLogo, fmt } from "../MobilePredictionShared";
import PredictionFilterBar from "../../../../components/predictions/PredictionFilterBar/PredictionFilterBar";
import "./PredictionArena.css";

import { useLanguage } from "../../../../context/LanguageContext";
import { translate }   from "../../../../data/translations";
import PromoPopup      from "../../../../components/PromoPopup/PromoPopup";
import MatchPreviewSection from "../../../../components/predictions/MatchPreviewSection";

// ── SEO ──────────────────────────────────────────────────────────────────────
import SEO from "../../../../components/SEO/SEO";
import { generateKeywords } from "../../../../config/seoKeywords";

// ════════════════════════════════════════════════════════════
// HERO
// ════════════════════════════════════════════════════════════
function Hero({ openCount }) {
  const { lang } = useLanguage();
  return (
    <div className="pa-hero" aria-label="Prediction Arena hero banner">
      <div className="pa-hero-bg" aria-hidden="true" />
      <div className="pa-hero-content">
        <div className="pa-live-pill" aria-hidden="true">
          <span className="pa-live-dot" />
        </div>
        <h1 className="pa-hero-title">
          {translate("ph_cricket", lang)}<br />
          <span>{translate("ph_prediction_arena", lang)}</span>
        </h1>
        <p className="pa-hero-sub">{translate("ph_predict_desc", lang)}</p>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// FEATURED CARD
// ════════════════════════════════════════════════════════════
function FeaturedCard({ match, onRequireAuth }) {
  const { lang } = useLanguage();
  const navigate = useNavigate();

  if (!match) return null;
  const locked = match.prediction_open === 0 || match.prediction_open === "0";

  const handleCTA = (e) => {
    e.preventDefault();
    if (!localStorage.getItem("token")) { onRequireAuth(); return; }
    navigate(`/predictions/${match.id}`);
  };

  return (
    <div className="pa-featured-shell">
      <article
        className="pa-featured"
        itemScope
        itemType="https://schema.org/SportsEvent"
        aria-label={`Featured match: ${match.team_a} vs ${match.team_b}`}
      >
        <meta itemProp="name"    content={match.title || `${match.team_a} vs ${match.team_b}`} />
        <meta itemProp="url"     content={`https://8jjgames.com/predictions/${match.id}`} />
        <meta itemProp="sport"   content="Cricket" />
        {match.starting_at && <meta itemProp="startDate" content={match.starting_at} />}

        <div className="pa-featured-label" aria-hidden="true">⚡ {translate("pa_featured_match", lang)}</div>
        <div className="pa-featured-tournament">{match.tournament || translate("pc_cricket", lang)}</div>

        <div className="pa-featured-teams">
          <div
            className="pa-featured-team"
            itemProp="competitor"
            itemScope
            itemType="https://schema.org/SportsTeam"
          >
            <TeamLogo name={match.team_a} logo={match.team_a_logo} size={58} />
            <span itemProp="name">{match.team_a}</span>
          </div>

          <div className="pa-featured-vs" aria-hidden="true">VS</div>

          <div
            className="pa-featured-team"
            itemProp="competitor"
            itemScope
            itemType="https://schema.org/SportsTeam"
          >
            <TeamLogo name={match.team_b} logo={match.team_b_logo} size={58} />
            <span itemProp="name">{match.team_b}</span>
          </div>
        </div>

        <div className="pa-featured-meta">
          <time dateTime={match.starting_at} itemProp="startDate">
            🗓 {fmt(match.starting_at)}
          </time>
          {match.stake_cost > 0
            ? <span className="pa-cost" aria-label={`${match.stake_cost} points entry`}>⚡ {match.stake_cost} pts</span>
            : <span className="pa-free">{translate("pc_free", lang)}</span>}
        </div>

        {locked
          ? <span className="pa-cta-locked" role="status">🔒 {translate("pc_prediction_closed", lang)}</span>
          : <button
              className="pa-cta-btn"
              onClick={handleCTA}
              aria-label={`Predict ${match.team_a} vs ${match.team_b}`}
            >
              {translate("pm_predict_now", lang)} →
            </button>
        }
      </article>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// MATCH CARD
// ════════════════════════════════════════════════════════════
function MatchCard({ match, onRequireAuth }) {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const locked = match.prediction_open === 0 || match.prediction_open === "0";
  const isLive = match.match_state === "live";
  const isDone = match.status === "completed";

  const handleNav = (e) => {
    e.preventDefault();
    if (!localStorage.getItem("token")) { onRequireAuth(); return; }
    navigate(`/predictions/${match.id}`);
  };

  return (
    <div
      className={`pa-match-shell${isLive ? " is-live" : ""}${match.is_featured ? " is-featured" : ""}`}
      itemScope
      itemType="https://schema.org/SportsEvent"
    >
      <div className="pa-match-card">
        <meta itemProp="name"  content={match.title || `${match.team_a} vs ${match.team_b}`} />
        <meta itemProp="url"   content={`https://8jjgames.com/predictions/${match.id}`} />
        <meta itemProp="sport" content="Cricket" />
        {match.starting_at && <meta itemProp="startDate" content={match.starting_at} />}

        <div className="pa-match-top">
          <span className="pa-match-tourney">{match.tournament || translate("pc_cricket", lang)}</span>
          {isLive  && <span className="pa-badge-live"  role="status">● {translate("pc_status_live", lang)}</span>}
          {!isLive && !isDone && !locked && <span className="pa-badge-open" role="status">● {translate("pm_status_open", lang)}</span>}
          {locked  && !isDone && <span className="pa-badge-locked" aria-label="Predictions locked">🔒</span>}
          {isDone  && <span className="pa-badge-done"  role="status">✓ {translate("pc_status_completed", lang)}</span>}
        </div>

        <div className="pa-match-teams">
          <div
            className="pa-match-team"
            itemProp="competitor"
            itemScope
            itemType="https://schema.org/SportsTeam"
          >
            <TeamLogo name={match.team_a} logo={match.team_a_logo} />
            <span className="pa-match-name" itemProp="name">{match.team_a}</span>
          </div>

          <div className="pa-match-divider" aria-hidden="true"><span>VS</span></div>

          <div
            className="pa-match-team"
            itemProp="competitor"
            itemScope
            itemType="https://schema.org/SportsTeam"
          >
            <TeamLogo name={match.team_b} logo={match.team_b_logo} />
            <span className="pa-match-name" itemProp="name">{match.team_b}</span>
          </div>
        </div>

        {isDone && match.winner && (
          <div
            className="pa-match-winner"
            itemProp="winner"
            itemScope
            itemType="https://schema.org/SportsTeam"
          >
            🏆 {translate("pc_winner", lang)}: <span itemProp="name">{match.winner}</span>
          </div>
        )}

        <div className="pa-match-footer">
          <time className="pa-match-time" dateTime={match.starting_at} itemProp="startDate">
            🗓 {fmt(match.starting_at)}
          </time>
          {match.stake_cost > 0
            ? <span className="pa-cost" aria-label={`${match.stake_cost} points entry`}>⚡ {match.stake_cost} pts</span>
            : <span className="pa-free">{translate("pc_free", lang)}</span>}
        </div>

        {!locked && !isDone
          ? <button
              className="pa-match-btn"
              onClick={handleNav}
              aria-label={`${match.user_prediction ? "View your prediction for" : "Predict"} ${match.team_a} vs ${match.team_b}`}
            >
              {match.user_prediction
                ? translate("pa_view_prediction", lang)
                : translate("pm_predict_now", lang)}
            </button>
          : <button
              className="pa-match-btn pa-match-btn-ghost"
              onClick={handleNav}
              aria-label={`View details for ${match.team_a} vs ${match.team_b}`}
            >
              {translate("pm_view_details", lang)}
            </button>
        }
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// MAIN PAGE
// ════════════════════════════════════════════════════════════
const TABS = [
  { key: "matches",     icon: "🏏", labelKey: "pa_tab_matches",     to: null                       },
  { key: "leaderboard", icon: "🏆", labelKey: "pa_tab_leaderboard", to: "/predictions/leaderboard" },
];

const FILTER_KEYS = [
  { key: "preview", labelKey: "pa_filter_preview" },
  { key: "live", labelKey: "pa_filter_live" },
  { key: "done", labelKey: "pa_filter_done" },
  { key: "all", labelKey: "pa_filter_all" },
];

export default function PredictionArena() {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("preview");
  const [popupKey,   setPopupKey]   = useState(0);
  const [showPopup,  setShowPopup]  = useState(false);

  // ── Secondary filters ─────────────────────────────────────────────
  const [searchQuery,      setSearchQuery]      = useState("");
  const [tournamentFilter, setTournamentFilter] = useState("all");
  const [notPredictedOnly, setNotPredictedOnly] = useState(false);
  const [myPicksFilter,    setMyPicksFilter]    = useState("all");
  const [predictedMatchIds, setPredictedMatchIds] = useState(new Set());
  const [myPredictionsMap,  setMyPredictionsMap]  = useState({});

  const isLoggedIn = !!localStorage.getItem("token");

  // ── Preview data ─────────────────────────────────────────
  const [previewLive, setPreviewLive]               = useState([]);
  const [upcomingData, setUpcomingData]             = useState([]);
  const [upcomingPagination, setUpcomingPagination] = useState({});
  const [upcomingPage, setUpcomingPage]             = useState(1);
  const [recentData, setRecentData]                 = useState([]);
  const [recentPagination, setRecentPagination]     = useState({});
  const [recentPage, setRecentPage]                 = useState(1);

  const openRegisterPopup = () => {
    setPopupKey((k) => k + 1);
    setShowPopup(true);
  };

  const loadPreviewLive = async () => {
    try {
      const res = await matchesPreviewAPI.getMatchPreview(1, 1);
      setPreviewLive(res.live);
    } catch (err) { console.error("Failed to load live preview:", err); }
  };

  const loadUpcoming = async (pageNum = 1) => {
    try {
      const res = await matchesPreviewAPI.getMatchPreview(pageNum, 8);
      setUpcomingData(res.upcoming);
      setUpcomingPagination(res.upcomingPagination);
      setUpcomingPage(pageNum);
    } catch (err) { console.error("Failed to load upcoming:", err); }
  };

  const loadRecent = async (pageNum = 1) => {
    try {
      const res = await matchesPreviewAPI.getMatchPreview(pageNum, 8);
      setRecentData(res.recent);
      setRecentPagination(res.recentPagination);
      setRecentPage(pageNum);
    } catch (err) { console.error("Failed to load recent:", err); }
  };

  useEffect(() => {
    matchesAPI.getMatches()
      .then(d => setMatches(d.matches || []))
      .catch(console.error)
      .finally(() => setLoading(false));

    loadPreviewLive();
    loadUpcoming(1);
    loadRecent(1);

    // Load user's predicted match IDs for "Not Predicted Yet" filter
    if (isLoggedIn) {
      predictionAPI.getMyPredictions()
        .then((data) => {
          const ids = new Set((data.predictions || []).map((p) => p.match_id));
          setPredictedMatchIds(ids);
          const map = {};
          (data.predictions || []).forEach((p) => {
            map[p.match_id] = p.predicted_option;
          });
          setMyPredictionsMap(map);
        })
        .catch(() => {});
    }
  }, []);

  // ── JSON-LD Schema ──────────────────────────────────────────────────────
  useEffect(() => {
    if (loading || matches.length === 0) return;

    const upcomingMatches = matches.filter((m) => m.status === "upcoming");

    const webPageSchema = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Prediction Arena - Cricket Match Predictions | 8JJ Games",
      "description":
        "Predict cricket match winners, earn points and climb the leaderboard on 8JJ Games. Free entry cricket predictions with real rewards.",
      "url": "https://8jjgames.com/predictions",
      "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home",             "item": "https://8jjgames.com" },
          { "@type": "ListItem", "position": 2, "name": "Prediction Arena", "item": "https://8jjgames.com/predictions" },
        ],
      },
    };

    const itemListSchema = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "Upcoming Cricket Match Predictions",
      "description": `${upcomingMatches.length} upcoming matches available to predict on 8JJ Games`,
      "url": "https://8jjgames.com/predictions",
      "numberOfItems": upcomingMatches.length,
      "itemListElement": upcomingMatches.slice(0, 10).map((match, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "SportsEvent",
          "name": match.title || `${match.team_a} vs ${match.team_b}`,
          "url":  `https://8jjgames.com/predictions/${match.id}`,
          "startDate": match.starting_at,
          "sport": "Cricket",
        },
      })),
    };

    const gameSchema = {
      "@context": "https://schema.org",
      "@type": "Game",
      "name": "Cricket Prediction Arena",
      "description":
        "Predict cricket match outcomes, earn points and compete on the leaderboard. Free to play prediction game on 8JJ Games.",
      "url": "https://8jjgames.com/predictions",
      "genre": "Sports Prediction",
      "gamePlatform": "Web Browser",
      "publisher": { "@type": "Organization", "name": "8JJ Games", "url": "https://8jjgames.com" },
    };

    const eventSchemas = upcomingMatches.slice(0, 5).map((match) => ({
      "@context": "https://schema.org",
      "@type": "SportsEvent",
      "name": match.title || `${match.team_a} vs ${match.team_b}`,
      "startDate": match.starting_at,
      "sport": "Cricket",
      "competitor": [
        { "@type": "SportsTeam", "name": match.team_a },
        { "@type": "SportsTeam", "name": match.team_b },
      ],
      "organizer": { "@type": "Organization", "name": match.tournament || "Cricket Tournament" },
    }));

    const existing = document.getElementById("pa-schema");
    if (existing) document.head.removeChild(existing);

    const s = document.createElement("script");
    s.type = "application/ld+json";
    s.id   = "pa-schema";
    s.text = JSON.stringify([webPageSchema, itemListSchema, gameSchema, ...eventSchemas]);
    document.head.appendChild(s);

    return () => {
      const el = document.getElementById("pa-schema");
      if (el) document.head.removeChild(el);
    };
  }, [matches, loading]);

  const featured  = matches.find(m => m.is_featured === 1) || matches.find(m => m.status === "upcoming") || null;
  const openCount = matches.filter(m => m.status === "upcoming").length;
  const getMatchStatus = (m) => {
    if (m.winner) return "done";
    if (m.prediction_open === 1 || m.prediction_open === "1") return "live";
    return "closed";
  };

  const filtered = (() => {
    switch (filter) {
      case "preview":
        return [];

      case "live":
        return matches.filter((m) => getMatchStatus(m) === "live");

      case "done":
        return matches.filter((m) => getMatchStatus(m) === "done");

      case "all":
      default: {
        const ORDER = { live: 0, closed: 1, done: 2 };
        return [...matches].sort(
          (a, b) => (ORDER[getMatchStatus(a)] ?? 1) - (ORDER[getMatchStatus(b)] ?? 1)
        );
      }
    }
  })();

  // ── Secondary filter application ──────────────────────────────────
  const displayedMatches = useMemo(() => {
    let list = filtered;

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(
        (m) =>
          m.team_a?.toLowerCase().includes(q) ||
          m.team_b?.toLowerCase().includes(q) ||
          m.tournament?.toLowerCase().includes(q)
      );
    }

    if (tournamentFilter !== "all") {
      list = list.filter((m) => m.tournament === tournamentFilter);
    }

    if (notPredictedOnly && isLoggedIn && (filter === "live" || filter === "all")) {
      list = list.filter((m) => !predictedMatchIds.has(m.id) && m.prediction_open === 1);
    }

    if (myPicksFilter !== "all" && isLoggedIn && filter === "finished") {
      list = list.filter((m) => {
        const userPick = m.user_prediction ?? myPredictionsMap[m.id];
        if (myPicksFilter === "skipped") return !userPick;
        if (!userPick) return false;
        const won = userPick === m.winner;
        if (myPicksFilter === "won")  return won;
        if (myPicksFilter === "lost") return !won;
        return true;
      });
    }

    return list;
  }, [filtered, searchQuery, tournamentFilter, notPredictedOnly, predictedMatchIds, myPicksFilter, myPredictionsMap, isLoggedIn, filter]);

  const allTournaments = useMemo(() => {
    const names = matches
      .map((m) => m.tournament)
      .filter(Boolean)
      .filter((t) => t !== "Cricket Match");
    return [...new Set(names)].sort();
  }, [matches]);

  // Reset secondary filters on main tab change
  const handleFilterChange = (key) => {
    setFilter(key);
    setSearchQuery("");
    setTournamentFilter("all");
    setNotPredictedOnly(false);
    setMyPicksFilter("all");
  };

  const handleTabClick = (tab) => { if (tab.to) navigate(tab.to); };

  return (
    <>
      {/* ── SEO Meta Tags ── */}
      <SEO
        title="Prediction Arena - Cricket Match Predictions | 8JJ Games"
        description={`Predict cricket match winners and earn points on 8JJ Games. ${openCount} upcoming matches open for predictions. Free entry, real rewards!`}
        keywords={generateKeywords("pages", "predictions")}
        url="/predictions"
        type="website"
      />

      <div className="pa-page">
        {showPopup && (
          <PromoPopup
            key={popupKey}
            image="/images/register-refer.png"
            title={translate("promo_popup_register_title", lang)}
            description={translate("promo_popup_register_description", lang)}
            buttonText={translate("promo_popup_register_button", lang)}
            buttonLink="/register"
            onClose={() => setShowPopup(false)}
          />
        )}

        <Hero openCount={openCount} />

        {/* Tab bar */}
        <nav className="pa-tabs" aria-label="Prediction sections">
          {TABS.map(t => (
            <button
              key={t.key}
              className={`pa-tab${t.key === "matches" ? " active" : ""}`}
              aria-current={t.key === "matches" ? "page" : undefined}
              onClick={() => handleTabClick(t)}
            >
              <span className="pa-tab-icon" aria-hidden="true">{t.icon}</span>
              <span>{translate(t.labelKey, lang)}</span>
            </button>
          ))}
        </nav>

        <main className="pa-section">
          <FeaturedCard match={featured} onRequireAuth={openRegisterPopup} />

          {/* Filters */}
          <div className="pa-filters" role="group" aria-label="Filter matches by status">
            {FILTER_KEYS.map(f => (
              <button
                key={f.key}
                className={`pa-filter${filter === f.key ? " active" : ""}`}
                aria-pressed={filter === f.key}
                onClick={() => handleFilterChange(f.key)}
              >
                {translate(f.labelKey, lang)}
              </button>
            ))}
          </div>

          {/* ── Secondary filter bar (live / done / all tabs only) ── */}
          {filter !== "preview" && (
            <PredictionFilterBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              tournamentFilter={tournamentFilter}
              onTournamentChange={setTournamentFilter}
              notPredictedOnly={notPredictedOnly}
              onNotPredictedToggle={() => setNotPredictedOnly((v) => !v)}
              myPicksFilter={myPicksFilter}
              onMyPicksChange={setMyPicksFilter}
              tournaments={allTournaments}
              isLoggedIn={isLoggedIn}
              onRequireAuth={openRegisterPopup}
              activeTab={filter}
              isMobile={true}
            />
          )}

          {/* Match list */}
          {/* Match Preview Section */}
{filter === "preview" && (
  <div className="pa-mobile-preview">
    <MatchPreviewSection
      live={previewLive}
      upcoming={upcomingData}
      upcomingPagination={upcomingPagination}
      upcomingPage={upcomingPage}
      onUpcomingPageChange={loadUpcoming}
      recent={recentData}
      recentPagination={recentPagination}
      recentPage={recentPage}
      onRecentPageChange={loadRecent}
    />
  </div>
)}

{/* Prediction Match list */}
{filter !== "preview" && (
  loading ? (
    <div className="pa-empty" role="status" aria-live="polite">
      <p>{translate("pa_loading_matches", lang)}</p>
    </div>
  ) : displayedMatches.length === 0 ? (
    <div className="pa-empty pfb-mobile-empty" role="status">
      <span className="pfb-empty-icon">
        {searchQuery ? "🔍" : notPredictedOnly ? "✅" : myPicksFilter === "won" ? "🏆" : myPicksFilter === "lost" ? "😔" : myPicksFilter === "skipped" ? "⬜" : "🏏"}
      </span>
      <p className="pfb-empty-title">
        {searchQuery
          ? `No matches for "${searchQuery}"`
          : notPredictedOnly
          ? "All caught up!"
          : myPicksFilter === "won"
          ? "No winning predictions found"
          : myPicksFilter === "lost"
          ? "No losing predictions found"
          : myPicksFilter === "skipped"
          ? "You predicted every completed match!"
          : translate("pa_no_matches", lang)}
      </p>
      <p className="pfb-empty-sub">
        {searchQuery
          ? "Try a different team or tournament name."
          : notPredictedOnly
          ? "You've predicted all open matches."
          : myPicksFilter !== "all"
          ? "Try a different picks filter above."
          : "Check back soon for new matches."}
      </p>
      {(searchQuery || tournamentFilter !== "all" || notPredictedOnly || myPicksFilter !== "all") && (
        <button
          className="pfb-empty-clear"
          onClick={() => {
            setSearchQuery("");
            setTournamentFilter("all");
            setNotPredictedOnly(false);
            setMyPicksFilter("all");
          }}
          type="button"
        >
          ✕ Clear filters
        </button>
      )}
    </div>
  ) : (
    <section
      className="pa-list"
      aria-label={`${displayedMatches.length} cricket matches`}
      itemScope
      itemType="https://schema.org/ItemList"
    >
      <meta itemProp="name" content="Cricket Match Predictions" />
      <meta itemProp="numberOfItems" content={displayedMatches.length} />

      {displayedMatches.map((m, index) => (
        <div
          key={m.id}
          itemProp="itemListElement"
          itemScope
          itemType="https://schema.org/ListItem"
        >
          <meta itemProp="position" content={index + 1} />
          <MatchCard match={m} onRequireAuth={openRegisterPopup} />
        </div>
      ))}
    </section>
  )
)}
        </main>

        {/* ── SEO: Hidden content for crawlers ── */}
        <div className="sr-only">
          <h2>About Cricket Prediction Arena</h2>
          <p>
            The 8JJ Games Prediction Arena lets you predict the outcomes of live and upcoming cricket
            matches. Earn points for every correct prediction, climb the weekly leaderboard and win
            bonus point rewards every Monday. Entry is free — no stake required.
          </p>
        </div>
      </div>
    </>
  );
}