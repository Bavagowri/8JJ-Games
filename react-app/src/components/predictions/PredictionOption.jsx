// react-app/src/components/predictions/PredictionOption.jsx
import "./Predictions.css";

export default function PredictionOption({ team, onClick, disabled, selected }) {
  return (
    <button
      className={`prediction-option${selected ? " selected" : ""}`}
      onClick={onClick}
      disabled={disabled}
    >
      {team}
    </button>
  );
}