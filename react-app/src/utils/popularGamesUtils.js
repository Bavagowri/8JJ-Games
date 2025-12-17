// utils/popularGamesUtils.js
const POPULAR_KEY = "8jj_popular_v1";

/**
 * Load popular games from localStorage
 */
export function loadPopular() {
  try {
    return JSON.parse(localStorage.getItem(POPULAR_KEY) || "[]");
  } catch {
    return [];
  }
}

/**
 * Save popular games to localStorage
 */
export function savePopular(list) {
  try {
    localStorage.setItem(POPULAR_KEY, JSON.stringify(list));
  } catch {}
}

/**
 * Track a game click/play and update popular games
 * Keeps top 12 most clicked games
 */
export function trackGameClick(game) {
  try {
    const list = loadPopular();
    
    // Check if game already exists
    const existingIndex = list.findIndex((g) => g.id === game.id);
    
    if (existingIndex !== -1) {
      // Game exists, increment clicks
      list[existingIndex].clicks = (list[existingIndex].clicks || 1) + 1;
      list[existingIndex].lastClicked = Date.now();
    } else {
      // New game, add it
      list.push({
        id: game.id,
        title: game.title,
        image: game.image,
        category: game.category || "",
        gameId: game.gameId,
        externalUrl: game.externalUrl,
        clicks: 1,
        lastClicked: Date.now(),
      });
    }
    
    // Sort by clicks (descending)
    list.sort((a, b) => b.clicks - a.clicks);
    
    // Keep only top 12
    const topList = list.slice(0, 12);
    
    savePopular(topList);
    return topList;
  } catch (error) {
    console.error("Error tracking game click:", error);
    return [];
  }
}

/**
 * Clear all popular games (optional)
 */
export function clearPopular() {
  try {
    localStorage.removeItem(POPULAR_KEY);
  } catch {}
}