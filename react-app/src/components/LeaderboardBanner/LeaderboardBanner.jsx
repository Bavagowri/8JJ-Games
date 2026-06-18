import { Trophy, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./LeaderboardBanner.css";

export default function LeaderboardBanner({ rank, points }) {
  const navigate = useNavigate();

  return (
    <div className="leaderboard-banner">
      <div className="leaderboard-banner-glow" />

      <div className="leaderboard-banner-content">
        <div className="leaderboard-banner-left">
          <div className="leaderboard-icon">
            <Trophy size={34} />
          </div>

          <div className="leaderboard-text">
            <h3>Climb the Leaderboard</h3>
            <p>
              {rank
                ? `You’re currently ranked #${rank} with ${points} points`
                : "Compete with players worldwide and earn rewards"}
            </p>
          </div>
        </div>

        <button
          className="leaderboard-cta"
          onClick={() => navigate("/leaderboard")}
        >
          View Leaderboard
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
