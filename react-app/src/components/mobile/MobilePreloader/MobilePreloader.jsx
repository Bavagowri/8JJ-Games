// src/components/mobile/MobilePreloader/MobilePreloader.jsx

import { useState, useEffect } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { translate } from '../../../data/translations';
import { Gamepad2, Zap, Target, Trophy, Sparkles, Rocket } from 'lucide-react';
import './MobilePreloader.css';

export default function MobilePreloader({ duration = 2500 }) {
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
        return prev + 2.5;
      });
    }, duration / 40);

    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => setIsVisible(false), 600);
    }, duration);

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, [duration]);

  if (!isVisible) return null;

  return (
    <div 
      className={`mobile-preloader ${fadeOut ? 'fade-out' : ''}`}
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin="0"
      aria-valuemax="100"
      aria-label={translate("loadingText", lang)}
    >
      {/* Animated Background */}
      <div className="mobile-preloader-bg" aria-hidden="true">
        <div className="mobile-gradient-orb mobile-orb-1"></div>
        <div className="mobile-gradient-orb mobile-orb-2"></div>
        <div className="mobile-gradient-orb mobile-orb-3"></div>
      </div>

      {/* Floating Game Icons */}
      <div className="mobile-floating-icons" aria-hidden="true">
        <div className="mobile-icon-particle mobile-icon-1">
          <Gamepad2 className="mobile-lucide-icon" size={32} strokeWidth={2} />
        </div>
        <div className="mobile-icon-particle mobile-icon-2">
          <Trophy className="mobile-lucide-icon" size={32} strokeWidth={2} />
        </div>
        <div className="mobile-icon-particle mobile-icon-3">
          <Target className="mobile-lucide-icon" size={32} strokeWidth={2} />
        </div>
        <div className="mobile-icon-particle mobile-icon-4">
          <Zap className="mobile-lucide-icon" size={32} strokeWidth={2} />
        </div>
        <div className="mobile-icon-particle mobile-icon-5">
          <Sparkles className="mobile-lucide-icon" size={32} strokeWidth={2} />
        </div>
        <div className="mobile-icon-particle mobile-icon-6">
          <Rocket className="mobile-lucide-icon" size={32} strokeWidth={2} />
        </div>
      </div>

      <div className="mobile-preloader-content">
        {/* Logo with Animated Glow */}
        <div className="mobile-logo-container">
          <div className="mobile-logo-glow" aria-hidden="true"></div>
          <div className="mobile-logo-wrapper">
            {/* Animated Ring */}
            <div className="mobile-logo-ring" aria-hidden="true">
              <svg viewBox="0 0 120 120" className="mobile-ring-svg">
                <circle 
                  cx="60" 
                  cy="60" 
                  r="55" 
                  fill="none"
                  stroke="url(#mobile-gradient)" 
                  strokeWidth="3"
                  strokeDasharray="345"
                  strokeDashoffset="345"
                  className="mobile-ring-circle"
                />
                <defs>
                  <linearGradient id="mobile-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00d9ff" />
                    <stop offset="50%" stopColor="#4facfe" />
                    <stop offset="100%" stopColor="#00f2fe" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            
            {/* Brand Logo */}
            <div className="mobile-brand-logo">
              <img 
                className="mobile-brand-image" 
                src="/8JJ_games.png" 
                alt="8JJ Games"
              />
            </div>
          </div>
        </div>

        {/* Loading Progress */}
        <div className="mobile-loading-section">
          {/* Progress Bar */}
          <div className="mobile-progress-containerz">
            <div className="mobile-progress-track">
              <div 
                className="mobile-progress-fill" 
                style={{ width: `${progress}%` }}
              >
                <div className="mobile-progress-shine"></div>
              </div>
            </div>
            <div className="mobile-progress-percentage">
              {Math.round(progress)}%
            </div>
          </div>
          
          {/* Loading Dots */}
          <div className="mobile-loading-dots" aria-hidden="true">
            <span className="mobile-dot"></span>
            <span className="mobile-dot"></span>
            <span className="mobile-dot"></span>
          </div>
          
          {/* Loading Message */}
          <p className="mobile-loading-message">
            {translate("loadingText", lang) || "Loading your games..."}
          </p>
        </div>

        {/* Feature Pills */}
        <div className="mobile-feature-pills" role="list" aria-label="Features">
          <div className="mobile-pill" role="listitem">
            <Zap className="mobile-pill-icon" size={16} strokeWidth={2.5} />
            <span>{translate("preloader_feature_instant", lang) || "Instant Play"}</span>
          </div>
          <div className="mobile-pill" role="listitem">
            <Target className="mobile-pill-icon" size={16} strokeWidth={2.5} />
            <span>{translate("preloader_feature_games", lang) || "1000+ Games"}</span>
          </div>
          <div className="mobile-pill" role="listitem">
            <Gamepad2 className="mobile-pill-icon" size={16} strokeWidth={2.5} />
            <span>{translate("preloader_feature_nodownload", lang) || "No Download"}</span>
          </div>
        </div>
      </div>

      {/* Particle Effects */}
      <div className="mobile-particles" aria-hidden="true">
        {[...Array(15)].map((_, i) => (
          <div key={i} className={`mobile-particle mobile-particle-${i + 1}`}></div>
        ))}
      </div>
    </div>
  );
}