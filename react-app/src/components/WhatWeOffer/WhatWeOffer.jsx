import { translate } from "../../data/translations";
import { useLanguage } from "../../context/LanguageContext";
import "./WhatWeOffer.css";

export default function WhatWeOffer() {
  const { lang } = useLanguage();

  const items = [
    {
      icon: "/images/whatweoffer/game-console.png",
      text: translate("hundredPlusGames", lang),
    },
    {
      icon: "/images/whatweoffer/no-download.png",
      text: translate("noInstallNeeded", lang),
    },
    {
      icon: "/images/whatweoffer/all-device.png",
      text: translate("onAnyDevice", lang),
    },
    {
      icon: "/images/whatweoffer/free.png",
      text: translate("allForFree", lang),
    },
  ];

  return (
    <div className="offer-bar">
      {items.map((item, i) => (
        <div key={i} className="offer-item">
          <img
            src={item.icon}
            alt={item.text}
            className="offer-icon"
            draggable="false"
          />
          <span className="offer-text">{item.text}</span>
        </div>
      ))}
    </div>
  );
}