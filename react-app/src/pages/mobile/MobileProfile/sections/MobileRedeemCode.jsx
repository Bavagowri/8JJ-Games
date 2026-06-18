// src/pages/mobile/MobileProfile/sections/MobileRedeemCode.jsx
import { useState, useEffect } from 'react';

import { useNavigate } from "react-router-dom";
import { useLanguage } from '../../../../context/LanguageContext';
import { translate } from '../../../../data/translations';
import { useProfile } from "../../../../context/ProfileContext";
import MobileHeader from "../../../../components/mobile/MobileHeader/MobileHeader";
import MobileBottomNav from "../../../../components/mobile/MobileBottomNav/MobileBottomNav";
import "./MobileRedeemCode.css";

const R2_BASE =
  import.meta.env.VITE_ASSETS_BASE_URL ||
  "https://assets.8jjgames.com";

const ICONS = {
  gift: "/images/icons/8jj-gift.png"
};

export default function MobileRedeemCode() {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, []);
  
  const navigate = useNavigate();
  const { profile, refreshProfile } = useProfile();
  const { lang } = useLanguage();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  

  const getAuthToken = () => {
    return localStorage.getItem('authToken') || localStorage.getItem('token');
  };

  const handleRedeem = async (e) => {
    e.preventDefault();

    if (!code.trim()) {
      setMessage(translate('redeem_error_empty', lang));
      setMessageType('error');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const token = getAuthToken();

      if (!token) {
        setMessage(`❌ ${translate('redeem_error_login', lang)}`);
        setMessageType('error');
        setLoading(false);
        return;
      }

      const response = await fetch('/api/redemption/redeem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ code: code.toUpperCase() })
      });

      const data = await response.json();

      if (data.success) {
        setMessage(`✅ Success! You earned ${data.points_added} points. Total: ${data.total_points} points`);
        setMessageType('success');
        setCode('');
        await refreshProfile();

        setTimeout(() => setMessage(''), 5000);
      } else {
        setMessage(`❌ ${data.message}`);
        setMessageType('error');
      }
    } catch (error) {
      setMessage(`❌ ${translate('redeem_error_failed', lang)}`);
      setMessageType('error');
      console.error('Redemption error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToMain = () => {
    navigate("/profile", { replace: true });
  };

  return (
    <div className="mobile-redeem-wrapper">
      <MobileHeader title={translate('redeem_title', lang)} showBack />

      <div className="mobile-content">

        {/* Mobile Top-bar */}
        <div className="mobile-top-bar">
          {/* Back button */}
          <button
            onClick={handleBackToMain}
            className="premium-mobile-back-button"
            aria-label="Go back"
          >
            ←
          </button>

          {/* Page title */}
          <h1 className="mobile-top-title">
            {translate("redeem_title", lang)}
          </h1>

          {/* Right spacer (future icon / keeps title centered) */}
          <div className="mobile-top-spacer" />
        </div>


        <div className="mobile-redeem-card">
          <div className="redeem-icon-wrapper">
            {/* <img src={ICONS.gift} alt="" className="redeem-icon" /> */}
          </div>

          <h2 className="redeem-heading">{translate('redeem_title', lang)}</h2>
          <p className="redeem-subtitle">{translate('redeem_subtitle', lang)}</p>

          <form onSubmit={handleRedeem} className="mobile-redeem-form">
            <div className="code-input-wrapper">
              <input
                type="text"
                placeholder={translate('redeem_placeholder', lang)}
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                disabled={loading}
                maxLength="12"
                className="mobile-code-input"
              />
            </div>
            <p className="code-hint">{translate('redeem_code_hint', lang)}</p>

            <button type="submit" disabled={loading} className="mobile-redeem-btn">
              {loading ? (
                <>
                  <div className="btn-spinner"></div>
                  {translate('redeem_btn_processing', lang)}
                </>
              ) : (
                `🎯 ${translate('redeem_btn_claim', lang)}`
              )}
            </button>
          </form>

          {message && (
            <div className={`redeem-message message-${messageType}`}>
              {message}
            </div>
          )}
        </div>

        <div className="redeem-info-card">
          <h4>📝 {translate('redeem_info_title', lang)}</h4>
          <ul>
            <li>{translate('redeem_info_step1', lang)}</li>
            <li>{translate('redeem_info_step2', lang)}</li>
            <li>{translate('redeem_info_step3', lang)}</li>
            <li>{translate('redeem_info_step4', lang)}</li>
          </ul>
        </div>

        <div className="mobile-footer-space" />
      </div>

      <MobileBottomNav />
    </div>
  );
}