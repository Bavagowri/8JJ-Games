// react-app/src/components/predictions/PredictionHero.jsx
import { Link } from "react-router-dom";
import "./Predictions.css";
import { useLanguage } from "../../context/LanguageContext";
import { translate } from "../../data/translations";

export default function PredictionHero() {
  const { lang } = useLanguage();

  return (
    <section className="prediction-hero">
      <div className="hero-live-badge">
        <span className="hero-live-dot" />
       {translate("ph_live_events", lang)}
      </div>

      <h1>
        <span>{translate("ph_cricket", lang)}</span> {translate("ph_prediction_arena", lang)}
      </h1>

      <p>{translate("ph_predict_desc", lang)}</p>

      <div className="hero-actions">
        <a href="#matches" className="hero-btn-primary">
          🏏 {translate("ph_explore_matches", lang)}
        </a>
        <Link to="/my-predictions" className="hero-btn-secondary">
          {translate("ph_my_predictions", lang)} →
        </Link>
      </div>
    </section>
  );
}