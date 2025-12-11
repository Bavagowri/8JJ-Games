import { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext();

const SUPPORTED = ["en", "hi", "ta", "ml", "kn", "bn"];

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState("en");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("8jj_lang");
      if (saved && SUPPORTED.includes(saved)) {
        setLang(saved);
      }
    } catch (e) {}
  }, []);

  const changeLanguage = (next) => {
    const value = SUPPORTED.includes(next) ? next : "en";
    setLang(value);
    try {
      localStorage.setItem("8jj_lang", value);
    } catch (e) {}
  };

  return (
    <LanguageContext.Provider value={{ lang, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
