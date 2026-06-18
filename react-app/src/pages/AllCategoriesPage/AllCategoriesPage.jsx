// react-app/src/pages/AllCategoriesPage/AllCategoriesPage.jsx

import { useLayoutEffect, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import CategoryGrid from "../../components/CategoryGrid/CategoryGrid";
import { translate } from "../../data/translations";
import { useLanguage } from "../../context/LanguageContext";
import "./AllCategoriesPage.css";

import BannerB from "../../components/Widgets/BannerB";
import { matchesAPI } from "../../api/matches.api";

import SEO from "../../components/SEO/SEO";
import { generateKeywords } from "../../config/seoKeywords";

export default function AllCategoriesPage() {
  const { lang } = useLanguage();
  const navigate = useNavigate();

  // ── Live match data for BannerB ───────────────────────────────────────────
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    matchesAPI.getMatches()
      .then((data) => setMatches(data.matches || []))
      .catch((err) => console.error("BannerB matches fetch error:", err));
  }, []);

  // Scroll to top on mount
  useLayoutEffect(() => {
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    });
  }, []);

  // JSON-LD schema
  useEffect(() => {
    const collectionPageSchema = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Browse All Game Categories - 8JJ Games",
      "description": "Explore all game categories on 8JJ Games. Browse action, puzzle, racing, sports, horror, adventure games and more. Find games by genre and discover your next favorite!",
      "url": "https://8jjgames.com/categories",
      "mainEntity": {
        "@type": "ItemList",
        "name": "Game Categories",
        "description": "Complete list of game categories available on 8JJ Games",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "item": { "@type": "Thing", "name": "Action Games",  "url": "https://8jjgames.com/categories/action",    "description": "Fast-paced action games including shooting, fighting, and combat games" } },
          { "@type": "ListItem", "position": 2, "item": { "@type": "Thing", "name": "Puzzle Games",  "url": "https://8jjgames.com/categories/puzzle",    "description": "Brain-teasing puzzle games to challenge your mind" } },
          { "@type": "ListItem", "position": 3, "item": { "@type": "Thing", "name": "Racing Games",  "url": "https://8jjgames.com/categories/racing",    "description": "High-speed racing and driving games" } },
          { "@type": "ListItem", "position": 4, "item": { "@type": "Thing", "name": "Sports Games",  "url": "https://8jjgames.com/categories/sports",    "description": "Football, basketball, baseball and other sports games" } },
          { "@type": "ListItem", "position": 5, "item": { "@type": "Thing", "name": "Arcade Games",  "url": "https://8jjgames.com/categories/arcade",    "description": "Classic arcade-style games for instant fun" } },
        ],
      },
    };

    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home",       "item": "https://8jjgames.com" },
        { "@type": "ListItem", "position": 2, "name": "Categories", "item": "https://8jjgames.com/categories" },
      ],
    };

    const websiteSchema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "8JJ Games",
      "url": "https://8jjgames.com",
      "potentialAction": {
        "@type": "SearchAction",
        "target": { "@type": "EntryPoint", "urlTemplate": "https://8jjgames.com/all-games?search={search_term_string}" },
        "query-input": "required name=search_term_string",
      },
    };

    const schemaScript = document.createElement("script");
    schemaScript.type = "application/ld+json";
    schemaScript.text = JSON.stringify([collectionPageSchema, breadcrumbSchema, websiteSchema]);
    schemaScript.id = "categories-schema";
    document.head.appendChild(schemaScript);

    return () => {
      const existing = document.getElementById("categories-schema");
      if (existing) document.head.removeChild(existing);
    };
  }, []);

  return (
    <>
      <SEO
        title="Browse All Game Categories - 8JJ Games"
        description="Explore all game categories on 8JJ Games. Find action, puzzle, racing, sports, horror, adventure, arcade games and more. Browse by genre and discover your next favorite game!"
        keywords="game categories, browse games, game genres, types of games, category list, game sections, all categories, game types, browse by category, action games, puzzle games, racing games, sports games, arcade games"
        url="/categories"
        type="website"
        image="/images/8JJ-GAMES1.jpg"
      />

      <main className="all-categories-page">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link to="/" className="breadcrumb-link">Home</Link>
          <span className="breadcrumb-separator" aria-hidden="true">/</span>
          <span className="breadcrumb-current">Categories</span>
        </nav>

        <header className="category-headerzz">
          <button
            onClick={() => navigate(-1)}
            className="premium-back-button"
            aria-label="Go back to previous page"
            type="button"
          >
            <span className="back-arrow">←</span>
          </button>

          <h1 className="page-title">
            <span aria-hidden="true">🗂</span>{" "}
            {translate("categories", lang) || "Game Categories"}
          </h1>

          <p className="page-subtitle">
            {translate("browseGamesByCategory", lang) ||
              "Browse our complete collection of game categories. From action-packed adventures to brain-teasing puzzles, find games that match your mood and interests."}
          </p>
        </header>

        <section className="categories-grid-section" aria-labelledby="categories-grid-heading">
          <h2 id="categories-grid-heading" className="sr-only">
            All Available Game Categories
          </h2>
          <CategoryGrid />
        </section>

        <section className="categories-info-section sr-only" aria-labelledby="categories-info-heading visually-hidden">
          <div className="categories-info-content">
            <h2 id="categories-info-heading" className="info-section-title">
              Discover Games by Category
            </h2>
            <p className="info-section-text">
              At 8JJ Games, we organize our extensive game library into easy-to-browse categories.
              Whether you're looking for fast-paced action, mind-bending puzzles, thrilling racing experiences,
              or family-friendly fun, you'll find the perfect category to explore.
            </p>
            <p className="info-section-text">
              Click on any category above to discover dozens of free games within that genre.
              All games are playable instantly in your browser — no downloads, no installations, no hassle.
            </p>
          </div>
        </section>

        {/* ── BannerB — live DB data, same as Home.jsx ── */}
        {matches.length > 0 && (
          <BannerB matches={matches} autoPlayMs={6000} />
        )}

        <section className="popular-categories-section" aria-labelledby="popular-categories-heading">
          <h2 id="popular-categories-heading" className="section-title visually-hidden">
            Most Popular Categories
          </h2>
          <nav className="popular-categories-nav" aria-label="Popular game categories">
            <Link to="/categories/action"    className="category-quick-link">Action Games</Link>
            <Link to="/categories/puzzle"    className="category-quick-link">Puzzle Games</Link>
            <Link to="/categories/racing"    className="category-quick-link">Racing Games</Link>
            <Link to="/categories/sports"    className="category-quick-link">Sports Games</Link>
            <Link to="/categories/arcade"    className="category-quick-link">Arcade Games</Link>
            <Link to="/categories/adventure" className="category-quick-link">Adventure Games</Link>
          </nav>
        </section>
      </main>
    </>
  );
}