import { useRef, useState, useEffect } from "react";
import { loadRecent } from "../../utils/localStorage";
import "./CategoriesSection.css";

const sidebarItems = [
  { id: "featuredSection", icon: "⭐", label: "Featured" },
  { id: "recentSection", icon: "⏱️", label: "Recent" },
  { id: "popularSection", icon: "💥", label: "Popular" },
  { id: "hotSection", icon: "🔥", label: "Hot" },
  // { id: "top100", icon: "⭐", label: "Top 100" },
  { id: "driving", icon: "🏎️", label: "Driving" },
  { id: "trending", icon: "🔥", label: "Trending" },
  { id: "christmas", icon: "🎅🏻", label: "Christmas" },
  { id: "action", icon: "🥊", label: "Action" },
  { id: "top-picks", icon: "🌶️", label: "Top Picks" },
  { id: "halloween_games", icon: "🎃", label: "Halloween" },
  { id: "card_games", icon: "🃏", label: "Card" },
  { id: "football_games", icon: "⚽", label: "Football" },
  { id: "basketball_games", icon: "🏀", label: "Basketball" },
  { id: "simulation_games", icon: "🎮", label: "Simulation" },
  { id: "skill_games", icon: "🎯", label: "Skill" },
  { id: "horror_games", icon: "💀", label: "Horror" },
  { id: "endless_runner", icon: "🏃", label: "Endless Runner" },
  { id: "platformer", icon: "🏃", label: "Platformer" },
  { id: "puzzles", icon: "🧩", label: "Puzzles" },
  { id: "gamesAll", icon: "🎮", label: "All Games" },
];

export default function CategoriesSection({
  title = "📂 Browse Categories",
  id = "categoriesSection",
}) {
  const containerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [recentGames, setRecentGames] = useState([]);

  useEffect(() => {
    setRecentGames(loadRecent());
  }, []);

  const checkScrollButtons = () => {
    const el = containerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  const scroll = (direction) => {
    containerRef.current?.scrollBy({
      left: direction === "left" ? -300 : 300,
      behavior: "smooth",
    });
    setTimeout(checkScrollButtons, 300);
  };

  const handleCategoryClick = (categoryId) => {
    document.getElementById(categoryId)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <section className="categories-section" id={id}>
      <div className="categories-content">
        <div className="categories-header">
          <h2 className="categories-title">{title}</h2>
        </div>

        <div className="categories-wrapper">
          {canScrollLeft && (
            <button
              className="categories-nav left"
              onClick={() => scroll("left")}
            >
              ‹
            </button>
          )}

          <div
            className="categories-container"
            ref={containerRef}
            onScroll={checkScrollButtons}
          >
            {sidebarItems.map((item) => (
              <div className="category-item" key={item.id}>
                <div
                  className="category-card"
                  onClick={() => handleCategoryClick(item.id)}
                >
                  <div className="category-icon">{item.icon}</div>
                  <div className="category-label">{item.label}</div>
                </div>
              </div>
            ))}
          </div>

          {canScrollRight && (
            <button
              className="categories-nav right"
              onClick={() => scroll("right")}
            >
              ›
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
