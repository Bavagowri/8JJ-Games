// react-app/src/components/Legal/ResponsibleGamingContent.jsx
import React, { useState } from "react";
import "./ResponsibleGaming.css";
import { translate } from "../../data/translations";

export default function ResponsibleGamingContent({ lang = "en" }) {
  const [checked, setChecked] = useState({});

  const toggle = (i) =>
    setChecked((prev) => ({ ...prev, [i]: !prev[i] }));

  const checklist = translate("rg_checklist", lang);

  const TIPS = [
    { icon: "⏱️", titleKey: "rg_tip_set_time",  bodyKey: "rg_tip_set_time_body"  },
    { icon: "💰", titleKey: "rg_tip_budget",     bodyKey: "rg_tip_budget_body"    },
    { icon: "🧠", titleKey: "rg_tip_mindful",    bodyKey: "rg_tip_mindful_body"   },
    
  ];

  return (
    <div className="legal-page rg-page">

      {/* HERO */}
      <div className="legal-hero">
        <div className="legal-hero-glow" />
        <div className="legal-hero-inner">
          <span className="legal-badge">🛡️ {translate("rg_hero_badge", lang)}</span>
          <h1>{translate("rg_hero_title", lang)} <em>{translate("rg_hero_titleEm", lang)}</em></h1>
          <p className="legal-effective">{translate("rg_hero_subtitle", lang)}</p>
        </div>
      </div>

      <div className="legal-container">

        {/* Commitment */}
        <div className="legal-intro">
          <p>{translate("rg_commitment_intro", lang)}</p>
        </div>

        {/* 1 — What Is Responsible Gaming */}
        <div className="legal-section">
          <div className="legal-section-num">1</div>
          <div className="legal-section-body">
            <h2>{translate("rg_s1_title", lang)}</h2>
            <p>{translate("rg_s1_para1", lang)}</p>
            <p>{translate("rg_s1_para2", lang)}</p>
          </div>
        </div>

        {/* 2 — Healthy Gaming Habits / Tips */}
        <div className="legal-section">
          <div className="legal-section-num">2</div>
          <div className="legal-section-body">
            <h2>{translate("rg_s2_title", lang)}</h2>
            <p>{translate("rg_s2_para", lang)}</p>
            <div className="rg-tips-grid">
              {TIPS.map((tip, i) => (
                <div className="rg-tip-card" key={i}>
                  <div className="rg-tip-icon">{tip.icon}</div>
                  <h4>{translate(tip.titleKey, lang)}</h4>
                  <p>{translate(tip.bodyKey, lang)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3 — Protecting Minors */}
        <div className="legal-section">
          <div className="legal-section-num">3</div>
          <div className="legal-section-body">
            <h2>{translate("rg_s3_title", lang)}</h2>
            <p>{translate("rg_s3_intro", lang)}</p>
            <ul className="legal-simple-list">
              <li>{translate("rg_s3_b1", lang)}</li>
              <li>{translate("rg_s3_b2", lang)}</li>
              <li>{translate("rg_s3_b3", lang)}</li>
              <li>{translate("rg_s3_b4", lang)}</li>
            </ul>
          </div>
        </div>

        {/* 4 — External Support Resources */}
        <div className="legal-section">
          <div className="legal-section-num">4</div>
          <div className="legal-section-body">
            <h2>{translate("rg_s4_title", lang)}</h2>
            <p>{translate("rg_s4_intro", lang)}</p>
            <ul className="legal-simple-list">
              <li>
                <strong style={{ color: "#f1f5f9" }}>{translate("rg_support_icall", lang)}:</strong>{" "}
                9152987821
              </li>
              <li>
                <strong style={{ color: "#f1f5f9" }}>{translate("rg_support_vandrevala", lang)}:</strong>{" "}
                1860-2662-345 (24/7)
              </li>
              <li>
                <strong style={{ color: "#f1f5f9" }}>{translate("rg_support_nimhans", lang)}:</strong>{" "}
                080-46110007
              </li>
              <li>
                <strong style={{ color: "#f1f5f9" }}>{translate("rg_support_ga", lang)}:</strong>{" "}
                <a href="https://www.gamblersanonymous.org" target="_blank" rel="noopener noreferrer" style={{ color: "#f59e0b" }}>
                  gamblersanonymous.org
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Self-Assessment Checklist */}
        {Array.isArray(checklist) && checklist.length > 0 && (
          <div className="rg-checklist-section">
            {checklist.map((item, i) => (
              <label key={i} className={`rg-checklist-item ${checked[i] ? "checked" : ""}`}>
                <input
                  type="checkbox"
                  checked={!!checked[i]}
                  onChange={() => toggle(i)}
                />
                <span>{item}</span>
              </label>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="rg-help-box">
          <div className="rg-help-icon">💬</div>
          <h3>{translate("rg_help_title", lang)}</h3>
          <p>{translate("rg_help_text", lang)}</p>
          <a href="mailto:8jjcorporate@gmail.com" className="rg-help-btn">
            {translate("rg_help_button", lang)}
          </a>
        </div>

      </div>
    </div>
  );
}