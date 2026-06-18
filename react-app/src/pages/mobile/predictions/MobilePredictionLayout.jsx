// react-app/src/pages/mobile/predictions/MobilePredictionLayout.jsx
import { Outlet, useLocation } from "react-router-dom";
import MobileHeader    from "../../../components/mobile/MobileHeader/MobileHeader";
import MobileBottomNav from "../../../components/mobile/MobileBottomNav/MobileBottomNav";

// ── SEO ──────────────────────────────────────────────────────────────────────
import SEO from "../../../components/SEO/SEO";
import { generateKeywords } from "../../../config/seoKeywords";

const ROUTE_META = {
  "/predictions": {
    title: "Prediction Arena - Cricket Match Predictions | 8JJ Games",
    description:
      "Predict cricket match winners, earn points and climb the leaderboard on 8JJ Games. Free entry cricket predictions with real rewards.",
  },
  "/my-predictions": {
    title: "My Predictions | 8JJ Games",
    description:
      "View and manage your cricket match prediction history on 8JJ Games.",
  },
  "/predictions/leaderboard": {
    title: "Cricket Prediction Leaderboard | 8JJ Games",
    description:
      "See the top cricket prediction players on 8JJ Games. Win up to 500 bonus points every Monday.",
  },
};

const DEFAULT_META = {
  title: "Prediction Arena | 8JJ Games",
  description:
    "Predict cricket match outcomes, earn points and compete on the 8JJ Games leaderboard.",
};

export default function MobilePredictionLayout() {
  const { pathname } = useLocation();

  // Exact match first, then prefix match for dynamic routes like /predictions/:id
  const meta =
    ROUTE_META[pathname] ||
    (pathname.startsWith("/predictions/") ? {
      title: "Match Prediction | 8JJ Games",
      description:
        "Predict the winner of this cricket match on 8JJ Games and earn points.",
    } : DEFAULT_META);

  return (
    <>
      {/* Layout-level fallback SEO — child pages override with their own <SEO /> */}
      <SEO
        title={meta.title}
        description={meta.description}
        keywords={generateKeywords("pages", "predictions")}
        url={pathname}
        type="website"
      />

      <MobileHeader />
      <Outlet />
      <MobileBottomNav />
    </>
  );
}