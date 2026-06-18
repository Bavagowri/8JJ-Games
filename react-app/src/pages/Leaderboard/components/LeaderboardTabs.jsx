// react-app/src/pages/Leaderboard/components/LeaderboardTabs.jsx

import React from 'react';
import { Globe, Users, Flag } from 'lucide-react';
import { useProfile } from "../../../context/ProfileContext";
import { getCountryName } from "../../../utils/country";
import { useLanguage } from "../../../context/LanguageContext";
import { translate } from "../../../data/translations";
import '../styles/leaderboard-tabs.css';

const LeaderboardTabs = ({ activeTab, onTabChange }) => {
  const { profile } = useProfile();
  const { lang } = useLanguage();
  const countryCode = profile?.country;
  const countryLabel = countryCode
    ? getCountryName(countryCode)
    : "Country";

  const tabs = [
    { id: "global", label: `${translate("leaderboard_scope_global", lang)}`, icon: Globe },
    {
      id: "country",
      label: countryLabel,
      icon: Flag,
      disabled: !countryCode
    }
  ];

  // const tabs = [
  //   { id: 'global', label: 'Global', icon: Globe },
  //   // { id: 'friends', label: 'Friends', icon: Users },
  //   { id: 'country', label: 'India', icon: Flag }
  // ];

  return (
    <div className="leaderboard-tabs">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
            disabled={tab.disabled}
            title={tab.disabled ? "Set your country to unlock" : ""}
          >
            <Icon size={18} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default LeaderboardTabs;