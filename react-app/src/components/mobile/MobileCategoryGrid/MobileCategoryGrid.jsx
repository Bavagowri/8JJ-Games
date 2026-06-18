// src/components/mobile/MobileCategoryGrid/MobileCategoryGrid.jsx
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../../context/LanguageContext";
import { translate } from "../../../data/translations";
import { 
  Grid3x3, 
  ChevronRight, 
  Sparkles 
} from "lucide-react";
import "./MobileCategoryGrid.css";

const categories = [
  {
    id: 1,
    name: "Basketball",
    slug: "basketball",
    icon: "/images/home-icons-2/basketball.png",
    // gradient: "linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)",
    // color: "#FF6B35"
  },
  {
    id: 2,
    name: "Driving",
    slug: "driving",
    icon: "/images/home-icons-2/driving.png",
    // gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    // color: "#667eea"
  },
  {
    id: 3,
    name: "Skill",
    slug: "skill",
    icon: "/images/home-icons-2/target.png",
    // gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    // color: "#f093fb"
  },
  {
    id: 4,
    name: "Runner",
    slug: "runner",
    icon: "/images/home-icons-2/runner.png",
    // gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    // color: "#4facfe"
  },
  {
    id: 5,
    name: "Card",
    slug: "card",
    icon: "/images/home-icons-2/card.png",
    // gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    // color: "#43e97b"
  },
  {
    id: 6,
    name: "Simulation",
    slug: "simulation",
    icon: "/images/home-icons-2/simulation.png",
    // gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    // color: "#fa709a"
  },
  {
    id: 7,
    name: "Action",
    slug: "action",
    icon: "/images/home-icons-2/action.png",
    // gradient: "linear-gradient(135deg, #30cfd0 0%, #330867 100%)",
    // color: "#30cfd0"
  },
  {
    id: 8,
    name: "Puzzle",
    slug: "puzzles",
    icon: "/images/home-icons-2/puzzle.png",
    // gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
    // color: "#a8edea"
  },
];

export default function MobileCategoryGrid() {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const [hoveredId, setHoveredId] = useState(null);
  const scrollContainerRef = useRef(null);
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(true);

  // Check scroll position for indicators
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftScroll(scrollLeft > 10);
      setShowRightScroll(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      handleScroll(); // Initial check
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const scrollTo = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -280 : 280;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="mobile-category-section">
      {/* Header */}
      <div className="mobile-category-header">
        <div className="mobile-category-header-left">
          <div className="mobile-category-icon-wrapper">
            <Grid3x3 className="mobile-category-header-icon" />
            <Sparkles className="mobile-category-sparkle" />
          </div>
          <h2 className="mobile-category-title">
            {translate("categories", lang)}
          </h2>
        </div>

        <button
          className="mobile-category-view-all"
          onClick={() => navigate('/categories')}
          aria-label={translate("seeAll", lang)}
        >
          <span>{translate("seeAll", lang)}</span>
          {/* <ChevronRight className="mobile-category-arrow" /> */}
        </button>
      </div>

      {/* Grid Container with Scroll Indicators */}
      <div className="mobile-category-scroll-wrapper">
        {/* Left Scroll Indicator */}
        {showLeftScroll && (
          <button 
            className="mobile-category-scroll-btn mobile-category-scroll-left"
            onClick={() => scrollTo('left')}
            aria-label="Scroll left"
          >
            <ChevronRight />
          </button>
        )}

        {/* Category Grid */}
        <div 
          className="mobile-category-grid" 
          ref={scrollContainerRef}
        >
          {categories.map((cat, index) => (
            <button
              key={cat.id}
              className="mobile-category-card"
              onClick={() => navigate(`/categories/${cat.slug}`)}
              onMouseEnter={() => setHoveredId(cat.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                animationDelay: `${index * 0.05}s`
              }}
            >
              {/* Background Gradient */}
              <div 
                className="mobile-category-bg"
                style={{ background: cat.gradient }}
              />

              {/* Glow Effect */}
              <div 
                className={`mobile-category-glow ${hoveredId === cat.id ? 'active' : ''}`}
                style={{ background: cat.gradient }}
              />

              {/* Content */}
              <div className="mobile-category-content">
                <div className="mobile-category-icon-container">
                  <img
                    src={cat.icon}
                    alt=""
                    className="mobile-category-icon"
                  />
                  <div 
                    className="mobile-category-icon-ring"
                    style={{ borderColor: cat.color }}
                  />
                </div>

                <span className="mobile-category-label">{cat.name}</span>

                {/* Hover Arrow */}
                <div className="mobile-category-hover-arrow">
                  <ChevronRight />
                </div>
              </div>

              {/* Decorative Corner */}
              <div className="mobile-category-corner" />
            </button>
          ))}
        </div>

        {/* Right Scroll Indicator */}
        {showRightScroll && (
          <button 
            className="mobile-category-scroll-btn mobile-category-scroll-right"
            onClick={() => scrollTo('right')}
            aria-label="Scroll right"
          >
            <ChevronRight />
          </button>
        )}
      </div>

      {/* Scroll Progress Bar */}
      <div className="mobile-category-progress-container">
        <div className="mobile-category-progress-track">
          <div 
            className="mobile-category-progress-bar"
            style={{
              width: scrollContainerRef.current 
                ? `${(scrollContainerRef.current.scrollLeft / 
                    (scrollContainerRef.current.scrollWidth - scrollContainerRef.current.clientWidth)) * 100}%`
                : '0%'
            }}
          />
        </div>
      </div>
    </section>
  );
}