// server/src/controllers/notificationController.js

import { db } from "../db/index.js";

/* ================= GET USER NOTIFICATIONS ================= */
export async function getUserNotifications(req, res) {
  try {
    const userId = req.user.id;
    const { 
      page = 1, 
      limit = 20, 
      type, 
      unread_only = false 
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    
    let whereConditions = ["user_id = ?"];
    let params = [userId];

    // Filter by type
    if (type && type !== 'all') {
      whereConditions.push("type = ?");
      params.push(type);
    }

    // Filter unread only
    if (unread_only === 'true') {
      whereConditions.push("is_read = FALSE");
    }

    // Don't show expired notifications
    whereConditions.push("(expires_at IS NULL OR expires_at > NOW())");

    const whereClause = `WHERE ${whereConditions.join(" AND ")}`;

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM notifications ${whereClause}`;
    const [[{ total }]] = await db.execute(countQuery, params);

    // Get notifications
    const query = `
      SELECT id, type, title, message, metadata, action_url, action_text,
             is_read, read_at, priority, created_at
      FROM notifications
      ${whereClause}
      ORDER BY 
        CASE priority
          WHEN 'urgent' THEN 1
          WHEN 'high' THEN 2
          WHEN 'normal' THEN 3
          WHEN 'low' THEN 4
        END,
        is_read ASC,
        created_at DESC
      LIMIT ? OFFSET ?
    `;

    const [notifications] = await db.query(query, [...params, parseInt(limit), offset]);

    //  FIX: Safely parse metadata - check if it's a string first
    const parsedNotifications = notifications.map(n => ({
      ...n,
      metadata: n.metadata 
        ? (typeof n.metadata === 'string' ? JSON.parse(n.metadata) : n.metadata)
        : null
    }));

    res.json({
      notifications: parsedNotifications,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (err) {
    console.error("GET NOTIFICATIONS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
}

/* ================= GET UNREAD COUNT ================= */
export async function getUnreadCount(req, res) {
  try {
    const userId = req.user.id;

    const [[{ count }]] = await db.execute(
      `SELECT COUNT(*) as count 
       FROM notifications 
       WHERE user_id = ? 
       AND is_read = FALSE 
       AND (expires_at IS NULL OR expires_at > NOW())`,
      [userId]
    );

    res.json({ count });

  } catch (err) {
    console.error("GET UNREAD COUNT ERROR:", err);
    res.status(500).json({ message: "Failed to get unread count" });
  }
}

/* ================= MARK AS READ ================= */
export async function markAsRead(req, res) {
  try {
    const userId = req.user.id;
    const { notificationId } = req.params;

    await db.execute(
      `UPDATE notifications 
       SET is_read = TRUE, read_at = NOW() 
       WHERE id = ? AND user_id = ?`,
      [notificationId, userId]
    );

    res.json({ message: "Notification marked as read" });

  } catch (err) {
    console.error("MARK AS READ ERROR:", err);
    res.status(500).json({ message: "Failed to mark notification as read" });
  }
}

/* ================= MARK ALL AS READ ================= */
export async function markAllAsRead(req, res) {
  try {
    const userId = req.user.id;

    await db.execute(
      `UPDATE notifications 
       SET is_read = TRUE, read_at = NOW() 
       WHERE user_id = ? AND is_read = FALSE`,
      [userId]
    );

    res.json({ message: "All notifications marked as read" });

  } catch (err) {
    console.error("MARK ALL AS READ ERROR:", err);
    res.status(500).json({ message: "Failed to mark all as read" });
  }
}

/* ================= DELETE NOTIFICATION ================= */
export async function deleteNotification(req, res) {
  try {
    const userId = req.user.id;
    const { notificationId } = req.params;

    await db.execute(
      "DELETE FROM notifications WHERE id = ? AND user_id = ?",
      [notificationId, userId]
    );

    res.json({ message: "Notification deleted" });

  } catch (err) {
    console.error("DELETE NOTIFICATION ERROR:", err);
    res.status(500).json({ message: "Failed to delete notification" });
  }
}

/* ================= CLEAR ALL NOTIFICATIONS ================= */
export async function clearAllNotifications(req, res) {
  try {
    const userId = req.user.id;

    await db.execute(
      "DELETE FROM notifications WHERE user_id = ?",
      [userId]
    );

    res.json({ message: "All notifications cleared" });

  } catch (err) {
    console.error("CLEAR ALL ERROR:", err);
    res.status(500).json({ message: "Failed to clear notifications" });
  }
}

/* ================= GET NOTIFICATION PREFERENCES ================= */
export async function getPreferences(req, res) {
  try {
    const userId = req.user.id;

    const [rows] = await db.execute(
      "SELECT * FROM user_notification_preferences WHERE user_id = ?",
      [userId]
    );

    if (!rows.length) {
      // Create default preferences
      await db.execute(
        `INSERT INTO user_notification_preferences (user_id) VALUES (?)`,
        [userId]
      );

      const [newRows] = await db.execute(
        "SELECT * FROM user_notification_preferences WHERE user_id = ?",
        [userId]
      );

      return res.json(newRows[0]);
    }

    res.json(rows[0]);

  } catch (err) {
    console.error("GET PREFERENCES ERROR:", err);
    res.status(500).json({ message: "Failed to fetch preferences" });
  }
}

/* ================= UPDATE NOTIFICATION PREFERENCES ================= */
export async function updatePreferences(req, res) {
  try {
    const userId = req.user.id;
    const {
      game_updates,
      new_games,
      level_up,
      achievements,
      community_events,
      email_notifications
    } = req.body;

    const updateFields = [];
    const params = [];

    if (game_updates !== undefined) {
      updateFields.push("game_updates = ?");
      params.push(game_updates);
    }
    if (new_games !== undefined) {
      updateFields.push("new_games = ?");
      params.push(new_games);
    }
    if (level_up !== undefined) {
      updateFields.push("level_up = ?");
      params.push(level_up);
    }
    if (achievements !== undefined) {
      updateFields.push("achievements = ?");
      params.push(achievements);
    }
    if (community_events !== undefined) {
      updateFields.push("community_events = ?");
      params.push(community_events);
    }
    if (email_notifications !== undefined) {
      updateFields.push("email_notifications = ?");
      params.push(email_notifications);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    params.push(userId);

    // Ensure preferences exist
    await db.execute(
      `INSERT INTO user_notification_preferences (user_id) 
       VALUES (?) 
       ON DUPLICATE KEY UPDATE user_id = user_id`,
      [userId]
    );

    // Update preferences
    await db.execute(
      `UPDATE user_notification_preferences 
       SET ${updateFields.join(", ")} 
       WHERE user_id = ?`,
      params
    );

    res.json({ message: "Preferences updated successfully" });

  } catch (err) {
    console.error("UPDATE PREFERENCES ERROR:", err);
    res.status(500).json({ message: "Failed to update preferences" });
  }
}

/* ================= CREATE NOTIFICATION (Helper function) ================= */
export async function createNotification({
  userId,
  type,
  title,
  message,
  metadata = null,
  actionUrl = null,
  actionText = null,
  priority = 'normal',
  expiresAt = null
}) {
  try {
    // Check if user has this notification type enabled
    const [prefs] = await db.execute(
      "SELECT * FROM user_notification_preferences WHERE user_id = ?",
      [userId]
    );

    if (prefs.length > 0) {
      const pref = prefs[0];
      
      // Map notification types to preference fields
      const prefMap = {
        'game_update': 'game_updates',
        'new_game': 'new_games',
        'level_up': 'level_up',
        'achievement': 'achievements',
        'community_event': 'community_events'
      };

      const prefField = prefMap[type];
      
      // If user has disabled this type, don't create notification
      if (prefField && !pref[prefField]) {
        console.log(`User ${userId} has disabled ${type} notifications`);
        return null;
      }
    }

    const [result] = await db.execute(
      `INSERT INTO notifications 
       (user_id, type, title, message, metadata, action_url, action_text, priority, expires_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        type,
        title,
        message,
        metadata ? JSON.stringify(metadata) : null,
        actionUrl,
        actionText,
        priority,
        expiresAt
      ]
    );

    return result.insertId;

  } catch (err) {
    console.error("CREATE NOTIFICATION ERROR:", err);
    throw err;
  }
}