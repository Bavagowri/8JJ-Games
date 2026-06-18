// src/pages/mobile/MobileAuth/MobileForgotPassword.jsx

import { useState } from "react";
import { translate } from "../../../data/translations";
import { useLanguage } from "../../../context/LanguageContext";

export default function MobileForgotPassword({ onSwitchToLogin }) {
  const { lang } = useLanguage();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [fieldError, setFieldError] = useState("");

  const API_BASE = import.meta.env.VITE_API_URL;

  // ── Validator ──
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return translate("emailRequired", lang);
    if (!emailRegex.test(email)) return translate("enterValidEmail", lang);
    return "";
  };

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (fieldError) setFieldError("");
    if (error) setError("");
    if (success) setSuccess("");
  };

  const handleBlur = () => {
    setFieldError(validateEmail(email));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const emailError = validateEmail(email);
    if (emailError) {
      setFieldError(emailError);
      setError(translate("fixErrorsAbove", lang));
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setSuccess(translate("resetLinkSent", lang));
      setEmail("");

      // Auto redirect to login after 4 seconds
      setTimeout(() => {
        onSwitchToLogin();
      }, 4000);
    } catch (err) {
      setError(err.message || translate("failedSendResetLink", lang));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Animated Lock Icon */}
      <div className="mobile-auth-icon-wrapper">
        <span className="mobile-auth-icon-large">🔐</span>
      </div>

      <h2 className="mobile-auth-title">{translate("forgotPasswordTitle", lang)}</h2>
      <p className="mobile-auth-subtitle">{translate("forgotPasswordSubtitle", lang)}</p>

      {error && <div className="mobile-error-message">{error}</div>}
      {success && <div className="mobile-success-message">✓ {success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mobile-auth-input-group">
          <label className="mobile-auth-label">{translate("emailAddress", lang)}</label>
          <input
            name="email"
            type="email"
            placeholder={translate("enterYourEmail", lang)}
            value={email}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`mobile-auth-input ${fieldError ? 'mobile-input-error' : ''}`}
            required
            autoFocus
          />
          {fieldError && <span className="mobile-field-error">{fieldError}</span>}
        </div>

        <button type="submit" disabled={loading || !!success} className="mobile-auth-button">
          {loading ? (
            <span className="mobile-btn-loading">
              <span className="mobile-btn-spinner"></span>
              {translate("sending", lang)}
            </span>
          ) : success ? (
            `✓ ${translate("sent", lang) || "Sent"}`
          ) : (
            translate("sendResetLink", lang)
          )}
        </button>

        {/* Back to login */}
        <button type="button" onClick={onSwitchToLogin} className="mobile-back-to-login">
          <span className="mobile-back-arrow">←</span>
          {translate("backToLogin", lang)}
        </button>
      </form>
    </>
  );
}