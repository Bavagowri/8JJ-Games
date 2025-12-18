import "./CategoryCard.css";

export default function CategoryCard({ title, image, categoryId, onClick }) {
  return (
    <button
      className={`category-card overlay-${categoryId}`}
      onClick={onClick}
      style={{ backgroundImage: `url(${image})` }}
    >
      <div className="category-overlay">
        <span className="categorya-card-title">{title.toUpperCase()}</span>
      </div>
    </button>
  );
}
