// src/pages/mobile/MobileAuth/MobileResetPassword.jsx

import { useState } from "react";
import { translate } from "../../../data/translations";
import { useLanguage } from "../../../context/LanguageContext";
import SEO from "../../../components/SEO/SEO";
import { generateKeywords } from "../../../config/seoKeywords";
import MobileBottomNav from "../../../components/mobile/MobileBottomNav/MobileBottomNav";

const API_BASE = import.meta.env.VITE_API_URL;

export default function MobileResetPassword() {
  const { lang } = useLanguage();

  // Token from URL (same as desktop)
  const token = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("token") : null;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0, feedback: [], label: "", color: ""
  });

  // ── Password strength calculator (identical logic to desktop) ──
  const calculatePasswordStrength = (pw) => {
    if (!pw) return { score: 0, feedback: [], label: "", color: "" };
    let score = 0;
    const feedback = [];

    if (pw.length >= 8) { score++; feedback.push({ text: translate("passwordStrength8Chars", lang), met: true }); }
    else { feedback.push({ text: translate("passwordStrength8Chars", lang), met: false }); }

    if (/[A-Z]/.test(pw)) { score++; feedback.push({ text: translate("passwordStrengthUppercase", lang), met: true }); }
    else { feedback.push({ text: translate("passwordStrengthUppercase", lang), met: false }); }

    if (/[a-z]/.test(pw)) { score++; feedback.push({ text: translate("passwordStrengthLowercase", lang), met: true }); }
    else { feedback.push({ text: translate("passwordStrengthLowercase", lang), met: false }); }

    if (/[0-9]/.test(pw)) { score++; feedback.push({ text: translate("passwordStrengthNumber", lang), met: true }); }
    else { feedback.push({ text: translate("passwordStrengthNumber", lang), met: false }); }

    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pw)) { score++; feedback.push({ text: translate("passwordStrengthSpecial", lang), met: true }); }
    else { feedback.push({ text: translate("passwordStrengthSpecial", lang), met: false }); }

    let label = "", color = "";
    if (score === 0) { label = ""; color = ""; }
    else if (score <= 2) { label = translate("passwordStrengthWeak", lang); color = "#ff4444"; }
    else if (score === 3) { label = translate("passwordStrengthFair", lang); color = "#ffa500"; }
    else if (score === 4) { label = translate("passwordStrengthGood", lang); color = "#00d9ff"; }
    else { label = translate("passwordStrengthStrong", lang); color = "#00ff88"; }

    return { score, feedback, label, color };
  };

  // ── Validators (identical to desktop) ──
  const validatePassword = (pw) => {
    if (!pw) return translate("errPasswordRequired", lang);
    if (pw.length < 8) return translate("errPasswordLength", lang);
    if (!/[A-Z]/.test(pw)) return translate("errPasswordUppercase", lang);
    if (!/[a-z]/.test(pw)) return translate("errPasswordLowercase", lang);
    if (!/[0-9]/.test(pw)) return translate("errPasswordNumber", lang);
    return "";
  };
  const validateConfirmPassword = (cp, pw) => {
    if (!cp) return translate("errConfirmPasswordRequired", lang);
    if (cp !== pw) return translate("errPasswordsDoNotMatch", lang);
    return "";
  };

  // ── Handlers ──
  const handlePasswordChange = (e) => {
    const val = e.target.value;
    setPassword(val);
    setPasswordStrength(calculatePasswordStrength(val));
    if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: "" });
    if (confirmPassword) {
      setFieldErrors({ ...fieldErrors, confirmPassword: validateConfirmPassword(confirmPassword, val) });
    }
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    if (fieldErrors.confirmPassword) setFieldErrors({ ...fieldErrors, confirmPassword: "" });
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    let err = "";
    if (name === "password") err = validatePassword(value);
    else if (name === "confirmPassword") err = validateConfirmPassword(value, password);
    setFieldErrors({ ...fieldErrors, [name]: err });
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const errors = {
      password: validatePassword(password),
      confirmPassword: validateConfirmPassword(confirmPassword, password),
    };
    setFieldErrors(errors);
    if (Object.values(errors).some(err => err !== "")) {
      setError(translate("errFixErrors", lang));
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || translate("errResetFailed", lang));

      setSuccess(translate("successPasswordUpdated", lang));
      setPassword("");
      setConfirmPassword("");
      setPasswordStrength({ score: 0, feedback: [], label: "", color: "" });

      // Redirect to login after 3 seconds (same as desktop)
      setTimeout(() => { window.location.href = "/login"; }, 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Eye icons ──
  const EyeIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  );
  const EyeOffIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );

  return (
    <>
      <SEO
        title="Reset Your Password | 8JJ Games"
        description="Create a new password for your 8JJ Games account."
        keywords={generateKeywords('pages', 'reset-password')}
        url="/reset-password"
      />

      <div className="mobile-reset-wrapper">
        {/* Header with lock icon */}
        <div className="mobile-reset-header">
          <div className="mobile-reset-icon-wrapper">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mobile-reset-lock-icon">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <h1 className="mobile-reset-title">{translate("resetPasswordTitle", lang)}</h1>
          <p className="mobile-reset-subtitle">{translate("resetPasswordSubtitle", lang)}</p>
        </div>

        {/* Messages */}
        {error && (
          <div className="mobile-error-message mobile-reset-message">
            <span>⚠️</span> {error}
          </div>
        )}
        {success && (
          <div className="mobile-success-message mobile-reset-message">
            <span>✓</span> {success}
          </div>
        )}

        {/* Form */}
        <form onSubmit={submit} className="mobile-reset-form">
          {/* New Password */}
          <div className="mobile-auth-input-group">
            <label className="mobile-auth-label">{translate("newPasswordLabel", lang)}</label>
            <div className="mobile-password-wrapper">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder={translate("newPasswordPlaceholder", lang)}
                value={password}
                onChange={handlePasswordChange}
                onBlur={handleBlur}
                className={`mobile-auth-input ${fieldErrors.password ? 'mobile-input-error' : ''}`}
                required
              />
              <button type="button" className="mobile-password-toggle" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
            {fieldErrors.password && <span className="mobile-field-error">{fieldErrors.password}</span>}

            {/* Strength bars */}
            {password && (
              <div className="mobile-strength-container">
                <div className="mobile-strength-bars">
                  {[1, 2, 3, 4, 5].map(bar => (
                    <div
                      key={bar}
                      className={`mobile-strength-bar ${bar <= passwordStrength.score ? 'active' : ''}`}
                      style={{ backgroundColor: bar <= passwordStrength.score ? passwordStrength.color : 'rgba(255,255,255,0.1)' }}
                    />
                  ))}
                </div>
                {passwordStrength.label && (
                  <span className="mobile-strength-label" style={{ color: passwordStrength.color }}>{passwordStrength.label}</span>
                )}
              </div>
            )}

            {/* Requirements checklist */}
            {password && (
              <div className="mobile-requirements">
                {passwordStrength.feedback.map((item, i) => (
                  <div key={i} className={`mobile-requirement-item ${item.met ? 'met' : ''}`}>
                    <span className="mobile-requirement-icon">{item.met ? '✓' : '○'}</span>
                    <span className="mobile-requirement-text">{item.text}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="mobile-auth-input-group">
            <label className="mobile-auth-label">{translate("confirmPasswordLabel", lang)}</label>
            <div className="mobile-password-wrapper">
              <input
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder={translate("confirmPasswordPlaceholder", lang)}
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                onBlur={handleBlur}
                className={`mobile-auth-input ${fieldErrors.confirmPassword ? 'mobile-input-error' : ''}`}
                required
              />
              <button type="button" className="mobile-password-toggle" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
            {fieldErrors.confirmPassword && <span className="mobile-field-error">{fieldErrors.confirmPassword}</span>}
          </div>

          {/* Submit */}
          <button type="submit" disabled={loading || !!success} className="mobile-auth-button">
            {loading ? (
              <span className="mobile-btn-loading">
                <span className="mobile-btn-spinner"></span>
                {translate("resettingPasswordBtn", lang)}
              </span>
            ) : success ? (
              translate("passwordResetBtn", lang)
            ) : (
              translate("resetPasswordBtn", lang)
            )}
          </button>

          {/* Back to login link */}
          <a href="/login" className="mobile-back-to-login">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
            </svg>
            <span>{translate("backToLoginBtn", lang)}</span>
          </a>
        </form>

        <MobileBottomNav />
      </div>
    </>
  );
}