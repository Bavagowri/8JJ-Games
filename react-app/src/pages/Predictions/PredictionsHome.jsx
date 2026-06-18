// react-app/src/pages/Predictions/PredictionsHome.jsx
import { useEffect, useMemo, useState } from "react";
import { predictionAPI } from "../../api/prediction.api";
import { matchesAPI } from "../../api/matches.api";
import PredictionFilterBar from "../../components/predictions/PredictionFilterBar/PredictionFilterBar";
import { useNavigate, Link } from "react-router-dom";
import PredictionCard from "../../components/predictions/PredictionCard";
import PredictionCountdown from "../../components/predictions/PredictionCountdown";
import "../../components/predictions/Predictions.css";
import "./PredictionsHome.css";
import "./PredictionsHomeSkeletons.css";
import { useLanguage } from "../../context/LanguageContext";
import { translate } from "../../data/translations";
import PromoPopup from "../../components/PromoPopup/PromoPopup";
import MatchPreviewSection from "../../components/predictions/MatchPreviewSection";
import { matchesPreviewAPI } from "../../api/liveScores.api";
// ── SEO ──────────────────────────────────────────────────────────────────────
import SEO from "../../components/SEO/SEO";
import { generateKeywords } from "../../config/seoKeywords";

const FILTERS = [
  { key: "preview",  label: "Preview",  icon: "👁" },
  { key: "live",     label: "Live",     icon: "🔴" },
  { key: "finished", label: "Completed",     icon: "✅" },
  { key: "all",      label: "All",      icon: null },
];

// ════════════════════════════════════════════════════════════
// SKELETON COMPONENTS
// ════════════════════════════════════════════════════════════

function Sk({ className = "", style = {} }) {
  return <div className={`phsk-bone ${className}`} style={style} aria-hidden="true" />;
}

function HeroSkeleton() {
  return (
    <div className="phsk-hero" aria-hidden="true">
      <Sk className="phsk-hero__badge" />
      <Sk className="phsk-hero__h1" />
      <Sk className="phsk-hero__h1-b" />
      <Sk className="phsk-hero__sub" />
      <div className="phsk-hero__actions">
        <Sk className="phsk-hero__btn" />
        <Sk className="phsk-hero__btn phsk-hero__btn--ghost" />
      </div>
    </div>
  );
}

function FeaturedSkeleton() {
  return (
    <div className="phsk-featured" aria-hidden="true">
      {/* Header */}
      <div className="phsk-featured__header">
        <Sk className="phsk-featured__eyebrow" />
        <Sk className="phsk-featured__badge" />
      </div>

      {/* Split panels */}
      <div className="phsk-featured__panels">
        <div className="phsk-featured__panel phsk-featured__panel--l">
          <Sk className="phsk-featured__avatar" />
          <Sk className="phsk-featured__team" />
        </div>
        <div className="phsk-featured__vs">
          <Sk className="phsk-featured__vs-circle" />
        </div>
        <div className="phsk-featured__panel phsk-featured__panel--r">
          <Sk className="phsk-featured__avatar" />
          <Sk className="phsk-featured__team" />
        </div>
      </div>

      {/* Footer */}
      <div className="phsk-featured__footer">
        <div className="phsk-featured__footer-meta">
          <Sk className="phsk-featured__meta" />
          <Sk className="phsk-featured__meta phsk-featured__meta--short" />
          <Sk className="phsk-featured__meta phsk-featured__meta--pill" />
        </div>
        <Sk className="phsk-featured__cta" />
      </div>
    </div>
  );
}

function FiltersSkeleton() {
  return (
    <div className="phsk-filters" aria-hidden="true">
      <div style={{ display: "flex", gap: 4, background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: 4, flex: 1 }}>
        {[64, 52, 48, 40].map((w, i) => (
          <Sk key={i} className="phsk-filters__tab" style={{ width: w, borderRadius: 8 }} />
        ))}
      </div>
      <Sk className="phsk-filters__mypreds" />
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="phsk-card" aria-hidden="true">
      {/* Tournament + status */}
      <div className="phsk-card__top">
        <Sk className="phsk-card__tourney" />
        <Sk className="phsk-card__status" />
      </div>

      {/* Teams */}
      <div className="phsk-card__teams">
        <div className="phsk-card__team">
          <Sk className="phsk-card__logo" />
          <Sk className="phsk-card__name" />
        </div>
        <Sk className="phsk-card__vs" />
        <div className="phsk-card__team phsk-card__team--r">
          <Sk className="phsk-card__logo" />
          <Sk className="phsk-card__name" />
        </div>
      </div>

      {/* Meta */}
      <div className="phsk-card__meta">
        <Sk className="phsk-card__time" />
        <Sk className="phsk-card__countdown" />
      </div>

      {/* Stake row */}
      <Sk className="phsk-card__stake" />

      {/* Option buttons */}
      <div className="phsk-card__opts">
        <Sk className="phsk-card__opt" />
        <Sk className="phsk-card__opt" />
        <Sk className="phsk-card__opt phsk-card__opt--third" />
      </div>
    </div>
  );
}

function PredictionsLoadingSkeleton() {
  return (
    <div className="phsk-root" role="status" aria-label="Loading prediction matches">
      <span className="sr-only">Loading matches…</span>
      <HeroSkeleton />
      <FeaturedSkeleton />
      <FiltersSkeleton />
      <div className="phsk-grid">
        {Array.from({ length: 6 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// REAL PAGE COMPONENTS
// ════════════════════════════════════════════════════════════

function FeaturedTeamAvatar({ name, logo }) {
  const [imgErr, setImgErr] = useState(false);
  return (
    <div className="featured-team-avatar">
      {logo && !imgErr ? (
        <img src={logo} alt={name} onError={() => setImgErr(true)} />
      ) : (
        name.slice(0, 2).toUpperCase()
      )}
    </div>
  );
}

function FeaturedPrediction({ match, onRequireAuth }) {
  const { lang } = useLanguage();
  const navigate = useNavigate();

  if (!match) return null;
  return (
    <div className="featured-prediction-card">
      <div className="featured-card-header">
        <div className="featured-card-eyebrow">
          <span className="featured-eyebrow-label">Featured</span>
          <span className="featured-league-dot" />
          <span className="featured-league">{match.tournament}</span>
        </div>
        <span className={`status-badge ${match.status}`}>{match.status}</span>
      </div>

      <div className="featured-panels">
        <div
          className="featured-panel-left"
          style={{
            backgroundImage: `
            linear-gradient(135deg, rgba(8,24,60,0.78) 0%, rgba(12,32,75,0.65) 100%),
            url(${match.team_a_logo || ''})
          `,
            backgroundSize: match.team_a_logo ? '140%, cover' : 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <FeaturedTeamAvatar name={match.team_a} logo={match.team_a_logo} />
          <span className="featured-team-name">{match.team_a}</span>
        </div>

        <div
          className="featured-panel-right"
          style={{
            backgroundImage: `
            linear-gradient(225deg, rgba(8,24,60,0.78) 0%, rgba(12,32,75,0.65) 100%),
            url(${match.team_b_logo || ''})
          `,
            backgroundSize: match.team_b_logo ? '140%, cover' : 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <FeaturedTeamAvatar name={match.team_b} logo={match.team_b_logo} />
          <span className="featured-team-name">{match.team_b}</span>
        </div>

        <div className="featured-vs-circle">VS</div>
      </div>

      <div className="featured-card-footer">
        <div className="featured-info">
          <span className="featured-info-item">
            <span className="featured-info-icon">🗓</span>
            {new Date(match.starting_at).toLocaleString("en-US", {
              month: "short", day: "numeric",
              hour: "2-digit", minute: "2-digit",
            })}
          </span>
          <PredictionCountdown closeTime={match.prediction_close_time || match.starting_at} />
          {match.stake_cost > 0
            ? <span className="featured-info-item">
                <span className="featured-info-icon">⚡</span>
                {match.stake_cost} {translate("phome_pts_entry", lang)}
              </span>
            : <span className="featured-info-item" style={{ color: "var(--pred-success)" }}>
                ✓ {translate("phome_free_entry", lang)}
              </span>
          }
        </div>
        <button
          className="featured-predict-btn"
          onClick={() => {
            if (!localStorage.getItem("token")) { onRequireAuth(); return; }
            navigate(`/predictions/${match.id}`);
          }}
        >
          🏏 {translate("phome_predict_now", lang)}
        </button>
      </div>
    </div>
  );
}

function PredictionHero({ totalMatches, upcomingCount }) {
  const { lang } = useLanguage();
  return (
    <div className="prediction-hero">
      <div className="hero-live-badge">
        <span className="hero-live-dot" />
        {translate("phome_matches_open", lang, { upcomingCount })}
      </div>
      <h1>{translate("ph_prediction_arena", lang)}</h1>
      <p>{translate("ph_predict_desc", lang)}</p>
      <div className="hero-actions">
        <a href="#matches" className="hero-btn-primary">🏆 {translate("ph_explore_matches", lang)}</a>
        <Link to="/predictions/leaderboard" className="hero-btn-secondary">📊 {translate("plb_title", lang)}</Link>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// MAIN PAGE
// ════════════════════════════════════════════════════════════
export default function PredictionsHome() {
  const [matches, setMatches] = useState([]);
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();
  const handleBack = () => navigate(-1);
  const { lang } = useLanguage();
  const [loading, setLoading] = useState(true);

  const [popupKey, setPopupKey] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const openRegisterPopup = () => { setPopupKey((k) => k + 1); setShowPopup(true); };
  const closeRegisterPopup = () => setShowPopup(false);

  // ── Secondary filters (live / finished / all tabs only) ──────────
  const [searchQuery,      setSearchQuery]      = useState("");
  const [tournamentFilter, setTournamentFilter] = useState("all");
  const [notPredictedOnly, setNotPredictedOnly] = useState(false);
  const [myPicksFilter,    setMyPicksFilter]    = useState("all");
  const [predictedMatchIds, setPredictedMatchIds] = useState(new Set());
  const [myPredictionsMap,  setMyPredictionsMap]  = useState({}); // matchId → userPick label

  const isLoggedIn = !!localStorage.getItem("token");

  // ── Preview data (lifted here so tab count is accurate) ──
  const [previewLive, setPreviewLive]                       = useState([]);
  const [upcomingData, setUpcomingData]                     = useState([]);
  const [upcomingPagination, setUpcomingPagination]         = useState({});
  const [upcomingPage, setUpcomingPage]                     = useState(1);
  const [recentData, setRecentData]                         = useState([]);
  const [recentPagination, setRecentPagination]             = useState({});
  const [recentPage, setRecentPage]                         = useState(1);



  const handlePredict = async (matchId, optionId) => {
    try {
      if (!localStorage.getItem("token")) { openRegisterPopup(); return; }
      await predictionAPI.submitPrediction(matchId, optionId);
      await loadMatches();
    } catch (err) { console.error(err); }
  };
  const getMatchStatus = (m) => {
    if (m.winner) return "completed";
    if (m.prediction_open === 1) return "open";
    return "closed";
  };
  

  const filtered = (() => {
    switch (filter) {
      case "preview":
        return []; // handled separately

      case "live":
        return matches.filter((m) => getMatchStatus(m) === "open");

      case "finished":
        return matches.filter((m) => getMatchStatus(m) === "completed");

      case "all":
      default: {
        const ORDER = { open: 0, closed: 1, completed: 2 };
        return [...matches].sort(
          (a, b) => (ORDER[getMatchStatus(a)] ?? 1) - (ORDER[getMatchStatus(b)] ?? 1)
        );
      }
    }
  })();

  // const filtered = filter === "all" ? matches : matches.filter((m) => m.status === filter);
  const featured = matches.find((m) => m.is_featured === 1) || matches.find((m) => m.status === "upcoming") || null;
  const upcomingCount = matches.filter((m) => m.status === "upcoming").length;

  // ── Secondary filter application (search + tournament + not-predicted + my-picks) ──
  const displayedMatches = useMemo(() => {
    let list = filtered;

    // 1. search — team_a, team_b, tournament
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(
        (m) =>
          m.team_a?.toLowerCase().includes(q) ||
          m.team_b?.toLowerCase().includes(q) ||
          m.tournament?.toLowerCase().includes(q)
      );
    }

    // 2. tournament dropdown
    if (tournamentFilter !== "all") {
      list = list.filter((m) => m.tournament === tournamentFilter);
    }

    // 3. not-predicted-yet (live + all tabs only)
    if (notPredictedOnly && isLoggedIn && (filter === "live" || filter === "all")) {
      list = list.filter((m) => !predictedMatchIds.has(m.id) && m.prediction_open === 1);
    }

    // 4. my-picks filter (completed tab only)
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

  // Unique tournament names for the dropdown (from all matches, not just current tab)
  const allTournaments = useMemo(() => {
    const names = matches
      .map((m) => m.tournament)
      .filter(Boolean)
      .filter((t) => t !== "Cricket Match"); // exclude generic fallback
    return [...new Set(names)].sort();
  }, [matches]);

  // Reset secondary filters when switching main tab
  const handleFilterChange = (key) => {
    setFilter(key);
    setSearchQuery("");
    setTournamentFilter("all");
    setNotPredictedOnly(false);
    setMyPicksFilter("all");
  };

  // Tab counts for badges
  const tabCounts = {
    preview: previewLive.length + upcomingData.length + recentData.length,
    live: matches.filter((m) => getMatchStatus(m) === "open").length,
    finished: matches.filter((m) => getMatchStatus(m) === "completed").length,
    all:      matches.length,
  };

  useEffect(() => { 
    loadMatches();
    loadPreviewLive();
    loadUpcoming(1);
    loadRecent(1);
    // Load user's predicted matches for "Not Predicted Yet" filter
    if (isLoggedIn) {
      predictionAPI.getMyPredictions()
        .then((data) => {
          const ids = new Set((data.predictions || []).map((p) => p.match_id));
          setPredictedMatchIds(ids);
          // Build map: matchId → user's picked option label
          const map = {};
          (data.predictions || []).forEach((p) => {
            map[p.match_id] = p.predicted_option; // label string
          });
          setMyPredictionsMap(map);
        })
        .catch(() => {}); // silently fail — filter just won't work
    }
   }, []);


  // ── JSON-LD Schema ────────────────────────────────────────────────────────
  useEffect(() => {
    if (loading || matches.length === 0) return;

    const upcomingMatches = matches.filter((m) => m.status === "upcoming");
    const eventSchemas = upcomingMatches.slice(0, 5).map((match) => ({
      "@type": "SportsEvent",
      "name": match.title || `${match.team_a} vs ${match.team_b}`,
      "description": `Predict the winner of ${match.team_a} vs ${match.team_b} in ${match.tournament || "Cricket"}. Free entry prediction game on 8JJ Games.`,
      "startDate": match.starting_at,
      "sport": "Cricket",
      "competitor": [
        { "@type": "SportsTeam", "name": match.team_a },
        { "@type": "SportsTeam", "name": match.team_b },
      ],
      "organizer": { "@type": "Organization", "name": match.tournament || "Cricket Tournament" },
    }));

    const webPageSchema = {
      "@context": "https://schema.org", "@type": "WebPage",
      "name": "Prediction Arena - Cricket Match Predictions | 8JJ Games",
      "description": "Predict cricket match winners, earn points and climb the leaderboard on 8JJ Games. Free entry predictions with real rewards.",
      "url": "https://8jjgames.com/predictions",
      "breadcrumb": { "@type": "BreadcrumbList", "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://8jjgames.com" },
        { "@type": "ListItem", "position": 2, "name": "Prediction Arena", "item": "https://8jjgames.com/predictions" },
      ]},
    };

    const itemListSchema = {
      "@context": "https://schema.org", "@type": "ItemList",
      "name": "Upcoming Cricket Match Predictions",
      "url": "https://8jjgames.com/predictions",
      "numberOfItems": upcomingMatches.length,
      "itemListElement": upcomingMatches.slice(0, 10).map((match, index) => ({
        "@type": "ListItem", "position": index + 1,
        "item": { "@type": "SportsEvent", "name": match.title || `${match.team_a} vs ${match.team_b}`, "url": `https://8jjgames.com/predictions/${match.id}`, "startDate": match.starting_at, "sport": "Cricket" },
      })),
    };

    const gameSchema = {
      "@context": "https://schema.org", "@type": "Game",
      "name": "Cricket Prediction Arena",
      "description": "Predict cricket match outcomes, earn points and compete on the leaderboard. Free to play prediction game on 8JJ Games.",
      "url": "https://8jjgames.com/predictions", "genre": "Sports Prediction", "gamePlatform": "Web Browser",
      "publisher": { "@type": "Organization", "name": "8JJ Games", "url": "https://8jjgames.com" },
    };

    const existing = document.getElementById("predictions-home-schema");
    if (existing) document.head.removeChild(existing);

    const s = document.createElement("script");
    s.type = "application/ld+json";
    s.id = "predictions-home-schema";
    s.text = JSON.stringify([webPageSchema, itemListSchema, gameSchema, ...eventSchemas]);
    document.head.appendChild(s);

    return () => { const el = document.getElementById("predictions-home-schema"); if (el) document.head.removeChild(el); };
  }, [matches, loading]);

  const loadMatches = async () => {
    try {
      setLoading(true);
      const data = await matchesAPI.getMatches();
      setMatches(data.matches || []);
    } catch (err) {
      console.error("Failed to load matches:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadPreviewLive = async () => {
    try {
      const res = await matchesPreviewAPI.getMatchPreview(1, 1);
      setPreviewLive(res.live);
    } catch (err) {
      console.error("Failed to load live preview:", err);
    }
  };

  const loadUpcoming = async (pageNum = 1) => {
    try {
      const res = await matchesPreviewAPI.getMatchPreview(pageNum, 8);
      setUpcomingData(res.upcoming);
      setUpcomingPagination(res.upcomingPagination);
      setUpcomingPage(pageNum);
    } catch (err) {
      console.error("Failed to load upcoming:", err);
    }
  };

  const loadRecent = async (pageNum = 1) => {
    try {
      const res = await matchesPreviewAPI.getMatchPreview(pageNum, 8);
      setRecentData(res.recent);
      setRecentPagination(res.recentPagination);
      setRecentPage(pageNum);
    } catch (err) {
      console.error("Failed to load recent:", err);
    }
  };

  const upcomingMatches = matches.filter((m) => m.status === "upcoming");

  return (
    <>
      <SEO
        title="Prediction Arena - Cricket Match Predictions | 8JJ Games"
        description={loading
          ? "Predict cricket match winners, earn points and climb the leaderboard on 8JJ Games. Free entry cricket predictions with real rewards."
          : `Predict cricket match winners and earn points on 8JJ Games. ${upcomingMatches.length} upcoming matches open for predictions. Free entry, real rewards!`
        }
        keywords={generateKeywords("pages", "predictions")}
        url="/predictions"
        type="website"
      />

      <div className="predictions-page">

        {/* Breadcrumb — always visible */}
        <div className="predictions-breadcrumb-bar">
          <div className="BackBTNcontainer">
            <button
              onClick={handleBack}
              className="premium-back-buttonzzz game-back-button"
              aria-label="Go back to previous page"
            >
              <span className="back-arrow">←</span>
            </button>
          </div>
          <nav className="breadcrumb max-width" aria-label="Breadcrumb">
            <Link to="/" className="breadcrumb-link">{translate("home", lang)}</Link>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">{translate("ph_prediction_arena", lang)}</span>
          </nav>
        </div>

        {/* ── Loading: skeleton | Loaded: real content ── */}
        {loading ? (
          <PredictionsLoadingSkeleton />
        ) : (
          <>
            {showPopup && (
              <PromoPopup
                key={popupKey}
                image="/images/register-refer.png"
                title={translate("promo_popup_register_title", lang)}
                description={translate("promo_popup_register_description", lang)}
                buttonText={translate("promo_popup_register_button", lang)}
                buttonLink="/register"
                storageKey="hide_register_popup"
                onClose={closeRegisterPopup}
              />
            )}

            <PredictionHero totalMatches={matches.length} upcomingCount={upcomingCount} />

            <FeaturedPrediction match={featured} onRequireAuth={openRegisterPopup} />

            {/* ── Phase 2: Segmented filter control ── */}
            <div className="pf-bar" role="tablist" aria-label="Filter matches by status">
              <div className="pf-segment-wrap">
                {FILTERS.map((f) => {
                  const count = tabCounts[f.key];
                  const isLive = f.key === "live" && count > 0;

                  return (
                    <button
                      key={f.key}
                      role="tab"
                      aria-selected={filter === f.key}
                      className={`pf-seg${filter === f.key ? " pf-seg-active" : ""}${isLive ? " pf-seg-live" : ""}`}
                      onClick={() => handleFilterChange(f.key)}
                    >
                      {f.label}
                      {count > 0 && (
                        <span className={`pf-count${isLive ? " pf-count-live" : ""}`}>
                          {count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <Link to="/my-predictions" className="pf-mypreds-btn" aria-label="View my predictions">
                🏏 {translate("ph_my_predictions", lang)}
                <span className="pf-mypreds-arrow">→</span>
              </Link>
            </div>

            {/* ── Secondary filter bar (live / completed / all only) ── */}
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
                activeTab={filter === "finished" ? "done" : filter}
                isMobile={false}
              />
            )}

            {/* ───────────────────────────────────────────── */}
            {/* ✅ MATCH PREVIEW SECTION */}
            {/* ───────────────────────────────────────────── */}
            {filter === "preview" && (
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
            )}

            {/* ───────────────────────────────────────────── */}
            {/* ✅ PREDICTION CARDS GRID (HIDDEN FOR PREVIEW) */}
            {/* ───────────────────────────────────────────── */}
            {filter !== "preview" && (
              <section
                id="matches"
                className="predictions-grid"
                aria-label={`${displayedMatches.length} cricket matches available for prediction`}
                itemScope
                itemType="https://schema.org/ItemList"
              >
                <meta itemProp="name" content="Cricket Match Predictions" />
                <meta itemProp="numberOfItems" content={displayedMatches.length} />

                {displayedMatches.length === 0 ? (
                  <div className="pfb-empty" role="status">
                    <span className="pfb-empty-icon">
                      {searchQuery ? "🔍" : notPredictedOnly ? "✅" : myPicksFilter === "won" ? "🏆" : myPicksFilter === "lost" ? "😔" : myPicksFilter === "skipped" ? "⬜" : "🏟️"}
                    </span>
                    <h3 className="pfb-empty-title">
                      {searchQuery
                        ? `No matches found for "${searchQuery}"`
                        : notPredictedOnly
                        ? "You've predicted all open matches!"
                        : myPicksFilter === "won"
                        ? "No winning predictions found"
                        : myPicksFilter === "lost"
                        ? "No losing predictions found"
                        : myPicksFilter === "skipped"
                        ? "You predicted every completed match!"
                        : filter === "live" && "No live prediction matches right now"}
                      {!searchQuery && !notPredictedOnly && myPicksFilter === "all" && filter === "finished" && "No completed matches yet"}
                      {!searchQuery && !notPredictedOnly && myPicksFilter === "all" && filter === "all" && translate("phome_no_matches", lang)}
                    </h3>
                    <p className="pfb-empty-sub">
                      {searchQuery
                        ? "Try searching with a different team or tournament name."
                        : notPredictedOnly
                        ? "Check back when new matches open up."
                        : myPicksFilter !== "all"
                        ? "Try a different picks filter above."
                        : translate("phome_check_back", lang)}
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
                  displayedMatches.map((match, index) => (
                    <div
                      key={match.id}
                      itemProp="itemListElement"
                      itemScope
                      itemType="https://schema.org/ListItem"
                    >
                      <meta itemProp="position" content={index + 1} />

                      <div itemScope itemType="https://schema.org/SportsEvent" itemProp="item">
                        <meta
                          itemProp="name"
                          content={match.title || `${match.team_a} vs ${match.team_b}`}
                        />
                        <meta
                          itemProp="url"
                          content={`https://8jjgames.com/predictions/${match.id}`}
                        />
                        {match.starting_at && (
                          <meta itemProp="startDate" content={match.starting_at} />
                        )}

                        <PredictionCard
                          match={match}
                          onPredict={handlePredict}
                          onRequireAuth={openRegisterPopup}
                        />
                      </div>
                    </div>
                  ))
                )}
              </section>
            )}

            <div className="sr-only">
              <h2>About Cricket Prediction Arena</h2>
              <p>The 8JJ Games Prediction Arena lets you predict the outcomes of live and upcoming cricket matches. Earn points for every correct prediction, climb the weekly leaderboard and win bonus point rewards every Monday. Entry is free — no stake required.</p>
            </div>
          </>
        )}
      </div>
    </>
  );
}