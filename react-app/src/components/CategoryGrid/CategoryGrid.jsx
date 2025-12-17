import CategoryCard from "../CategoryCard/CategoryCard";
import "./CategoryGrid.css";

import { translate } from "../../data/translations";
import { useLanguage } from "../../context/LanguageContext";

const categories = [
  { id: "adventure", label: "adventure", image: "/images/category-grid/adventure.png" },
  { id: "shooting", label: "shooting", image: "/images/category-grid/shooting.png" },
  { id: "driving", label: "driving", image: "/images/category-grid/driving.png" },
  { id: "christmas", label: "christmas", image: "/images/category-grid/christmas.png" },
  { id: "makeup", label: "girls", image: "/images/category-grid/makeup.png" },
  { id: "puzzle", label: "puzzles", image: "/images/category-grid/puzzle.png" },
  { id: "card", label: "card", image: "/images/category-grid/card.png" },
  { id: "brain", label: "brain", image: "/images/category-grid/brain.png" },
  { id: "haloween", label: "halloween", image: "/images/category-grid/halloween.png" },
  { id: "horror", label: "horror", image: "/images/category-grid/zombie.png" },
  { id: "kids", label: "kids", image: "/images/category-grid/kids.png" },
  { id: "basketball", label: "basketball", image: "/images/category-grid/basketball.png" },
  { id: "football", label: "football", image: "/images/category-grid/football.png" },
  { id: "boys", label: "boys", image: "/images/category-grid/boys.png" },
  { id: "skill", label: "skill", image: "/images/category-grid/skill.png" },
  { id: "educational", label: "educational", image: "/images/category-grid/educational.png" },
  { id: "action", label: "action", image: "/images/category-grid/action.png" },

  { id: "matching", label: "skill", image: "/images/category-grid/matching.png" },
  { id: "arcade", label: "arcade", image: "/images/category-grid/arcade.png" },
  { id: "fun", label: "fun", image: "/images/category-grid/fun.png" },

  { id: "all", label: "all", image: "/images/category-grid/all.png" }
];

  
  // { id: "action", icon: "🥊", label: "action", isRoute: false },
  // { id: "top-picks", icon: "🌶️", label: "topPicks", isRoute: false },
  // { id: "platformer", icon:"🏃", label: "platformer", isRoute: false },
  // { id: "halloween_games", icon: "🎃", label: "halloween", isRoute: false },
  // { id: "card_games", icon: "🃏", label: "card", isRoute: false },
  // { id: "football_games", icon: "⚽", label: "football", isRoute: false },
  // { id: "basketball_games", icon: "🏀", label: "basketball", isRoute: false },
  // { id: "simulation_games", icon: "🎮", label: "simulation", isRoute: false },
  // { id: "skill_games", icon: "🎯", label: "skill", isRoute: false },
  // { id: "horror_games", icon: "💀", label: "horror", isRoute: false },
  // { id: "endless_runner", icon: "🏃", label: "endlessRunner", isRoute: false },
  // { id: "puzzles", icon: "🧩", label: "puzzles", isRoute: false },
  // { id: "/all-games", icon: "👾", label: "allGames", isRoute: true },
  // { id: "faqSection", icon: "❓", label: "faq", isRoute: false }


export default function CategoryGrid() {
    const { lang } = useLanguage();

  return (
    <div className="category-grid">
      {categories.map(cat => (
        <CategoryCard
          key={cat.id}
          title={`${translate(cat.label, lang)} ${translate("games", lang)}`}
          image={cat.image}
          onClick={() => console.log(cat.id)}
        />
      ))}
    </div>
  );
}
