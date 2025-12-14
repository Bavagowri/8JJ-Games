import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { translate } from "../../data/translations";
import "./Sidebar.css";

const sidebarItems = [
  { id: "top", icon: "🏠", label: "home" },
  { id: "christmas", icon: "🎅🏻", label: "christmas" },
  { id: "endless_runner", icon:"🏃‍♂️", label:"endlessRunner"},
  { id: "card_games", icon: "🃏", label: "card" },
  { id: "football_games", icon: "⚽", label: "football" },
  { id: "basketball_games", icon: "🏀", label: "basketball" },
  { id: "platformer", icon:"🧗‍♂️", label: "platformer"},
  { id: "halloween_games", icon: "🎃", label: "halloween" },
  { id: "horror_games", icon: "💀", label: "horror" },
  { id: "skill_games", icon:"🎯", label:"skill"},
  { id: "simulation_games", icon:"🎮", label:"simulation"},
  { id: "gamesAll", icon: "👾", label: "allGames" },
  { id: "faqSection", icon: "❓", label: "faq" }
];

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false); // New state for desktop hide
  const [activeItem, setActiveItem] = useState("top");
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handler = () => setOpen(true);
    document.addEventListener("openDrawer", handler);
    return () => document.removeEventListener("openDrawer", handler);
  }, []);

  // Add listener for toggle event from header
  useEffect(() => {
    const handler = () => setHidden(prev => !prev);
    document.addEventListener("toggleSidebar", handler);
    return () => document.removeEventListener("toggleSidebar", handler);
  }, []);

  const scrollTo = (id) => {
    setOpen(false);
    setActiveItem(id);

    if (location.pathname !== "/") {
      navigate("/", { state: { scrollTo: id } });
      return;
    }

    if (id === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      document.getElementById(id)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <>
      {open && (
        <div className="sidebar-overlay" onClick={() => setOpen(false)} />
      )}

      <aside className={`sidebar ${open ? "open" : ""} ${hidden ? "hidden" : ""}`}>
        <ul className="sidebar-list">
          {sidebarItems.map((item) => (
            <li
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={`sidebar-item ${activeItem === item.id ? "active" : ""}`}
            >
              <span className="icon">{item.icon}</span>
              <span className="label">{translate(item.label, lang)}</span>
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
}