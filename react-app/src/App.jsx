import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { LanguageProvider } from "./context/LanguageContext";

import Header from "./components/Header/Header";
import Sidebar from "./components/Sidebar/Sidebar";
import Home from "./pages/Home/Home";
import GamePage from "./pages/GamePage/GamePage";
import Footer from "./components/Footer/Footer";

export default function App() {
  const [search, setSearch] = useState("");

  return (
    <LanguageProvider>
      <BrowserRouter>
        <div className="app-root">

          {/* Always visible */}
          <Header onSearch={setSearch} />
          <Sidebar />

          {/* Page content changes here */}
          <Routes>
            <Route path="/" element={<Home search={search} />} />
            <Route path="/game/:index" element={<GamePage />} />
          </Routes>

          <Footer />
        </div>
      </BrowserRouter>
    </LanguageProvider>
  );
}
