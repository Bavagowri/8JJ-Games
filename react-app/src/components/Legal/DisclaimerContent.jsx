// react-app/src/components/Legal/DisclaimerContent.jsx
import React from "react";
import "./Disclaimer.css";
import { translate } from "../../data/translations";

// ── Component 
export default function DisclaimerContent({ lang = "en" }) {
  const bullets = translate("s3bullets", lang);

  return (
    <div className="legal-page disc-page">

      {/* HERO */}
      <div className="legal-hero">
        <div className="legal-hero-glow" />
        <div className="legal-hero-inner">
          <span className="legal-badge">⚠️ {translate("badge", lang)}</span>
          <h1>
            <em>{translate("title", lang)}</em>
          </h1>
          <p className="legal-effective">{translate("date", lang)}</p>
        </div>
      </div>

      <div className="legal-container">

        {/* Intro */}
        <div className="legal-intro">
          <p>
            <strong style={{ color: "#f1f5f9" }}>
              {translate("introTitle", lang)}:
            </strong>{" "}
            {translate("introPara", lang)}
          </p>
        </div>

        {/* 1 */}
        <div className="legal-section">
          <div className="legal-section-num">1</div>
          <div className="legal-section-body">
            <h2>{translate("s1", lang)}</h2>
            <p>{translate("s1p1", lang)}</p>
            <p>{translate("s1p2", lang)}</p>
          </div>
        </div>

        {/* 2 */}
        <div className="legal-section">
          <div className="legal-section-num">2</div>
          <div className="legal-section-body">
            <h2>{translate("s2", lang)}</h2>
            <p>{translate("s2p", lang)}</p>
          </div>
        </div>

        {/* 3 */}
        <div className="legal-section">
          <div className="legal-section-num">3</div>
          <div className="legal-section-body">
            <h2>{translate("s3", lang)}</h2>
            <p>{translate("s3p1", lang)}</p>
            <ul className="legal-simple-list">
              {Array.isArray(bullets)
                ? bullets.map((b, i) => <li key={i}>{b}</li>)
                : null}
            </ul>
            <div className="legal-highlight" style={{ marginTop: "16px" }}>
              {translate("s3callout", lang)}
            </div>
          </div>
        </div>

        {/* 4 */}
        <div className="legal-section">
          <div className="legal-section-num">4</div>
          <div className="legal-section-body">
            <h2>{translate("s4", lang)}</h2>
            <p>{translate("s4p", lang)}</p>
          </div>
        </div>

        {/* 5 */}
        <div className="legal-section">
          <div className="legal-section-num">5</div>
          <div className="legal-section-body">
            <h2>{translate("s5", lang)}</h2>
            <p>{translate("s5p", lang)}</p>
          </div>
        </div>

        {/* 6 */}
        <div className="legal-section">
          <div className="legal-section-num">6</div>
          <div className="legal-section-body">
            <h2>{translate("s6", lang)}</h2>
            <p>{translate("s6p", lang)}</p>
          </div>
        </div>

        {/* 7 */}
        <div className="legal-section">
          <div className="legal-section-num">7</div>
          <div className="legal-section-body">
            <h2>{translate("s7", lang)}</h2>
            <p>{translate("s7p", lang)}</p>
          </div>
        </div>

        {/* 8 */}
        <div className="legal-section">
          <div className="legal-section-num">8</div>
          <div className="legal-section-body">
            <h2>{translate("s8", lang)}</h2>
            <p>{translate("s8p", lang)}</p>
          </div>
        </div>

        {/* 9 – Contact */}
        <div className="legal-section">
          <div className="legal-section-num">9</div>
          <div className="legal-section-body">
            <h2>{translate("s9", lang)}</h2>
            <div className="legal-contact">
              <p>
                <strong>{translate("emailLabel", lang)}</strong>
                <a href="mailto:8jjcorporate@gmail.com">8jjcorporate@gmail.com</a>
              </p>
              <p>
                <strong>{translate("webLabel", lang)}</strong>
                <a href="https://8jjgames.com/contact" target="_blank" rel="noopener noreferrer">
                  8jjgames.com/contact
                </a>
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}