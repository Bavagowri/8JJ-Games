import { useState } from "react";
import { LanguageProvider } from "./context/LanguageContext";
import Header from "./components/Header/Header";
import Sidebar from "./components/Sidebar/Sidebar";
import Home from "./pages/Home/Home";
import Footer from "./components/Footer/Footer";
// import ShareModal from "./components/ShareModal/ShareModal";

export default function App() {
  const [search, setSearch] = useState("");

  return (
    <LanguageProvider>
      <div className="app-root">
        <Header onSearch={setSearch} />
        <Sidebar />
        <Home search={search} />
        <Footer />
      </div>
    </LanguageProvider>
  );
}
