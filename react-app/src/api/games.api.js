// react-app/src/api/games.api.js
const API_BASE = "/api/games";

/* ================= GET ALL ================= */
export async function getAllGames({ source, limit, offset } = {}) {
  const params = new URLSearchParams();

  if (source) params.append("source", source);
  if (limit) params.append("limit", limit);
  if (offset) params.append("offset", offset);

  const res = await fetch(`${API_BASE}?${params.toString()}`);

  if (!res.ok) {
    throw new Error("Failed to fetch games");
  }

  const data = await res.json();
  return data.data;
}

/* ================= POPULAR ================= */
export async function getPopularGames(limit = 6) {
  const res = await fetch(`${API_BASE}/popular?limit=${limit}`);

  if (!res.ok) {
    throw new Error("Failed to fetch popular games");
  }

  const data = await res.json();
  return data.data;
}

/* ================= FEATURED ================= */
export async function getFeaturedGames() {
  const res = await fetch(`${API_BASE}/featured`);

  if (!res.ok) {
    throw new Error("Failed to fetch featured games");
  }

  const data = await res.json();
  return data.data;
}

/* ================= RECENT ================= */
export async function getRecentGames(limit = 12) {
  const res = await fetch(`${API_BASE}/recent?limit=${limit}`);

  if (!res.ok) {
    throw new Error("Failed to fetch recent games");
  }

  const data = await res.json();
  return data.data;
}

/* ================= CATEGORY ================= */
export async function getGamesByCategory(category) {
  const res = await fetch(`${API_BASE}/category/${category}`);

  if (!res.ok) {
    throw new Error("Failed to fetch category games");
  }

  const data = await res.json();
  return data.data;
}

/* ================= TAG ================= */
export async function getGamesByTag(tag) {
  const res = await fetch(`${API_BASE}/tag/${tag}`);

  if (!res.ok) {
    throw new Error("Failed to fetch tag games");
  }

  const data = await res.json();
  return data.data;
}

/* ================= HOT ================= */
export async function getHotGames(limit = 12) {
  const res = await fetch(`${API_BASE}/hot?limit=${limit}`);

  if (!res.ok) {
    throw new Error("Failed to fetch hot games");
  }

  const data = await res.json();
  return data.data;
}

/* ================= TOP PICKS ================= */
export async function getTopPickGames(limit = 33) {
  const res = await fetch(`/api/games/top-picks?limit=${limit}`);

  if (!res.ok) {
    throw new Error("Failed to fetch top picks");
  }

  const data = await res.json();
  return data.data;
}
