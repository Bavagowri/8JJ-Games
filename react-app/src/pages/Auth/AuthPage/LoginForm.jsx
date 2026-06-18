// react-app/src/pages/Auth/AuthPage/LoginForm.jsx

import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
// import { useGoogleLogin } from "@react-oauth/google";
import { useState, useEffect } from "react";
import GoogleLoginButton from "../../../components/GoogleLoginButton/GoogleLoginButton";
import { translate } from "../../../data/translations";
import { useLanguage } from "../../../context/LanguageContext";
import LoginSuccessPopup from "./LoginSuccessPopup";
import AppleAuthSection from "./AppleAuthSection";

const API_BASE = import.meta.env.VITE_API_URL;
if (!API_BASE) {
  throw new Error("❌ VITE_API_URL is not defined");
}


export default function LoginForm({ onSwitchToRegister, onSwitchToForgotPassword }) {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showResend, setShowResend] = useState(false);
  const [success, setSuccess] = useState("");

  // States for popup
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successUserId, setSuccessUserId] = useState(null);
  const [successToken, setSuccessToken] = useState(null);

  const { login } = useAuth();

  // Validation functions
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
    if (password.length < 6) {
      return translate("passwordMinLength", lang);
    }
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors({ ...fieldErrors, [name]: "" });
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    let error = "";

    if (name === "email") {
      error = validateEmail(value);
    } else if (name === "password") {
      error = validatePassword(value);
    }

    setFieldErrors({ ...fieldErrors, [name]: error });
  };

  const handlePopupClose = () => {
    setShowSuccessPopup(false);
    navigate("/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setShowResend(false);

    // Validate all fields
    const errors = {
      email: validateEmail(form.email),
      password: validatePassword(form.password),
    };

    setFieldErrors(errors);

    // Check if there are any errors
    if (Object.values(errors).some(error => error !== "")) {
      setError(translate("fixErrorsAbove", lang));
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        // Detect email-not-verified case
        if (res.status === 403 && data.code === "EMAIL_NOT_VERIFIED") {
          setShowResend(true);
        }
        throw new Error(data.message);
      }

      // console.log("✅ Login successful");
      // console.log("Token:", data.token);
      // console.log("User:", data.user);

      const token = data.token;
      const userId = data.user?.id;

      // console.log("UserId to save:", userId);
      // console.log("Token to save:", token);

      // Save to localStorage
      localStorage.setItem("authToken", token);
      localStorage.setItem("userId", String(userId));
      localStorage.setItem("user", JSON.stringify(data.user));

      // console.log("✅ Saved to localStorage");
      // console.log("Retrieved userId:", localStorage.getItem("userId"));
      // console.log("Retrieved token:", localStorage.getItem("authToken"));

      // Call login from context
      login(token);

      // 🎮 Trigger daily login activity
      await fetch(`${API_BASE}/api/activity`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          activity_type: "daily_login"
        })
      });


      // console.log("🎯 Setting popup state");
      // console.log("  userId:", userId);
      // console.log("  token:", token?.substring(0, 20) + "...");

      setSuccessToken(token);
      setSuccessUserId(userId);
      setShowSuccessPopup(true);

    } catch (err) {
      setError(err.message);
      // console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Google Login

  const handleGoogleSuccess = async (tokenResponse) => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken: tokenResponse.access_token }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || translate("googleLoginFailed", lang));
        return;
      }
      const token = data.token;
      const userId = data.user?.id;
      localStorage.setItem("authToken", token);
      localStorage.setItem("userId", String(userId));
      localStorage.setItem("user", JSON.stringify(data.user));
      login(token);
      setSuccessToken(token);
      setSuccessUserId(userId);
      setShowSuccessPopup(true);
    } catch (err) {
      setError(err.message);
    }
  };

const handleGoogleError = () => {
  setError(translate("googleLoginFailed", lang));
};

const [mounted, setMounted] = useState(false);
useEffect(() => setMounted(true), []);

  // RESEND VERIFICATION EMAIL
  const resendVerification = async (email) => {
    try {
      const res = await fetch(
        `${API_BASE}/api/auth/resend-verification`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email })
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || translate("failedSendResetLink", lang));
      }

      setSuccess(translate("verificationEmailResent", lang));
      setShowResend(false);

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <div className="form-panel-content Login-Panel">
        <h2 className="form-title">{translate("welcomeBack", lang)}</h2>
        <p className="form-subtitle">{translate("loginToContinue", lang)}</p>

        {error && <div className="error-message">{error}</div>}

        {success && <div className="success-message">{success}</div>}

        {showResend && (
          <div className="login-resend-modal-overlay">
            <div className="login-resend-modal">
              <button
                className="login-resend-modal-close"
                onClick={() => setShowResend(false)}
              >
                ✕
              </button>

              <h3>{translate("emailVerificationRequired", lang)}</h3>
              <p>{translate("accountNotVerified", lang)}</p>

              <button
                className="login-resend-btn"
                onClick={() => resendVerification(form.email)}
              >
                {translate("resendVerificationEmail", lang)}
              </button>
            </div>
          </div>
        )}


        <form onSubmit={handleSubmit} className="auth-form">
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
                placeholder={translate("enterYourPassword", lang)}
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
          </div>

          <div className="form-options">
            <label className="checkbox-labelz">
              <input type="checkbox" className="checkbox" />
              <span className="checkbox-textz">{translate("rememberMe", lang)}</span>
            </label>
            <button
              type="button"
              onClick={onSwitchToForgotPassword}
              className="forgot-link"
            >
              {translate("forgotPassword", lang)}
            </button>
          </div>

          <button type="submit" disabled={loading} className="submit-button">
            {loading ? translate("loggingIn", lang) : translate("logIn", lang)}
          </button>

          <div className="divider">
            <span className="divider-line"></span>
            <span className="divider-text">{translate("or", lang)}</span>
            <span className="divider-line"></span>
          </div>

          {mounted && (
            <GoogleLoginButton
              onSuccess={handleGoogleSuccess}
              onError={() => setError(translate("googleLoginFailed", lang))}
              label={translate("continueWithGoogle", lang)}
              className="mobile-google-button"
              iconClassName="mobile-google-icon"
            />
          )}
          {/* <AppleAuthSection /> */}

        </form>

        <p className="signup-text">
          {translate("dontHaveAccount", lang)}{" "}
          <button onClick={onSwitchToRegister} className="signup-link">
            {translate("signUp", lang)}
          </button>
        </p>
      </div>

      {/* SUCCESS POPUP */}
      {showSuccessPopup && (
        <LoginSuccessPopup
          token={successToken}
          userId={successUserId}
          onClose={handlePopupClose}
        />
      )}
    </>
  );
}