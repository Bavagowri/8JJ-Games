// react-app/src/pages/mobile/predictions/MobileMyPrediction/MobileMyPrediction.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate }   from "react-router-dom";
import { predictionAPI }       from "../../../../api/prediction.api";
import MobileBottomNav         from "../../../../components/mobile/MobileBottomNav/MobileBottomNav";
import { TeamLogo, fmt }       from "../MobilePredictionShared";
import "./MobileMyPrediction.css";

import { useLanguage } from "../../../../context/LanguageContext";
import { translate }   from "../../../../data/translations";

// ── SEO ──────────────────────────────────────────────────────────────────────
import SEO from "../../../../components/SEO/SEO";
import { generateKeywords } from "../../../../config/seoKeywords";

// ── Stat summary bar ──────────────────────────────────────
function StatBar({ preds }) {
  const { lang } = useLanguage();
  const total    = preds.length;
  const wins     = preds.filter(p => p.is_correct === 1).length;
  const losses   = preds.filter(p => p.is_correct === 0 && p.match_status === "completed").length;
  const pending  = preds.filter(p => p.match_status !== "completed").length;
  const rate     = total > 0 ? Math.round((wins / (wins + losses || 1)) * 100) : 0;

  return (
    <div
      className="mmp-stats"
      aria-label="Your prediction statistics"
      itemScope
      itemType="https://schema.org/ProfilePage"
    >
      <div className="mmp-stat" aria-label={`${total} total predictions`}>
        <div className="mmp-stat-val">{total}</div>
        <div className="mmp-stat-lbl">{translate("mmp_stat_total", lang)}</div>
      </div>
      <div className="mmp-stat-div" aria-hidden="true" />
      <div className="mmp-stat" aria-label={`${wins} wins`}>
        <div className="mmp-stat-val mmp-win">{wins}</div>
        <div className="mmp-stat-lbl">{translate("mmp_stat_wins", lang)}</div>
      </div>
      <div className="mmp-stat-div" aria-hidden="true" />
      <div className="mmp-stat" aria-label={`${losses} losses`}>
        <div className="mmp-stat-val mmp-loss">{losses}</div>
        <div className="mmp-stat-lbl">{translate("mmp_stat_losses", lang)}</div>
      </div>
      <div className="mmp-stat-div" aria-hidden="true" />
      <div className="mmp-stat" aria-label={`${rate}% win rate`}>
        <div className="mmp-stat-val mmp-rate">{rate}%</div>
        <div className="mmp-stat-lbl">{translate("mmp_stat_win_rate", lang)}</div>
      </div>
    </div>
  );
}

// ── Single prediction row ─────────────────────────────────
function PredRow({ p, index }) {
  const { lang }  = useLanguage();
  const isWin     = p.is_correct === 1;
  const isLoss    = p.is_correct === 0 && p.match_status === "completed";
  const isPending = !isWin && !isLoss;
  const result    = isWin ? "won" : isLoss ? "lost" : "pending";

  return (
    <Link
      to={`/predictions/${p.match_id}`}
      className={`mmp-row${isWin ? " mmp-row-win" : isLoss ? " mmp-row-loss" : ""}`}
      aria-label={`${p.team_a} vs ${p.team_b} — your pick: ${p.user_prediction} — ${result}`}
      itemProp="itemListElement"
      itemScope
      itemType="https://schema.org/ListItem"
    >
      <meta itemProp="position" content={index + 1} />

      <div
        className="mmp-row-logos"
        aria-hidden="true"
        itemScope
        itemType="https://schema.org/SportsEvent"
        itemProp="item"
      >
        <meta itemProp="name"  content={`${p.team_a} vs ${p.team_b}`} />
        <meta itemProp="url"   content={`https://8jjgames.com/predictions/${p.match_id}`} />
        <meta itemProp="sport" content="Cricket" />
        {p.starting_at && <meta itemProp="startDate" content={p.starting_at} />}
        <TeamLogo name={p.team_a} logo={p.team_a_logo} size={36} />
        <TeamLogo name={p.team_b} logo={p.team_b_logo} size={36} />
      </div>

      <div className="mmp-row-info">
        <div className="mmp-row-match">
          {p.team_a} <span className="mmp-vs" aria-hidden="true">vs</span> {p.team_b}
        </div>
        <div className="mmp-row-tourney">{p.tournament || translate("pc_cricket", lang)}</div>
        <div className="mmp-row-pick">
          {translate("mmp_your_pick", lang)}: <strong>{p.user_prediction}</strong>
        </div>
        {p.points_awarded > 0 && (
          <div className="mmp-row-pts" aria-label={`${p.points_awarded} points earned`}>
            +{p.points_awarded} {translate("mmp_pts_earned", lang)}
          </div>
        )}
      </div>

      <div className="mmp-row-right">
        {isWin     && <span className="mmp-badge mmp-badge-win"     role="status">{translate("mmp_result_win",     lang)}</span>}
        {isLoss    && <span className="mmp-badge mmp-badge-loss"    role="status">{translate("mmp_result_loss",    lang)}</span>}
        {isPending && <span className="mmp-badge mmp-badge-pending" role="status">{translate("mmp_result_pending", lang)}</span>}
        <time className="mmp-row-time" dateTime={p.starting_at}>{fmt(p.starting_at)}</time>
      </div>
    </Link>
  );
}

// ════════════════════════════════════════════════════════════
// MAIN PAGE
// ════════════════════════════════════════════════════════════
const FILTER_KEYS = [
  { key: "all",     labelKey: "pa_filter_all"     },
  { key: "pending", labelKey: "mmp_filter_pending" },
  { key: "won",     labelKey: "mmp_filter_won"     },
  { key: "lost",    labelKey: "mmp_filter_lost"    },
];

export default function MobileMyPredictions() {
  const navigate  = useNavigate();
  const { lang }  = useLanguage();
  const [preds,   setPreds]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState("all");

  useEffect(() => {
    predictionAPI.getMyPredictions()
      .then(d => setPreds(d.predictions || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // ── JSON-LD Schema ──────────────────────────────────────────────────────
  useEffect(() => {
    if (loading || preds.length === 0) return;

    const wins        = preds.filter(p => p.is_correct === 1).length;
    const totalPoints = preds.reduce((acc, p) => acc + (p.points_awarded || 0), 0);

    const profilePageSchema = {
      "@context": "https://schema.org",
      "@type":    "ProfilePage",
      "name":     "My Predictions - Cricket Prediction History | 8JJ Games",
      "description": `Personal cricket match prediction history on 8JJ Games. ${preds.length} total predictions, ${wins} correct, ${totalPoints} points earned.`,
      "url":      "https://8jjgames.com/my-predictions",
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
      "@type":    "ItemList",
      "name":     "My Cricket Predictions",
      "url":      "https://8jjgames.com/my-predictions",
      "numberOfItems": preds.length,
      "itemListElement": preds.slice(0, 10).map((p, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type":     "SportsEvent",
          "name":      p.title || `${p.team_a} vs ${p.team_b}`,
          "url":       `https://8jjgames.com/predictions/${p.match_id}`,
          "startDate": p.starting_at,
          "sport":     "Cricket",
        },
      })),
    };

    const existing = document.getElementById("mmp-schema");
    if (existing) document.head.removeChild(existing);

    const s = document.createElement("script");
    s.type = "application/ld+json";
    s.id   = "mmp-schema";
    s.text = JSON.stringify([profilePageSchema, itemListSchema]);
    document.head.appendChild(s);

    return () => {
      const el = document.getElementById("mmp-schema");
      if (el) document.head.removeChild(el);
    };
  }, [preds, loading]);

  const filtered = preds.filter(p => {
    if (filter === "won")     return p.is_correct === 1;
    if (filter === "lost")    return p.is_correct === 0 && p.match_status === "completed";
    if (filter === "pending") return p.match_status !== "completed";
    return true;
  });

  return (
    <>
      {/* ── SEO Meta Tags (noindex — private page) ── */}
      <SEO
        title={loading ? "My Predictions | 8JJ Games" : `My Predictions (${preds.length}) | 8JJ Games`}
        description={`Your cricket prediction history on 8JJ Games. ${preds.length} predictions made. Track your wins, losses and points earned.`}
        keywords={generateKeywords("pages", "predictions")}
        url="/my-predictions"
        type="website"
      />
      {/* Personal data — exclude from search index */}
      <meta name="robots" content="noindex, follow" />

      <div className="mmp-page">

        {/* Header */}
        <header className="mmp-header">
          <button
            className="mmp-back"
            onClick={() => navigate("/predictions")}
            aria-label="Back to Prediction Arena"
          >
            ← {translate("plb_back_predictions_mbl", lang)}
          </button>
          <div className="mmp-header-centre">
            <h1>{translate("mmp_title", lang)}</h1>
            <p aria-label={`${preds.length} total picks`}>
              {preds.length} {translate("mmp_total_picks", lang)}
            </p>
          </div>
          <div style={{ width: 48 }} aria-hidden="true" />
        </header>

        {/* Tab nav */}
        <nav className="mmp-tabnav" aria-label="Prediction sections">
          <Link to="/predictions"             className="mmp-tabnav-item">🏏 {translate("pa_tab_matches", lang)}</Link>
          <span                               className="mmp-tabnav-item active" aria-current="page">🎯 {translate("mmp_tab_my_picks", lang)}</span>
          <Link to="/predictions/leaderboard" className="mmp-tabnav-item">🏆 {translate("plb_title", lang)}</Link>
        </nav>

        <main className="mmp-body">
          {loading ? (
            <div className="mmp-empty" role="status" aria-live="polite">
              <p>{translate("plb_loading", lang)}</p>
            </div>
          ) : preds.length === 0 ? (
            <div className="mmp-empty" role="status">
              <div style={{ fontSize: 40, marginBottom: 12 }} aria-hidden="true">🎯</div>
              <p>{translate("mmp_no_predictions", lang)}</p>
              <Link to="/predictions" className="mmp-start-btn">
                {translate("mmp_browse_matches", lang)}
              </Link>
            </div>
          ) : (
            <>
              <StatBar preds={preds} />

              {/* Filters */}
              <div
                className="mmp-filters"
                role="group"
                aria-label="Filter predictions by result"
              >
                {FILTER_KEYS.map(f => (
                  <button
                    key={f.key}
                    className={`mmp-filter${filter === f.key ? " active" : ""}`}
                    aria-pressed={filter === f.key}
                    onClick={() => setFilter(f.key)}
                  >
                    {translate(f.labelKey, lang)}
                  </button>
                ))}
              </div>

              {filtered.length === 0 ? (
                <div className="mmp-empty" role="status">
                  <p>{translate("mmp_no_filter_results", lang, { filter: translate(`mmp_filter_${filter}`, lang) })}</p>
                </div>
              ) : (
                <section
                  className="mmp-list"
                  aria-label={`${filtered.length} predictions`}
                  itemScope
                  itemType="https://schema.org/ItemList"
                >
                  <meta itemProp="name"          content="My Cricket Predictions" />
                  <meta itemProp="numberOfItems" content={filtered.length} />
                  {filtered.map((p, i) => (
                    <PredRow key={p.id} p={p} index={i} />
                  ))}
                </section>
              )}

              {/* ── SEO: Hidden content for crawlers ── */}
              <div className="sr-only">
                <h2>Your Prediction History</h2>
                <p>
                  Track every cricket match prediction you have made on 8JJ Games.
                  Filter by result to review wins, losses, and pending picks.
                  Click any row to see full match details and your prediction outcome.
                </p>
              </div>
            </>
          )}
        </main>

        <MobileBottomNav />
      </div>
    </>
  );
}