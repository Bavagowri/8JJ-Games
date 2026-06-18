// src/pages/mobile/MobileAuth/MobileLoginForm.jsx
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { useState, useEffect } from "react";
import GoogleLoginButton from "../../../components/GoogleLoginButton/GoogleLoginButton";
import { useLanguage } from "../../../context/LanguageContext";
import { translate } from "../../../data/translations";
import MobileLoginSuccessPopup from "./MobileLoginSuccessPopup";
import MobileAppleAuthSection from "./MobileAppleAuthSection";

const API_BASE = import.meta.env.VITE_API_URL;

export default function MobileLoginForm({ onSwitchToRegister, onSwitchToForgotPassword }) {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  // ── Resend-verification modal (ported from desktop LoginForm) ──
  const [showResend, setShowResend] = useState(false);
  const [resendSuccess, setResendSuccess] = useState("");

  // ── Login-success popup ──
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successToken, setSuccessToken] = useState(null);
  const [successUserId, setSuccessUserId] = useState(null);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // ── Validators (identical to desktop LoginForm) ──
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return translate("emailRequired", lang);
    if (!emailRegex.test(email)) return translate("enterValidEmail", lang);
    return "";
  };

  const validatePassword = (password) => {
    if (!password) return translate("passwordRequired", lang);
    if (password.length < 6) return translate("passwordMinLength", lang);
    return "";
  };

  // ── Handlers ──
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (fieldErrors[name]) setFieldErrors({ ...fieldErrors, [name]: "" });
    if (error) setError("");
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    let err = "";
    if (name === "email") err = validateEmail(value);
    else if (name === "password") err = validatePassword(value);
    setFieldErrors({ ...fieldErrors, [name]: err });
  };

  // ── Resend verification (ported from desktop LoginForm) ──
  const resendVerification = async (email) => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/resend-verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || translate("failedSendResetLink", lang));

      setResendSuccess(translate("verificationEmailResent", lang));
      setShowResend(false);
    } catch (err) {
      setError(err.message);
      setShowResend(false);
    }
  };

  // ── Submit ──
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setShowResend(false);
    setResendSuccess("");

    // Validate all fields first
    const errors = {
      email: validateEmail(form.email),
      password: validatePassword(form.password),
    };
    setFieldErrors(errors);
    if (Object.values(errors).some((err) => err !== "")) {
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
        // Detect email-not-verified — same check as desktop LoginForm
        if (res.status === 403 && data.code === "EMAIL_NOT_VERIFIED") {
          setShowResend(true);
        }
        throw new Error(data.message);
      }

      const token = data.token;
      const userId = data.user?.id;

      localStorage.setItem("authToken", token);
      localStorage.setItem("userId", String(userId));
      localStorage.setItem("user", JSON.stringify(data.user));

      login(token);

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


      setSuccessToken(token);
      setSuccessUserId(userId);
      setShowSuccessPopup(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Google login ──
  // const googleLogin = useGoogleLogin({
  //   flow: "implicit",
  //   onSuccess: async (tokenResponse) => {
  //     try {
  //       const res = await fetch(`${API_BASE}/api/auth/google`, {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({ accessToken: tokenResponse.access_token }),
  //       });

  //       const data = await res.json();

  //       if (!res.ok) {
  //         if (res.status === 403 && data.code === "ACCOUNT_INACTIVE") {
  //           setError("⚠️ " + data.message);
  //         } else {
  //           setError(data.message || translate("googleLoginFailed", lang));
  //         }
  //         return;
  //       }

  //       const token = data.token;
  //       const userId = data.user?.id;

  //       localStorage.setItem("authToken", token);
  //       localStorage.setItem("userId", String(userId));
  //       localStorage.setItem("user", JSON.stringify(data.user));

  //       login(token);

  //       await fetch(`${API_BASE}/api/activity`, {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           "Authorization": `Bearer ${token}`
  //         },
  //         body: JSON.stringify({
  //           activity_type: "daily_login"
  //         })
  //       });


  //       setSuccessToken(token);
  //       setSuccessUserId(userId);
  //       setShowSuccessPopup(true);
  //     } catch (err) {
  //       setError(err.message);
  //     }
  //   },
  //   onError: () => setError(translate("googleLoginFailed", lang)),
  // });

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

  const handlePopupClose = () => {
    setShowSuccessPopup(false);
    navigate("/");
  };

  // ── Eye icons ──
  const EyeIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
  const EyeOffIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );

  return (
    <>
      <h2 className="mobile-auth-title">{translate("welcomeBack", lang)}</h2>
      <p className="mobile-auth-subtitle">{translate("loginToContinue", lang)}</p>

      {error && <div className="mobile-error-message">{error}</div>}
      {resendSuccess && <div className="mobile-success-message">{resendSuccess}</div>}

      {/* ── Resend-verification modal (ported from desktop) ── */}
      {showResend && (
        <div className="mobile-resend-overlay">
          <div className="mobile-resend-modal">
            <button className="mobile-resend-modal-close" onClick={() => setShowResend(false)}>
              ✕
            </button>
            <h3>{translate("emailVerificationRequired", lang)}</h3>
            <p>{translate("accountNotVerified", lang)}</p>
            <button className="mobile-resend-btn" onClick={() => resendVerification(form.email)}>
              {translate("resendVerificationEmail", lang)}
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
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
            className={`mobile-auth-input ${fieldErrors.email ? "mobile-input-error" : ""}`}
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
              placeholder={translate("enterYourPassword", lang)}
              value={form.password}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`mobile-auth-input ${fieldErrors.password ? "mobile-input-error" : ""}`}
              required
            />
            <button
              type="button"
              className="mobile-password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
          {fieldErrors.password && <span className="mobile-field-error">{fieldErrors.password}</span>}
        </div>

        {/* Options row: remember me + forgot password */}
        <div className="mobile-auth-options">
          <label className="mobile-auth-remember mobile-auth-checkbox-label" style={{ margin: 0 }}>
            <input type="checkbox" className="mobile-auth-checkbox" />
            <span className="mobile-auth-checkbox-text">{translate("rememberMe", lang)}</span>
          </label>
          <button type="button" onClick={onSwitchToForgotPassword} className="mobile-forgot-link">
            {translate("forgotPassword", lang)}
          </button>
        </div>

        {/* Submit */}
        <button type="submit" disabled={loading} className="mobile-auth-button">
          {loading ? (
            <span className="mobile-btn-loading">
              <span className="mobile-btn-spinner"></span>
              {translate("loggingIn", lang)}
            </span>
          ) : (
            translate("logIn", lang)
          )}
        </button>

        {/* Divider */}
        <div className="mobile-auth-divider">
          <span className="mobile-auth-divider-line"></span>
          <span className="mobile-auth-divider-text">{translate("or", lang)}</span>
          <span className="mobile-auth-divider-line"></span>
        </div>

        {/* Google */}
        {/* <button type="button" className="mobile-google-button" onClick={() => googleLogin()}>
          <svg className="mobile-google-icon" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          {translate("continueWithGoogle", lang)}
        </button> */}

        {mounted && (
          <GoogleLoginButton
            onSuccess={handleGoogleSuccess}
            onError={() => setError(translate("googleLoginFailed", lang))}
            label={translate("continueWithGoogle", lang)}
            className="mobile-google-button"
            iconClassName="mobile-google-icon"
          />
        )}

        {/* Apple Sign In */}
        {/* <MobileAppleAuthSection /> */}
      </form>

      {/* Switch to register */}
      <div className="mobile-auth-link">
        {translate("dontHaveAccount", lang)}{" "}
        <button onClick={onSwitchToRegister}>{translate("signUp", lang)}</button>
      </div>

      {/* Success popup */}
      {showSuccessPopup && (
        <MobileLoginSuccessPopup
          token={successToken}
          userId={successUserId}
          onClose={handlePopupClose}
        />
      )}
    </>
  );
}