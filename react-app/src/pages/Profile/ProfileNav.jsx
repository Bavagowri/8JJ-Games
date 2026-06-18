// react-app/src/pages/Profile/ProfileNav.jsx

import { useState, useRef, useEffect } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { translate } from "../../data/translations";
import {
  LayoutDashboard,
  Activity,
  Swords,
  Settings,
  Shield,
  Bell,
  Gift
} from "lucide-react";
import "./ProfileNav.css";

const tabs = [
  { key: "overview", labelKey: "profileTab_overview", icon: LayoutDashboard },
  { key: "activity", labelKey: "profileTab_activity", icon: Activity },
  { key: "stats", labelKey: "profileTab_stats", icon: Swords },
  { key: "settings", labelKey: "profileTab_editProfile", icon: Settings },
  { key: "security", labelKey: "profileTab_security", icon: Shield },
  { key: "notifications", labelKey: "profileTab_notifications", icon: Bell },
  { key: "redeem-code", labelKey: "profileTab_redeemCode", icon: Gift },
];

export default function ProfileNav({ activeTab, setActiveTab }) {
  const { lang } = useLanguage();
  const navRef = useRef(null);
  const [showLeftGradient, setShowLeftGradient] = useState(false);
  const [showRightGradient, setShowRightGradient] = useState(true);

  // Auto-scroll active tab into view
  useEffect(() => {
    const activeButton = navRef.current?.querySelector('.profile-tab.active');
    if (activeButton) {
      activeButton.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  }, [activeTab]);

  // Handle scroll to show/hide gradient indicators
  const handleScroll = (e) => {
    const { scrollLeft, scrollWidth, clientWidth } = e.target;
    setShowLeftGradient(scrollLeft > 10);
    setShowRightGradient(scrollLeft < scrollWidth - clientWidth - 10);
  };

  return (
    <div className="profile-nav-container">
      {showLeftGradient && <div className="nav-gradient nav-gradient-left"></div>}
      <div 
        className="profile-nav" 
        ref={navRef}
        onScroll={handleScroll}
      >
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.key}
              className={`ThemeBox profile-tab ${activeTab === tab.key ? "active" : ""}`}
              onClick={() => setActiveTab(tab.key)}
            >
              <span className="tab-icon-wrapper">
                <IconComponent size={20} strokeWidth={2.5} className="tab-icon" />
              </span>
              <span className="tab-label">{translate(tab.labelKey, lang)}</span>
              {activeTab === tab.key && <span className="tab-glow"></span>}
            </button>
          );
        })}
      </div>
      {showRightGradient && <div className="nav-gradient nav-gradient-right"></div>}
    </div>
  );
}