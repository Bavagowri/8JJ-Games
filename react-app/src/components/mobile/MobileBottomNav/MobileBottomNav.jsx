// src/components/mobile/MobileBottomNav/MobileBottomNav.jsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "../../../context/LanguageContext";
import { translate } from "../../../data/translations";
import { useAuth } from "../../../context/AuthContext";
import { useProfile } from "../../../context/ProfileContext";
import { 
  Home, 
  Gamepad2, 
  Star, 
  LogIn,
  User
} from "lucide-react";
import "./MobileBottomNav.css";

// Avatar utility
const getAvatarUrl = (avatar, fallback = '/images/default-avatar.png') => {
  if (!avatar?.trim()) return fallback;
  if (/^(https?:|blob:|data:)/.test(avatar)) return avatar;
  const API_BASE = import.meta.env.VITE_API_URL || '';
  return avatar.startsWith('/')
    ? `${API_BASE}${avatar}`
    : `${API_BASE}/uploads/avatars/${avatar}`;
};

export default function MobileBottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { lang } = useLanguage();
  const { isAuthenticated } = useAuth();
  const { profile } = useProfile();
  const [activeTab, setActiveTab] = useState("home");

  // Update active tab based on route
  useEffect(() => {
    const path = location.pathname;
    if (path === "/") {
      setActiveTab("home");
    } else if (path.startsWith("/all-")) {
      setActiveTab("all");
    } else if (path === "/my-collection") {
      setActiveTab("collection");
    } else if (path === "/login" || path === "/profile") {
      setActiveTab("auth");
    }
  }, [location]);

  const handleNavClick = (tab, path) => {
    setActiveTab(tab);
    navigate(path);
  };

  const navItems = [
    {
      id: "home",
      path: "/",
      icon: Home,
      label: translate("home", lang),
    },
    {
      id: "all",
      path: "/all-8jj-games",
      icon: Gamepad2,
      label: translate("allGames", lang),
    },
    {
      id: "collection",
      path: "/my-collection",
      icon: Star,
      label: translate("myCollection", lang),
    },
    {
      id: "auth",
      path: isAuthenticated ? "/profile" : "/login",
      icon: isAuthenticated ? User : LogIn,
      label: isAuthenticated ? translate("profile", lang) : translate("logInHeader", lang),
    }
  ];

  return (
    <nav className="mobile-bottom-nav" role="navigation" aria-label="Main navigation">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        
        return (
          <button
            key={item.id}
            className={`mobile-nav-item ${isActive ? "active" : ""}`}
            onClick={() => handleNavClick(item.id, item.path)}
            aria-label={item.label}
            aria-current={isActive ? "page" : undefined}
          >
            <div className="mobile-nav-icon-container">
              {/* Show profile image for authenticated users, otherwise show icon */}
              {item.id === "auth" && isAuthenticated && profile?.avatar ? (
                <img 
                  src={getAvatarUrl(profile.avatar)} 
                  alt="Profile" 
                  className="mobile-nav-avatar"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling.style.display = 'block';
                  }}
                />
              ) : null}
              <Icon 
                className="mobile-nav-icon" 
                style={{
                  display: item.id === "auth" && isAuthenticated && profile?.avatar ? 'none' : 'block'
                }}
              />
            </div>
            <span className="mobile-nav-label">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}