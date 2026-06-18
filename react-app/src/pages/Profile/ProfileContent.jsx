// react-app/src/pages/Profile/ProfileContent.jsx



import { useState, useEffect } from "react";
import Overview from "./sections/Overview";
import Settings from "./sections/Settings";
import Activity from "./sections/Activity";
import Friends from "./sections/Friends";
import Stats from "./sections/Stats";
import Security from "./sections/Security";
import Notifications from "./sections/Notifications";
import RedeemCode from "./sections/RedeemCode";  // Add import

export default function ProfileContent({ activeTab }) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentTab, setCurrentTab] = useState(activeTab);

  useEffect(() => {
    if (activeTab !== currentTab) {
      setIsTransitioning(true);
      
      // Delay to allow fade out
      const timeout = setTimeout(() => {
        setCurrentTab(activeTab);
        setIsTransitioning(false);
      }, 150);

      return () => clearTimeout(timeout);
    }
  }, [activeTab, currentTab]);

  const renderContent = () => {
    switch (currentTab) {
      case "settings":
        return <Settings />;
      case "activity":
        return <Activity />;
      case "friends":
        return <Friends />;
      case "stats":
        return <Stats />;
      case "security":
        return <Security />;
      case "notifications":
        return <Notifications />;
      case "redeem-code":         // In renderContent() switch statement, add:
        return <RedeemCode />;
      default:
        return <Overview />;
    }
  };

  return (
    <div 
      className="profile-content"
      style={{
        opacity: isTransitioning ? 0 : 1,
        transform: isTransitioning ? 'translateY(20px)' : 'translateY(0)',
        transition: 'opacity 0.3s ease, transform 0.3s ease'
      }}
    >
      {renderContent()}
    </div>
  );
}