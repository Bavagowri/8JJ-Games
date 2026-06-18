// react-app/src/data/gameMetadata.js

/**
 * Enhanced metadata for games to enable advanced filtering
 * This data structure is optimized for h5games.online JSON format
 */

export const gameMetadata = {
  // Manual overrides for specific games
  games: {
    "timberman": {
      description: "Here you can play a online version of Timberman on your browser. Become a timberman! You need to cut wood while avoiding the tree branches. Don't beyond the time! Sounds like an easy task? It's easy to play but hard to master. Have fun!",
      tags: ["Timing", "Skill", "Highscore", "Action", "Boys"],
      difficulty: "medium",
      players: "single",
      ageRating: "everyone",
      features: ["highscore", "timing-based"],
      releaseYear: 2022,
      trending: false,
      popular: true
    },
    "hill-climb-racing": {
      description: "Drive the car to the end of the hill.",
      tags: ["Cars", "Skill"],
      difficulty: "easy",
      players: "single",
      ageRating: "everyone",
      features: ["physics-based", "endless"],
      releaseYear: 2021,
      trending: true,
      popular: true
    },
    "stick-hero": {
      difficulty: "medium",
      ageRating: "everyone",
      features: ["highscore", "skill-based", "timing-based"],
      trending: true,
      popular: true
    },
    "2-cars": {
      difficulty: "hard",
      ageRating: "everyone",
      features: ["multitasking", "highscore", "endless"],
      trending: true,
      popular: true
    },
    "mahjong-solitaire": {
      difficulty: "medium",
      ageRating: "everyone",
      features: ["puzzle", "matching", "strategy"],
      popular: true
    },
    "spider-solitaire": {
      difficulty: "hard",
      ageRating: "everyone",
      features: ["puzzle", "card", "strategy"],
      popular: true
    },
    "solitaire": {
      difficulty: "medium",
      ageRating: "everyone",
      features: ["puzzle", "card", "classic"],
      popular: true
    },
    "freecell-solitaire": {
      difficulty: "medium",
      ageRating: "everyone",
      features: ["puzzle", "card", "strategy"],
      popular: true
    },
    "minion-rush": {
      difficulty: "easy",
      ageRating: "kids",
      features: ["endless", "cartoon", "casual"],
      trending: true
    }
  },
  
  trending: [
    "hill-climb-racing",
    "timberman",
    "stick-hero",
    "2-cars",
    "minion-rush"
  ],
  
  popular: [
    "timberman",
    "hill-climb-racing",
    "2-cars",
    "stick-hero",
    "mahjong-solitaire",
    "spider-solitaire",
    "solitaire",
    "freecell-solitaire"
  ]
};

/**
 * FIXED: Filter options matching EXACT game data categories
 * Based on console output: ['adventures', 'driving', 'girls', 'other', 'puzzles', 'racing', 'shooters', 'shooting', 'sports', 'strategy']
 */
export const filterOptions = {
  // FIXED: Use exact category names from your game data
  categories: [
    "adventures",   //  Changed from "adventure" to "adventures" (plural)
    "driving",
    "girls",
    "other",
    "puzzles",
    "racing",
    "shooters",     //  Keep both "shooters" and "shooting" as they're both in your data
    "shooting",
    "sports",
    "strategy"
  ],
  
  // FIXED: Tags matching your actual game data (lowercase tags normalized to Title Case)
  tags: [
    "Action",       // from your data
    "Adventure",
    "Arcade",
    "Basketball",
    "Boys",
    "Brain",
    "Bubble Shooter",
    "Card",
    "Cars",
    "Cartoon",
    "Christmas",
    "Cognitive",
    "Cute",
    "Decorating",
    "Driving",
    "Educational",
    "Family",
    "Fps",          // from 'fps' in your data
    "Fun",
    "Halloween",
    "Highscore",
    "Kids",
    "Matching",
    "Painting",
    "Physics",
    "Platformer",
    "Princess",
    "Puzzle",
    "Racing",
    "Shooting",     // from your data
    "Simulation",
    "Skill",
    "Soccer",
    "Sports",
    "Strategy",
    "Timing",
    "Zombie"
  ],
  
  difficulty: [
    { value: "easy", label: "Easy" },
    { value: "medium", label: "Medium" },
    { value: "hard", label: "Hard" }
  ],
  
  players: [
    { value: "single", label: "Single Player" },
    { value: "multiplayer", label: "Multiplayer" }
  ],
  
  ageRating: [
    { value: "everyone", label: "Everyone" },
    { value: "kids", label: "Kids (6+)" },
    { value: "teen", label: "Teen (13+)" }
  ],
  
  features: [
    "highscore",
    "timing-based",
    "physics-based",
    "endless",
    "levels",
    "matching",
    "puzzle",
    "action",
    "adventure",
    "educational",
    "casual",
    "arcade"
  ],
  
  sortOptions: [
    { value: "title-asc", label: "Title (A-Z)" },
    { value: "title-desc", label: "Title (Z-A)" },
    { value: "popular", label: "Most Popular" },
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "category", label: "By Category" }
  ]
};

const TAG_MAPPINGS = {
  difficulty: {
    easy: ["Kids", "Cute", "Fun", "Educational", "Family", "Casual"],
    medium: ["Skill", "Timing", "Matching", "Platformer"],
    hard: ["Avoid", "Endless Runner", "Physics", "Strategy", "Brain"]
  },
  features: {
    "highscore": ["Highscore"],
    "timing-based": ["Timing"],
    "physics-based": ["Physics", "Box2D"],
    "endless": ["Endless Runner"],
    "matching": ["Matching"],
    "puzzle": ["Puzzle", "Brain"],
    "educational": ["Educational"],
    "action": ["Action"],
    "adventure": ["Adventure"],
    "casual": ["Fun", "Family"],
    "arcade": ["Arcade"]
  },
  ageRating: {
    kids: ["Kids", "Educational", "Cute", "Cartoon", "Family"],
    teen: ["Zombie", "Halloween", "Boys"],
    everyone: []
  }
};

/**
 * FIXED: Parse tags with better normalization to Title Case
 */
export function parseTags(tagString) {
  if (!tagString) return [];
  if (Array.isArray(tagString)) return tagString;
  
  // Split by comma and normalize to Title Case
  return tagString
    .split(',')
    .map(tag => {
      const trimmed = tag.trim();
      if (!trimmed) return null;
      // Convert to Title Case: first letter uppercase, rest lowercase
      return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
    })
    .filter(Boolean);
}

/**
 * UPDATED: Normalize category name for consistent matching
 */
export function normalizeCategory(category) {
  if (!category) return "";
  return category.toLowerCase().trim();
}

export function inferDifficulty(game) {
  const tags = parseTags(game.tags).map(t => t.toLowerCase());
  const desc = (game.description || '').toLowerCase();
  
  if (desc.includes('easy') || desc.includes('simple')) return 'easy';
  if (desc.includes('hard') || desc.includes('difficult') || desc.includes('challenging')) return 'hard';
  
  let easyScore = 0;
  let hardScore = 0;
  
  tags.forEach(tag => {
    if (TAG_MAPPINGS.difficulty.easy.some(t => tag.includes(t.toLowerCase()))) {
      easyScore++;
    }
    if (TAG_MAPPINGS.difficulty.hard.some(t => tag.includes(t.toLowerCase()))) {
      hardScore++;
    }
  });
  
  if (easyScore > hardScore) return 'easy';
  if (hardScore > easyScore + 1) return 'hard';
  return 'medium';
}

export function inferAgeRating(game) {
  const tags = parseTags(game.tags).map(t => t.toLowerCase());
  
  if (tags.some(t => TAG_MAPPINGS.ageRating.kids.some(k => t.includes(k.toLowerCase())))) {
    return 'kids';
  }
  
  if (tags.some(t => TAG_MAPPINGS.ageRating.teen.some(k => t.includes(k.toLowerCase())))) {
    return 'teen';
  }
  
  return 'everyone';
}

export function extractFeatures(game) {
  const features = new Set();
  const tags = parseTags(game.tags).map(t => t.toLowerCase());
  
  Object.entries(TAG_MAPPINGS.features).forEach(([feature, keywords]) => {
    if (keywords.some(keyword => tags.some(tag => tag.includes(keyword.toLowerCase())))) {
      features.add(feature);
    }
  });
  
  return Array.from(features);
}

export function isTrending(gameId) {
  if (gameMetadata.games[gameId]?.trending !== undefined) {
    return gameMetadata.games[gameId].trending;
  }
  return gameMetadata.trending.includes(gameId);
}

export function isPopular(gameId) {
  if (gameMetadata.games[gameId]?.popular !== undefined) {
    return gameMetadata.games[gameId].popular;
  }
  return gameMetadata.popular.includes(gameId);
}

/**
 * FIXED: Enhanced metadata with consistent tag normalization to Title Case
 * Now handles both tagList (array) and tags (string) from source data
 */
export function enhanceGamesWithMetadata(games) {
  return games.map(game => {
    const gameId = game.guid || game.id;
    const manualOverride = gameMetadata.games[gameId] || {};
    
    // FIXED: Handle both tagList (array) and tags (string) from source data
    let sourceTags = [];
    if (Array.isArray(game.tagList) && game.tagList.length > 0) {
      // Game already has tagList array from source
      sourceTags = game.tagList;
    } else if (typeof game.tags === 'string' && game.tags.trim()) {
      // Game has tags as comma-separated string
      sourceTags = parseTags(game.tags);
    }
    
    // Get tags: prefer manual override, otherwise use source tags
    let finalTagList = manualOverride.tags || sourceTags;
    
    // IMPORTANT: Ensure all tags are normalized to Title Case
    finalTagList = finalTagList.map(tag => {
      const normalized = String(tag).trim();
      if (!normalized) return null;
      return normalized.charAt(0).toUpperCase() + normalized.slice(1).toLowerCase();
    }).filter(Boolean);
    
    return {
      ...game,
      id: gameId,
      description: manualOverride.description || game.description || "",
      tags: game.tags || "", // Keep original tags string
      tagList: finalTagList, // Normalized tag array in Title Case
      difficulty: manualOverride.difficulty || inferDifficulty(game),
      players: manualOverride.players || "single",
      ageRating: manualOverride.ageRating || inferAgeRating(game),
      features: manualOverride.features || extractFeatures(game),
      releaseYear: manualOverride.releaseYear || (game.pubDate ? new Date(game.pubDate).getFullYear() : 2022),
      trending: manualOverride.trending !== undefined ? manualOverride.trending : isTrending(gameId),
      popular: manualOverride.popular !== undefined ? manualOverride.popular : isPopular(gameId),
      category: normalizeCategory(game.category) || "other",
      thumbnail: game.thumb || game.image,
      url: game.link,
      width: parseInt(game.width) || 800,
      height: parseInt(game.height) || 600
    };
  });
}

export function getUniqueCategories(games) {
  const categories = new Set();
  games.forEach(game => {
    if (game.category) categories.add(normalizeCategory(game.category));
  });
  return Array.from(categories).sort();
}

export function getUniqueTags(games) {
  const tagCount = {};
  
  games.forEach(game => {
    const tags = Array.isArray(game.tagList) ? game.tagList : parseTags(game.tags);
    tags.forEach(tag => {
      tagCount[tag] = (tagCount[tag] || 0) + 1;
    });
  });
  
  return Object.entries(tagCount)
    .sort((a, b) => b[1] - a[1])
    .map(([tag]) => tag);
}

/**
 * UPDATED: Advanced game filtering with case-insensitive matching
 */
export function filterGames(games, filters = {}) {
  let filtered = [...games];
  
  // Filter by category (case-insensitive)
  if (filters.categories && filters.categories.length > 0) {
    filtered = filtered.filter(game => {
      const gameCategory = normalizeCategory(game.category);
      return filters.categories.some(cat => 
        normalizeCategory(cat) === gameCategory
      );
    });
  }
  
  // Filter by tags (case-insensitive OR logic)
  if (filters.tags && filters.tags.length > 0) {
    filtered = filtered.filter(game => {
      const gameTags = (Array.isArray(game.tagList) ? game.tagList : parseTags(game.tags))
        .map(t => t.toLowerCase());
      return filters.tags.some(filterTag => 
        gameTags.some(gameTag => 
          gameTag === filterTag.toLowerCase()
        )
      );
    });
  }
  
  // Filter by difficulty
  if (filters.difficulty && filters.difficulty.length > 0) {
    filtered = filtered.filter(game => 
      filters.difficulty.includes(game.difficulty)
    );
  }
  
  // Filter by players
  if (filters.players && filters.players.length > 0) {
    filtered = filtered.filter(game => 
      filters.players.includes(game.players)
    );
  }
  
  // Filter by age rating
  if (filters.ageRating && filters.ageRating.length > 0) {
    filtered = filtered.filter(game => 
      filters.ageRating.includes(game.ageRating)
    );
  }
  
  // Filter by features
  if (filters.features && filters.features.length > 0) {
    filtered = filtered.filter(game => {
      const gameFeatures = game.features || [];
      return filters.features.some(feature => 
        gameFeatures.includes(feature)
      );
    });
  }
  
  // Filter by trending
  if (filters.onlyTrending) {
    filtered = filtered.filter(game => game.trending);
  }
  
  // Filter by popular
  if (filters.onlyPopular) {
    filtered = filtered.filter(game => game.popular);
  }
  
  // Search filter (case-insensitive)
  if (filters.search) {
    const query = filters.search.toLowerCase();
    filtered = filtered.filter(game => {
      const title = (game.title || '').toLowerCase();
      const desc = (game.description || '').toLowerCase();
      const tags = (Array.isArray(game.tagList) ? game.tagList : parseTags(game.tags))
        .map(t => t.toLowerCase())
        .join(' ');
      
      return title.includes(query) || 
             desc.includes(query) || 
             tags.includes(query);
    });
  }
  
  return filtered;
}

export function sortGames(games, sortBy = 'title-asc') {
  const sorted = [...games];
  
  switch (sortBy) {
    case 'title-asc':
      return sorted.sort((a, b) => 
        a.title.localeCompare(b.title)
      );
      
    case 'title-desc':
      return sorted.sort((a, b) => 
        b.title.localeCompare(a.title)
      );
      
    case 'newest':
      return sorted.sort((a, b) => 
        new Date(b.pubDate || 0) - new Date(a.pubDate || 0)
      );
      
    case 'oldest':
      return sorted.sort((a, b) => 
        new Date(a.pubDate || 0) - new Date(b.pubDate || 0)
      );
      
    case 'popular':
      return sorted.sort((a, b) => {
        if (a.popular && !b.popular) return -1;
        if (!a.popular && b.popular) return 1;
        if (a.trending && !b.trending) return -1;
        if (!a.trending && b.trending) return 1;
        return 0;
      });
      
    case 'category':
      return sorted.sort((a, b) => {
        const catCompare = normalizeCategory(a.category).localeCompare(normalizeCategory(b.category));
        return catCompare !== 0 ? catCompare : a.title.localeCompare(b.title);
      });
      
    default:
      return sorted;
  }
}

export function getGameStatistics(games) {
  const stats = {
    total: games.length,
    byCategory: {},
    byDifficulty: {},
    byAgeRating: {},
    topTags: [],
    trending: 0,
    popular: 0
  };
  
  games.forEach(game => {
    const cat = normalizeCategory(game.category) || 'other';
    stats.byCategory[cat] = (stats.byCategory[cat] || 0) + 1;
    
    stats.byDifficulty[game.difficulty] = (stats.byDifficulty[game.difficulty] || 0) + 1;
    stats.byAgeRating[game.ageRating] = (stats.byAgeRating[game.ageRating] || 0) + 1;
    
    if (game.trending) stats.trending++;
    if (game.popular) stats.popular++;
  });
  
  stats.topTags = getUniqueTags(games).slice(0, 20);
  
  return stats;
}