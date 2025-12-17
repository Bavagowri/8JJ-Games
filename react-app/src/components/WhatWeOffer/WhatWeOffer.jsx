import "./WhatWeOffer.css";

export default function WhatWeOffer() {
  const items = [
    {
      icon: "/images/whatweoffer/game-console.png",
      text: "100+ games",
    },
    {
      icon: "/images/whatweoffer/no-download.png",
      text: "No install needed",
    },
    {
      icon: "/images/whatweoffer/all-device.png",
      text: "On any device",
    },
    {
      icon: "/images/whatweoffer/free.png",
      text: "All for free",
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
