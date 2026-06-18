// react-app/src/pages/Predictions/PredictionLeaderboard.jsx
import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { leaderboardAPI } from "../../api/predictionLeaderboard.api";
import { useAuth } from "../../context/AuthContext";
import "./PredictionLeaderboard.css";
import { useLanguage } from "../../context/LanguageContext";
import { translate } from "../../data/translations";

// ── SEO ──────────────────────────────────────────────────────────────────────
import SEO from "../../components/SEO/SEO";
import { generateKeywords } from "../../config/seoKeywords";

const TABS = [
  { key: "weekly",  labelKey: "plb_tab_weekly" },
  { key: "alltime", labelKey: "plb_tab_alltime" },
];

const WEEKLY_BONUS = [500, 400, 300, 250, 200, 150, 120, 100, 80, 60];
const API_URL = import.meta.env.VITE_API_URL || "";

const PODIUM_MAP = [
  { dataIdx: 1, rankClass: "p2", label: "2", badgeKey: "plb_runner_up",   medal: "🥈" },
  { dataIdx: 0, rankClass: "p1", label: "1", badgeKey: "plb_champion",    medal: "🏆" },
  { dataIdx: 2, rankClass: "p3", label: "3", badgeKey: "plb_third_place", medal: "🥉" },
];

/* Floating orb background */
function AuroraOrbs() {
  return (
    <div className="plb-aurora" aria-hidden="true">
      <div className="plb-orb plb-orb--1" />
      <div className="plb-orb plb-orb--2" />
      <div className="plb-orb plb-orb--3" />
      <div className="plb-orb plb-orb--4" />
      {Array.from({ length: 28 }).map((_, i) => (
        <div
          key={i}
          className="plb-star"
          style={{
            left:  `${(i * 37 + 11) % 100}%`,
            top:   `${(i * 53 + 7)  % 100}%`,
            animationDelay: `${(i * 0.4) % 4}s`,
            width:  `${1 + (i % 3)}px`,
            height: `${1 + (i % 3)}px`,
          }}
        />
      ))}
    </div>
  );
}

function Avatar({ src, fallback }) {
  const [err, setErr] = useState(false);
  if (!err && src) {
    return (
      <img
        src={`${API_URL}${src}`}
        alt={fallback}
        onError={() => setErr(true)}
        style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%", display: "block" }}
      />
    );
  }
  return <span>{(fallback || "?")[0].toUpperCase()}</span>;
}

/* Animated number counter */
function CountUp({ value, duration = 1200 }) {
  const [display, setDisplay] = useState(0);
  const raf = useRef(null);
  useEffect(() => {
    const start = performance.now();
    const to    = value;
    const tick  = (now) => {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease     = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(to * ease));
      if (progress < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [value, duration]);
  return display.toLocaleString();
}

export default function PredictionLeaderboard() {
  const { user }                      = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [tab, setTab]                 = useState("weekly");
  const [animated, setAnimated]       = useState(false);
  const MY_USERNAME                   = user?.username || "";
  const { lang }                      = useLanguage();

  useEffect(() => {
    (async () => {
      try {
        const data = await leaderboardAPI.getLeaderboard();
        setLeaderboard(data.leaderboard || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
        setTimeout(() => setAnimated(true), 120);
      }
    })();
  }, []);

  // ── JSON-LD Schema ──────────────────────────────────────────────────────
  useEffect(() => {
    if (loading || leaderboard.length === 0) return;

    const sorted = [...leaderboard]
      .sort((a, b) => b.weekly_points - a.weekly_points)
      .slice(0, 10);

    // ItemList for top players
    const leaderboardSchema = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "Cricket Prediction Leaderboard | 8JJ Games",
      "description":
        "Top cricket prediction players on 8JJ Games ranked by weekly and all-time points. Weekly bonus prizes distributed every Monday.",
      "url": "https://8jjgames.com/predictions/leaderboard",
      "numberOfItems": sorted.length,
      "itemListElement": sorted.map((row, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Person",
          "name": row.username,
          "description": `Rank #${index + 1} on 8JJ Games Cricket Prediction Leaderboard with ${row.weekly_points || 0} weekly points and ${Number(row.win_rate || 0).toFixed(0)}% accuracy.`,
        },
      })),
    };

    // WebPage schema
    const webPageSchema = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Cricket Prediction Leaderboard | 8JJ Games",
      "description":
        "See the top cricket prediction players on 8JJ Games. Compete weekly to win up to 500 bonus points. Fresh rankings every Monday.",
      "url": "https://8jjgames.com/predictions/leaderboard",
      "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://8jjgames.com" },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Prediction Arena",
            "item": "https://8jjgames.com/predictions",
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Leaderboard",
            "item": "https://8jjgames.com/predictions/leaderboard",
          },
        ],
      },
    };

    // Game schema for the prediction competition
    const gameSchema = {
      "@context": "https://schema.org",
      "@type": "Game",
      "name": "Cricket Prediction Leaderboard Competition",
      "description":
        "Compete weekly on the 8JJ Games Cricket Prediction Leaderboard. Top 10 players earn bonus points every Monday. #1 earns 500 pts.",
      "url": "https://8jjgames.com/predictions/leaderboard",
      "gamePlatform": "Web Browser",
      "genre": "Sports Prediction",
      "publisher": {
        "@type": "Organization",
        "name": "8JJ Games",
        "url": "https://8jjgames.com",
      },
    };

    // Remove existing schema
    const existing = document.getElementById("leaderboard-schema");
    if (existing) document.head.removeChild(existing);

    const schemaScript = document.createElement("script");
    schemaScript.type = "application/ld+json";
    schemaScript.id = "leaderboard-schema";
    schemaScript.text = JSON.stringify([webPageSchema, leaderboardSchema, gameSchema]);
    document.head.appendChild(schemaScript);

    return () => {
      const s = document.getElementById("leaderboard-schema");
      if (s) document.head.removeChild(s);
    };
  }, [leaderboard, loading]);

  const sorted = [...leaderboard]
    .sort((a, b) =>
      tab === "weekly"
        ? b.weekly_points - a.weekly_points
        : b.total_points  - a.total_points
    )
    .map((row, i) => ({ ...row, rank: i + 1 }));

  const top3    = sorted.slice(0, 3);
  const rest    = sorted.slice(3);
  const myRow   = sorted.find((r) => r.username === MY_USERNAME);
  const isTop10 = myRow && myRow.rank <= 10;
  const pts     = (row) => tab === "weekly" ? (row.weekly_points || 0) : (row.total_points || 0);

  // ── Loading state ─────────────────────────────────────────────────────
  if (loading) {
    return (
      <>
        <SEO
          title="Cricket Prediction Leaderboard | 8JJ Games"
          description="See the top cricket prediction players on 8JJ Games. Compete weekly to win bonus points. Fresh rankings every Monday."
          keywords={generateKeywords("pages", "predictions")}
          url="/predictions/leaderboard"
          type="website"
        />
        <div className="plb-page plb-loading">
          <AuroraOrbs />
          <div className="plb-loading-inner" role="status" aria-live="polite">
            <div className="plb-loading-trophy" aria-hidden="true">🏆</div>
            <div className="plb-loading-bar"><div className="plb-loading-fill" /></div>
            <p>{translate("plb_loading", lang)}</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* ── SEO Meta Tags ── */}
      <SEO
        title="Cricket Prediction Leaderboard | 8JJ Games"
        description={`Top ${sorted.length} cricket prediction players on 8JJ Games. ${
          top3[0] ? `#1: ${top3[0].username} with ${pts(top3[0]).toLocaleString()} pts. ` : ""
        }Win up to 500 bonus points every Monday. Can you reach the top?`}
        keywords={generateKeywords("pages", "predictions")}
        url="/predictions/leaderboard"
        type="website"
      />

      <div className="plb-page">
        <AuroraOrbs />

        {/* ── Topbar ── */}
        <div className="plb-topbar">
          <Link to="/predictions" className="plb-back" aria-label="Back to Prediction Arena">
            <span className="plb-back-arrow">←</span>
            <span>{translate("plb_back_predictions", lang)}</span>
          </Link>

          <div className="plb-tabs" role="tablist" aria-label="Leaderboard period">
            {TABS.map((t) => (
              <button
                key={t.key}
                role="tab"
                aria-selected={tab === t.key}
                className={`plb-tab${tab === t.key ? " active" : ""}`}
                onClick={() => setTab(t.key)}
              >
                {translate(t.labelKey, lang)}
              </button>
            ))}
          </div>
        </div>

        {/* ── Page title ── */}
        <header className="plb-hero-title">
          <div className="plb-hero-eyebrow">⚡ {translate("plb_title", lang)}</div>
          <h1 className="plb-hero-h1">
            <span>{translate("plb_title", lang)}</span>
          </h1>
          <p className="plb-hero-sub">
            {translate("plb_subtitle", lang)}
            {isTop10 && (
              <span className="plb-hero-you-badge" role="status">
                ✨ {translate("plb_you_top10", lang)}
              </span>
            )}
          </p>
        </header>

        {/* ── Bonus banner ── */}
        <aside className="plb-banner" aria-label="Weekly bonus prizes">
          <div className="plb-banner-left">
            <span className="plb-banner-icon" aria-hidden="true">🎁</span>
            <strong>{translate("plb_weekly_bonus_title", lang)}</strong>
            <span className="plb-banner-desc">{translate("plb_every_monday", lang)}</span>
          </div>
          <div className="plb-banner-prizes" role="list" aria-label="Prize breakdown">
            {["🥇 500", "🥈 400", "🥉 300"].map((s, i) => (
              <div key={i} className="plb-banner-prize" role="listitem">
                {s}<span>{translate("plb_pts", lang)}</span>
              </div>
            ))}
            <div className="plb-banner-prize dim" role="listitem">… #10: 60<span>{translate("plb_pts", lang)}</span></div>
          </div>
        </aside>

        {/* ══════════════════════════════════════════════════
            PODIUM
        ══════════════════════════════════════════════════ */}
        {top3.length > 0 && (
          <section
            className="plb-podium-wrap"
            aria-label="Top 3 players podium"
            itemScope
            itemType="https://schema.org/ItemList"
          >
            <meta itemProp="name" content="Top 3 Cricket Predictors" />

            <div className="plb-stage-lines" aria-hidden="true">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="plb-stage-line" style={{ animationDelay: `${i * 0.18}s` }} />
              ))}
            </div>

            <div className="plb-podium">
              {PODIUM_MAP.map(({ dataIdx, rankClass, label, badge, medal }) => {
                const row = top3[dataIdx];
                if (!row) return <div key={dataIdx} className="plb-podium-gap" />;
                const isChamp = rankClass === "p1";

                return (
                  <div
                    key={row.username}
                    className={`plb-podium-slot ${rankClass}${animated ? " show" : ""}`}
                    itemProp="itemListElement"
                    itemScope
                    itemType="https://schema.org/ListItem"
                    aria-label={`Rank ${label}: ${row.username} — ${pts(row).toLocaleString()} points`}
                  >
                    <meta itemProp="position" content={label} />

                    <div className="plb-medal" aria-hidden="true">{medal}</div>
                    <div className="plb-rank-num" aria-hidden="true">#{label}</div>

                    <div className="plb-card-shell">
                      <div className="plb-card-bloom" />
                      <div
                        className="plb-card"
                        itemScope
                        itemType="https://schema.org/Person"
                        itemProp="item"
                      >
                        {isChamp && (
                          <div className="plb-card-crown" aria-hidden="true">
                            <div className="plb-crown-ray" /><div className="plb-crown-ray" />
                            <div className="plb-crown-ray" /><div className="plb-crown-ray" />
                            <div className="plb-crown-ray" />
                          </div>
                        )}

                        <div className={`plb-avatar-wrap${isChamp ? " champ" : ""}`}>
                          <div className="plb-avatar-outer-ring" aria-hidden="true" />
                          <div className="plb-avatar-inner-ring" aria-hidden="true" />
                          <div className="plb-avatar">
                            <Avatar src={row.avatar} fallback={row.username} />
                          </div>
                          {isChamp && <div className="plb-avatar-pulse" aria-hidden="true" />}
                        </div>

                        <div className="plb-card-badge" aria-hidden="true">{badge}</div>

                        <div className="plb-card-name" itemProp="name">{row.username}</div>

                        <div className="plb-card-pts" aria-label={`${pts(row).toLocaleString()} points`}>
                          {animated ? <CountUp value={pts(row)} duration={1400} /> : 0}
                          <span className="plb-card-pts-label">{translate("plb_pts", lang)}</span>
                        </div>

                        <div className="plb-card-divider" />

                        <div className="plb-card-stats">
                          <div className="plb-card-stat">
                            <span className="plb-stat-icon" aria-hidden="true">🎯</span>
                            <span className="plb-stat-val">{row.predictions || 0}</span>
                            <span className="plb-stat-lbl">{translate("plb_picks", lang)}</span>
                          </div>
                          <div className="plb-card-stat">
                            <span className="plb-stat-icon" aria-hidden="true">✅</span>
                            <span className="plb-stat-val">{Number(row.win_rate || 0).toFixed(0)}%</span>
                            <span className="plb-stat-lbl">{translate("plb_correct", lang)}</span>
                          </div>
                        </div>

                        {row.tier && (
                          <div className="plb-card-tier" itemProp="jobTitle">
                            🏅 {row.tier}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="plb-pedestal" aria-hidden="true">
                      <div className="plb-pedestal-label">{label}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ══════════════════════════════════════════════════
            LIST — rows 4+
        ══════════════════════════════════════════════════ */}
        <section
          className="plb-list-wrap"
          aria-label="Full leaderboard rankings"
          itemScope
          itemType="https://schema.org/ItemList"
        >
          <meta itemProp="name" content="Cricket Prediction Leaderboard Rankings" />

          <div className="plb-list-header" role="row" aria-label="Leaderboard column headers">
            <span className="plb-list-col rank"  role="columnheader">{translate("plb_rank", lang)}</span>
            <span className="plb-list-col player" role="columnheader">{translate("plb_player", lang)}</span>
            <span className="plb-list-col picks"  role="columnheader">{translate("plb_picks", lang)}</span>
            <span className="plb-list-col acc"    role="columnheader">{translate("plb_accuracy", lang)}</span>
            <span className="plb-list-col pts"    role="columnheader">{translate("plb_points", lang)}</span>
          </div>

          <div className="plb-list" role="list">
            {rest.length === 0 && (
              <div className="plb-empty" role="status">
                <div aria-hidden="true">🏟️</div>
                <p>{translate("plb_no_entries", lang)}</p>
              </div>
            )}

            {rest.map((row, i) => {
              const isMe    = row.username === MY_USERNAME;
              const inTop10 = row.rank <= 10;
              const bonus   = inTop10 ? WEEKLY_BONUS[row.rank - 1] : null;
              const winRate = Number(row.win_rate || 0);

              return (
                <div
                  key={row.rank}
                  role="listitem"
                  aria-label={`Rank ${row.rank}: ${row.username} — ${pts(row).toLocaleString()} points${isMe ? " (you)" : ""}`}
                  className={`plb-row${isMe ? " is-me" : ""}${animated ? " show" : ""}`}
                  style={{ transitionDelay: `${i * 0.035}s` }}
                  itemProp="itemListElement"
                  itemScope
                  itemType="https://schema.org/ListItem"
                >
                  <meta itemProp="position" content={row.rank} />

                  {/* Rank */}
                  <div className="plb-row-rank">
                    {row.rank <= 3
                      ? <span className="plb-row-medal" aria-hidden="true">{"🥇🥈🥉"[row.rank - 1]}</span>
                      : <span className="plb-row-num">{row.rank}</span>
                    }
                  </div>

                  {/* Avatar */}
                  <div className="plb-row-avatar">
                    <Avatar src={row.avatar} fallback={row.username} />
                  </div>

                  {/* Info */}
                  <div
                    className="plb-row-info"
                    itemScope
                    itemType="https://schema.org/Person"
                    itemProp="item"
                  >
                    <div className="plb-row-name">
                      <span itemProp="name">{row.username}</span>
                      {isMe && <span className="plb-row-you">{translate("plb_you", lang)}</span>}
                      {inTop10 && bonus && tab === "weekly" && (
                        <span className="plb-bonus-chip" aria-label={`+${bonus} weekly bonus points`}>
                          +{bonus} {translate("plb_pts", lang)}
                        </span>
                      )}
                    </div>
                    <div className="plb-row-tier" itemProp="jobTitle">{row.tier || "Rookie"}</div>
                  </div>

                  {/* Picks */}
                  <div className="plb-row-picks" aria-label={`${row.predictions || 0} picks`}>
                    {row.predictions || 0}
                  </div>

                  {/* Accuracy bar */}
                  <div className="plb-row-acc" aria-label={`${winRate.toFixed(0)}% accuracy`}>
                    <div className="plb-acc-bar" aria-hidden="true">
                      <div
                        className="plb-acc-fill"
                        style={{ width: animated ? `${winRate}%` : "0%" }}
                      />
                    </div>
                    <span className="plb-acc-num">{winRate.toFixed(0)}%</span>
                  </div>

                  {/* Points */}
                  <div className="plb-row-pts" aria-label={`${pts(row).toLocaleString()} points`}>
                    <span className="plb-row-pts-val">{pts(row).toLocaleString()}</span>
                    <span className="plb-row-pts-lbl">{translate("plb_pts", lang)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── SEO: Hidden content for crawlers ── */}
        <div className="sr-only">
          <h2>About the Cricket Prediction Leaderboard</h2>
          <p>
            The 8JJ Games Cricket Prediction Leaderboard ranks players by their weekly and all-time
            prediction points. Every Monday the weekly leaderboard resets and the top 10 players
            receive bonus points — #1 earns 500 pts, #2 earns 400 pts, down to #10 who earns 60 pts.
          </p>
          <p>
            How to climb the leaderboard: make accurate cricket match predictions before each match
            deadline. Correct predictions earn points multiplied by the odds. Higher odds options
            carry greater risk but bigger rewards. Consistency and accuracy over the week are the
            keys to finishing in the top 10.
          </p>
          {top3.length > 0 && (
            <ul>
              {top3.map((row, i) => (
                <li key={row.username}>
                  #{i + 1}: {row.username} — {pts(row).toLocaleString()} points —{" "}
                  {Number(row.win_rate || 0).toFixed(0)}% accuracy
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>
    </>
  );
}