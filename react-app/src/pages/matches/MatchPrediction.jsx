// react-app/src/pages/matches/MatchPrediction.jsx
import { useEffect, useState } from "react";
import { matchesAPI } from "../../api/matches.api";
import toast from "react-hot-toast";
import "./MatchPrediction.css";

export default function MatchPrediction() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    try {
      const data = await matchesAPI.getActiveMatches();
      setMatches(data || []);
    } catch (err) {
      toast.error("Failed to load matches");
    } finally {
      setLoading(false);
    }
  };

  const handlePredict = async (matchId, team) => {
    try {
      const res = await matchesAPI.submitPrediction({
        match_id: matchId,
        predicted_team: team
      });

      if (res.awarded) {
        toast.success(`Prediction submitted! +${res.points} points 🎉`);
      } else {
        toast(res.message || "Prediction submitted");
      }

      loadMatches();
    } catch (err) {
      toast.error("Prediction failed");
    }
  };

  if (loading) return <div className="match-loading">Loading matches...</div>;

  return (
    <div className="match-container">
      <h2>🏏 Match Predictions</h2>

      {matches.map(match => (
        <div key={match.id} className="match-card">
          <div className="match-header">
            <span>{match.team_a}</span>
            <span className="vs">VS</span>
            <span>{match.team_b}</span>
          </div>

          <div className="match-date">
            {new Date(match.match_time).toLocaleString()}
          </div>

          {!match.user_prediction ? (
            <div className="match-actions">
              <button onClick={() => handlePredict(match.id, match.team_a)}>
                Predict {match.team_a}
              </button>
              <button onClick={() => handlePredict(match.id, match.team_b)}>
                Predict {match.team_b}
              </button>
            </div>
          ) : (
            <div className="match-predicted">
              ✅ You predicted: {match.user_prediction}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}