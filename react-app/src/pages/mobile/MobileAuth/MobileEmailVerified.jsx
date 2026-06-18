// src/pages/mobile/MobileAuth/MobileEmailVerified.jsx

import { useState, useEffect } from "react";
import { translate } from "../../../data/translations";
import { useLanguage } from "../../../context/LanguageContext";

export default function MobileEmailVerified() {
  const { lang } = useLanguage();
  const [pageLoaded, setPageLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setPageLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`mobile-email-verify-wrapper ${pageLoaded ? 'loaded' : ''}`}>
      {/* Subtle particle background */}
      <div className="mobile-verify-particles" aria-hidden="true">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="mobile-verify-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${6 + Math.random() * 6}s`
            }}
          />
        ))}
      </div>

      {/* Card */}
      <div className="mobile-email-verify-card">
        {/* Animated checkmark */}
        <div className="mobile-verify-icon-wrapper">
          <svg className="mobile-verify-check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path className="mobile-verify-circle" d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline className="mobile-verify-checkmark" points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>

        {/* Logo */}
        <a href="/" aria-label={translate("homeAriaLabel", lang)} className="mobile-verify-logo-link">
          <img
            src="/8JJ_games.png"
            alt={translate("logoAlt", lang)}
            className="mobile-verify-logo"
          />
        </a>

        {/* Success text */}
        <h1 className="mobile-verify-title">{translate("emailVerified", lang)}</h1>

        <p className="mobile-verify-subtitle">
          <span className="mobile-verify-check-text">✓</span> {translate("accountNowActive", lang)}
        </p>

        <p className="mobile-verify-description">
          {translate("welcomeToGames", lang)}
        </p>

        {/* Primary CTA: Continue to Login */}
        <a href="/login" className="mobile-verify-login-btn">
          <span>{translate("continueToLogin", lang)}</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
          </svg>
        </a>

        {/* Secondary: Back to Home */}
        <a href="/" className="mobile-verify-home-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          <span>{translate("backToHome", lang)}</span>
        </a>
      </div>
    </div>
  );
}