// react-app/src/pages/NotFound/NotFound.jsx

import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { translate } from '../../data/translations';
import SEO from '../../components/SEO/SEO';
import { generateKeywords } from '../../config/seoKeywords';
import './NotFound.css';

export default function NotFound() {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  
  const [glitchText, setGlitchText] = useState('404');
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    // Glitch effect for 404 text
    const glitchInterval = setInterval(() => {
      const glitches = ['404', '4Ø4', '4０4', '４04', '40４'];
      setGlitchText(glitches[Math.floor(Math.random() * glitches.length)]);
    }, 150);

    // Countdown timer
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          navigate('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(glitchInterval);
      clearInterval(countdownInterval);
    };
  }, [navigate]);

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  // Replace {{count}} in translation with actual countdown value
  const getRedirectText = () => {
    const template = translate("notFound_redirect", lang);
    return template.replace('{{count}}', countdown);
  };

  return (
    <>
      {/* SEO Meta Tags */}
      <SEO
        title={`${translate("notFound_title", lang)} - 8JJ Games`}
        description={translate("notFound_subtitle", lang)}
        keywords={generateKeywords('pages', '404')}
        url="/404"
      />

      <main className="notfound-container">
        {/* Animated Background Stars */}
        <div className="notfound-stars2" aria-hidden="true"></div>
        <div className="notfound-stars3" aria-hidden="true"></div>

        <div className="notfound-content">
          {/* Glitch 404 Effect */}
          <div className="notfound-glitch-wrapper" role="img" aria-label="Error 404">
            <h1 className="notfound-glitch" data-text={glitchText}>
              {glitchText}
            </h1>
          </div>

          {/* Game Controller Icon */}
          <div className="notfound-icon" aria-hidden="true">🎮</div>

          {/* Main Error Message */}
          <h2 className="notfound-title">{translate("notFound_title", lang)}</h2>
          <p className="notfound-subtitle">
            {translate("notFound_subtitle", lang)}
          </p>

          {/* Additional Information */}
          <div className="notfound-message">
            <p>{translate("notFound_description", lang)}</p>
            <p className="notfound-hint">{translate("notFound_hint", lang)}</p>
          </div>

          {/* Action Buttons */}
          <nav className="notfound-actions" aria-label="Navigation options">
            <button 
              onClick={handleGoHome} 
              className="notfound-btn notfound-btn-primary"
              aria-label={translate("notFound_backHome", lang)}
            >
              <span aria-hidden="true">🏠</span> {translate("notFound_backHome", lang)}
            </button>
            <button 
              onClick={handleGoBack} 
              className="notfound-btn notfound-btn-secondary"
              aria-label={translate("notFound_goBack", lang)}
            >
              <span aria-hidden="true">←</span> {translate("notFound_goBack", lang)}
            </button>
          </nav>

          {/* Auto-redirect Countdown */}
          <div className="notfound-countdown" role="status" aria-live="polite">
            <p>
              {getRedirectText().split(countdown.toString()).map((part, index, array) => (
                index < array.length - 1 ? (
                  <span key={index}>
                    {part}
                    <span className="countdown-number">{countdown}</span>
                  </span>
                ) : part
              ))}
            </p>
          </div>
        </div>

        {/* Footer */}
        <footer className="notfound-footer">
          <p>
            8jjgames.com • {translate("notFound_footer", lang)}
          </p>
        </footer>
      </main>
    </>
  );
}