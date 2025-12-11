import { useEffect, useState } from "react";
import "./Sidebar.css";

const sidebarItems = [
  { id: "top", icon: "🏠", label: "Home" },
  { id: "recentSection", icon: "⏱️", label: "Recent" },
  { id: "popularSection", icon: "💥", label: "Popular" },
  { id: "hotSection", icon: "🔥", label: "Hot" },
  { id: "top100", icon: "⭐", label: "Top 100" },
  { id: "faqSection", icon: "❓", label: "FAQ" },
  { id: "gamesAll", icon: "🎮", label: "All Games" },
  { id: "number_games", icon: "🏏", label: "Cricket" },
  { id: "football_games", icon: "⚽", label: "Football" },
  { id: "basketball_games", icon: "🏀", label: "Basketball" },
  { id: "baseball_games", icon: "⚾", label: "Baseball" },
  { id: "shooting_games", icon: "🔫", label: "Shooting" },
  { id: "halloween_games", icon: "🎃", label: "Halloween" },
  { id: "horror_games", icon: "💀", label: "Horror" },
];

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  // Listen for hamburger click event
  useEffect(() => {
    const handler = () => setOpen(true);
    document.addEventListener("openDrawer", handler);

    return () => document.removeEventListener("openDrawer", handler);
  }, []);

  const scrollTo = (id) => {
    setOpen(false); // close drawer after clicking
    if (id === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <>
      {open && <div className="sidebar-overlay" onClick={() => setOpen(false)} />}

      <aside className={`sidebar ${open ? "open" : ""}`}>
        <ul className="sidebar-list">
          {sidebarItems.map((item) => (
            <li
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="sidebar-item"
            >
              <span className="icon">{item.icon}</span>
              <span className="label">{item.label}</span>
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
}
