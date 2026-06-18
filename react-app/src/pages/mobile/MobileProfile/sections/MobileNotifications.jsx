// src/pages/mobile/MobileProfile/sections/MobileNotifications.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { notificationAPI } from "../../../../api/notification.api";
import { useLanguage } from "../../../../context/LanguageContext";
import { translate } from "../../../../data/translations";
import MobileHeader from "../../../../components/mobile/MobileHeader/MobileHeader";
import MobileBottomNav from "../../../../components/mobile/MobileBottomNav/MobileBottomNav";
import "./MobileNotifications.css";

const R2_BASE =
  import.meta.env.VITE_ASSETS_BASE_URL ||
  "https://assets.8jjgames.com";

const ICONS = {
  games: `${R2_BASE}/8jj_icons/icons/game-2.webp`,
  social: `${R2_BASE}/8jj_icons/icons/social.webp`,
  email: `${R2_BASE}/8jj_icons/icons/email.webp`,
  success: `${R2_BASE}/8jj_icons/icons/check.webp`,
  error: `${R2_BASE}/8jj_icons/icons/wrong.webp`,
};

export default function MobileNotifications() {
  const navigate = useNavigate();
  const { lang } = useLanguage();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, []);

  const [settings, setSettings] = useState({
    game_updates: true,
    achievements: true,
    email_notifications: false,
    new_games: true,
    level_up: true,
    community_events: false,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      setLoading(true);
      const prefs = await notificationAPI.getPreferences();

      setSettings({
        game_updates: prefs.game_updates ?? true,
        new_games: prefs.new_games ?? true,
        level_up: prefs.level_up ?? true,
        achievements: prefs.achievements ?? true,
        community_events: prefs.community_events ?? false,
        email_notifications: prefs.email_notifications ?? false,
      });
    } catch (err) {
      showMessage(translate("notification_error_update", lang), "error");
    } finally {
      setLoading(false);
    }
  };

  const toggle = async (key) => {
    const newValue = !settings[key];

    setSettings((prev) => ({
      ...prev,
      [key]: newValue,
    }));

    try {
      setSaving(true);
      await notificationAPI.updatePreferences({ [key]: newValue });
      showMessage(translate("notification_success_update", lang), "success");
    } catch (err) {
      setSettings((prev) => ({
        ...prev,
        [key]: !newValue,
      }));
      showMessage(translate("notification_error_update", lang), "error");
    } finally {
      setSaving(false);
    }
  };

  const showMessage = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const notificationCategories = [
    {
      icon: ICONS.games,
      title: translate("notification_category_gaming", lang),
      items: [
        { key: "game_updates", label: translate("notification_game_updates", lang), description: translate("notification_game_updates_desc", lang) },
        { key: "new_games", label: translate("notification_new_games", lang), description: translate("notification_new_games_desc", lang) },
        { key: "level_up", label: translate("notification_level_up", lang), description: translate("notification_level_up_desc", lang) },
      ],
    },
    {
      icon: ICONS.social,
      title: translate("notification_category_social", lang),
      items: [
        { key: "achievements", label: translate("notification_achievements", lang), description: translate("notification_achievements_desc", lang) },
        { key: "community_events", label: translate("notification_community_events", lang), description: translate("notification_community_events_desc", lang) },
      ],
    },
    {
      icon: ICONS.email,
      title: translate("notification_category_email", lang),
      items: [
        { key: "email_notifications", label: translate("notification_email_toggle", lang), description: translate("notification_email_desc", lang) },
      ],
    },
  ];

  const handleBackToMain = () => {
    navigate("/profile", { replace: true });
  };

  if (loading) {
    return (
      <div className="mobile-notifications-wrapper">
        <MobileHeader title={translate("notification_title", lang)} showBack />
        <div className="mobile-content">
          <div className="mobile-loading">
            <div className="mobile-spinner"></div>
            <p>{translate("notification_loading", lang)}</p>
          </div>
        </div>
        <MobileBottomNav />
      </div>
    );
  }

  return (
    <div className="mobile-notifications-wrapper">

      
      <MobileHeader title={translate("notification_title", lang)} showBack />

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
            {translate("notification_title", lang)}
          </h1>

          {/* Right spacer (future icon / keeps title centered) */}
          <div className="mobile-top-spacer" />
        </div>

        <p className="notifications-subtitle">
          {translate("notification_subtitle", lang)}
        </p>

        {message && (
          <div className={`mobile-notification-message message-${message.type}`}>
            <img
              src={message.type === "success" ? ICONS.success : ICONS.error}
              alt=""
              className="message-icon"
            />
            {message.text}
          </div>
        )}

        {notificationCategories.map((category, categoryIndex) => (
          <div key={categoryIndex} className="notification-category">
            <div className="category-header">
              <img src={category.icon} alt="" className="category-icon" />
              <h3>{category.title}</h3>
            </div>

            {category.items.map((item) => (
              <div key={item.key} className="notification-item">
                <div className="notification-info">
                  <h4>{item.label}</h4>
                  <p>{item.description}</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings[item.key]}
                    onChange={() => toggle(item.key)}
                    disabled={saving}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            ))}
          </div>
        ))}

        <div className="mobile-footer-space" />
      </div>

      <MobileBottomNav />
    </div>
  );
}