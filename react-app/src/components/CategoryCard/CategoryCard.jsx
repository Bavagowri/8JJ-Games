import "./CategoryCard.css";

export default function CategoryCard({ title, image, onClick }) {
  return (
    <button className="category-card" onClick={onClick}>
      <img src={image} alt={title} />
      <span>{allowBreak(title)}</span>
    </button>
  );
}

function allowBreak(text) {
  return text.toUpperCase();
}
