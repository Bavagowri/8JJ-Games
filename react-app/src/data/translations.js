export const t = {
  featured: {
    en: "Featured",
    hi: "विशेष",
    ta: "சிறப்பு",
    ml: "പ്രധാനപ്പെട്ടവ",
    kn: "ವಿಶೇಷ",
    bn: "বাছাই করা",
  },
  popularGames: {
    en: "Popular Games",
    hi: "लोकप्रिय गेम्स",
    ta: "பிரபலமான விளையாட்டுகள்",
    ml: "ജനപ്രിയ ഗെയിമുകൾ",
    kn: "ಜನಪ್ರಿಯ ಆಟಗಳು",
    bn: "জনপ্রিয় গেমস",
  },
  hotGames: {
    en: "Hot Games",
    hi: "हॉट गेम्स",
    ta: "ஹாட் விளையாட்டுகள்",
    ml: "ഹോട്ട് ഗെയിമുകൾ",
    kn: "ಹಾಟ್ ಆಟಗಳು",
    bn: "হট গেমস",
  },
  searchPlaceholder: {
    en: "Search games…",
    hi: "गेम खोजें…",
    ta: "விளையாட்டுகளை தேடுங்கள்…",
    ml: "ഗെയിമുകൾ തിരയുക…",
    kn: "ಆಟಗಳನ್ನು ಹುಡುಕಿ…",
    bn: "গেম খুঁজুন…",
  },
};

export function translate(key, lang) {
  const entry = t[key];
  if (!entry) return key;
  return entry[lang] || entry.en || key;
}
