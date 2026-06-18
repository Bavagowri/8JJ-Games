// react-app/src/pages/mobile/predictions/MobilePredictionleaderboard/MobileLeaderboard.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate }   from "react-router-dom";
import { leaderboardAPI }      from "../../../../api/predictionLeaderboard.api";
import { useAuth }             from "../../../../context/AuthContext";
import MobileBottomNav         from "../../../../components/mobile/MobileBottomNav/MobileBottomNav";
import { Avatar }              from "../MobilePredictionShared";
import "./MobileLeaderboard.css";

import { useLanguage } from "../../../../context/LanguageContext";
import { translate }   from "../../../../data/translations";

// ── SEO ──────────────────────────────────────────────────────────────────────
import SEO from "../../../../components/SEO/SEO";
import { generateKeywords } from "../../../../config/seoKeywords";

const TABS = [
  { key: "weekly",  labelKey: "plb_tab_this_week" },
  { key: "alltime", labelKey: "plb_tab_all_time"  },
];
const WEEKLY_BONUS = [500, 400, 300, 250, 200, 150, 120, 100, 80, 60];

// ── Podium card ───────────────────────────────────────────
function PodiumSlot({ row, rankClass, medal, rank }) {
  if (!row) return <div className={`mlb-podium-slot ${rankClass}`} aria-hidden="true" />;
  return (
    <div
      className={`mlb-podium-slot ${rankClass}`}
      itemScope
      itemType="https://schema.org/Person"
      aria-label={`Rank ${rank}: ${row.username} — ${row._pts.toLocaleString()} points`}
    >
      <div className="mlb-podium-platform">
        <div className="mlb-podium-avatar">
          <Avatar src={row.avatar} fallback={row.username} />
        </div>
        <div className="mlb-podium-medal" aria-hidden="true">{medal}</div>
        <div className="mlb-podium-name"  itemProp="name">{row.username}</div>
        <div
          className="mlb-podium-pts"
          aria-label={`${row._pts.toLocaleString()} points`}
        >
          {row._pts.toLocaleString()}<span>pts</span>
        </div>
        <div className="mlb-podium-sub">
          {row.predictions || 0} picks · {Number(row.win_rate || 0).toFixed(0)}%
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// MAIN
// ════════════════════════════════════════════════════════════
export default function MobileLeaderboard() {
  const { user }  = useAuth();
  const navigate  = useNavigate();
  const { lang }  = useLanguage();
  const [data,    setData]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab,     setTab]     = useState("weekly");
  const ME = user?.username || "";

  useEffect(() => {
    leaderboardAPI.getLeaderboard()
      .then(d => setData(d.leaderboard || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // ── JSON-LD Schema ──────────────────────────────────────────────────────
  useEffect(() => {
    if (loading || data.length === 0) return;

    const sortedForSchema = [...data]
      .map(r => ({ ...r, _pts: r.weekly_points || 0 }))
      .sort((a, b) => b._pts - a._pts)
      .slice(0, 10);

    const leaderboardSchema = {
      "@context": "https://schema.org",
      "@type":    "ItemList",
      "name":     "Cricket Prediction Leaderboard | 8JJ Games",
      "description":
        "Top cricket prediction players on 8JJ Games ranked by weekly and all-time points. Weekly bonus prizes distributed every Monday.",
      "url":          "https://8jjgames.com/predictions/leaderboard",
      "numberOfItems": sortedForSchema.length,
      "itemListElement": sortedForSchema.map((row, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type":       "Person",
          "name":        row.username,
          "description": `Rank #${index + 1} on 8JJ Games Cricket Prediction Leaderboard with ${row._pts} weekly points and ${Number(row.win_rate || 0).toFixed(0)}% accuracy.`,
        },
      })),
    };

    const webPageSchema = {
      "@context": "https://schema.org",
      "@type":    "WebPage",
      "name":     "Cricket Prediction Leaderboard | 8JJ Games",
      "description":
        "See the top cricket prediction players on 8JJ Games. Compete weekly to win up to 500 bonus points. Fresh rankings every Monday.",
      "url": "https://8jjgames.com/predictions/leaderboard",
      "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home",             "item": "https://8jjgames.com" },
          { "@type": "ListItem", "position": 2, "name": "Prediction Arena", "item": "https://8jjgames.com/predictions" },
          { "@type": "ListItem", "position": 3, "name": "Leaderboard",      "item": "https://8jjgames.com/predictions/leaderboard" },
        ],
      },
    };

    const gameSchema = {
      "@context":    "https://schema.org",
      "@type":       "Game",
      "name":        "Cricket Prediction Leaderboard Competition",
      "description": "Compete weekly on the 8JJ Games Cricket Prediction Leaderboard. Top 10 players earn bonus points every Monday. #1 earns 500 pts.",
      "url":         "https://8jjgames.com/predictions/leaderboard",
      "gamePlatform": "Web Browser",
      "genre":        "Sports Prediction",
      "publisher":    { "@type": "Organization", "name": "8JJ Games", "url": "https://8jjgames.com" },
    };

    const existing = document.getElementById("mlb-schema");
    if (existing) document.head.removeChild(existing);

    const s = document.createElement("script");
    s.type = "application/ld+json";
    s.id   = "mlb-schema";
    s.text = JSON.stringify([webPageSchema, leaderboardSchema, gameSchema]);
    document.head.appendChild(s);

    return () => {
      const el = document.getElementById("mlb-schema");
      if (el) document.head.removeChild(el);
    };
  }, [data, loading]);

  const sorted = [...data]
    .map(r => ({
      ...r,
      _pts: tab === "weekly" ? (r.weekly_points || 0) : (r.total_points || 0),
    }))
    .sort((a, b) => b._pts - a._pts)
    .map((r, i) => ({ ...r, rank: i + 1 }));

  const top3    = sorted.slice(0, 3);
  const rest    = sorted.slice(3, 10);
  const myRow   = sorted.find(r => r.username === ME);
  const isTop10 = myRow && myRow.rank <= 10;

  return (
    <>
      {/* ── SEO Meta Tags ── */}
      <SEO
        title="Cricket Prediction Leaderboard | 8JJ Games"
        description={`Top ${sorted.length} cricket prediction players on 8JJ Games. ${
          top3[0] ? `#1: ${top3[0].username} with ${top3[0]._pts.toLocaleString()} pts. ` : ""
        }Win up to 500 bonus points every Monday.`}
        keywords={generateKeywords("pages", "predictions")}
        url="/predictions/leaderboard"
        type="website"
      />

      <div className="mlb-page">

        {/* Header */}
        <header className="mlb-header">
          <button
            className="mlb-back"
            onClick={() => navigate("/predictions")}
            aria-label="Back to Prediction Arena"
          >
            ← {translate("plb_back_predictions_mbl", lang)}
          </button>
          <div className="mlb-header-centre">
            <h1>{translate("plb_title", lang)}</h1>
            <p>{translate("plb_subtitle", lang)}</p>
          </div>
          <div style={{ width: 48 }} aria-hidden="true" />
        </header>

        {/* Tab nav */}
        <nav className="mlb-tabnav" aria-label="Prediction sections">
          <Link to="/predictions"    className="mlb-tabnav-item">🏏 {translate("pa_tab_matches", lang)}</Link>
          <Link to="/my-predictions" className="mlb-tabnav-item">🎯 {translate("mmp_tab_my_picks", lang)}</Link>
          <span className="mlb-tabnav-item active" aria-current="page">🏆 {translate("plb_title", lang)}</span>
        </nav>

        {/* Week switcher */}
        <div
          className="mlb-switcher"
          role="tablist"
          aria-label="Leaderboard period"
        >
          {TABS.map(t => (
            <button
              key={t.key}
              role="tab"
              aria-selected={tab === t.key}
              className={`mlb-switch${tab === t.key ? " active" : ""}`}
              onClick={() => setTab(t.key)}
            >
              {translate(t.labelKey, lang)}
            </button>
          ))}
        </div>

        {/* Bonus banner */}
        <aside
          className="mlb-bonus-bar"
          aria-label="Weekly bonus prizes"
        >
          <span>🎁 {translate("plb_weekly_bonus_label", lang)}:</span>
          <span className="mlb-bonus-chip mlb-gold"   aria-label="1st place: 500 points">🥇 500pts</span>
          <span className="mlb-bonus-chip mlb-silver" aria-label="2nd place: 400 points">🥈 400pts</span>
          <span className="mlb-bonus-chip mlb-bronze" aria-label="3rd place: 300 points">🥉 300pts</span>
          {isTop10 && (
            <span className="mlb-you-chip" role="status">
              ✨ {translate("plb_youre_top10", lang)}
            </span>
          )}
        </aside>

        {loading ? (
          <div className="mlb-empty" role="status" aria-live="polite">
            <p>{translate("plb_loading", lang)}</p>
          </div>
        ) : (
          <main className="mlb-body">

            {/* ── Podium ── */}
            {top3.length >= 2 && (
              <section
                className="mlb-podium"
                aria-label="Top 3 players podium"
                itemScope
                itemType="https://schema.org/ItemList"
              >
                <meta itemProp="name"          content="Top 3 Cricket Predictors" />
                <meta itemProp="numberOfItems" content={Math.min(top3.length, 3)} />
                <PodiumSlot row={top3[1]} rankClass="p2" medal="🥈" rank={2} />
                <PodiumSlot row={top3[0]} rankClass="p1" medal="🥇" rank={1} />
                <PodiumSlot row={top3[2]} rankClass="p3" medal="🥉" rank={3} />
              </section>
            )}

            {/* ── Rows 4-10 ── */}
            <section
              className="mlb-list"
              aria-label="Leaderboard rankings 4 to 10"
              itemScope
              itemType="https://schema.org/ItemList"
            >
              <meta itemProp="name" content="Cricket Prediction Leaderboard" />

              {rest.map((row) => {
                const isMe  = row.username === ME;
                const bonus = row.rank <= 10 ? WEEKLY_BONUS[row.rank - 1] : null;

                return (
                  <div
                    key={row.username}
                    className={`mlb-row${isMe ? " is-me" : ""}`}
                    aria-label={`Rank ${row.rank}: ${row.username} — ${row._pts.toLocaleString()} points${isMe ? " (you)" : ""}`}
                    itemProp="itemListElement"
                    itemScope
                    itemType="https://schema.org/ListItem"
                  >
                    <meta itemProp="position" content={row.rank} />

                    <div className="mlb-row-rank" aria-hidden="true">{row.rank}</div>

                    <div className="mlb-row-avatar">
                      <Avatar src={row.avatar} fallback={row.username} />
                    </div>

                    <div
                      className="mlb-row-info"
                      itemScope
                      itemType="https://schema.org/Person"
                      itemProp="item"
                    >
                      <div className="mlb-row-name">
                        <span itemProp="name">{row.username}</span>
                        {isMe && (
                          <span className="mlb-you" role="status">
                            {translate("plb_you_tag", lang)}
                          </span>
                        )}
                        {bonus && tab === "weekly" && (
                          <span
                            className="mlb-bonus-tag"
                            aria-label={`+${bonus} weekly bonus points`}
                          >
                            +{bonus}
                          </span>
                        )}
                      </div>
                      <div className="mlb-row-sub">
                        {row.predictions || 0} {translate("plb_picks", lang)} · {Number(row.win_rate || 0).toFixed(0)}% {translate("plb_correct", lang)}
                      </div>
                    </div>

                    <div
                      className="mlb-row-pts"
                      aria-label={`${row._pts.toLocaleString()} points`}
                    >
                      {row._pts.toLocaleString()}
                      <div className="mlb-row-pts-label">pts</div>
                    </div>
                  </div>
                );
              })}
            </section>

            {/* ── SEO: Hidden content for crawlers ── */}
            <div className="sr-only">
              <h2>About the Cricket Prediction Leaderboard</h2>
              <p>
                The 8JJ Games Cricket Prediction Leaderboard ranks players by their weekly and
                all-time prediction points. Every Monday the weekly leaderboard resets and the
                top 10 players receive bonus points — #1 earns 500 pts, down to #10 who earns 60 pts.
              </p>
              <p>
                Make accurate cricket match predictions to climb the leaderboard. Correct predictions
                earn points multiplied by the odds. Top-ranked players this week:
              </p>
              {top3.length > 0 && (
                <ul>
                  {top3.map((row, i) => (
                    <li key={row.username}>
                      #{i + 1}: {row.username} — {row._pts.toLocaleString()} points —{" "}
                      {Number(row.win_rate || 0).toFixed(0)}% accuracy
                    </li>
                  ))}
                </ul>
              )}
            </div>

          </main>
        )}

        {/* Sticky my-position bar */}
        {myRow && (
          <div
            className="mlb-sticky-me"
            aria-label={`Your rank: #${myRow.rank} — ${myRow._pts.toLocaleString()} points`}
            role="status"
          >
            <div className="mlb-sticky-rank" aria-hidden="true">#{myRow.rank}</div>
            <div className="mlb-sticky-avatar">
              <Avatar src={myRow.avatar} fallback={myRow.username} />
            </div>
            <div className="mlb-sticky-info">
              <div className="mlb-sticky-name">{myRow.username}</div>
              <div className="mlb-sticky-sub">
                {myRow.predictions || 0} {translate("plb_picks", lang)}
              </div>
            </div>
            <div className="mlb-sticky-pts" aria-label={`${myRow._pts.toLocaleString()} points`}>
              {myRow._pts.toLocaleString()} pts
            </div>
          </div>
        )}

        <MobileBottomNav />
      </div>
    </>
  );
}