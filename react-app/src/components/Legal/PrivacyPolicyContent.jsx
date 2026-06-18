// react-app/src/components/Legal/PrivacyPolicyContent.jsx
import React from "react";
import { useLanguage } from "../../context/LanguageContext";
import { translate } from "../../data/translations";
import "./PrivacyPolicy.css";

export default function PrivacyPolicyContent() {
  const { lang } = useLanguage();

  return (
    <div className="legal-page pp-page">

      {/* ── HERO ── */}
      <div className="legal-hero">
        <div className="legal-hero-glow" />
        <div className="legal-hero-inner">
            <span className="legal-badge">⚠️ {translate("badge", lang)}</span>
          <h1>
            {translate("privacyPolicyTitle", lang)
              .split(" ")
              .map((word, i, arr) =>
                i === arr.length - 1
                  ? <em key={i}> {word}</em>
                  : <span key={i}>{word} </span>
              )}
          </h1>
          <p className="legal-effective">
            <strong>{translate("effectiveDate", lang)}</strong>
            {translate("effectiveDateValue", lang)}
          </p>
        </div>
      </div>

      {/* ── BODY ── */}
      <div className="legal-container">

        {/* Intro */}
        <div className="legal-intro">
          <p>{translate("introPara1", lang)}</p>
          <p>{translate("introPara2", lang)}</p>
        </div>

        {/* 1 – Information We Collect */}
        <div className="legal-section">
          <div className="legal-section-num">1</div>
          <div className="legal-section-body">
            <h2>{translate("section1Title", lang)}</h2>

            <div className="legal-subsection">
              <h3>{translate("section1SubA", lang)}</h3>
              <ul className="legal-info-list">
                <li>
                  <span className="legal-list-title">{translate("accountInfo", lang)}</span>
                  <span className="legal-list-detail">{translate("accountInfoDetail", lang)}</span>
                </li>
                <li>
                  <span className="legal-list-title">{translate("profileData", lang)}</span>
                  <span className="legal-list-detail">{translate("profileDataDetail", lang)}</span>
                </li>
                <li>
                  <span className="legal-list-title">{translate("userContent", lang)}</span>
                  <span className="legal-list-detail">{translate("userContentDetail", lang)}</span>
                </li>
              </ul>
            </div>

            <div className="legal-subsection">
              <h3>{translate("section1SubB", lang)}</h3>
              <ul className="legal-info-list">
                <li>
                  <span className="legal-list-title">{translate("gameplayData", lang)}</span>
                  <span className="legal-list-detail">{translate("gameplayDataDetail", lang)}</span>
                </li>
                <li>
                  <span className="legal-list-title">{translate("deviceInfo", lang)}</span>
                  <span className="legal-list-detail">{translate("deviceInfoDetail", lang)}</span>
                </li>
                <li>
                  <span className="legal-list-title">{translate("logData", lang)}</span>
                  <span className="legal-list-detail">{translate("logDataDetail", lang)}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* 2 – How We Use */}
        <div className="legal-section">
          <div className="legal-section-num">2</div>
          <div className="legal-section-body">
            <h2>{translate("section2Title", lang)}</h2>
            <ul className="legal-simple-list">
              <li>{translate("use1", lang)}</li>
              <li>{translate("use2", lang)}</li>
              <li>{translate("use3", lang)}</li>
              <li>{translate("use4", lang)}</li>
              <li>{translate("use5", lang)}</li>
            </ul>
          </div>
        </div>

        {/* 3 – Sharing */}
        <div className="legal-section">
          <div className="legal-section-num">3</div>
          <div className="legal-section-body">
            <h2>{translate("section3Title", lang)}</h2>
            <div className="legal-highlight">{translate("noSellText", lang)}</div>
            <ul className="legal-simple-list">
              <li>{translate("share1", lang)}</li>
              <li>{translate("share2", lang)}</li>
            </ul>
          </div>
        </div>

        {/* 4 – Third-Party */}
        <div className="legal-section">
          <div className="legal-section-num">4</div>
          <div className="legal-section-body">
            <h2>{translate("section4Title", lang)}</h2>
            <p>{translate("thirdPartyText", lang)}</p>
          </div>
        </div>

        {/* 5 – Security */}
        <div className="legal-section">
          <div className="legal-section-num">5</div>
          <div className="legal-section-body">
            <h2>{translate("section5Title", lang)}</h2>
            <p>{translate("securityText", lang)}</p>
          </div>
        </div>

        {/* 6 – Children */}
        <div className="legal-section">
          <div className="legal-section-num">6</div>
          <div className="legal-section-body">
            <h2>{translate("section6Title", lang)}</h2>
            <p>{translate("childrenText", lang)}</p>
          </div>
        </div>

        {/* 7 – Your Rights */}
        <div className="legal-section">
          <div className="legal-section-num">7</div>
          <div className="legal-section-body">
            <h2>{translate("section7Title", lang)}</h2>
            <ul className="legal-simple-list">
              <li>{translate("right1", lang)}</li>
              <li>{translate("right2", lang)}</li>
            </ul>
          </div>
        </div>

        {/* 8 – Changes */}
        <div className="legal-section">
          <div className="legal-section-num">8</div>
          <div className="legal-section-body">
            <h2>{translate("section8Title", lang)}</h2>
            <p>{translate("changesText", lang)}</p>
          </div>
        </div>

        {/* 9 – Contact */}
        <div className="legal-section">
          <div className="legal-section-num">9</div>
          <div className="legal-section-body">
            <h2>{translate("section9Title", lang)}</h2>
            <div className="legal-contact">
              <p>
                <strong>{translate("emailLabel", lang)}</strong>
                <a href="mailto:8jjcorporate@gmail.com">8jjcorporate@gmail.com</a>
              </p>
              <p>
                <strong>{translate("websiteLabel", lang)}</strong>
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