// react-app/src/pages/Predictions/MyPredictions.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { predictionAPI } from "../../api/prediction.api";
import "../../components/predictions/Predictions.css";
import "./MyPredictions.css";
import "./MyPredictionsSkeletons.css";
import { useLanguage } from "../../context/LanguageContext";
import { translate } from "../../data/translations";

// ── SEO ──────────────────────────────────────────────────────────────────────
import SEO from "../../components/SEO/SEO";
import { generateKeywords } from "../../config/seoKeywords";

const TABS = [
  { key: "all",       labelKey: "phome_filter_all" },
  { key: "upcoming",  labelKey: "phome_filter_upcoming" },
  { key: "completed", labelKey: "phome_filter_completed" },
];

function parseDate(str) {
  if (!str) return null;
  const d = new Date(String(str).replace(" ", "T"));
  return isNaN(d.getTime()) ? null : d;
}

function getResult(p) {
  if (p.status !== "completed") return "pending";
  return p.is_correct ? "won" : "lost";
}

// ════════════════════════════════════════════════════════════
// SKELETON COMPONENTS
// ════════════════════════════════════════════════════════════

function Sk({ className = "", style = {} }) {
  return <div className={`mpsk-bone ${className}`} style={style} aria-hidden="true" />;
}

// Mirrors .mp-page-header: h1 + subtitle on left, arena-link button on right
function PageHeaderSkeleton() {
  return (
    <div className="mpsk-header" aria-hidden="true">
      <div className="mpsk-header__left">
        <Sk className="mpsk-header__h1" />
        <Sk className="mpsk-header__sub" />
      </div>
      <Sk className="mpsk-header__cta" />
    </div>
  );
}

// Mirrors .mp-stats-grid: 6 equal cards, each with a big number + small label
function StatsGridSkeleton() {
  return (
    <div className="mpsk-stats" aria-hidden="true">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="mpsk-stat-card">
          <Sk className="mpsk-stat__val" />
          <Sk className="mpsk-stat__lbl" />
        </div>
      ))}
    </div>
  );
}

// Mirrors .mp-tabs: frosted container with 3 tabs + count pill each
function TabsSkeleton() {
  return (
    <div className="mpsk-tabs-bar" aria-hidden="true">
      <div className="mpsk-tabs">
        {[82, 94, 100].map((w, i) => (
          <Sk key={i} className="mpsk-tab" style={{ width: w }} />
        ))}
      </div>
    </div>
  );
}

// Mirrors .mp-row: left-accent border, match info → pick → odds → result badge → points → arrow
function RowSkeleton({ variant = "pending" }) {
  return (
    <div className={`mpsk-row mpsk-row--${variant}`} aria-hidden="true">
      {/* Colour accent bar (left side) — rendered via ::before in CSS */}

      {/* Match info column */}
      <div className="mpsk-row__match">
        <Sk className="mpsk-row__teams" />
        <div className="mpsk-row__meta">
          <Sk className="mpsk-row__meta-item" />
          <Sk className="mpsk-row__meta-item mpsk-row__meta-item--short" />
        </div>
      </div>

      {/* Pick pill */}
      <div className="mpsk-row__pick">
        <Sk className="mpsk-row__pick-lbl" />
        <Sk className="mpsk-row__pick-val" />
      </div>

      {/* Odds */}
      <div className="mpsk-row__odds">
        <Sk className="mpsk-row__odds-lbl" />
        <Sk className="mpsk-row__odds-val" />
      </div>

      {/* Result badge */}
      <Sk className="mpsk-row__badge" />

      {/* Points */}
      <div className="mpsk-row__pts">
        <Sk className="mpsk-row__pts-lbl" />
        <Sk className="mpsk-row__pts-val" />
      </div>

      {/* Arrow */}
      <Sk className="mpsk-row__arrow" />
    </div>
  );
}

// Combine all sections into one skeleton page
const ROW_VARIANTS = ["won", "pending", "lost", "pending", "won", "pending", "lost", "pending"];

function MyPredictionsSkeleton() {
  return (
    <div className="mpsk-root" role="status" aria-label="Loading your predictions">
      <span className="sr-only">Loading your predictions…</span>
      <PageHeaderSkeleton />
      <StatsGridSkeleton />
      <TabsSkeleton />
      <div className="mpsk-list">
        {ROW_VARIANTS.map((v, i) => (
          <RowSkeleton key={i} variant={v} />
        ))}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// MAIN PAGE
// ════════════════════════════════════════════════════════════
export default function MyPredictions() {
  const [tab, setTab]               = useState("all");
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const { lang }                    = useLanguage();
  const navigate                    = useNavigate();
  const handleBack                  = () => navigate(-1);

  useEffect(() => {
    predictionAPI
      .getMyPredictions()
      .then((data) => setPredictions(data.predictions || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // ── JSON-LD Schema ──────────────────────────────────────────────────────
  useEffect(() => {
    if (loading || predictions.length === 0) return;

    const won         = predictions.filter((p) => getResult(p) === "won").length;
    const totalPoints = predictions.reduce((acc, p) => acc + (p.points_awarded || 0), 0);

    const profilePageSchema = {
      "@context": "https://schema.org",
      "@type": "ProfilePage",
      "name": "My Predictions - Cricket Prediction History | 8JJ Games",
      "description": `Personal cricket match prediction history on 8JJ Games. ${predictions.length} total predictions, ${won} correct, ${totalPoints} points earned.`,
      "url": "https://8jjgames.com/my-predictions",
      "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home",             "item": "https://8jjgames.com" },
          { "@type": "ListItem", "position": 2, "name": "Prediction Arena", "item": "https://8jjgames.com/predictions" },
          { "@type": "ListItem", "position": 3, "name": "My Predictions",   "item": "https://8jjgames.com/my-predictions" },
        ],
      },
    };

    const itemListSchema = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "My Cricket Predictions",
      "description": `${predictions.length} cricket match predictions made on 8JJ Games`,
      "url": "https://8jjgames.com/my-predictions",
      "numberOfItems": predictions.length,
      "itemListElement": predictions.slice(0, 10).map((p, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "SportsEvent",
          "name": p.title || `${p.team_a} vs ${p.team_b}`,
          "url": `https://8jjgames.com/predictions/${p.match_id}`,
          ...(p.starting_at && { "startDate": p.starting_at }),
          "sport": "Cricket",
        },
      })),
    };

    const existing = document.getElementById("my-predictions-schema");
    if (existing) document.head.removeChild(existing);

    const schemaScript = document.createElement("script");
    schemaScript.type = "application/ld+json";
    schemaScript.id = "my-predictions-schema";
    schemaScript.text = JSON.stringify([profilePageSchema, itemListSchema]);
    document.head.appendChild(schemaScript);

    return () => {
      const s = document.getElementById("my-predictions-schema");
      if (s) document.head.removeChild(s);
    };
  }, [predictions, loading]);

  // ── Derived values ──────────────────────────────────────────────────────
  const filtered    = tab === "all" ? predictions : predictions.filter((p) => p.status === tab);
  const won         = predictions.filter((p) => getResult(p) === "won").length;
  const lost        = predictions.filter((p) => getResult(p) === "lost").length;
  const pending     = predictions.filter((p) => getResult(p) === "pending").length;
  const totalPoints = predictions.reduce((acc, p) => acc + (p.points_awarded || 0), 0);
  const totalStaked = predictions.reduce((acc, p) => acc + (p.stake_cost     || 0), 0);
  const completedCount = predictions.filter((p) => p.status === "completed").length;
  const winRate     = completedCount > 0 ? Math.round((won / completedCount) * 100) : 0;

  // ── Breadcrumb always rendered ──────────────────────────────────────────
  const Breadcrumb = (
    <div className="predictions-breadcrumb-bar">
      <div className="BackBTNcontainer">
        <button
          onClick={handleBack}
          className="premium-back-buttonzzz game-back-button"
          aria-label="Go back"
        >
          <span className="back-arrow">←</span>
        </button>
      </div>
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/" className="breadcrumb-link">{translate("home", lang)}</Link>
        <span className="breadcrumb-separator">/</span>
        <Link to="/predictions" className="breadcrumb-link">{translate("ph_prediction_arena", lang)}</Link>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-current">{translate("ph_my_predictions", lang)}</span>
      </nav>
    </div>
  );

  return (
    <>
      <SEO
        title={loading
          ? "My Predictions | 8JJ Games"
          : `My Predictions (${predictions.length}) | 8JJ Games`}
        description={loading
          ? "View and manage your cricket match prediction history on 8JJ Games."
          : `Your cricket prediction history on 8JJ Games. ${predictions.length} predictions made, ${won} won, ${winRate}% accuracy, ${totalPoints} points earned.`}
        keywords={generateKeywords("pages", "predictions")}
        url="/my-predictions"
        type="website"
      />
      <meta name="robots" content="noindex, follow" />

      <main className="my-predictions-page">

        {/* Breadcrumb always visible */}
        {Breadcrumb}

        {/* ── Skeleton | Real content ── */}
        {loading ? (
          <MyPredictionsSkeleton />
        ) : (
          <>
            {/* Page header */}
            <header className="mp-page-header">
              <div>
                <h1 className="mp-page-title">{translate("ph_my_predictions", lang)}</h1>
                <p className="mp-page-sub">{translate("ph_predict_desc", lang)}</p>
              </div>
              <Link to="/predictions" className="mp-arena-link" aria-label="Go to Prediction Arena">
                🏏 {translate("ph_prediction_arena", lang)} →
              </Link>
            </header>

            {/* Stats grid */}
            <section
              className="mp-stats-grid"
              aria-label="Your prediction statistics"
              itemScope
              itemType="https://schema.org/ProfilePage"
            >
              <meta itemProp="name" content="My Predictions Statistics" />
              <div className="mp-stat-card" aria-label={`${predictions.length} total picks`}>
                <span className="mp-stat-value">{predictions.length}</span>
                <span className="mp-stat-label">{translate("pld_total_picks", lang)}</span>
              </div>
              <div className="mp-stat-card mp-stat-card--won" aria-label={`${won} won`}>
                <span className="mp-stat-value">{won}</span>
                <span className="mp-stat-label">{translate("pld_won", lang)}</span>
              </div>
              <div className="mp-stat-card mp-stat-card--lost" aria-label={`${lost} lost`}>
                <span className="mp-stat-value">{lost}</span>
                <span className="mp-stat-label">{translate("pld_lost", lang)}</span>
              </div>
              <div className="mp-stat-card mp-stat-card--pending" aria-label={`${pending} pending`}>
                <span className="mp-stat-value">{pending}</span>
                <span className="mp-stat-label">{translate("pld_pending", lang)}</span>
              </div>
              <div className="mp-stat-card" aria-label={`${totalStaked} points staked`}>
                <span className="mp-stat-value">{totalStaked}</span>
                <span className="mp-stat-label">{translate("pld_pts_staked", lang)}</span>
              </div>
              <div className="mp-stat-card mp-stat-card--earned" aria-label={`${totalPoints} points earned`}>
                <span className="mp-stat-value">+{totalPoints}</span>
                <span className="mp-stat-label">{translate("pld_pts_earned", lang)}</span>
              </div>
            </section>

            {/* Tabs */}
            <div className="mp-tabs-bar">
              <div className="mp-tabs" role="tablist" aria-label="Filter predictions">
                {TABS.map((t) => (
                  <button
                    key={t.key}
                    role="tab"
                    aria-selected={tab === t.key}
                    className={`mp-tab${tab === t.key ? " active" : ""}`}
                    onClick={() => setTab(t.key)}
                  >
                    {translate(t.labelKey, lang)}
                    {t.key === "all"       && <span className="mp-tab-count">{predictions.length}</span>}
                    {t.key === "upcoming"  && <span className="mp-tab-count">{pending}</span>}
                    {t.key === "completed" && <span className="mp-tab-count">{won + lost}</span>}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="mp-error-banner" role="alert">
                Failed to load predictions: {error}
              </div>
            )}

            {/* List */}
            {filtered.length === 0 ? (
              <div className="mp-empty" role="status">
                <div className="mp-empty-icon" aria-hidden="true">🏏</div>
                <h2>{translate("plb_empty", lang)}</h2>
                <p>
                  Head to the{" "}
                  <Link to="/predictions" className="mp-empty-link">
                    {translate("ph_prediction_arena", lang)}
                  </Link>{" "}
                  to make your first pick.
                </p>
              </div>
            ) : (
              <section
                className="mp-list"
                aria-label={`${filtered.length} predictions`}
                itemScope
                itemType="https://schema.org/ItemList"
              >
                <meta itemProp="name" content="My Cricket Predictions" />
                <meta itemProp="numberOfItems" content={filtered.length} />

                {filtered.map((p, index) => {
                  const result    = getResult(p);
                  const matchDate = parseDate(p.starting_at);
                  const isPending = result === "pending";
                  const isWon     = result === "won";

                  return (
                    <Link
                      key={p.prediction_id || p.id}
                      to={`/predictions/${p.match_id}`}
                      className="mp-row-link"
                      aria-label={`${p.team_a} vs ${p.team_b} — your pick: ${p.user_prediction} — ${result}`}
                      itemProp="itemListElement"
                      itemScope
                      itemType="https://schema.org/ListItem"
                    >
                      <meta itemProp="position" content={index + 1} />
                      <div
                        className={`mp-row mp-row--${result}`}
                        itemScope
                        itemType="https://schema.org/SportsEvent"
                        itemProp="item"
                      >
                        <meta itemProp="name" content={`${p.team_a} vs ${p.team_b}`} />
                        <meta itemProp="url" content={`https://8jjgames.com/predictions/${p.match_id}`} />
                        {p.starting_at && <meta itemProp="startDate" content={p.starting_at} />}

                        <div className="mp-row-match">
                          <div className="mp-row-teams">
                            <span itemProp="name">{p.team_a} <span className="mp-row-vs">vs</span> {p.team_b}</span>
                          </div>
                          <div className="mp-row-meta">
                            <span>🏆 {p.tournament || "Cricket"}</span>
                            <time dateTime={p.starting_at} itemProp="startDate">
                              🗓 {matchDate
                                ? matchDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })
                                : "TBC"}
                            </time>
                          </div>
                        </div>

                        <div className="mp-row-pick">
                          <span className="mp-pick-label">Pick</span>
                          <span className="mp-pick-value">{p.user_prediction}</span>
                        </div>

                        <div className="mp-row-odds">
                          <span className="mp-odds-label">Odds</span>
                          <span className="mp-odds-value">{p.odds ? `${p.odds}×` : "—"}</span>
                        </div>

                        <span className={`result-badge ${result}`} aria-label={`Result: ${result}`}>
                          {isWon ? "✓ Won" : result === "lost" ? "✗ Lost" : "⏳ Pending"}
                        </span>

                        <div className={`mp-row-points mp-row-points--${result}`}>
                          {isPending
                            ? <><span className="mp-pts-label">Potential</span><span className="mp-pts-value">+{Math.round((p.stake_cost || 0) * (p.odds || 1))} pts</span></>
                            : isWon
                              ? <><span className="mp-pts-label">Earned</span><span className="mp-pts-value">+{p.points_awarded || 0} pts</span></>
                              : <><span className="mp-pts-label">Lost</span><span className="mp-pts-value">−{p.stake_cost || 0} pts</span></>
                          }
                        </div>

                        <span className="mp-row-arrow" aria-hidden="true">›</span>
                      </div>
                    </Link>
                  );
                })}
              </section>
            )}

            <div className="sr-only">
              <h2>About Your Prediction History</h2>
              <p>
                Your personal cricket prediction dashboard on 8JJ Games. Track every match prediction
                you have made, see which ones were correct, and monitor your total points earned.
              </p>
            </div>
          </>
        )}
      </main>
    </>
  );
}