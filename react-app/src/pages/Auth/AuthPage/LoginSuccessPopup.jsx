
// react-app/src/pages/Auth/LoginSuccessPopup.jsx

import { useEffect, useState } from 'react';
import { translate } from '../../../data/translations';
import { useLanguage } from '../../../context/LanguageContext';
import './loginSuccessPopup.css';

export default function LoginSuccessPopup({ onClose, userId, token }) {
  const { lang } = useLanguage();
  const [code, setCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [alreadyClaimed, setAlreadyClaimed] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');

  useEffect(() => {
    const debugMsg = `
Props Received:
- userId: ${userId} (type: ${typeof userId})
- token: ${token ? 'Present' : 'Missing'}
- token preview: ${token ? token.substring(0, 30) + '...' : 'N/A'}

LocalStorage:
- userId: ${localStorage.getItem('userId')}
- token: ${localStorage.getItem('authToken') ? 'Present' : 'Missing'}
    `.trim();

    // console.log(debugMsg);
    setDebugInfo(debugMsg);

    // Try to get from localStorage if props are missing
    const storedUserId = userId || localStorage.getItem('userId');
    const storedToken = token || localStorage.getItem('authToken');

    // console.log('Using userId:', storedUserId);
    // console.log('Using token:', storedToken ? 'Present' : 'Missing');

    if (storedUserId && storedToken) {
      generateCode(storedUserId, storedToken);
    } else {
      setError('Missing authentication data. Please try logging in again.');
      setLoading(false);
    }
  }, [userId, token]);

  const generateCode = async (userIdVal, tokenVal) => {
    try {
      setLoading(true);
      setError('');
      setAlreadyClaimed(false);

      // console.log('📡 Generating code with:', { userId: userIdVal, token: tokenVal?.substring(0, 20) + '...' });

      const response = await fetch('/api/redemption/generate-user-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenVal}`
        }
      });

      // console.log('Response status:', response.status);
      const data = await response.json();
      // console.log('Response data:', data);

      if (response.ok) {
        if (data.success && data.code) {
          // User got a code (first time)
          // console.log(' Code generated:', data.code);
          setCode(data.code);
        } else if (data.already_claimed) {
          // User already claimed their code before
          // console.log(' User already claimed code');
          setAlreadyClaimed(true);
        } else {
          throw new Error(data.message || 'Failed to generate code');
        }
      } else {
        throw new Error(data.message || 'Failed to generate code');
      }
    } catch (err) {
      // console.error('Error:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyCode = () => {
    if (code) {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // If user already claimed, close popup automatically
  useEffect(() => {
    if (alreadyClaimed) {
      const timer = setTimeout(() => {
        onClose();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [alreadyClaimed, onClose]);

  return (
    <div className="login-success-overlay">
      <div className="login-success-modal">
        <button className="success-close-btn" onClick={onClose}>&times;</button>

        <div className="success-modal-content">
          {loading ? (
            <div className="success-loading">
              <div className="success-spinner"></div>
              <p>{translate("generatingCode", lang)}</p>
            </div>
          ) : alreadyClaimed ? (
            <div className="success-already-claimed">
              <p style={{ fontSize: '48px', margin: '0' }}>✅</p>
              <h3 style={{ color: '#00d9ff', marginTop: '20px' }}>
                {translate("welcomeBack", lang)}
              </h3>
              <p style={{ color: '#aaa', marginTop: '10px', fontSize: '14px' }}>
                {translate("alreadyClaimedCode", lang) || "You've already claimed your redemption code"}
              </p>
            </div>
          ) : error ? (
            <div className="success-error-state">
              <p style={{ fontSize: '48px', margin: '0' }}>⚠️</p>
              <p style={{ color: '#ff4444', marginTop: '10px', fontSize: '14px' }}>
                {error}
              </p>
              <button onClick={onClose} className="success-close-modal-btn" style={{ marginTop: '10px' }}>
                {translate("skipForNow", lang)}
              </button>
            </div>
          ) : code ? (
            <>
              <div className="success-icon-container">
                <div className="success-icon">🎉</div>
              </div>

              <h2 className="success-title">{translate("welcomeBack", lang)}</h2>
              <p className="success-subtitle">{translate("exclusiveRedemptionCode", lang)}</p>

              <div className="success-code-display">
                <div className="success-code-box">
                  <span className="success-code-text">{code}</span>
                </div>
                <button 
                  onClick={copyCode} 
                  className={`success-copy-btn ${copied ? 'success-copied' : ''}`}
                >
                  {copied ? `✓ ${translate("copied", lang)}` : `📋 ${translate("copyCode", lang)}`}
                </button>
              </div>

              <div className="success-instructions">
                <h4>{translate("howToUse", lang)}</h4>
                <ol>
                  <li>{translate("copyCodeAbove", lang)}</li>
                  <li>{translate("goToProfile", lang)}</li>
                  <li>{translate("pasteCode", lang)}</li>
                  <li>{translate("getPointsInstantly", lang)}</li>
                </ol>
              </div>

              <button onClick={onClose} className="success-close-modal-btn">
                {translate("gotItLetsGo", lang)}
              </button>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}