import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { LanguageProvider } from "./context/LanguageContext";

import Header from "./components/Header/Header";
import Sidebar from "./components/Sidebar/Sidebar";
// import TopPromoBar from "./components/TopPromoBar/TopPromoBar";

import Home from "./pages/Home/Home";
import AllGames from "./pages/AllGames/AllGames";
import GamePage from "./pages/GamePage/GamePage";
import Footer from "./components/Footer/Footer";
import GamePageV2 from "./pages/GamePageV2/GamePageV2";

import Snow from "./components/Snow/Snow";


export default function App() {
  const [search, setSearch] = useState("");

  return (
    <LanguageProvider>
      <BrowserRouter>
        <div className="app-root">
          <Snow />
          {/* <TopPromoBar /> */}
          {/* Always visible */}
          <Header onSearch={setSearch} />
          <Sidebar />

          {/* Page content changes here */}
          <Routes>
            <Route path="/" element={<Home search={search} />} />
            <Route path="/all-games" element={<AllGames />} />
            <Route path="/game/:index" element={<GamePageV2 />} />
          </Routes>

          <Footer />
        </div>
      </BrowserRouter>
    </LanguageProvider>
  );
}