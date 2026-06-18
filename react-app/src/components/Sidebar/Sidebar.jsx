// react-app/src/components/Sidebar/Sidebar.jsx
import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { translate } from "../../data/translations";
import "./Sidebar.css";

// Breakpoint below which sidebar is hidden by default and requires burger to open
const SIDEBAR_BREAKPOINT = 1280; // px — adjust this to match your "maximized" threshold

const R2_BASE =
  import.meta.env.VITE_ASSETS_BASE_URL ||
  "https://assets.8jjgames.com";

const SIDEBAR_ICONS = {
  home: `${R2_BASE}/8jj_icons/sidebar-icons-2/home.webp`,
  featured: `${R2_BASE}/8jj_icons/sidebar-icons-2/star.webp`,
  hot: `${R2_BASE}/8jj_icons/sidebar-icons-2/fire.webp`,
  christmas: `${R2_BASE}/8jj_icons/sidebar-icons-2/christmas.webp`,
  girls: `${R2_BASE}/8jj_icons/sidebar-icons-2/makeup.webp`,
  driving: `${R2_BASE}/8jj_icons/sidebar-icons-2/driving.webp`,
  popular: `${R2_BASE}/8jj_icons/sidebar-icons-2/rocket.webp`,
  action: `${R2_BASE}/8jj_icons/sidebar-icons-2/action.webp`,
  topPicks: `${R2_BASE}/8jj_icons/sidebar-icons-2/chili.webp`,
  platformer: `${R2_BASE}/8jj_icons/sidebar-icons-2/platformer.webp`,
  halloween: `${R2_BASE}/8jj_icons/sidebar-icons-2/halloween.webp`,
  card: `${R2_BASE}/8jj_icons/sidebar-icons-2/card.webp`,
  football: `${R2_BASE}/8jj_icons/sidebar-icons-2/football.webp`,
  basketball: `${R2_BASE}/8jj_icons/sidebar-icons-2/basketball.webp`,
  categories: `${R2_BASE}/8jj_icons/sidebar-icons-2/categories.webp`,
  simulation: `${R2_BASE}/8jj_icons/sidebar-icons-2/simulation.webp`,
  skill: `${R2_BASE}/8jj_icons/sidebar-icons-2/target.webp`,
  horror: `${R2_BASE}/8jj_icons/sidebar-icons-2/horror.webp`,
  endless: `${R2_BASE}/8jj_icons/sidebar-icons-2/runner.webp`,
  puzzles: `${R2_BASE}/8jj_icons/sidebar-icons-2/puzzle.webp`,
  allGames: `${R2_BASE}/8jj_icons/sidebar-icons-2/all.webp`,
  faq: `${R2_BASE}/8jj_icons/sidebar-icons-2/help.webp`,
};

const sidebarItems = [
  { id: "top", icon: "home", label: "home", isRoute: false },

  // Sections
  { id: "featuredSection", icon: "featured", label: "featuredGames", isRoute: false },
  { id: "hotGames", icon: "hot", label: "hotGames", isRoute: false },
  { id: "christmas", icon: "christmas", label: "christmas", isRoute: false },
  { id: "makeup", icon: "girls", label: "girls", isRoute: false },
  { id: "driving", icon: "driving", label: "drivingGames", isRoute: false },
  { id: "popularSection", icon: "popular", label: "popularGames", isRoute: false },
  { id: "action", icon: "action", label: "actionGames", isRoute: false },
  { id: "top-picks", icon: "topPicks", label: "topPicks", isRoute: false },
  { id: "platformer", icon: "platformer", label: "platformerGames", isRoute: false },
  { id: "halloween_games", icon: "halloween", label: "halloween", isRoute: false },
  { id: "card_games", icon: "card", label: "cardGames", isRoute: false },

  // Sports
  { id: "football_games", icon: "football", label: "football", isRoute: false },
  { id: "basketball_games", icon: "basketball", label: "basketball", isRoute: false },

  // Categories
  { id: "categories", icon: "categories", label: "categories", isRoute: false },
  { id: "simulation_games", icon: "simulation", label: "simulationGames", isRoute: false },
  { id: "skill_games", icon: "skill", label: "skill", isRoute: false },
  { id: "horror_games", icon: "horror", label: "horror", isRoute: false },
  { id: "endless_runner", icon: "endless", label: "endlessRunnerGames", isRoute: false },
  { id: "puzzles", icon: "puzzles", label: "puzzlesGames", isRoute: false },

  // Routes / misc
  { id: "/all-8jj-games", icon: "allGames", label: "allGames", isRoute: true },
  { id: "faqSection", icon: "faq", label: "faq", isRoute: false },
];

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [activeItem, setActiveItem] = useState("top");
  // Tracks whether current viewport is "small" (below breakpoint)
  // const [isSmallScreen, setIsSmallScreen] = useState(
  //   () => window.innerWidth < SIDEBAR_BREAKPOINT
  // );
  // const [isSmallScreen, setIsSmallScreen] = useState(
  //   () => typeof window !== 'undefined' ? window.innerWidth < SIDEBAR_BREAKPOINT : false
  // );
  const sidebarRef = useRef(null);
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  // ADD mounted state after existing useState declarations
  const [mounted, setMounted] = useState(false);

  // CHANGE isSmallScreen initializer — always false on server
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  // ADD useEffect for mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  // ─── Sync body class so app-root padding shifts with sidebar ────────────────
  useEffect(() => {
    const sidebarVisible = !hidden && !isSmallScreen;
    document.body.classList.toggle("sidebar-visible", sidebarVisible);
    return () => document.body.classList.remove("sidebar-visible");
  }, [hidden, isSmallScreen]);

  // ─── Responsive: auto-hide sidebar when window is resized below breakpoint ───
  useEffect(() => {
    const handleResize = () => {
      const small = window.innerWidth < SIDEBAR_BREAKPOINT;
      setIsSmallScreen(small);

      // On admin routes keep sidebar always hidden — handled separately below
      if (location.pathname.startsWith("/admin")) return;

      if (small) {
        // Below breakpoint → always hide (user must use burger)
        setHidden(true);
        setOpen(false); // also close drawer if open
      } else {
        // Above breakpoint → always show (ignore manual-hide preference)
        setHidden(false);
      }
    };

    // Run once on mount to set initial state correctly
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [location.pathname]);

  // ─── Auto-hide sidebar on admin routes ───────────────────────────────────────
  useEffect(() => {
    const isAdminRoute = location.pathname.startsWith("/admin");

    if (isAdminRoute && !hidden) {
      setHidden(true);
    } else if (!isAdminRoute) {
      // Restore based on current screen size (not localStorage)
      setHidden(window.innerWidth < SIDEBAR_BREAKPOINT);
    }
  }, [location.pathname]);

  // ─── External toggle events (hamburger button) ───────────────────────────────
  useEffect(() => {
    const handler = () => setOpen((prev) => !prev);
    document.addEventListener("toggleDrawer", handler);
    return () => document.removeEventListener("toggleDrawer", handler);
  }, []);

  useEffect(() => {
    const handler = () => {
      // On small screens the burger toggles the drawer (open/close)
      if (isSmallScreen) {
        setOpen((prev) => !prev);
      } else {
        // On large screens the burger hides/shows the sidebar
        setHidden((prev) => !prev);
      }
    };
    document.addEventListener("toggleSidebar", handler);
    return () => document.removeEventListener("toggleSidebar", handler);
  }, [isSmallScreen]);

  // ─── Sync active item with route ─────────────────────────────────────────────
  useEffect(() => {
    if (location.pathname === "/all-games") {
      setActiveItem("/all-games");
    } else if (location.pathname === "/") {
      if (activeItem !== "top" && !document.getElementById(activeItem)) {
        setActiveItem("top");
      }
    }
  }, [location.pathname]);

  const handleItemClick = (item) => {
    // On small screens close the drawer after selection
    if (isSmallScreen) {
      setOpen(false);
    }
    setActiveItem(item.id);

    if (item.isRoute) {
      navigate(item.id);
      return;
    }

    if (location.pathname !== "/") {
      navigate("/", { state: { scrollTo: item.id } });
      return;
    }

    if (item.id === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const el = document.getElementById(item.id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Don't render sidebar on admin routes
  if (location.pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <>
      {/* Overlay only shown on small screens when drawer is open */}
      {mounted && open && isSmallScreen && (
        <div className="sidebar-overlay" onClick={() => setOpen(false)} />
      )}

      <aside
        ref={sidebarRef}
        className={`sidebar ${open ? "open" : ""} ${hidden ? "hidden" : ""} ${
          mounted ? (isSmallScreen ? "small-screen" : "large-screen") : "large-screen"
        }`}
      >
        <ul className="sidebar-list">
          {sidebarItems.map((item) => (
            <li
              key={item.id}
              onClick={() => handleItemClick(item)}
              className={`sidebar-item ${activeItem === item.id ? "active" : ""}`}
            >
              <img
                src={SIDEBAR_ICONS[item.icon]}
                alt={translate(item.label, lang)}
                className="icon"
              />
              <span className="label">{translate(item.label, lang)}</span>
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
}