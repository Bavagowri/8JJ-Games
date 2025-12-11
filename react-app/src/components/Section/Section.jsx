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
  const [activeItem, setActiveItem] = useState("top");
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
    setActiveItem(id);

    // If user is NOT on home page → redirect first
    if (location.pathname !== "/") {
      navigate("/", { state: { scrollTo: id } });
      return;
    }

    // Home → scroll immediately
    if (id === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setActiveId("top");
      return;
    }
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    setActiveId(id);
  };

  useEffect(() => {
    const ids = sidebarItems.map((s) => s.id).filter((i) => i !== "top");
    const targets = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { root: null, rootMargin: "-90px 0px -60% 0px", threshold: [0.25, 0.5, 0.75] }
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {open && <div className="sidebar-overlay" onClick={() => setOpen(false)} />}
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <ul className="sidebar-list">
          {sidebarItems.map((item) => (
            <li
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={`sidebar-item ${activeItem === item.id ? "active" : ""}`}
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