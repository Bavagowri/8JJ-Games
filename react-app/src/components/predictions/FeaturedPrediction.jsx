// react-app/src/pages/Predictions/PredictionLeaderboard.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { leaderboardAPI } from "../../api/predictionLeaderboard.api";
import { useAuth } from "../../context/AuthContext";
import "./PredictionLeaderboard.css";
import { useLanguage } from "../../context/LanguageContext";
import { translate } from "../../data/translations";

const TABS         = [{ key: "weekly", label: "This Week (7d)" }, { key: "alltime", label: "All Time" }];
const WEEKLY_BONUS = [500, 400, 300, 250, 200, 150, 120, 100, 80, 60];
const API_URL      = import.meta.env.VITE_API_URL || "";

// Podium order: 2nd left, 1st centre, 3rd right
const PODIUM_MAP = [
  { dataIdx: 1, rankClass: "p2", label: "#2", badge: "🥈 Runner-Up"   },
  { dataIdx: 0, rankClass: "p1", label: "#1", badge: "🏆 Champion"    },
  { dataIdx: 2, rankClass: "p3", label: "#3", badge: "🥉 Third Place" },
];

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

export default function PredictionLeaderboard() {
  const { user }                        = useAuth();
  const [leaderboard, setLeaderboard]   = useState([]);
  const [loading, setLoading]           = useState(true);
  const [tab, setTab]                   = useState("weekly");
  const [animated, setAnimated]         = useState(false);
  const MY_USERNAME                     = user?.username || "";
  const { lang } = useLanguage();

  useEffect(() => {
    (async () => {
      try {
        const data = await leaderboardAPI.getLeaderboard();
        setLeaderboard(data.leaderboard || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
        setTimeout(() => setAnimated(true), 80);
      }
    })();
  }, []);

  const sorted = [...leaderboard]
    .sort((a, b) => tab === "weekly"
      ? b.weekly_points - a.weekly_points
      : b.total_points  - a.total_points)
    .map((row, i) => ({ ...row, rank: i + 1 }));

  const top3    = sorted.slice(0, 3);
  const rest    = sorted.slice(3);
  const myRow   = sorted.find((r) => r.username === MY_USERNAME);
  const isTop10 = myRow && myRow.rank <= 10;
  const pts     = (row) => tab === "weekly" ? (row.weekly_points || 0) : (row.total_points || 0);

  if (loading) {
    return (
      <div className="plb-page" style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:"60vh" }}>
        <div style={{ textAlign:"center", color:"rgba(255,255,255,0.3)" }}>
          <div style={{ fontSize:40, marginBottom:12 }}>🏆</div>
          <p style={{ margin:0, fontSize:14, fontFamily:"Inter,sans-serif" }}>{translate("plb_loading", lang)}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="plb-page">

        {/* Back link */}
        <div className="plb-topbar">
          <Link to="/predictions" className="plb-back">← {translate("plb_back_predictions", lang)}</Link>
        </div>

        {/* Header row: title left, tabs right */}
        <div className="plb-header">
          <div className="plb-header-left">
            <h1>Prediction Leaderboard {translate("plb_title", lang)}</h1>
            <p className="plb-header-sub">Top predictors earn weekly bonus points every Monday</p>
          </div>
          <div className="plb-tabs">
            {TABS.map((t) => (
              <button
                key={t.key}
                className={`plb-tab${tab === t.key ? " active" : ""}`}
                onClick={() => setTab(t.key)}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bonus banner */}
        <div className="plb-banner">
          <span className="plb-banner-icon">🎁</span>
          <div>
            <strong>Weekly Top 10 Bonus</strong> — Every Monday:{" "}
            {[500, 400, 300].map((b, i) => (
              <span key={i} style={{ marginRight: 8 }}>
                #{i + 1}: <strong style={{ color: "#fbbf24" }}>{b} pts</strong>
              </span>
            ))}
            <span style={{ opacity: 0.4, fontSize: 11 }}>… down to #10</span>
          </div>
          {isTop10 && <div className="plb-banner-you">✨ You're Top 10!</div>}
        </div>

        {/* ── Podium ── */}
        {top3.length > 0 && (
          <div className="plb-podium">
            {PODIUM_MAP.map(({ dataIdx, rankClass, label, badge }, i) => {
              const row = top3[dataIdx];
              if (!row) return <div key={i} style={{ flex: 1 }} />;
              return (
                <div
                  key={row.username}
                  className={`plb-podium-slot ${rankClass}${animated ? " show" : ""}`}
                >
                  <div className="plb-rank-label">{label}</div>

                  <div className="plb-card">
                    {/* Badge */}
                    <div className="plb-card-badge">{badge}</div>

                    {/* Avatar */}
                    <div className="plb-avatar-wrap">
                      <div className="plb-avatar-ring" />
                      <div className="plb-avatar">
                        <Avatar src={row.avatar} fallback={row.username} />
                      </div>
                    </div>

                    {/* Name */}
                    <div className="plb-card-name">{row.username}</div>

                    {/* Points */}
                    <div className="plb-card-pts">
                      {pts(row).toLocaleString()}
                      {rankClass === "p1" && <span style={{ fontSize: 20 }}> ⚡</span>}
                    </div>

                    {/* Stats */}
                    <div className="plb-card-stats">
                      <div className="plb-card-stat">
                        🎯 {row.predictions || 0} picks
                      </div>
                      <div className="plb-card-stat">
                        🔥 {Number(row.win_rate || 0).toFixed(0)}% correct
                      </div>
                    </div>

                    {/* Tier */}
                    <div className="plb-card-tier">
                      🏅 {row.tier || "Rookie"}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── List rows 4+ ── */}
        <div className="plb-list">
          {rest.length === 0 && (
            <div style={{ textAlign:"center", padding:"32px 0", color:"rgba(255,255,255,0.2)", fontSize:13 }}>
              No more entries yet
            </div>
          )}
          {rest.map((row, i) => {
            const isMe    = row.username === MY_USERNAME;
            const inTop10 = row.rank <= 10;
            const bonus   = inTop10 ? WEEKLY_BONUS[row.rank - 1] : null;

            return (
              <div
                key={row.rank}
                className={`plb-row${isMe ? " is-me" : ""}${animated ? " show" : ""}`}
                style={{ transitionDelay: `${i * 0.035}s` }}
              >
                {/* Rank */}
                <div className="plb-row-rank">
                  {row.rank <= 3
                    ? ["🥇","🥈","🥉"][row.rank - 1]
                    : row.rank}
                </div>

                {/* Avatar */}
                <div className="plb-row-avatar">
                  <Avatar src={row.avatar} fallback={row.username} />
                </div>

                {/* Info */}
                <div className="plb-row-info">
                  <div className="plb-row-name">
                    {row.username}
                    {isMe && <span className="plb-row-you">YOU</span>}
                    {inTop10 && bonus && tab === "weekly" && (
                      <span className="plb-bonus-chip">+{bonus} bonus</span>
                    )}
                  </div>
                  <div className="plb-row-sub">
                    {row.predictions || 0} picks · {Number(row.win_rate || 0).toFixed(0)}% correct
                  </div>
                </div>

                {/* Win rate */}
                <div className="plb-row-winrate">
                  {Number(row.win_rate || 0).toFixed(0)}%
                </div>

                {/* Points */}
                <div className="plb-row-pts">
                  {pts(row).toLocaleString()}
                  <div className="plb-row-pts-label">pts</div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* ── Sticky my-position bar ── */}
      {myRow && (
        <div className="plb-mypos">
          <div>
            <div className="plb-mypos-label">Your Rank</div>
            <div className="plb-mypos-rank">#{myRow.rank}</div>
          </div>
          <div className="plb-row-avatar" style={{ width:38, height:38, fontSize:16, flexShrink:0 }}>
            <Avatar src={myRow.avatar} fallback={myRow.username} />
          </div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontWeight:600, fontSize:13, color:"#fff", overflow:"hidden", whiteSpace:"nowrap", textOverflow:"ellipsis" }}>
              {myRow.username}
            </div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.35)", marginTop:2 }}>
              {myRow.predictions || 0} picks · {Number(myRow.win_rate || 0).toFixed(0)}% correct
            </div>
          </div>
          <div className="plb-mypos-pts">{pts(myRow).toLocaleString()} pts</div>
        </div>
      )}
    </>
  );
}