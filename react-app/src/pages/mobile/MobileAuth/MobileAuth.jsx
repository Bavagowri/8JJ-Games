// src/pages/mobile/MobileAuth/MobileAuth.jsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import MobileHeader from "../../../components/mobile/MobileHeader/MobileHeader";
import MobileLoginForm from "./MobileLoginForm";
import MobileRegisterForm from "./MobileRegisterForm";
import MobileForgotPassword from "./MobileForgotPassword";
import MobileBottomNav from "../../../components/mobile/MobileBottomNav/MobileBottomNav";
import SEO from "../../../components/SEO/SEO";
import { generateKeywords } from "../../../config/seoKeywords";
import { translate } from "../../../data/translations";
import { useLanguage } from "../../../context/LanguageContext";
import "./MobileAuth.css";

export default function MobileAuth({ mode: initialMode = "login" }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { lang } = useLanguage();
  const [mode, setMode] = useState(initialMode);
  const [loaded, setLoaded] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  // Add loaded class after mount for fade-in animation
  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // Sync mode with URL
  useEffect(() => {
    if (location.pathname === "/login") {
      setMode("login");
      setShowForgotPassword(false);
    } else if (location.pathname === "/register") {
      setMode("register");
      setShowForgotPassword(false);
    } else if (location.pathname === "/forgot-password") {
      setShowForgotPassword(true);
    }
  }, [location.pathname]);

  const switchToLogin = () => {
    setMode("login");
    setShowForgotPassword(false);
    navigate("/login");
  };

  const switchToRegister = () => {
    setMode("register");
    setShowForgotPassword(false);
    navigate("/register");
  };

  const switchToForgotPassword = () => {
    setShowForgotPassword(true);
    navigate("/forgot-password");
  };

  const getSEO = () => {
    if (showForgotPassword) {
      return {
        title: "Reset Password - 8JJ Games",
        description: "Reset your 8JJ Games password",
        url: "/forgot-password"
      };
    }
    
    switch (mode) {
      case "login":
        return {
          title: "Login - 8JJ Games",
          description: "Sign in to your 8JJ Games account on mobile",
          url: "/login"
        };
      case "register":
        return {
          title: "Sign Up - 8JJ Games",
          description: "Create your free 8JJ Games account",
          url: "/register"
        };
      default:
        return {
          title: "Login - 8JJ Games",
          description: "Access your account",
          url: "/login"
        };
    }
  };

  const seo = getSEO();

  return (
    <>
      <SEO
        title={seo.title}
        description={seo.description}
        keywords={generateKeywords('pages', mode)}
        url={seo.url}
      />

      <div className={`mobile-auth-wrapper ${loaded ? 'loaded' : ''}`}>
         <MobileHeader />
        {/* Animated Background Particles */}
        <div className="mobile-auth-particles" aria-hidden="true">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="mobile-auth-particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 8}s`,
                animationDuration: `${8 + Math.random() * 12}s`
              }}
            />
          ))}
        </div>

        {/* Logo Header */}
        <div className="mobile-auth-logo-header">
          <a href="/" className="mobile-auth-logo-link">
            <img
              src="/8JJ_games.png"
              alt="8JJ Games"
              className="mobile-auth-logo"
            />
          </a>
        </div>

        {/* Main Content Card */}
        <div className="mobile-auth-card">
          {!showForgotPassword ? (
            <>
              {/* Tab Navigation */}
              <div className="mobile-auth-tabs">
                <button
                  className={`mobile-auth-tab ${mode === "login" ? "active" : ""}`}
                  onClick={switchToLogin}
                >
                  <span className="mobile-auth-tab-text">
                    {translate("logIn", lang)}
                  </span>
                  {mode === "login" && (
                    <span className="mobile-auth-tab-indicator" />
                  )}
                </button>
                
                <button
                  className={`mobile-auth-tab ${mode === "register" ? "active" : ""}`}
                  onClick={switchToRegister}
                >
                  <span className="mobile-auth-tab-text">
                    {translate("signUp", lang)}
                  </span>
                  {mode === "register" && (
                    <span className="mobile-auth-tab-indicator" />
                  )}
                </button>
              </div>

              {/* Form Content with Slide Animation */}
              <div className="mobile-auth-form-container">
                <div
                  className={`mobile-auth-form-slider ${mode === "register" ? "slide-left" : ""}`}
                >
                  {/* Login Form */}
                  <div className="mobile-auth-form-panel">
                    {mode === "login" && (
                      <MobileLoginForm
                        onSwitchToRegister={switchToRegister}
                        onSwitchToForgotPassword={switchToForgotPassword}
                      />
                    )}
                  </div>

                  {/* Register Form */}
                  <div className="mobile-auth-form-panel">
                    {mode === "register" && (
                      <MobileRegisterForm
                        onSwitchToLogin={switchToLogin}
                      />
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* Forgot Password Form */
            <div className="mobile-auth-forgot-container">
              <MobileForgotPassword
                onSwitchToLogin={switchToLogin}
              />
            </div>
          )}
        </div>

        <MobileBottomNav />
      </div>
    </>
  );
}