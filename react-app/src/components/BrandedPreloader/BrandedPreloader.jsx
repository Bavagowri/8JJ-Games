// react-app/src/components/BrandedPreloader/BrandedPreloader.jsx

import { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { translate } from '../../data/translations';
import { Gamepad2, Joystick, Trophy, Zap, Dice5, Target } from 'lucide-react';
import './BrandedPreloader.css';

export default function BrandedPreloader({ duration = 3000 }) {
  const { lang } = useLanguage();
  
  const [isVisible, setIsVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Animate progress bar
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, duration / 50);

    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => setIsVisible(false), 800);
    }, duration);

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, [duration]);

  if (!isVisible) return null;

  return (
    <div 
      className={`preloader ${fadeOut ? 'fade-out' : ''}`}
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin="0"
      aria-valuemax="100"
      aria-label={translate("preloader_loading", lang)}
    >
      {/* Animated Background */}
      <div className="preloader-bg" aria-hidden="true">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

      {/* Floating Game Icons */}
      <div className="floating-icons" aria-hidden="true">
        <div className="icon-particle icon-1">
          <Gamepad2 className="lucide-icon" size={40} strokeWidth={2} />
        </div>
        <div className="icon-particle icon-2">
          <Joystick className="lucide-icon" size={40} strokeWidth={2} />
        </div>
        <div className="icon-particle icon-3">
          <Trophy className="lucide-icon" size={40} strokeWidth={2} />
        </div>
        <div className="icon-particle icon-4">
          <Target className="lucide-icon" size={40} strokeWidth={2} />
        </div>
        <div className="icon-particle icon-5">
          <Zap className="lucide-icon" size={40} strokeWidth={2} />
        </div>
        <div className="icon-particle icon-6">
          <Dice5 className="lucide-icon" size={40} strokeWidth={2} />
        </div>
      </div>

      <div className="preloader-content">
        {/* Logo with Animated Glow */}
        <div className="logo-container">
          <div className="logo-glow" aria-hidden="true"></div>
          <div className="logo-wrapper">
            <svg 
              className="logo-icon" 
              viewBox="0 0 100 100" 
              fill="none"
              aria-hidden="true"
            >
              <circle cx="50" cy="50" r="45" stroke="url(#gradient)" strokeWidth="3"/>
              <path 
                d="M35 50 L45 60 L65 40" 
                stroke="white" 
                strokeWidth="4" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="checkmark"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1476d8ff" />
                  <stop offset="100%" stopColor="#5387b6ff" />
                </linearGradient>
              </defs>
            </svg>
            <h1 className="brand-text">
              <img 
                className="brand-image" 
                src="/images/8JJ_games.png" 
                alt="8JJ Games"
              />
            </h1>
          </div>
        </div>

        {/* Loading Progress */}
        <div className="loading-section">
          <div className="progress-container">
            <div className="progress-bar" role="presentation">
              <div 
                className="progress-fill" 
                style={{ width: `${progress}%` }}
                aria-hidden="true"
              >
                <div className="progress-glow"></div>
              </div>
            </div>
            <div className="progress-text" aria-live="polite">
              {progress}%
            </div>
          </div>
          
          <div className="loading-dots" aria-hidden="true">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
          
          <p className="loading-message">
            {translate("preloader_message", lang)}
          </p>
        </div>

        {/* Feature Pills */}
        <div className="feature-pills" role="list" aria-label={translate("preloader_features", lang)}>
          <div className="pill" role="listitem">
            <Target className="pill-icon-lucide" size={18} strokeWidth={2.5} />
            <span>{translate("preloader_feature_games", lang)}</span>
          </div>
          <div className="pill" role="listitem">
            <Zap className="pill-icon-lucide" size={18} strokeWidth={2.5} />
            <span>{translate("preloader_feature_instant", lang)}</span>
          </div>
          <div className="pill" role="listitem">
            <Gamepad2 className="pill-icon-lucide" size={18} strokeWidth={2.5} />
            <span>{translate("preloader_feature_nodownload", lang)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}