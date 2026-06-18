// react-app/src/components/Legal/TermsConditionsContent.jsx
import React from "react";
import "./TermsConditions.css";
import { translate } from "../../data/translations";

export default function TermsConditionsContent({ lang = "en" }) {
  const s3bullets = translate("tc_s3bullets", lang);
  const s5bullets = translate("tc_s5bullets", lang);
  const s8bullets = translate("tc_s8bullets", lang);

  return (
    <div className="legal-page tc-page">

      {/* HERO */}
      <div className="legal-hero">
        <div className="legal-hero-glow" />
        <div className="legal-hero-inner">
          <span className="legal-badge">📋 {translate("tc_badge", lang)}</span>
          <h1>
           


            {translate("tc_title", lang)}
            <em> {translate("tc_titleEm", lang)}</em>

            
          </h1>
          <p className="legal-effective">{translate("tc_date", lang)}</p>
        </div>
      </div>

      <div className="legal-container">

        <div className="legal-intro">
          <p>{translate("tc_introPara", lang)}</p>
        </div>

        {/* 1 */}
        <div className="legal-section">
          <div className="legal-section-num">1</div>
          <div className="legal-section-body">
            <h2>{translate("tc_s1", lang)}</h2>
            <p>{translate("tc_s1p", lang)}</p>
          </div>
        </div>

        {/* 2 */}
        <div className="legal-section">
          <div className="legal-section-num">2</div>
          <div className="legal-section-body">
            <h2>{translate("tc_s2", lang)}</h2>
            <p>{translate("tc_s2p", lang)}</p>
          </div>
        </div>

       

        


        {/* 6 */}
        <div className="legal-section">
          <div className="legal-section-num">5</div>
          <div className="legal-section-body">
            <h2>{translate("tc_s6", lang)}</h2>
            <p>{translate("tc_s6p", lang)}</p>
          </div>
        </div>

        

        {/* 8 */}
        <div className="legal-section">
          <div className="legal-section-num">6</div>
          <div className="legal-section-body">
            <h2>{translate("tc_s8", lang)}</h2>
            <p>{translate("tc_s8p", lang)}</p>
            <ul className="legal-simple-list">
              {Array.isArray(s8bullets)
                ? s8bullets.map((b, i) => <li key={i}>{b}</li>)
                : null}
            </ul>
            {/* <div className="legal-highlight" style={{ marginTop: "14px" }}>
              {translate("tc_s8callout", lang)}
            </div> */}
          </div>
        </div>

        {/* 9 */}
        <div className="legal-section">
          <div className="legal-section-num">7</div>
          <div className="legal-section-body">
            <h2>{translate("tc_s9", lang)}</h2>
            <p>{translate("tc_s9p", lang)}</p>
          </div>
        </div>

        {/* 10 */}
        <div className="legal-section">
          <div className="legal-section-num">8</div>
          <div className="legal-section-body">
            <h2>{translate("tc_s10", lang)}</h2>
            <p>{translate("tc_s10p", lang)}</p>
          </div>
        </div>

        {/* 11 */}
        <div className="legal-section">
          <div className="legal-section-num">9</div>
          <div className="legal-section-body">
            <h2>{translate("tc_s11", lang)}</h2>
            <p>{translate("tc_s11p", lang)}</p>
          </div>
        </div>

        {/* 12 */}
        <div className="legal-section">
          <div className="legal-section-num">10</div>
          <div className="legal-section-body">
            <h2>{translate("tc_s12", lang)}</h2>
            <p>{translate("tc_s12p", lang)}</p>
          </div>
        </div>

        {/* 13 – Contact */}
        <div className="legal-section">
          <div className="legal-section-num">11</div>
          <div className="legal-section-body">
            <h2>{translate("tc_s13", lang)}</h2>
            <div className="legal-contact">
              <p>
                <strong>{translate("tc_emailLbl", lang)}</strong>
                <a href="mailto:8jjcorporate@gmail.com">8jjcorporate@gmail.com</a>
              </p>
              <p>
                <strong>{translate("tc_webLbl", lang)}</strong>
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