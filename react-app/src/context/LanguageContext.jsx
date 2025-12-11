import { createContext, useContext, useState } from "react";

const LanguageContext = createContext();

const SUPPORTED = ["en", "hi", "ta", "ml", "kn", "bn"];

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try {
      const saved = localStorage.getItem("8jj_lang");
      return saved && SUPPORTED.includes(saved) ? saved : "en";
    } catch {
      return "en";
    }
  });

  const changeLanguage = (next) => {
    const value = SUPPORTED.includes(next) ? next : "en";
    setLang(value);
    try {
      localStorage.setItem("8jj_lang", value);
    } catch { void 0; }
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
