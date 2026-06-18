// react-app/src/components/Header/ProfileDropdown.jsx
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useProfile } from "../../context/ProfileContext";
import { useLanguage } from "../../context/LanguageContext";
import { translate } from "../../data/translations";
import { 
  User,
  Trophy,
  Crown,
  Activity,
  Swords,
  Settings,
  Shield,
  Bell,
  MessageCircle,
  Info,
  LogOut,
  LogIn,
  Sparkles,
  ChevronRight,
  Gift
} from "lucide-react";
import "./HeaderDropdowns.css";

// Utility function for avatar URL
const getAvatarUrl = (avatar, fallback = '/images/default-avatar.png') => {
  if (!avatar?.trim()) return fallback;
  
  if (/^(https?:|blob:|data:)/.test(avatar)) {
    return avatar;
  }
  
  const API_BASE = import.meta.env.VITE_API_URL || '';
  return avatar.startsWith('/') 
    ? `${API_BASE}${avatar}`
    : `${API_BASE}/uploads/avatars/${avatar}`;
};

export default function ProfileDropdown({ isOpen, onClose, user }) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { profile } = useProfile();
  const { lang } = useLanguage();

  const handleNavigation = (path) => {
    try {
      navigate(path);
      onClose();
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  const handleLogout = () => {
    try {
      logout();
      onClose();
      navigate("/");
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (!isOpen) return null;

  const menuItems = [
    {
      section: translate("accountSection", lang),
      items: [
        { icon: Trophy, label: translate("leaderboard", lang), action: () => handleNavigation("/leaderboard") },
        { icon: Crown, label: translate("plb_title", lang), action: () => handleNavigation("/predictions/leaderboard") },
        { icon: Activity, label: translate("activityHistory", lang), action: () => handleNavigation("/profile?tab=activity") },
        { icon: Swords, label: translate("playerStatistics", lang), action: () => handleNavigation("/profile?tab=stats") },
        { icon: Settings, label: translate("profileSettings", lang), action: () => handleNavigation("/profile?tab=settings") },
        { icon: Shield, label: translate("accountSecurity", lang), action: () => handleNavigation("/profile?tab=security") },
        { icon: Bell, label: translate("notificationPreferences", lang), action: () => handleNavigation("/profile?tab=notifications") },
        { icon: Gift, label: translate("profileTab_redeemCode", lang), action: () => handleNavigation("/profile?tab=redeem-code") }
      ],
    },
    {
      section: translate("supportSection", lang),
      items: [
        { icon: MessageCircle, label: translate("contactUs", lang), action: () => handleNavigation("/contact") },
        { icon: Info, label: translate("aboutUs", lang), action: () => handleNavigation("/about") },
      ],
    },
  ];

  return (
    <>
      <div className="dropdown-overlay" onClick={onClose}></div>
      <div className="header-dropdown profile-dropdown">
        {user ? (
          <>
            {/* LOGGED IN */}
            <div className="dropdown-header profile-header">
              <div className="profile-user-info">
                <img
                  src={getAvatarUrl(profile.avatar)}
                  alt={user.username}
                  className="profile-avatar-large"
                  onError={(e) => {
                    e.currentTarget.src = '/images/default-avatar.png';
                  }}
                />

                <div className="profile-user-details">
                  <p className="profile-username">{user.username}</p>
                  <p className="profile-email">{user.email}</p>
                </div>
              </div>

              <button
                className="btn-profile-view"
                onClick={() => handleNavigation("/profile")}
              >
                <User size={18} strokeWidth={2.5} />
                <span>{translate("profile", lang)}</span>
              </button>
            </div>

            <div className="dropdown-content">
              {menuItems.map((section, idx) => (
                <div key={idx} className="menu-section">
                  <div className="menu-section-title">{section.section}</div>
                  {section.items.map((item, itemIdx) => {
                    const IconComponent = item.icon;
                    return (
                      <button
                        key={itemIdx}
                        className="menu-item"
                        onClick={item.action}
                      >
                        <span className="menu-icon-profile">
                          <IconComponent size={18} strokeWidth={2.5} />
                        </span>
                        <span className="menu-label">{item.label}</span>
                        <ChevronRight className="menu-arrow" size={16} strokeWidth={2} />
                      </button>
                    );
                  })}
                </div>
              ))}

              <button
                className="menu-item menu-item-danger logout-btn"
                onClick={handleLogout}
              >
                <span className="menu-icon-profile">
                  <LogOut size={18} strokeWidth={2.5} />
                </span>
                <span className="menu-label">{translate("logout", lang)}</span>
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Guest View - Not Logged In */}
            <div className="dropdown-content guest-view">
              <div className="guest-message">
                <div className="guest-icon-container">
                  <Sparkles className="guest-icon-lucide" size={48} strokeWidth={2} />
                </div>
                <h3>{translate("welcomeGuest", lang)}</h3>
                <p>{translate("guestMessage", lang)}</p>
              </div>

              <div className="guest-actions">
                <button
                  className="btn-primary full-width"
                  onClick={() => handleNavigation("/login")}
                >
                  <LogIn size={18} strokeWidth={2.5} />
                  <span>{translate("logIn", lang)}</span>
                </button>
                <button
                  className="btn-secondary full-width"
                  onClick={() => handleNavigation("/register")}
                >
                  <Sparkles size={18} strokeWidth={2.5} />
                  <span>{translate("signUp", lang)}</span>
                </button>
              </div>

              <div className="guest-divider">
                <span>{translate("continueAsGuest", lang)}</span>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}