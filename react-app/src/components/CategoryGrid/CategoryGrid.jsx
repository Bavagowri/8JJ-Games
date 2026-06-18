// react-app/src/components/CategoryGrid/CategoryGrid.jsx


import CategoryCard from "../CategoryCard/CategoryCard";
import "./CategoryGrid.css";
import { useNavigate } from "react-router-dom";
import { translate } from "../../data/translations";
import { useLanguage } from "../../context/LanguageContext";

const categories = [
  { id: "adventure", label: "adventure", image: "/images/category-grid/adventure.jpg" },
  { id: "shooting", label: "shooting", image: "/images/category-grid/shooting.jpg" },
  { id: "driving", label: "driving", image: "/images/category-grid/driving.jpg" },
  { id: "christmas", label: "christmas", image: "/images/category-grid/christmas.jpg" },
  { id: "princess", label: "princess", image: "/images/category-grid/makeup.jpg" },
  { id: "puzzles", label: "puzzles", image: "/images/category-grid/puzzle.jpg" },
  { id: "card", label: "card", image: "/images/category-grid/card.jpg" },
  { id: "brain", label: "brain", image: "/images/category-grid/brain.jpg" },
  { id: "halloween", label: "halloween", image: "/images/category-grid/halloween.jpg" },
  { id: "zombie", label: "horror", image: "/images/category-grid/zombie.jpg" },
  { id: "kids", label: "kids", image: "/images/category-grid/kids.jpg" },
  { id: "basketball", label: "basketball", image: "/images/category-grid/basketball.jpg" },
  { id: "football", label: "football", image: "/images/category-grid/football.jpg" },
  { id: "boys", label: "boys", image: "/images/category-grid/boys.jpg" },
  { id: "skill", label: "skill", image: "/images/category-grid/skill.jpg" },
  { id: "educational", label: "educational", image: "/images/category-grid/educational.jpg" },
  { id: "action", label: "action", image: "/images/category-grid/action.jpg" },

  { id: "matching", label: "matching", image: "/images/category-grid/matching.jpg" },
  { id: "arcade", label: "arcade", image: "/images/category-grid/arcade.jpg" },
  { id: "fun", label: "fun", image: "/images/category-grid/fun.jpg" },

  // { id: "all", label: "all-category", image: "/images/category-grid/all.png", isAll: true}
];

export default function CategoryGrid({ limit }) {
    const { lang } = useLanguage();
    const navigate = useNavigate();

    const visibleCategories = limit
    ? categories.slice(0, limit)
    : categories;

    const handleClick = (cat) => {
      if (cat.isAll) {
        navigate("/categories"); // 👈 ALL CATEGORY
      } else {
        navigate(`/categories/${cat.id}`); // 👈 specific category
      }
    };

  return (
    // <div className="category-grid">
    //   {categories.map(cat => (
    //     <CategoryCard
    //       key={cat.id}
    //       title={`${translate(cat.label, lang)}`}
    //       image={cat.image}
    //       categoryId={cat.id}
    //       // onClick={() => console.log(cat.id)}
    //       // onClick={() => navigate(`/category/${cat.id}`)}
    //       onClick={() => handleClick(cat)}
    //     />
    //   ))}
    // </div>

    <div className="category-grid">
      {visibleCategories.map(cat => (
        <CategoryCard
          key={cat.id}
          title={`${translate(cat.label, lang)}`}
          image={cat.image}
          categoryId={cat.id}
          onClick={() => navigate(`/categories/${cat.id}`)}
        />
      ))}
    </div>
  );
}
