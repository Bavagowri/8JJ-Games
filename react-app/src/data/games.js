// Base card structure:
// id: used for openGame routing or external ID
// title: card title
// category: subtitle/genre
// image: relative path to your image in public/images or src/assets
// type: can help you group (popular, hot, cricket, etc.)
// externalUrl: for external games like Temple Run / Candy Crush

export const featuredGames = [
  {
    id: "templerun",
    title: "Temple Run",
    image: "/images/templerun.jpg",
    externalUrl: "https://templerun.org/",
  },
  {
    id: "candycrush",
    title: "Candy Crush",
    image: "/images/candycrush.jpg",
    externalUrl: "https://candycrush.org/",
  },
  {
    id: "subway",
    title: "Subway Surfers",
    image: "/images/Subway.jpg",
    externalUrl: "https://subway-surfers.gg/",
  },
  // ... add the anime images etc
];

export const popularGames = [
  {
    id: "templerun",
    title: "Templerun",
    category: "Popular",
    image: "/images/templerun.jpg",
    externalUrl: "https://templerun.org/",
  },
  {
    id: "candycrush",
    title: "Candycrush",
    category: "Popular",
    image: "/images/candycrush.jpg",
    externalUrl: "https://candycrush.org/",
  },
  {
    id: "subway",
    title: "Subway",
    category: "Popular",
    image: "/images/Subway.jpg",
    externalUrl: "https://subway-surfers.gg/",
  },
  {
    id: "akira-oda",
    title: "Akira Oda",
    category: "Anime",
    image: "/images/girl.avif",
    gameId: "ecd138ae69cf4e92b5f5cdd328b6b62e",
  },
  // ...rest of popular cards
];

export const hotGames = [
  {
    id: "pro-cricket",
    title: "Pro Cricket",
    category: "Cricket",
    image: "/images/cricket5.jpg",
    gameId: "610516946eee45ecb37540d2aec7df85",
  },
  {
    id: "cpl-cricket",
    title: "CPL Cricket",
    category: "Cricket",
    image: "/images/cricket4.jpg",
    gameId: "c294a400c6684a3db9521d3a37c911a0",
  },
  // ...
];

// Example category section (Cricket Games)
export const cricketGames = [
  {
    id: "pro-cricket",
    title: "Pro Cricket",
    category: "Cricket",
    image: "/images/cricket9.jpg",
    gameId: "610516946eee45ecb37540d2aec7df85",
  },
  // ...add rest
];

// Similarly define:
// footballGames, basketballGames, baseballGames, shootingGames,
// halloweenGames, horrorGames, animalGames, lettersGames, girlGames,
// boardGames, racingGames, cardGames, sportsGames, casualGames, indianGames

// Helper: sections configuration used by the Section component

export const sectionsConfig = [
  {
    id: "popularSection",
    icon: "💥",
    translationKey: "popularGames",
    games: popularGames,
    lockMode: "popular", // use for first-3 unlocked logic
  },
  {
    id: "hotSection",
    icon: "🔥",
    translationKey: "hotGames",
    games: hotGames,
  },
  {
    id: "number_games",
    icon: "🏏",
    translationKey: "cricketGames",
    games: cricketGames,
  },
  // ...add objects for each category (football_games, basketball_games etc.)
];