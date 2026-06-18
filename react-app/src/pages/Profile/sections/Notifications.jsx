import { useState, useEffect } from "react";
import { notificationAPI } from "../../../api/notification.api";
import { useLanguage } from "../../../context/LanguageContext";
import { translate } from "../../../data/translations";

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

export default function Notifications() {
  const { lang } = useLanguage();

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

  if (loading) {
    return (
      <div className="profile-notifications-page" style={{ textAlign: "center", padding: "60px 20px" }}>
        <div className="loading-spinner" style={{ margin: "0 auto 20px" }} />
        <p style={{ color: "var(--text-secondary)" }}>
          {translate("notification_loading", lang)}
        </p>
      </div>
    );
  }

  return (
    <div className="profile-notifications-page">
      <h3 className="Profile-title">{translate("notification_title", lang)}</h3>

      <p style={{ color: "var(--text-secondary)", marginBottom: "32px", fontSize: "15px" }}>
        {translate("notification_subtitle", lang)}
      </p>

      {message && (
        <div
          style={{
            padding: "12px 20px",
            borderRadius: "8px",
            marginBottom: "24px",
            background: message.type === "success"
              ? "rgba(46,213,115,0.1)"
              : "rgba(255,71,87,0.1)",
            border: `1px solid ${message.type === "success" ? "#2ed573" : "#ff4757"}`,
            color: message.type === "success" ? "#2ed573" : "#ff4757",
            fontWeight: "500",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <img
            src={message.type === "success" ? ICONS.success : ICONS.error}
            alt=""
            aria-hidden="true"
            className="message-icon"
          />
          {message.text}
        </div>
      )}

      {notificationCategories.map((category, categoryIndex) => (
        <div key={categoryIndex} style={{ marginBottom: "32px" }}>
          <h4
            style={{
              fontSize: "18px",
              fontWeight: "700",
              marginBottom: "16px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <img src={category.icon} alt="" aria-hidden="true" className="notification-section-icon" />
            {category.title}
          </h4>

          {category.items.map((item, itemIndex) => (
            <div
              key={item.key}
              className="notification-item ThemeBox"
              style={{
                animationDelay: `${(categoryIndex * 3 + itemIndex) * 0.05}s`,
                opacity: saving ? 0.6 : 1,
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: "600", marginBottom: "4px" }}>
                  {item.label}
                </div>
                <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                  {item.description}
                </div>
              </div>

              <label style={{ position: "relative", width: "60px", height: "30px" }}>
                <input
                  type="checkbox"
                  checked={settings[item.key]}
                  onChange={() => toggle(item.key)}
                  disabled={saving}
                  style={{ opacity: 0 }}
                />
                <span
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: settings[item.key]
                      ? "var(--primary-gradient)"
                      : "rgba(79,172,254,0.2)",
                    borderRadius: "30px",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      width: "22px",
                      height: "22px",
                      left: settings[item.key] ? "34px" : "4px",
                      bottom: "4px",
                      background: "#fff",
                      borderRadius: "50%",
                      transition: "0.4s",
                    }}
                  />
                </span>
              </label>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
