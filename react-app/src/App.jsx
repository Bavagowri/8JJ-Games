// react-app/src/App.jsx
import NotFound from "./pages/NotFound/NotFound";

import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { BrowserRouter, StaticRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider, useLanguage } from "./context/LanguageContext";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";

//  Mobile detection hook
import useIsMobile from "./hooks/useIsMobile";
import Header from "./components/Header/Header";
import Sidebar from "./components/Sidebar/Sidebar";

import Home from "./pages/Home/Home";
import AllGames from "./pages/AllGames/AllGames";
import Footer from "./components/Footer/Footer";
import GamePageV2 from "./pages/GamePageV2/GamePageV2";
import MyCollection from "./pages/MyCollection/MyCollection";

import MosaicGamePage from "./pages/MosaicGamePage/MosaicGamePage";
import CategoryGamesPage from "./pages/CategoryGamesPage/CategoryGamesPage";
import AllCategoriesPage from "./pages/AllCategoriesPage/AllCategoriesPage";
import SearchOverlay from "./components/SearchOverlay/SearchOverlay";
import { fetchH5Games } from "./api/fetchH5Games";
import { selfHostedGames } from "./data/selfHostedGames";
import BrandedPreloader from "./components/BrandedPreloader/BrandedPreloader";

// ── Desktop Auth ────────────────────────────────────────────────────
import AuthPage from './pages/Auth/AuthPage/AuthPage';
import ResetPassword from './pages/Auth/AuthPage/ResetPassword';
import EmailVerified from './pages/Auth/AuthPage/EmailVerified';

// ── Predictions (User) ─────────────────────────────────────────────
import PredictionsHome from "./pages/Predictions/PredictionsHome";
import PredictionDetails from "./pages/Predictions/PredictionDetails";
import MyPredictions from "./pages/Predictions/MyPredictions";
import PredictionLeaderboard from "./pages/Predictions/PredictionLeaderboard";

// ── Mobile Predictions ─────────────────────────────────────────────
import MobilePredictionLayout from "./pages/mobile/predictions/MobilePredictionLayout";
import MobilePredictionArena from "./pages/mobile/predictions/MobilePredictionArena/PredictionArena";
import MobileMyPredictions from "./pages/mobile/predictions/MobileMyPrediction/MobileMyPrediction";
import MobilePredictionLeaderboard from "./pages/mobile/predictions/MobilePredictionleaderboard/MobileLeaderboard";
import MobilePredictionDetails from "./pages/mobile/predictions/MobilePredictionDetails/PredictionDetails";

// ── Predictions (Admin) ────────────────────────────────────────────
import PredictionManagement from "./pages/admin/PredictionManagement/PredictionManagement";
import PredictionCreate from "./pages/admin/PredictionManagement/PredictionCreate";
import PredictionSubmissions from "./pages/admin/PredictionManagement/PredictionSubmissions";
import AdminMatchSync from "./pages/admin/AdminMatchSync/AdminMatchSync";

// ── General pages ───────────────────────────────────────────────────
import About from './pages/About/About';
import Contact from './pages/Contact/Contact';
import ProfilePage from "./pages/Profile/ProfilePage";
import LeaderboardPage from "./pages/Leaderboard/LeaderboardPage";

// ── Mobile pages ────────────────────────────────────────────────────
import MobileHome from "./pages/mobile/MobileHome/MobileHome";
import MobileAllGames from "./pages/mobile/MobileAllGames/MobileAllGames";
import MobileGamePage from "./pages/mobile/MobileGamePage/MobileGamePage";
import MobileCategoryGamesPage from "./pages/mobile/MobileCategoryGamesPage/MobileCategoryGamesPage";
import MobileProfile from "./pages/mobile/MobileProfile/MobileProfile";
import MobileMyCollection from "./pages/mobile/MobileMyCollection/MobileMyCollection";
import MobileAuth from "./pages/mobile/MobileAuth/MobileAuth";
import MobileLeaderboard from "./pages/mobile/MobileLeaderboard/MobileLeaderboard";
import MobileGamePageV2 from "./pages/mobile/MobileGamePageV2/MobileGamePageV2";
import MobileAllCategories from "./pages/mobile/MobileAllCategories/MobileAllCategories";
import MobileAbout from "./pages/mobile/MobileAbout/MobileAbout";
import MobileContact from "./pages/mobile/MobileContact/MobileContact";
import MobileFAQPage from "./pages/mobile/MobileFAQPage/MobileFAQPage";
import MobilePrivacyPolicy from "./pages/mobile/MobilePrivacyPolicy/MobilePrivacyPolicy";

// ── Support Pages ───────────────────────────────────────────────────
import PrivacyPolicyPage from "./pages/PrivacyPolicy/PrivacyPolicy";
import DisclaimerPage from "./pages/Disclaimer/Disclaimer";
import TermsConditionsPage from "./pages/TermsConditions/TermsConditions";
import ResponsibleGamingPage from "./pages/ResponsibleGaming/ResponsibleGaming";
import TermsOfServicePage from "./pages/TermsOfService/TermsOfService";

// ── Admin ───────────────────────────────────────────────────────────
import AdminRoute from './components/AdminRoute';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement/UserManagement';
import NotificationManagement from './pages/admin/Notifications/NotificationManagement';
import PointsManagement from "./pages/admin/AdminPoints/AdminPoints";
import AdminUserPoints from "./pages/admin/AdminPoints/AdminUserPoints";
import SyncManagement from "./pages/admin/SyncManagement/SyncManagement";
import GameManagement from "./pages/admin/GameManager/GameManager";

// ── Banner Management ───────────────────────────────────────────────
import BannerManagement from "./pages/admin/BannerManagement/BannerManagement";
import BannerCreate from "./pages/admin/BannerManagement/BannerCreate";
import PlacementCreate from "./pages/admin/BannerManagement/PlacementCreate";
import TemplateEdit from "./pages/admin/BannerManagement/TemplateEdit";

import { Toaster } from "react-hot-toast";
import './Overlayer.css';
import ProtectedRoute from "./components/ProtectedRoute";
import Maintenance from "./pages/Maintenance/Maintenance";


import { GoogleOAuthProvider } from '@react-oauth/google'

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

const MAINTENANCE = import.meta.env.VITE_MAINTENANCE_MODE === "true";
const R2_BASE = import.meta.env.VITE_ASSETS_BASE_URL || "https://assets.8jjgames.com";

function GATracker() {
  const location = useLocation();
  useEffect(() => {
    if (window.gtag) {
      window.gtag("config", "G-CJKGMQP0L0", {
        page_path: location.pathname,
      });
    }
  }, [location]);
  return null;
}

function AppContent() {
  const [search, setSearch] = useState("");
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  // const isMobile = useIsMobile(768);

  // const hasVisited = sessionStorage.getItem('hasVisitedSite') === 'true';

  // const [showPreloader, setShowPreloader] = useState(
  //   !isMobile && !hasVisited
  // );

  // useEffect(() => {
  //   // if (typeof window !== "undefined") {
  //   //   const hasVisited = sessionStorage.getItem("hasVisitedSite") === "true";

  //   //   if (!isMobile && !hasVisited) {
  //   //     setShowPreloader(true);
  //   //   }
  //   // }
  // }, [isMobile]);
  const [mounted, setMounted] = useState(false);
  const [showPreloader, setShowPreloader] = useState(false);

  const isMobileRaw = useIsMobile(768);
  // During SSR and first hydration, always use false so server+client match
  const isMobile = mounted ? isMobileRaw : false;

  // Step 1: mark mounted immediately after hydration
  useEffect(() => {
    setMounted(true);
  }, []);


  // Step 2: show preloader only after mount, desktop only, first visit only
  useEffect(() => {
    if (!mounted) return;
    const hasVisited = sessionStorage.getItem("hasVisitedSite") === "true";
    if (!isMobileRaw && !hasVisited) {
      setShowPreloader(true);
    }
  }, [mounted]);


  const { lang } = useLanguage();
  const Router = typeof window === "undefined" ? StaticRouter : BrowserRouter;

  useEffect(() => {
    const load = async () => {
      const h5 = await fetchH5Games();
      const all = [...selfHostedGames, ...h5];
      setGames(all);
      // localStorage.setItem("games", JSON.stringify(all));
      if (typeof window !== "undefined") {
        localStorage.setItem("games", JSON.stringify(all));
      }
      setLoading(false);
      setShowPreloader(false);
      if (!sessionStorage.getItem("hasVisitedSite")) {
        sessionStorage.setItem("hasVisitedSite", "true");
      }
    };
    load();
  }, []);

  // useEffect(() => {
  //   if ("scrollRestoration" in window.history) {
  //     window.history.scrollRestoration = "manual";
  //   }
  // }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  if (showPreloader) {
    return <BrandedPreloader />;
  }
  // During SSR / before mount: render minimal shell to avoid mismatch
  // if (!mounted) {
  //   return <div className={`app-root lang-${lang}`} />;
  // }

    // Show nothing until mounted so isMobile is correct before rendering routes
  if (!mounted) {
    return <BrandedPreloader duration={500} />
  }

  return (
    <>
      <ScrollToTop />
      <GATracker />
      <Toaster position="top-right" />
      <div className={`app-root lang-${lang}`}>

        {/* Background */}
        <img src={`${R2_BASE}/8jj_background/8jj-games-bg.webp`} fetchpriority="low" alt="" aria-hidden="true" role="presentation" className="profile-background-image" />
        <div className="gradient-overlay Profile-Overlay HOMEOVERLAYS"></div>

        {/* Desktop-only chrome */}
        {!isMobile && (
          <>
            <Header onSearch={setSearch} />
            <Sidebar />
            <SearchOverlay />
          </>
        )}

        <Routes>

          {/* ─── Main pages ─────────────────────────────────────── */}
          <Route
            path="/"
            element={<Home search={search} isMobile={isMobile} />}
          />

          <Route
            path="/all-games"
            element={isMobile ? <MobileAllGames /> : <AllGames />}
          />

          <Route
            path="/games/:slug"
            element={isMobile ? <MobileGamePageV2 /> : <GamePageV2 />}
          />

          <Route
            path="/my-collection"
            element={isMobile ? <MobileMyCollection /> : <MyCollection />}
          />

          <Route path="/faq" element={<MobileFAQPage />} />

          <Route
            path="/all-8jj-games"
            element={isMobile ? <MobileAllGames /> : <MosaicGamePage />}
          />

          <Route
            path="/categories/:categoryId"
            element={isMobile ? <MobileCategoryGamesPage /> : <CategoryGamesPage />}
          />

          <Route
            path="/categories"
            element={isMobile ? <MobileAllCategories /> : <AllCategoriesPage />}
          />

          <Route
            path="/about"
            element={isMobile ? <MobileAbout /> : <About />}
          />

          <Route
            path="/contact"
            element={isMobile ? <MobileContact /> : <Contact />}
          />

          <Route
            path="/privacy-policy"
            element={isMobile ? <MobilePrivacyPolicy /> : <PrivacyPolicyPage />}
          />

          {/* ── Prediction routes ──────────────────────────────── */}
          {isMobile ? (
            <Route element={<MobilePredictionLayout />}>
              <Route path="/predictions"               element={<MobilePredictionArena />} />
              <Route path="/predictions/:id"           element={<MobilePredictionDetails />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/my-predictions"          element={<MobileMyPredictions />} />
                <Route path="/predictions/leaderboard" element={<MobilePredictionLeaderboard />} />
              </Route>
            </Route>
          ) : (
            <>
              <Route path="/predictions"               element={<PredictionsHome />} />
              <Route path="/predictions/:id"           element={<PredictionDetails />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/my-predictions"          element={<MyPredictions />} />
                <Route path="/predictions/leaderboard" element={<PredictionLeaderboard />} />
              </Route>
            </>
          )}

          {/* ── Auth routes ─────────────────────────────────────── */}
          <Route
            path="/login"
            element={isMobile ? <MobileAuth mode="login" /> : <AuthPage mode="login" />}
          />

          <Route
            path="/register"
            element={isMobile ? <MobileAuth mode="register" /> : <AuthPage mode="register" />}
          />

          <Route
            path="/forgot-password"
            element={isMobile ? <MobileAuth mode="forgot-password" /> : <AuthPage mode="forgot-password" />}
          />

          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/email-verified" element={<EmailVerified />} />

          {/* ── Protected routes ────────────────────────────────── */}
          <Route element={<ProtectedRoute />}>
            <Route
              path="/profile"
              element={isMobile ? <MobileProfile /> : <ProfilePage />}
            />
            <Route
              path="/leaderboard"
              element={isMobile ? <MobileLeaderboard /> : <LeaderboardPage />}
            />
          </Route>

          {/* ── Admin routes ────────────────────────────────────── */}
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><UserManagement /></AdminRoute>} />
          <Route path="/admin/notifications" element={<AdminRoute><NotificationManagement /></AdminRoute>} />
          <Route path="/admin/points" element={<AdminRoute><PointsManagement /></AdminRoute>} />
          <Route path="/admin/user-points" element={<AdminRoute><AdminUserPoints /></AdminRoute>} />
          <Route path="/admin/sync" element={<AdminRoute><SyncManagement /></AdminRoute>} />
          <Route path="/admin/game-manager" element={<AdminRoute><GameManagement /></AdminRoute>} />

          <Route path="/admin/predictions" element={<AdminRoute><PredictionManagement /></AdminRoute>} />
          <Route path="/admin/predictions/create" element={<AdminRoute><PredictionCreate /></AdminRoute>} />
          <Route path="/admin/predictions/edit/:id" element={<AdminRoute><PredictionCreate /></AdminRoute>} />
          <Route path="/admin/predictions/:id/submissions" element={<AdminRoute><PredictionSubmissions /></AdminRoute>} />
          <Route path="/admin/matches/sync" element={<AdminRoute><AdminMatchSync /></AdminRoute>} />
          

          {/* ── Banner Management ───────────────────────────────── */}
          <Route path="/admin/banners" element={<BannerManagement />} />
          <Route path="/admin/banners/create" element={<BannerCreate />} />
          <Route path="/admin/banners/edit/:id" element={<BannerCreate />} />
          <Route path="/admin/banners/placements/create" element={<PlacementCreate />} />
          <Route path="/admin/banners/placements/edit/:id" element={<PlacementCreate />} />
          <Route path="/admin/banners/templates/edit/:id" element={<TemplateEdit />} />

          {/* ── Support Pages ───────────────────────────────────── */}
          <Route path="/disclaimer" element={<DisclaimerPage />} />
          <Route path="/terms-and-conditions" element={<TermsConditionsPage />} />
          <Route path="/responsible-gaming" element={<ResponsibleGamingPage />} />
          <Route path="/terms-of-service" element={<TermsOfServicePage />} />

          {/* ── 404 — must be last ──────────────────────────────── */}
          <Route path="*" element={<NotFound />} />

        </Routes>

        {/* Desktop-only footer */}
        {!isMobile && <Footer />}

      </div>
    </>
  );
}

export default function App({ url }) {

  const Router =
    typeof window === "undefined"
      ? StaticRouter
      : BrowserRouter;

  if (MAINTENANCE) {
    return <Maintenance />;
  }

  return (
    <LanguageProvider>
      {typeof window !== 'undefined' ? (
        <GoogleOAuthProvider clientId={googleClientId}>
          <Router location={url}>
            <AppContent />
          </Router>
        </GoogleOAuthProvider>
      ) : (
        <Router location={url}>
          <AppContent />
        </Router>
      )}
    </LanguageProvider>
  );
}