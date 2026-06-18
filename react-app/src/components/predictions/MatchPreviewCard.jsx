import { useState } from "react";
import "./MatchPreviewCard.css";

function TeamFlag({ name, logo }) {
  const [err, setErr] = useState(false);

  return (
    <div className="mpc-flag">
      {logo && !err ? (
        <img src={logo} alt={name} onError={() => setErr(true)} />
      ) : (
        (name || "").slice(0, 2).toUpperCase()
      )}
    </div>
  );
}

export default function MatchPreviewCard({ match }) {
  const isLive = match?.match_state === "live";
  const isCompleted = match?.match_state === "completed";

  const hasScore =
    match?.localteam_score && match?.visitorteam_score;

  const winner = match?.winner;

  const isTeamAWinner = winner && winner === match.team_a;
  const isTeamBWinner = winner && winner === match.team_b;

  const date = new Date(match?.starting_at);

  const dateLabel = isNaN(date)
    ? ""
    : date.toLocaleDateString("en-US", {
        weekday: "long",
        day: "numeric",
        month: "long",
      });

  const timeLabel = isNaN(date)
    ? ""
    : date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });

  return (
    <div
      className={`mpc 
        ${isLive ? "mpc--live" : ""}
        ${isCompleted ? "mpc--completed" : "mpc--upcoming"}
      `}
    >
      <div className="mpc-ghost2" />
      <div className="mpc-ghost" />
      <div className="mpc-stadium-bg" />
      <div className="mpc-overlay" />

      <div className="mpc-inner">
        <div className="mpc-date-pill">{dateLabel}</div>

        <div className="mpc-teams mpc-teams--row">
          {/* TEAM A */}
          <div className={`mpc-team ${isTeamAWinner ? "mpc-winner" : ""}`}>
            <TeamFlag name={match.team_a} logo={match.team_a_logo} />
            <span className="mpc-tname">{match.team_a}</span>
            <span className="mpc-tsub">
              {isTeamAWinner ? "Winner 🏆" : "Home"}
            </span>
          </div>

          {/* SCORE */}
          <div className="mpc-score-wrap">

  {hasScore ? (
    <div className="mpc-score-box">
      <div className="mpc-score-line">
        <span className="mpc-score-a">{match.localteam_score}</span>
        <span className="mpc-score-vs">vs</span>
        <span className="mpc-score-b">{match.visitorteam_score}</span>
      </div>

      {/* ✅ Winner (only for completed) */}
      {match.match_state === "completed" && match.winner && (
        <div className="mpc-winner">
          🏆 {match.winner}
        </div>
      )}
    </div>
  ) : (
    <div className="mpc-hex">
      {isLive ? (
        <span className="mpc-vs">LIVE</span>
      ) : (
        <span className="mpc-vs">VS</span>
      )}
    </div>
  )}

  {/* TIME / LIVE LABEL */}
  {isLive ? (
    <div className="mpc-live-pill">
      <span className="mpc-live-dot" />
      Live
    </div>
  ) : (
    <span className="mpc-time">{timeLabel}</span>
  )}

</div>

          {/* TEAM B */}
          <div className={`mpc-team ${isTeamBWinner ? "mpc-winner" : ""}`}>
            <TeamFlag name={match.team_b} logo={match.team_b_logo} />
            <span className="mpc-tname">{match.team_b}</span>
            <span className="mpc-tsub">
              {isTeamBWinner ? "Winner 🏆" : "Away"}
            </span>
          </div>
        </div>

        <div className="mpc-footer">
          <span className="mpc-tournament">
            {match.tournament || "Cricket"}
          </span>
        </div>
      </div>
    </div>
  );
}