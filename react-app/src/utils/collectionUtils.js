// utils/collectionUtils.js

const COLLECTION_KEY = "myGameCollection";

/**
 * Get all games from collection
 */
export const getCollection = () => {
  try {
    const collection = localStorage.getItem(COLLECTION_KEY);
    return collection ? JSON.parse(collection) : [];
  } catch (error) {
    console.error("Error reading collection:", error);
    return [];
  }
};

/**
 * Add game to collection
 */
export const addToCollection = (game) => {
  try {
    const collection = getCollection();
    
    // Check if game already exists
    const exists = collection.some(g => String(g.id) === String(game.id));
    if (exists) {
      return false;
    }
    
    // Add game to collection
    collection.push(game);
    localStorage.setItem(COLLECTION_KEY, JSON.stringify(collection));
    return true;
  } catch (error) {
    console.error("Error adding to collection:", error);
    return false;
  }
};

/**
 * Remove game from collection
 */
export const removeFromCollection = (gameId) => {
  try {
    const collection = getCollection();
    const filtered = collection.filter(g => String(g.id) !== String(gameId));
    localStorage.setItem(COLLECTION_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error("Error removing from collection:", error);
    return false;
  }
};

/**
 * Check if game is in collection
 */
export const isInCollection = (gameId) => {
  const collection = getCollection();
  return collection.some(g => String(g.id) === String(gameId));
};