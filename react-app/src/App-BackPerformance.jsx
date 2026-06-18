// react-app/src/App.jsx  02/03/2026
import NotFound from "./pages/NotFound/NotFound";

import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { LanguageProvider, useLanguage } from "./context/LanguageContext";

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
import PrivacyPolicyPage from "./pages/PrivacyPolicy/PrivacyPolicy";

// ── Desktop Auth ────────────────────────────────────────────────────
import AuthPage from './pages/Auth/AuthPage/AuthPage';
import ResetPassword from './pages/Auth/AuthPage/ResetPassword';
import EmailVerified from './pages/Auth/AuthPage/EmailVerified';

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

import './Overlayer.css';

import ProtectedRoute from "./components/ProtectedRoute";
import Maintenance from "./pages/Maintenance/Maintenance";

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

  // =====================================================================
  // PRELOADER: Shows once per session, dismisses as soon as games finish
  // loading — no artificial minimum delay. Uses sessionStorage so repeat
  // visits within the same tab skip it entirely.
  // =====================================================================
  const hasVisited = sessionStorage.getItem('hasVisitedSite') === 'true';
  const [showPreloader, setShowPreloader] = useState(!hasVisited);

  const { lang } = useLanguage();
  const isMobile = useIsMobile(768);

  useEffect(() => {
    const load = async () => {
      const h5 = await fetchH5Games();
      const all = [...selfHostedGames, ...h5];
      setGames(all);
      localStorage.setItem("games", JSON.stringify(all));
      setLoading(false);

      // Hide preloader as soon as data is ready — no extra delay
      if (showPreloader) {
        setShowPreloader(false);
        sessionStorage.setItem('hasVisitedSite', 'true');
      }
    };
    load();
  }, []);

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  if (showPreloader) {
    return <BrandedPreloader />;
  }

  return (
    <BrowserRouter>
      <GATracker />
      <div className={`app-root lang-${lang}`}>

        {/* Background */}
        <img src={`${R2_BASE}/8jj_background/8jj-games-bg.webp`} fetchpriority="high" alt="Profile background" aria-hidden="true" role="presentation" className="profile-background-image" />
        <div className="gradient-overlay Profile-Overlay HOMEOVERLAYS"></div>

        {/* Desktop-only chrome */}
        {!isMobile && (
          <>
            <Header onSearch={setSearch} />
            <Sidebar />
            <SearchOverlay/>
          </>
        )}

        <Routes>
          {/* ─── Main pages ──────────────────────────────────────── */}
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

          <Route path="/categories"
            element={isMobile ? <MobileAllCategories /> : <AllCategoriesPage />} />

          <Route path="/about"
            element={isMobile ? <MobileAbout /> : <About />} />

          <Route path="/contact"
            element={isMobile ? <MobileContact /> : <Contact />} />

          <Route path="/privacy-policy" element={isMobile ? <MobilePrivacyPolicy /> : <PrivacyPolicyPage />} />

          {/* ─── Auth routes ─────────────────────────────────────── */}
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

          {/* ─── Protected routes ────────────────────────────────── */}
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

          {/* ─── Admin routes ────────────────────────────────────── */}
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><UserManagement /></AdminRoute>} />
          <Route path="/admin/notifications" element={<AdminRoute><NotificationManagement /></AdminRoute>} />
          <Route path="/admin/points" element={<AdminRoute><PointsManagement /></AdminRoute>} />
          <Route path="/admin/user-points" element={<AdminRoute><AdminUserPoints /></AdminRoute>} />
          <Route path="/admin/sync" element={<AdminRoute><SyncManagement /></AdminRoute>} />
          <Route path="/admin/game-manager" element={<AdminRoute><GameManagement /></AdminRoute>} />

          {/* Banner Management Routes */}
          <Route path="/admin/banners" element={<BannerManagement />} />
          <Route path="/admin/banners/create" element={<BannerCreate />} />
          <Route path="/admin/banners/edit/:id" element={<BannerCreate />} />
          <Route path="/admin/banners/placements/create" element={<PlacementCreate />} />
          <Route path="/admin/banners/placements/edit/:id" element={<PlacementCreate />} />
          <Route path="/admin/banners/templates/edit/:id" element={<TemplateEdit />} />

          {/* ─── 404 — must be last ──────────────────────────────── */}
          <Route path="*" element={<NotFound />} />
        </Routes>

        {/* Desktop-only footer */}
        {!isMobile && <Footer />}
      </div>
    </BrowserRouter>
  );
}

export default function App() {
  if (MAINTENANCE) {
    return <Maintenance />;
  }
  return (
    <LanguageProvider>
      <HelmetProvider>
        <AppContent />
      </HelmetProvider>
    </LanguageProvider>
  );
}