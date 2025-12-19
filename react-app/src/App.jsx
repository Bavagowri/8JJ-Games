import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider, useLanguage } from "./context/LanguageContext";

import Header from "./components/Header/Header";
import Sidebar from "./components/Sidebar/Sidebar";
// import TopPromoBar from "./components/TopPromoBar/TopPromoBar";

import Home from "./pages/Home/Home";
import AllGames from "./pages/AllGames/AllGames";
import GamePage from "./pages/GamePage/GamePage";
import Footer from "./components/Footer/Footer";
import GamePageV2 from "./pages/GamePageV2/GamePageV2";

import MosaicGamePage from "./pages/MosaicGamePage/MosaicGamePage";
import CategoryGamesPage from "./pages/CategoryGamesPage/CategoryGamesPage";
import AllCategoriesPage from "./pages/AllCategoriesPage/AllCategoriesPage";
import SearchOverlay from "./components/SearchOverlay/SearchOverlay";
import { fetchH5Games } from "./api/fetchH5Games";
import { selfHostedGames } from "./data/selfHostedGames";

function AppContent() {
  const [search, setSearch] = useState("");
  const { lang } = useLanguage();

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  const [games, setGames] = useState([]);

  useEffect(() => {
    const load = async () => {
      const h5 = await fetchH5Games();
      const all = [...selfHostedGames, ...h5];
      setGames(all);
      localStorage.setItem("games", JSON.stringify(all));
    };
    load();
  }, []);

  return (
    <BrowserRouter>
      <div className={`app-root lang-${lang}`}>
        {/* Always visible */}
        <Header onSearch={setSearch} />
        <Sidebar />
        {/* 🔍 GLOBAL SEARCH OVERLAY */}
          <SearchOverlay games={games} />
        {/* Page content changes here */}
        <Routes>
          <Route path="/" element={<Home search={search} />} />
          <Route path="/all-games" element={<AllGames />} />
          <Route path="/game/:id" element={<GamePageV2 />} />
          <Route path="/all-mosaic-games" element={<MosaicGamePage />} />
          <Route path="/categories/:categoryId" element={<CategoryGamesPage />} />
          <Route path="/categories" element={<AllCategoriesPage />} />
        </Routes>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}