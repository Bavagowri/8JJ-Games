
// react-app/src/components/CategoryCard/CategoryCard.jsx

import "./CategoryCard.css";

export default function CategoryCard({ title, image, categoryId, onClick, gameCount }) {
  
  //  Keyboard support for accessibility
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  //  Format game count for display
  const formatCount = (count) => {
    if (!count) return '';
    return count >= 1000 ? `${(count / 1000).toFixed(1)}k` : count;
  };

  return (
    /*  Semantic article with proper ARIA attributes */
    <article
      className={`category-card overlay-${categoryId}`}
      onClick={onClick}
      onKeyPress={handleKeyPress}
      role="button"
      tabIndex={0}
      aria-label={`Browse ${title} games${gameCount ? ` - ${gameCount} games available` : ''}`}
      style={{ backgroundImage: `url(${image})` }}
      itemScope
      itemType="https://schema.org/CollectionPage"
    >
      {/*  Overlay with proper heading hierarchy */}
      <div className="category-overlay">
        <h3 className="categorya-card-title" itemProp="name">
          {title.toUpperCase()}
        </h3>
        
        {/*  Display game count if available */}
        {gameCount && (
          <span className="category-game-count" itemProp="numberOfItems">
            {formatCount(gameCount)} Games
          </span>
        )}
      </div>

      {/*  Hidden metadata for SEO */}
      <meta itemProp="url" content={`https://8jjgames.com/categories/${categoryId}`} />
      <meta itemProp="genre" content={title} />
    </article>
  );
}