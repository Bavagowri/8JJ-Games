// react-app/src/pages/Profile/sections/RedeemCode.jsx
import { useState } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { translate } from '../../../data/translations';
import './redeemCode.css';
import { useProfile } from "../../../context/ProfileContext";

const ICONS = {
  gift: "/images/icons/8jj-gift.png"
};

export default function RedeemCode() {
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
        // Update profile context
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

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setMessage(`✅ ${translate('redeem_copy_success', lang)}`);
    setMessageType('success');
    setTimeout(() => setMessage(''), 2000);
  };

  return (
    <div className="redeem-code-container">
      <div className="redeem-card ThemeBox">
        <h2 className="redeem-title">{translate('redeem_title', lang)}</h2>
        <p className="redeem-subtitle">{translate('redeem_subtitle', lang)}</p>

        <form onSubmit={handleRedeem} className="redeem-form">
          <div className="form-group">
            <label htmlFor="codeInput">{translate('redeem_label_code', lang)}</label>
            <div className="input-wrapper">
              <input
                id="codeInput"
                type="text"
                placeholder={translate('redeem_placeholder', lang)}
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                disabled={loading}
                maxLength="12"
                className="code-input"
              />
              {code && (
                <button
                  type="button"
                  onClick={copyCode}
                  className="paste-helper-btn"
                  title="Copy code"
                >
                  📋
                </button>
              )}
            </div>
            <p className="input-hint">{translate('redeem_code_hint', lang)}</p>
          </div>

          <button type="submit" disabled={loading} className="redeem-btn">
            {loading ? `⏳ ${translate('redeem_btn_processing', lang)}` : `🎯 ${translate('redeem_btn_claim', lang)}`}
          </button>
        </form>

        {message && (
          <div className={`message message-${messageType}`}>
            {message}
          </div>
        )}

        <div className="info-box">
          <h4>📝 {translate('redeem_info_title', lang)}</h4>
          <ul>
            <li>{translate('redeem_info_step1', lang)}</li>
            <li>{translate('redeem_info_step2', lang)}</li>
            <li>{translate('redeem_info_step3', lang)}</li>
            <li>{translate('redeem_info_step4', lang)}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}