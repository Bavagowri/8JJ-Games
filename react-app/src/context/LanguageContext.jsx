// react-app/src/context/LanguageContext.jsx

import { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext();

// Updated to include new languages: Urdu, Punjabi, Gujarati, Telugu, Marathi
const SUPPORTED = ["en", "hi", "ta", "ml", "kn", "bn", "ur", "pa", "gu", "te", "mr"];

// Function to detect browser/device language
const detectDeviceLanguage = () => {
  try {
    // Get browser language (works on all devices)
    const browserLang = navigator.language || navigator.languages?.[0] || "en";
    
    // Extract primary language code (e.g., "en-US" → "en", "hi-IN" → "hi")
    const langCode = browserLang.split("-")[0].toLowerCase();
    
    // Check if the detected language is supported
    if (SUPPORTED.includes(langCode)) {
      return langCode;
    }
    
    // Default to English if language not supported
    return "en";
  } catch (e) {
    // Fallback to English in case of any errors
    return "en";
  }
};

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState("en");

  useEffect(() => {
    try {
      // First, check if user has a saved language preference
      const saved = localStorage.getItem("8jj_lang");
      
      if (saved && SUPPORTED.includes(saved)) {
        // User has previously selected a language - use it
        setLang(saved);
      } else {
        // No saved preference - detect device language
        const detectedLang = detectDeviceLanguage();
        setLang(detectedLang);
        
        // Save the detected language to localStorage
        localStorage.setItem("8jj_lang", detectedLang);
      }
    } catch (e) {
      // If localStorage fails, just use detected language without saving
      const detectedLang = detectDeviceLanguage();
      setLang(detectedLang);
    }
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