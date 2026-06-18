// src/pages/mobile/MobileAuth/MobileLoginSuccessPopup.jsx

import { useEffect, useState } from 'react';
import { translate } from '../../../data/translations';
import { useLanguage } from '../../../context/LanguageContext';

export default function MobileLoginSuccessPopup({ onClose, userId, token }) {
  const { lang } = useLanguage();
  const [code, setCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [alreadyClaimed, setAlreadyClaimed] = useState(false);

  useEffect(() => {
    // Fall back to localStorage if props are missing (same as desktop)
    const storedUserId = userId || localStorage.getItem('userId');
    const storedToken = token || localStorage.getItem('authToken');

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

      const response = await fetch('/api/redemption/generate-user-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenVal}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        if (data.success && data.code) {
          setCode(data.code);
        } else if (data.already_claimed) {
          setAlreadyClaimed(true);
        } else {
          throw new Error(data.message || 'Failed to generate code');
        }
      } else {
        throw new Error(data.message || 'Failed to generate code');
      }
    } catch (err) {
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

  // Auto-dismiss if already claimed (same as desktop)
  useEffect(() => {
    if (alreadyClaimed) {
      const timer = setTimeout(() => {
        onClose();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [alreadyClaimed, onClose]);

  return (
    <div className="mobile-success-overlay">
      <div className="mobile-success-modal">
        <button className="mobile-success-close-btn" onClick={onClose}>&times;</button>

        <div className="mobile-success-modal-content">
          {loading ? (
            <div className="mobile-success-loading">
              <div className="mobile-success-spinner"></div>
              <p>{translate("generatingCode", lang)}</p>
            </div>

          ) : alreadyClaimed ? (
            <div className="mobile-success-already-claimed">
              <p style={{ fontSize: '48px', margin: '0' }}>✅</p>
              <h3 style={{ color: '#00d9ff', marginTop: '16px' }}>
                {translate("welcomeBack", lang)}
              </h3>
              <p style={{ color: '#aaa', marginTop: '8px', fontSize: '14px' }}>
                {translate("alreadyClaimedCode", lang) || "You've already claimed your redemption code"}
              </p>
            </div>

          ) : error ? (
            <div className="mobile-success-error-state">
              <p style={{ fontSize: '48px', margin: '0' }}>⚠️</p>
              <p style={{ color: '#ff4444', marginTop: '10px', fontSize: '14px' }}>
                {error}
              </p>
              <button onClick={onClose} className="mobile-success-close-modal-btn" style={{ marginTop: '12px' }}>
                {translate("skipForNow", lang)}
              </button>
            </div>

          ) : code ? (
            <>
              <div className="mobile-success-icon-container">
                <div className="mobile-success-icon">🎉</div>
              </div>

              <h2 className="mobile-success-title">{translate("welcomeBack", lang)}</h2>
              <p className="mobile-success-subtitle">{translate("exclusiveRedemptionCode", lang)}</p>

              <div className="mobile-success-code-display">
                <div className="mobile-success-code-box">
                  <span className="mobile-success-code-text">{code}</span>
                </div>
                <button
                  onClick={copyCode}
                  className={`mobile-success-copy-btn ${copied ? 'copied' : ''}`}
                >
                  {copied ? `✓ ${translate("copied", lang)}` : `📋 ${translate("copyCode", lang)}`}
                </button>
              </div>

              <div className="mobile-success-instructions">
                <h4>{translate("howToUse", lang)}</h4>
                <ol>
                  <li>{translate("copyCodeAbove", lang)}</li>
                  <li>{translate("goToProfile", lang)}</li>
                  <li>{translate("pasteCode", lang)}</li>
                  <li>{translate("getPointsInstantly", lang)}</li>
                </ol>
              </div>

              <button onClick={onClose} className="mobile-success-close-modal-btn">
                {translate("gotItLetsGo", lang)}
              </button>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}