// src/routes/games.routes.js
import express from "express";
import {
  getAllGames,
  getPopularGames,
  getFeaturedGames,
  getGamesByCategory,
  getGamesByTag,
  getRecentGames,
  getHotGames,
  getTopPickGames,
  getRelatedGames,
  getGameBySlug,
  // =====================================================================
  // PERF FIX (Step 6): Import the new home bundle controller.
  // This replaces 17 parallel fetch() calls from MobileHome.jsx with
  // a single endpoint that runs all queries in parallel on the server.
  // =====================================================================
  getHomeBundle,
} from "../controllers/games.controller.js";

const router = express.Router();

/* ================= ALL ================= */
router.get("/", getAllGames);

/* ================= POPULAR ================= */
router.get("/popular", getPopularGames);

/* ================= HOT ================= */
router.get("/hot", getHotGames);

/* ================= FEATURED ================= */
router.get("/featured", getFeaturedGames);

/* ================= TOP PICKS FOR YOU ================= */
router.get("/top-picks", getTopPickGames);

/* ================= RECENT ================= */
router.get("/recent", getRecentGames);

/* ================= HOME BUNDLE ================= */
// =====================================================================
// PERF FIX (Step 6): Single endpoint that returns all 17 home page
// sections in one HTTP request.
//
// ⚠️  PLACEMENT: Must be BEFORE the /:slug wildcard below, otherwise
//     Express will match "home-bundle" as a game slug and call
//     getGameBySlug instead, returning a 404.
//
// ORIGINAL: 17 separate routes fired in parallel by the frontend —
//   /api/games/hot
//   /api/games/featured
//   /api/games/top-picks
//   /api/games/popular
//   /api/games/tag/basketball  ... (13 more)
// These routes are kept intact for desktop Home.jsx and any other
// consumers. Only MobileHome.jsx is switching to the bundle.
// =====================================================================
router.get("/home-bundle", getHomeBundle);

/* ================= CATEGORY ================= */
router.get("/category/:category", getGamesByCategory);

/* ================= TAG ================= */
// ⚠️ MUST be before /:slug or Express will match "tag" as a slug
router.get("/tag/:tag", getGamesByTag);

/* ================= RELATED GAMES ================= */
// ⚠️ MUST be before /:slug or Express will match the slug and ignore /related
router.get("/:slug/related", getRelatedGames);

/* ================= GAME DETAIL ================= */
// ⚠️ Keep this LAST — it's a wildcard that catches everything
router.get("/:slug", getGameBySlug);

export default router;