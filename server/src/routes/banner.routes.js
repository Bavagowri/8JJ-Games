// server/src/routes/banner.routes.js - COMPLETE VERSION

import express from "express";
import { auth } from "../middleware/auth.js";
import { adminAuth } from "../middleware/adminAuth.js";
import {
  // Templates
  getTemplates,
  getTemplate,
  updateTemplate,
  toggleTemplate,
  
  // Placements
  getPlacements,
  getPlacement,
  createPlacement,
  updatePlacement,
  deletePlacement,
  togglePlacement,
  
  // Banners
  getBanners,
  getBanner,
  createBanner,
  updateBanner,
  deleteBanner,
  toggleBanner,
  getBannerAnalytics,
  
  // Slides
  addSlide,
  updateSlide,
  deleteSlide,
  reorderSlides,
  
  // Games
  addGame,
  removeGame,
  updateGame,
  
  // Public
  getBannerForPlacement,
  trackClick
} from "../controllers/bannerController.js";

const router = express.Router();

/* ================= PUBLIC ROUTES ================= */

// Get active banner for a specific placement (used by frontend)
router.get("/placement/:placementKey", getBannerForPlacement);

// Track banner interactions (impressions, clicks)
router.post("/track", trackClick); // Optional auth

/* ================= ADMIN ROUTES - TEMPLATES ================= */

// Get all templates
router.get("/admin/templates", adminAuth, getTemplates);

// Get single template
router.get("/admin/templates/:templateId", adminAuth, getTemplate);

// Update template
router.put("/admin/templates/:templateId", adminAuth, updateTemplate);

// Toggle template status
router.patch("/admin/templates/:templateId/toggle", adminAuth, toggleTemplate);

/* ================= ADMIN ROUTES - PLACEMENTS ================= */

// Get all placements
router.get("/admin/placements", adminAuth, getPlacements);

// Get single placement
router.get("/admin/placements/:placementId", adminAuth, getPlacement);

// Create placement
router.post("/admin/placements", adminAuth, createPlacement);

// Update placement
router.put("/admin/placements/:placementId", adminAuth, updatePlacement);

// Delete placement
router.delete("/admin/placements/:placementId", adminAuth, deletePlacement);

// Toggle placement status
router.patch("/admin/placements/:placementId/toggle", adminAuth, togglePlacement);

/* ================= ADMIN ROUTES - BANNERS ================= */

// Get all banners (with pagination)
router.get("/admin/banners", adminAuth, getBanners);

// Get single banner (with slides/games)
router.get("/admin/banners/:bannerId", adminAuth, getBanner);

// Create new banner
router.post("/admin/banners", adminAuth, createBanner);

// Update banner
router.put("/admin/banners/:bannerId", adminAuth, updateBanner);

// Delete banner
router.delete("/admin/banners/:bannerId", adminAuth, deleteBanner);

// Toggle banner active/inactive
router.patch("/admin/banners/:bannerId/toggle", adminAuth, toggleBanner);

// Get banner analytics
router.get("/admin/banners/:bannerId/analytics", adminAuth, getBannerAnalytics);

/* ================= ADMIN ROUTES - SLIDES (for carousel banners) ================= */

// Add slide to banner
router.post("/admin/banners/:bannerId/slides", adminAuth, addSlide);

// Update slide
router.put("/admin/slides/:slideId", adminAuth, updateSlide);

// Delete slide
router.delete("/admin/slides/:slideId", adminAuth, deleteSlide);

// Reorder slides
router.put("/admin/banners/:bannerId/slides/reorder", adminAuth, reorderSlides);

/* ================= ADMIN ROUTES - GAMES (for section banners) ================= */

// Add game to banner
router.post("/admin/banners/:bannerId/games", adminAuth, addGame);

// Update game in banner
router.put("/admin/games/:gameId", adminAuth, updateGame);

// Remove game from banner
router.delete("/admin/games/:gameId", adminAuth, removeGame);

export default router;