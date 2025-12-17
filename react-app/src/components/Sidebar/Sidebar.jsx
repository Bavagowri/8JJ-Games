import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { translate } from "../../data/translations";
import "./Sidebar.css";

const sidebarItems = [
  { id: "top", icon: "🏠", label: "home", isRoute: false },
  { id: "featuredSection", icon: "⭐", label: "featuredGames", isRoute: false },
  { id: "driving", icon: "🏎️", label: "driving", isRoute: false },
  { id: "trending", icon: "🔥", label: "trendingGames", isRoute: false },
  { id: "christmas", icon: "🎅🏻", label: "christmas", isRoute: false },
  { id: "action", icon: "🥊", label: "action", isRoute: false },
  { id: "top-picks", icon: "🌶️", label: "topPicks", isRoute: false },
  { id: "platformer", icon:"🏃", label: "platformer", isRoute: false },
  { id: "halloween_games", icon: "🎃", label: "halloween", isRoute: false },
  { id: "card_games", icon: "🃏", label: "card", isRoute: false },
  { id: "football_games", icon: "⚽", label: "football", isRoute: false },
  { id: "basketball_games", icon: "🏀", label: "basketball", isRoute: false },
  { id: "simulation_games", icon: "🎮", label: "simulation", isRoute: false },
  { id: "skill_games", icon: "🎯", label: "skill", isRoute: false },
  { id: "horror_games", icon: "💀", label: "horror", isRoute: false },
  { id: "endless_runner", icon: "🏃", label: "endlessRunner", isRoute: false },
  { id: "puzzles", icon: "🧩", label: "puzzles", isRoute: false },
  { id: "/all-games", icon: "👾", label: "allGames", isRoute: true },
  { id: "faqSection", icon: "❓", label: "faq", isRoute: false }
];

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [activeItem, setActiveItem] = useState("top");
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handler = () => setOpen(true);
    document.addEventListener("openDrawer", handler);
    return () => document.removeEventListener("openDrawer", handler);
  }, []);

  useEffect(() => {
    const handler = () => setHidden(prev => !prev);
    document.addEventListener("toggleSidebar", handler);
    return () => document.removeEventListener("toggleSidebar", handler);
  }, []);

  // Update active item based on current route
  useEffect(() => {
    if (location.pathname === "/all-games") {
      setActiveItem("/all-games");
    } else if (location.pathname === "/") {
      // Set to home or keep the active section
      if (activeItem !== "top" && !document.getElementById(activeItem)) {
        setActiveItem("top");
      }
    }
  }, [location.pathname]);

  const handleItemClick = (item) => {
    setOpen(false);
    setActiveItem(item.id);

    // If it's a route (like All Games), navigate to that route
    if (item.isRoute) {
      navigate(item.id);
      return;
    }

    // If it's a section and we're not on home page, navigate to home first
    if (location.pathname !== "/") {
      navigate("/", { state: { scrollTo: item.id } });
      return;
    }

    // Scroll to section on home page
    if (item.id === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      document.getElementById(item.id)?.scrollIntoView({
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
              onClick={() => handleItemClick(item)}
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