
// server/src/routes/notification.routes.js


import express from "express";
import { auth } from "../middleware/auth.js";
import { adminAuth } from "../middleware/adminAuth.js";
import {
  getUserNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
  getPreferences,
  updatePreferences
} from "../controllers/notificationController.js";

import {
  getTemplates,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  getPresets,
  sendToUser,
  createCampaign,
  sendCampaign,
  getCampaigns,
  getNotificationStats,
  getCategories,
  bulkSend
} from "../controllers/adminNotificationController.js";

const router = express.Router();

/* ================= USER ROUTES ================= */

// Get user's notifications (with pagination and filters)
router.get("/", auth, getUserNotifications);

// Get unread count
router.get("/unread-count", auth, getUnreadCount);

// Mark single notification as read
router.patch("/:notificationId/read", auth, markAsRead);

// Mark all notifications as read
router.patch("/read-all", auth, markAllAsRead);

// Delete single notification
router.delete("/:notificationId", auth, deleteNotification);

// Clear all notifications
router.delete("/", auth, clearAllNotifications);

// Get notification preferences
router.get("/preferences", auth, getPreferences);

// Update notification preferences
router.put("/preferences", auth, updatePreferences);

/* ================= ADMIN ROUTES ================= */

// Get notification stats (enhanced)
router.get("/admin/stats", adminAuth, getNotificationStats);

// Get categories
router.get("/admin/categories", adminAuth, getCategories);

// Template management
router.get("/admin/templates", adminAuth, getTemplates);
router.post("/admin/templates", adminAuth, createTemplate);
router.put("/admin/templates/:templateId", adminAuth, updateTemplate);
router.delete("/admin/templates/:templateId", adminAuth, deleteTemplate);

// Presets management
router.get("/admin/presets", adminAuth, getPresets);

// Send notification to single user
router.post("/admin/send", adminAuth, sendToUser);

// Bulk send to multiple users
router.post("/admin/bulk-send", adminAuth, bulkSend);

// Campaign management
router.get("/admin/campaigns", adminAuth, getCampaigns);
router.post("/admin/campaigns", adminAuth, createCampaign);
router.post("/admin/campaigns/:campaignId/send", adminAuth, sendCampaign);

export default router;