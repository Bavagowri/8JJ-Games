// react-app/src/pages/Auth/AuthPage/RegisterForm.jsx

import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import GoogleLoginButton from "../../../components/GoogleLoginButton/GoogleLoginButton";
import { translate } from "../../../data/translations";
import { useLanguage } from "../../../context/LanguageContext";

import AppleAuthSection from "./AppleAuthSection";


export default function RegisterForm({ onSwitchToLogin }) {
  const { lang } = useLanguage();
  const API_URL = import.meta.env.VITE_API_URL;
  const hasClientId = Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID);
  const navigate = useNavigate();
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

  const location = useLocation();
  const referralCode = new URLSearchParams(location.search).get("ref");

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (typeof window !== "undefined") localStorage.setItem("referralCode", referralCode);

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

  function GoogleAuthSection() {
    const googleLogin = useGoogleLogin({
      onSuccess: async (tokenResponse) => {
        const res = await fetch(`${API_URL}/api/auth/google`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            accessToken: tokenResponse.access_token,
            referralCode
          })
        });
        const data = await res.json();
        localStorage.setItem("token", data.token);
        window.location.href = "/";
      },
      
      onError: () => console.error("Google Login Failed")
    });
    return (
      <>
        <button type="button" className="google-button" onClick={() => googleLogin()}>
          <svg className="google-icon" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          {translate("signUpWithGoogle", lang)}
        </button>
      </>
    );
  }

  // Password strength calculator
  const calculatePasswordStrength = (password) => {
    if (!password) {
      return { score: 0, feedback: [], label: "", color: "" };
    }

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

    let label = "";
    let color = "";
    if (score === 0) {
      label = "";
      color = "";
    } else if (score <= 2) {
      label = translate("weak", lang);
      color = "#ff4444";
    } else if (score === 3) {
      label = translate("fair", lang);
      color = "#ffa500";
    } else if (score === 4) {
      label = translate("good", lang);
      color = "#00d9ff";
    } else {
      label = translate("strong", lang);
      color = "#00ff88";
    }

    return { score, feedback, label, color };
  };

  // Validation functions
  const validateUsername = (username) => {
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!username) return translate("usernameRequired", lang);
    if (!usernameRegex.test(username)) {
      return translate("usernameFormat", lang);
    }
    return "";
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return translate("emailRequired", lang);
    if (!emailRegex.test(email)) {
      return translate("enterValidEmail", lang);
    }
    return "";
  };

  const validatePassword = (password) => {
    if (!password) return translate("passwordRequired", lang);
    if (password.length < 8) {
      return translate("passwordMinLength8", lang);
    }
    if (!/[A-Z]/.test(password)) {
      return translate("passwordUppercase", lang);
    }
    if (!/[a-z]/.test(password)) {
      return translate("passwordLowercase", lang);
    }
    if (!/[0-9]/.test(password)) {
      return translate("passwordNumber", lang);
    }
    return "";
  };

  const validateConfirmPassword = (confirmPassword, password) => {
    if (!confirmPassword) return translate("confirmPasswordRequired", lang);
    if (confirmPassword !== password) {
      return translate("passwordsDoNotMatch", lang);
    }
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (fieldErrors[name]) {
      setFieldErrors({ ...fieldErrors, [name]: "" });
    }

    if (name === "password") {
      setPasswordStrength(calculatePasswordStrength(value));
    }

    if (name === "password" && form.confirmPassword) {
      const confirmError = validateConfirmPassword(form.confirmPassword, value);
      setFieldErrors({ ...fieldErrors, confirmPassword: confirmError });
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    let error = "";

    switch (name) {
      case "username":
        error = validateUsername(value);
        break;
      case "email":
        error = validateEmail(value);
        break;
      case "password":
        error = validatePassword(value);
        break;
      case "confirmPassword":
        error = validateConfirmPassword(value, form.password);
        break;
      default:
        break;
    }

    setFieldErrors({ ...fieldErrors, [name]: error });
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: form.username.trim(),
          email: form.email.trim().toLowerCase(),
          password: form.password,
          referralCode,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      setSuccess(translate("registrationSuccessful", lang));

      setForm({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const openTermsModal = (e) => {
    e.preventDefault();
    setShowTermsModal(true);
  };

  const closeTermsModal = () => {
    setShowTermsModal(false);
  };

  return (
    <>
      {/* Terms & Conditions Modal */}
      {showTermsModal && (
        <div className="modal-overlay" onClick={closeTermsModal}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{translate("termsAndConditions", lang)}</h2>
              <button className="modal-close" onClick={closeTermsModal}>✕</button>
            </div>

            <div className="modal-content">
              <div className="terms-section">
                <h3 className="terms-heading">1. {translate("acceptanceOfTerms", lang)}</h3>
                <p className="terms-text">
                  {translate("acceptanceOfTermsText", lang)}
                </p>
              </div>

              <div className="terms-section">
                <h3 className="terms-heading">2. {translate("userAccount", lang)}</h3>
                <p className="terms-text">
                  {translate("userAccountText", lang)}
                </p>
              </div>

              <div className="terms-section">
                <h3 className="terms-heading">3. {translate("privacyPolicy", lang)}</h3>
                <p className="terms-text">
                  {translate("privacyPolicyText", lang)}
                </p>
              </div>

              <div className="terms-section">
                <h3 className="terms-heading">4. {translate("userConduct", lang)}</h3>
                <p className="terms-text">
                  {translate("userConductText", lang)}
                </p>
              </div>


              <div className="terms-section">
                <h3 className="terms-heading">5. {translate("contactInformation", lang)}</h3>
                <p className="terms-text">
                  {translate("contactInformationText", lang)}
                </p>
              </div>
            </div>

            <div className="modal-footer">
              <button className="modal-accept-btn" onClick={closeTermsModal}>
                {translate("iUnderstand", lang)}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="form-panel-content">
        <h2 className="form-title">{translate("createAccount", lang)}</h2>
        <p className="form-subtitle">{translate("signUpToUnlock", lang)}</p>

        {success && <div className="success-message">{success}</div>}
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label className="label">{translate("username", lang)}</label>
            <input
              name="username"
              type="text"
              placeholder={translate("chooseUsername", lang)}
              value={form.username}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`input ${fieldErrors.username ? 'input-error' : ''}`}
              required
            />
            {fieldErrors.username && (
              <span className="field-error">{fieldErrors.username}</span>
            )}
          </div>

          <div className="input-group">
            <label className="label">{translate("email", lang)}</label>
            <input
              name="email"
              type="email"
              placeholder={translate("yourEmail", lang)}
              value={form.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`input ${fieldErrors.email ? 'input-error' : ''}`}
              required
            />
            {fieldErrors.email && (
              <span className="field-error">{fieldErrors.email}</span>
            )}
          </div>

          <div className="input-group">
            <label className="label">{translate("password", lang)}</label>
            <div className="password-input-wrapper">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder={translate("createStrongPassword", lang)}
                value={form.password}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`input ${fieldErrors.password ? 'input-error' : ''}`}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                )}
              </button>
            </div>
            {fieldErrors.password && (
              <span className="field-error">{fieldErrors.password}</span>
            )}

            {form.password && (
              <div className="password-strength-container">
                <div className="password-strength-bars">
                  {[1, 2, 3, 4, 5].map((bar) => (
                    <div
                      key={bar}
                      className={`strength-bar ${bar <= passwordStrength.score ? 'active' : ''}`}
                      style={{
                        backgroundColor: bar <= passwordStrength.score ? passwordStrength.color : 'rgba(255, 255, 255, 0.1)'
                      }}
                    />
                  ))}
                </div>
                {passwordStrength.label && (
                  <span
                    className="password-strength-label"
                    style={{ color: passwordStrength.color }}
                  >
                    {passwordStrength.label}
                  </span>
                )}
              </div>
            )}

            {form.password && (
              <div className="password-requirements">
                {passwordStrength.feedback.map((item, index) => (
                  <div key={index} className={`requirement-item ${item.met ? 'met' : ''}`}>
                    <span className="requirement-icon">{item.met ? '✓' : '○'}</span>
                    <span className="requirement-text">{item.text}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="input-group">
            <label className="label">{translate("confirmPassword", lang)}</label>
            <div className="password-input-wrapper">
              <input
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder={translate("confirmPasswordPlaceholder", lang)}
                value={form.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`input ${fieldErrors.confirmPassword ? 'input-error' : ''}`}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                )}
              </button>
            </div>
            {fieldErrors.confirmPassword && (
              <span className="field-error">{fieldErrors.confirmPassword}</span>
            )}
          </div>

          <label className="checkbox-labelz">
            <input type="checkbox" className="checkbox" required />
            <span className="checkbox-textz">
              {translate("agreeToTerms", lang)} <a href="#" onClick={openTermsModal} className="terms-link">{translate("termsAndConditions", lang)}</a>
            </span>
          </label>

          <button type="submit" disabled={loading || success} className="submit-button">
            {loading ? translate("creatingAccount", lang) : translate("signUp", lang)}
          </button>

          <div className="divider">
            <span className="divider-line"></span>
            <span className="divider-text">{translate("or", lang)}</span>
            <span className="divider-line"></span>
          </div>
          {mounted && hasClientId && (
            <GoogleLoginButton
              onSuccess={handleGoogleSuccess}
              onError={() => setError(translate("googleLoginFailed", lang))}
              label={translate("signUpWithGoogle", lang)}
            />
          )}

          {/* Apple Sign In */}
          {/* <AppleAuthSection referralCode={referralCode} /> */}

        </form>

        <p className="login-text">
          {translate("alreadyHaveAccount", lang)}{" "}
          <button onClick={onSwitchToLogin} className="login-link">
            {translate("logIn", lang)}
          </button>
        </p>
      </div>
    </>
  );
}