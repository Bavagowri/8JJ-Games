import CategoryCard from "../CategoryCard/CategoryCard";
import "./CategoryGrid.css";
import { useNavigate } from "react-router-dom";
import { translate } from "../../data/translations";
import { useLanguage } from "../../context/LanguageContext";

const categories = [
  { id: "adventure", label: "adventure", image: "/images/category-grid/adventure.png" },
  { id: "shooting", label: "shooting", image: "/images/category-grid/shooting.png" },
  { id: "driving", label: "driving", image: "/images/category-grid/driving.png" },
  { id: "christmas", label: "christmas", image: "/images/category-grid/christmas.png" },
  { id: "princess", label: "princess", image: "/images/category-grid/makeup.png" },
  { id: "puzzles", label: "puzzles", image: "/images/category-grid/puzzle.png" },
  { id: "card", label: "card", image: "/images/category-grid/card.png" },
  { id: "brain", label: "brain", image: "/images/category-grid/brain.png" },
  { id: "halloween", label: "halloween", image: "/images/category-grid/halloween.png" },
  { id: "zombie", label: "horror", image: "/images/category-grid/zombie.png" },
  { id: "kids", label: "kids", image: "/images/category-grid/kids.png" },
  { id: "basketball", label: "basketball", image: "/images/category-grid/basketball.png" },
  { id: "football", label: "football", image: "/images/category-grid/football.png" },
  { id: "boys", label: "boys", image: "/images/category-grid/boys.png" },
  { id: "skill", label: "skill", image: "/images/category-grid/skill.png" },
  { id: "educational", label: "educational", image: "/images/category-grid/educational.png" },
  { id: "action", label: "action", image: "/images/category-grid/action.png" },

  { id: "matching", label: "matching", image: "/images/category-grid/matching.png" },
  { id: "arcade", label: "arcade", image: "/images/category-grid/arcade.png" },
  { id: "fun", label: "fun", image: "/images/category-grid/fun.png" },

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
