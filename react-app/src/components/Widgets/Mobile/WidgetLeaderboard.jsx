// react-app/src/components/Widgets/Mobile/WidgetLeaderboard.jsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { leaderboardAPI } from "../../../api/predictionLeaderboard.api";
import "./MobileWidgets.css";

import { useLanguage } from "../../../context/LanguageContext";
import { translate } from "../../../data/translations";

const API_URL = import.meta.env.VITE_API_URL || "";

const RANK_EMOJI   = { 1: "👑", 2: "🥈", 3: "🥉" };
const PODIUM_CLASS = { 1: "rank-1", 2: "rank-2", 3: "rank-3" };

// ─── Avatar ───────────────────────────────────────────────────────────────────

function Avatar({ src, fallback }) {
  const [err, setErr] = useState(false);
  if (!err && src) {
    return (
      <img
        src={`${API_URL}${src}`}
        alt={fallback}
        onError={() => setErr(true)}
        style={{
          width: "100%", height: "100%",
          objectFit: "cover", borderRadius: "50%", display: "block",
        }}
      />
    );
  }
  return <span>{(fallback || "?")[0].toUpperCase()}</span>;
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function LeaderboardSkeleton({ limit, lang }) {
  return (
    <div className="mwlCover">
      <div className="mwl MobileWidgetLeaderboard" style={{ opacity: 0.4 }}>
        <div className="mwl-header">
          <div className="mwl-title-group">
            <div className="mwl-icon">🏆</div>
            <span className="mwl-title">{translate("wl_title", lang)}</span>
          </div>
        </div>
        <div className="mwl-list">
          {Array.from({ length: limit }).map((_, i) => (
            <div key={i} className="mwl-row">
              <div className="mwl-rank">—</div>
              <div className="mwl-user">
                <div className="mwl-avatar">?</div>
                <div>
                  <div style={{ width: 72, height: 11, background: "rgba(255,255,255,0.06)", borderRadius: 4 }} />
                  <div style={{ width: 48, height: 9, background: "rgba(255,255,255,0.04)", borderRadius: 4, marginTop: 4 }} />
                </div>
              </div>
              <div className="mwl-pts">—</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Public export ────────────────────────────────────────────────────────────

export default function WidgetLeaderboard({
  limit     = 5,
  showBonus = true,
}) {
  const navigate    = useNavigate();
  const { user }    = useAuth();
  const { lang }    = useLanguage();
  const MY_USERNAME = user?.username || "";

  const [leaderboard, setLeaderboard] = useState([]);
  const [tab,         setTab]         = useState("weekly");
  const [loading,     setLoading]     = useState(true);

  useEffect(() => {
    leaderboardAPI
      .getLeaderboard()
      .then((data) => setLeaderboard(data.leaderboard || []))
      .catch((err) => console.error("WidgetLeaderboard mobile fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  const sorted = [...leaderboard]
    .sort((a, b) =>
      tab === "weekly"
        ? b.weekly_points - a.weekly_points
        : b.total_points  - a.total_points
    )
    .map((row, i) => ({ ...row, rank: i + 1 }));

  const visible     = sorted.slice(0, limit);
  const myRow       = sorted.find((r) => r.username === MY_USERNAME);
  const pts         = (row) => tab === "weekly"
    ? (row.weekly_points || 0)
    : (row.total_points  || 0);

  const myRankLabel = myRow
    ? `#${myRow.rank} of ${sorted.length.toLocaleString()}`
    : "—";

  const podiumRows = visible.filter((r) => r.rank <= 3);
  const listRows   = visible.filter((r) => r.rank > 3);

  if (loading) return <LeaderboardSkeleton limit={limit} lang={lang} />;

  return (
    <div className="mwlCover">
      <div className="mwl MobileWidgetLeaderboard">

        {/* ── Header ──────────────────────────────────── */}
        <div className="mwl-header">
          <div className="mwl-title-group">
            <div className="mwl-icon">🏆</div>
            <span className="mwl-title">{translate("wl_title", lang)}</span>
          </div>

          <div className="mwl-tabs">
            <button
              className={`mwl-tab${tab === "weekly"  ? " active" : ""}`}
              onClick={() => setTab("weekly")}
            >
              {translate("wl_tab_week", lang)}
            </button>
            <button
              className={`mwl-tab${tab === "alltime" ? " active" : ""}`}
              onClick={() => setTab("alltime")}
            >
              {translate("wl_tab_all_time", lang)}
            </button>
          </div>
        </div>

        {/* ── Podium strip (top 3) ─────────────────────── */}
        {podiumRows.length > 0 && (
          <div className="mwl-podium">
            {podiumRows.map((row) => (
              <div
                key={row.rank}
                className={`mwl-podium-card ${PODIUM_CLASS[row.rank] || ""}`}
              >
                <span className="mwl-podium-crown">{RANK_EMOJI[row.rank]}</span>
                <div className="mwl-podium-avatar">
                  <Avatar src={row.avatar} fallback={row.username} />
                </div>
                <span className="mwl-podium-name">
                  {row.username}
                  {row.username === MY_USERNAME && (
                    <span className="mwl-me-tag" style={{ marginLeft: 3 }}>
                      {translate("wl_you", lang)}
                    </span>
                  )}
                </span>
                <span className="mwl-podium-pts">{pts(row).toLocaleString()}</span>
                <span className="mwl-podium-wins">
                  {row.predictions || 0} {translate("wl_picks", lang)} · {Number(row.win_rate || 0).toFixed(0)}% {translate("wl_correct", lang)}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* ── Remaining rows (#4+) ─────────────────────── */}
        {listRows.length > 0 && (
          <div className="mwl-list">
            {listRows.map((row) => {
              const isMe = row.username === MY_USERNAME;
              return (
                <div
                  key={row.rank}
                  className={`mwl-row${isMe ? " is-me" : ""}`}
                >
                  <div className="mwl-rank">#{row.rank}</div>

                  <div className="mwl-user">
                    <div className="mwl-avatar">
                      <Avatar src={row.avatar} fallback={row.username} />
                    </div>
                    <div>
                      <div className="mwl-name">
                        {row.username}
                        {isMe && (
                          <span className="mwl-me-tag">
                            {translate("wl_you", lang)}
                          </span>
                        )}
                      </div>
                      <div className="mwl-wins">
                        {row.predictions || 0} {translate("wl_picks", lang)} · {Number(row.win_rate || 0).toFixed(0)}% {translate("wl_correct", lang)}
                      </div>
                    </div>
                  </div>

                  <div className="mwl-pts">{pts(row).toLocaleString()}</div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Empty state ──────────────────────────────── */}
        {visible.length === 0 && (
          <div style={{ padding: "20px", textAlign: "center", color: "var(--mw-text-muted)", fontSize: 12 }}>
            {translate("wl_no_data", lang)}
          </div>
        )}

        {/* ── Footer ──────────────────────────────────── */}
        <div className="mwl-footer">
          <span className="mwl-my-rank">
            {translate("wl_your_rank", lang)}: <strong>{myRankLabel}</strong>
          </span>
          <button
            className="mwl-view-all"
            onClick={() => navigate("/predictions/leaderboard")}
          >
            {translate("wl_full_board", lang)} →
          </button>
        </div>

      </div>
    </div>
  );
}