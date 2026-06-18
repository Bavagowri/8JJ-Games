// react-app/src/pages/Auth/AuthPage/ForgotPasswordForm.jsx

import { useState } from "react";
import { translate } from "../../../data/translations";
import { useLanguage } from "../../../context/LanguageContext";

export default function ForgotPasswordForm({ onSwitchToLogin }) {
  const { lang } = useLanguage();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [fieldError, setFieldError] = useState("");

  const API_BASE = import.meta.env.VITE_API_URL;
  if (!API_BASE) {
    throw new Error("❌ VITE_API_URL is not defined");
  }

  // Validation function
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return translate("emailRequired", lang);
    if (!emailRegex.test(email)) {
      return translate("enterValidEmail", lang);
    }
    return "";
  };

  const handleChange = (e) => {
    setEmail(e.target.value);
    
    // Clear errors when user starts typing
    if (fieldError) setFieldError("");
    if (error) setError("");
    if (success) setSuccess("");
  };

  const handleBlur = () => {
    const error = validateEmail(email);
    setFieldError(error);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate email
    const emailError = validateEmail(email);
    if (emailError) {
      setFieldError(emailError);
      setError(translate("fixErrorsAbove", lang));
      return;
    }

    try {
      setLoading(true);
      
      // Replace with your actual API endpoint
      const res = await fetch(`${API_BASE}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setSuccess(translate("resetLinkSent", lang));
      setEmail("");
      
      // Auto redirect to login after 3 seconds
      setTimeout(() => {
        onSwitchToLogin();
      }, 3000);
      
    } catch (err) {
      setError(err.message || translate("failedSendResetLink", lang));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-panel-content">
      {/* Icon */}
      <div className="forgot-icon-wrapper">
        <span className="forgot-icon">🔐</span>
      </div>

      <h2 className="form-title">{translate("forgotPasswordTitle", lang)}</h2>
      <p className="form-subtitle">{translate("forgotPasswordSubtitle", lang)}</p>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="input-group">
          <label className="label">{translate("emailAddress", lang)}</label>
          <input
            name="email"
            type="email"
            placeholder={translate("enterYourEmail", lang)}
            value={email}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`input ${fieldError ? 'input-error' : ''}`}
            required
          />
          {fieldError && (
            <span className="field-error">{fieldError}</span>
          )}
        </div>

        <button type="submit" disabled={loading} className="submit-button">
          <span>
            {loading ? (
              <>
                <span className="button-spinner"></span>
                {translate("sending", lang)}
              </>
            ) : (
              translate("sendResetLink", lang)
            )}
          </span>
        </button>

        <button 
          type="button"
          onClick={onSwitchToLogin}
          className="back-to-login"
        >
          <span className="back-arrow">←</span>
          {translate("backToLogin", lang)}
        </button>
      </form>
    </div>
  );
}