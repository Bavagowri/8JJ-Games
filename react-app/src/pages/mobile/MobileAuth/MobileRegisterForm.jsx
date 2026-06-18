// src/pages/mobile/MobileAuth/MobileRegisterForm.jsx
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import GoogleLoginButton from "../../../components/GoogleLoginButton/GoogleLoginButton";
import { translate } from "../../../data/translations";
import { useLanguage } from "../../../context/LanguageContext";
import MobileAppleAuthSection from "./MobileAppleAuthSection";

export default function MobileRegisterForm({ onSwitchToLogin }) {
  const { lang } = useLanguage();
  const API_URL = import.meta.env.VITE_API_URL;
  const hasClientId = Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: [],
    label: "",
    color: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState("");

  // Referral code from URL (same as desktop)
  const location = useLocation();
  const referralCode = new URLSearchParams(location.search).get("ref");
  // localStorage.setItem("referralCode", referralCode);
  if (typeof window !== "undefined") localStorage.setItem("referralCode", referralCode);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const handleGoogleSuccess = async (tokenResponse) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken: tokenResponse.access_token, referralCode })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || translate("googleLoginFailed", lang));
      localStorage.setItem("token", data.token);
      window.location.href = "/";
    } catch (err) {
      setError(err.message);
    }
  };


  // Google login (same logic as desktop RegisterForm)

  // ── Password strength calculator (identical logic to desktop) ──
  const calculatePasswordStrength = (password) => {
    if (!password) return { score: 0, feedback: [], label: "", color: "" };

    let score = 0;
    const feedback = [];

    if (password.length >= 8) {
      score += 1;
      feedback.push({ text: translate("charactersPlus", lang), met: true });
    } else {
      feedback.push({ text: translate("charactersPlus", lang), met: false });
    }
    if (/[A-Z]/.test(password)) {
      score += 1;
      feedback.push({ text: translate("uppercaseLetter", lang), met: true });
    } else {
      feedback.push({ text: translate("uppercaseLetter", lang), met: false });
    }
    if (/[a-z]/.test(password)) {
      score += 1;
      feedback.push({ text: translate("lowercaseLetter", lang), met: true });
    } else {
      feedback.push({ text: translate("lowercaseLetter", lang), met: false });
    }
    if (/[0-9]/.test(password)) {
      score += 1;
      feedback.push({ text: translate("number", lang), met: true });
    } else {
      feedback.push({ text: translate("number", lang), met: false });
    }
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      score += 1;
      feedback.push({ text: translate("specialCharacter", lang), met: true });
    } else {
      feedback.push({ text: translate("specialCharacter", lang), met: false });
    }

    let label = "", color = "";
    if (score === 0) { label = ""; color = ""; }
    else if (score <= 2) { label = translate("weak", lang); color = "#ff4444"; }
    else if (score === 3) { label = translate("fair", lang); color = "#ffa500"; }
    else if (score === 4) { label = translate("good", lang); color = "#00d9ff"; }
    else { label = translate("strong", lang); color = "#00ff88"; }

    return { score, feedback, label, color };
  };

  // ── Validators (identical to desktop) ──
  const validateUsername = (username) => {
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!username) return translate("usernameRequired", lang);
    if (!usernameRegex.test(username)) return translate("usernameFormat", lang);
    return "";
  };
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return translate("emailRequired", lang);
    if (!emailRegex.test(email)) return translate("enterValidEmail", lang);
    return "";
  };
  const validatePassword = (password) => {
    if (!password) return translate("passwordRequired", lang);
    if (password.length < 8) return translate("passwordMinLength8", lang);
    if (!/[A-Z]/.test(password)) return translate("passwordUppercase", lang);
    if (!/[a-z]/.test(password)) return translate("passwordLowercase", lang);
    if (!/[0-9]/.test(password)) return translate("passwordNumber", lang);
    return "";
  };
  const validateConfirmPassword = (confirmPassword, password) => {
    if (!confirmPassword) return translate("confirmPasswordRequired", lang);
    if (confirmPassword !== password) return translate("passwordsDoNotMatch", lang);
    return "";
  };

  // ── Handlers ──
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (fieldErrors[name]) setFieldErrors({ ...fieldErrors, [name]: "" });
    if (name === "password") setPasswordStrength(calculatePasswordStrength(value));
    if (name === "password" && form.confirmPassword) {
      setFieldErrors({ ...fieldErrors, confirmPassword: validateConfirmPassword(form.confirmPassword, value) });
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    let err = "";
    switch (name) {
      case "username": err = validateUsername(value); break;
      case "email": err = validateEmail(value); break;
      case "password": err = validatePassword(value); break;
      case "confirmPassword": err = validateConfirmPassword(value, form.password); break;
      default: break;
    }
    setFieldErrors({ ...fieldErrors, [name]: err });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const errors = {
      username: validateUsername(form.username),
      email: validateEmail(form.email),
      password: validatePassword(form.password),
      confirmPassword: validateConfirmPassword(form.confirmPassword, form.password),
    };
    setFieldErrors(errors);
    if (Object.values(errors).some(err => err !== "")) {
      setError(translate("fixErrorsAbove", lang));
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.username.trim(),
          email: form.email.trim().toLowerCase(),
          password: form.password,
          referralCode,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");

      setSuccess(translate("registrationSuccessful", lang));
      setForm({ username: "", email: "", password: "", confirmPassword: "" });
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
      {/* ── Terms Modal ── */}
      {showTermsModal && (
        <div className="mobile-auth-modal-overlay" onClick={() => setShowTermsModal(false)}>
          <div className="mobile-auth-modal" onClick={e => e.stopPropagation()}>
            <div className="mobile-auth-modal-header">
              <h3>{translate("termsAndConditions", lang)}</h3>
              <button className="mobile-auth-modal-close" onClick={() => setShowTermsModal(false)}>✕</button>
            </div>
            <div className="mobile-auth-modal-body">
              <div className="mobile-terms-section">
                <h4>1. {translate("acceptanceOfTerms", lang)}</h4>
                <p>{translate("acceptanceOfTermsText", lang)}</p>
              </div>
              <div className="mobile-terms-section">
                <h4>2. {translate("userAccount", lang)}</h4>
                <p>{translate("userAccountText", lang)}</p>
              </div>
              <div className="mobile-terms-section">
                <h4>3. {translate("privacyPolicy", lang)}</h4>
                <p>{translate("privacyPolicyText", lang)}</p>
              </div>
              <div className="mobile-terms-section">
                <h4>4. {translate("userConduct", lang)}</h4>
                <p>{translate("userConductText", lang)}</p>
              </div>
              <div className="mobile-terms-section">
                <h4>5. {translate("contactInformation", lang)}</h4>
                <p>{translate("contactInformationText", lang)}</p>
              </div>
            </div>
            <div className="mobile-auth-modal-footer">
              <button className="mobile-auth-modal-accept-btn" onClick={() => setShowTermsModal(false)}>
                {translate("iUnderstand", lang)}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Register Form ── */}
      <h2 className="mobile-auth-title">{translate("createAccount", lang)}</h2>
      <p className="mobile-auth-subtitle">{translate("signUpToUnlock", lang)}</p>

      {success && <div className="mobile-success-message">{success}</div>}
      {error && <div className="mobile-error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        {/* Username */}
        <div className="mobile-auth-input-group">
          <label className="mobile-auth-label">{translate("username", lang)}</label>
          <input
            name="username"
            type="text"
            placeholder={translate("chooseUsername", lang)}
            value={form.username}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`mobile-auth-input ${fieldErrors.username ? 'mobile-input-error' : ''}`}
            required
          />
          {fieldErrors.username && <span className="mobile-field-error">{fieldErrors.username}</span>}
        </div>

        {/* Email */}
        <div className="mobile-auth-input-group">
          <label className="mobile-auth-label">{translate("email", lang)}</label>
          <input
            name="email"
            type="email"
            placeholder={translate("yourEmail", lang)}
            value={form.email}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`mobile-auth-input ${fieldErrors.email ? 'mobile-input-error' : ''}`}
            required
          />
          {fieldErrors.email && <span className="mobile-field-error">{fieldErrors.email}</span>}
        </div>

        {/* Password */}
        <div className="mobile-auth-input-group">
          <label className="mobile-auth-label">{translate("password", lang)}</label>
          <div className="mobile-password-wrapper">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder={translate("createStrongPassword", lang)}
              value={form.password}
              onChange={handleChange}
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
          {form.password && (
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
          {form.password && (
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
          <label className="mobile-auth-label">{translate("confirmPassword", lang)}</label>
          <div className="mobile-password-wrapper">
            <input
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder={translate("confirmPasswordPlaceholder", lang)}
              value={form.confirmPassword}
              onChange={handleChange}
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

        {/* Terms checkbox */}
        <label className="mobile-auth-checkbox-label">
          <input type="checkbox" className="mobile-auth-checkbox" required />
          <span className="mobile-auth-checkbox-text">
            {translate("agreeToTerms", lang)}{" "}
            <button type="button" onClick={(e) => { e.preventDefault(); setShowTermsModal(true); }} className="mobile-terms-link">
              {translate("termsAndConditions", lang)}
            </button>
          </span>
        </label>

        {/* Submit */}
        <button type="submit" disabled={loading || !!success} className="mobile-auth-button">
          {loading ? translate("creatingAccount", lang) : translate("signUp", lang)}
        </button>

        {/* Google divider + button */}
        {mounted && hasClientId && (
  <>
    <div className="mobile-auth-divider">
      <span className="mobile-auth-divider-line"></span>
      <span className="mobile-auth-divider-text">{translate("or", lang)}</span>
      <span className="mobile-auth-divider-line"></span>
    </div>
    <GoogleLoginButton
      onSuccess={handleGoogleSuccess}
      onError={() => setError(translate("googleLoginFailed", lang))}
      label={translate("signUpWithGoogle", lang)}
      className="mobile-google-button"
      iconClassName="mobile-google-icon"
    />
  </>
)}
        {/* Apple Sign In */}
        {/* <MobileAppleAuthSection referralCode={referralCode} /> */}
      </form>

      {/* Already have account link */}
      <div className="mobile-auth-link">
        {translate("alreadyHaveAccount", lang)}{" "}
        <button onClick={onSwitchToLogin}>{translate("logIn", lang)}</button>
      </div>
    </>
  );
}