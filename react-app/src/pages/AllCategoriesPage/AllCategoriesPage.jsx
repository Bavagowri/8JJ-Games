import CategoryGrid from "../../components/CategoryGrid/CategoryGrid";
import { translate } from "../../data/translations";
import { useLanguage } from "../../context/LanguageContext";
import "./AllCategoriesPage.css";
import { useLayoutEffect } from "react";


export default function AllCategoriesPage() {
  const { lang } = useLanguage();

  // ✅ Scroll to top once when page mounts
  useLayoutEffect(() => {
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    });
  }, []);

  return (
    <div className="all-categories-page">
      <h1 className="page-title">
        🗂 {translate("categories", lang)}
      </h1>

      <p className="page-subtitle">
        {translate("allGames", lang)}
      </p>

      <CategoryGrid />
    </div>
  );
}
