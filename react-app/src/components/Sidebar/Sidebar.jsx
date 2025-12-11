import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { translate } from "../../data/translations";
import "./Sidebar.css";

const sidebarItems = [
  { id: "top", icon: "🏠", label: "home" },
  { id: "recentSection", icon: "⏱️", label: "recent" },
  { id: "popularSection", icon: "💥", label: "popular" },
  { id: "hotSection", icon: "🔥", label: "hot" },
  { id: "top100", icon: "⭐", label: "top100" },
  { id: "faqSection", icon: "❓", label: "faq" },
  { id: "gamesAll", icon: "🎮", label: "allGames" },
  { id: "number_games", icon: "🏏", label: "cricket" },
  { id: "football_games", icon: "⚽", label: "football" },
  { id: "basketball_games", icon: "🏀", label: "basketball" },
  { id: "baseball_games", icon: "⚾", label: "baseball" },
  { id: "shooting_games", icon: "🔫", label: "shooting" },
  { id: "halloween_games", icon: "🎃", label: "halloween" },
  { id: "horror_games", icon: "💀", label: "horror" },
];

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handler = () => setOpen(true);
    document.addEventListener("openDrawer", handler);
    return () => document.removeEventListener("openDrawer", handler);
  }, []);

  const scrollTo = (id) => {
    setOpen(false);

    // If user is NOT on home page → redirect first
    if (location.pathname !== "/") {
      navigate("/", { state: { scrollTo: id } });
      return;
    }

    // Home → scroll immediately
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

      <aside className={`sidebar ${open ? "open" : ""}`}>
        <ul className="sidebar-list">
          {sidebarItems.map((item) => (
            <li
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="sidebar-item"
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
