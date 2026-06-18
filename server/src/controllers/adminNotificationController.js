
// server/src/controllers/adminNotificationController.js - COMPLETE FIXED VERSION

import { db } from "../db/index.js";
import { createNotification } from "./notificationController.js";

/* ================= GET ALL NOTIFICATION TEMPLATES ================= */
export async function getTemplates(req, res) {
  try {
    const { category, featured } = req.query;
    
    let query = `
      SELECT t.*, u.username as created_by_username,
             COALESCE(t.usage_count, 0) as usage_count
      FROM notification_templates t
      LEFT JOIN users u ON t.created_by = u.id
    `;
    
    const conditions = [];
    const params = [];
    
    if (category) {
      conditions.push('t.category = ?');
      params.push(category);
    }
    
    if (featured === 'true') {
      conditions.push('t.is_featured = TRUE');
    }
    
    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }
    
    query += ' ORDER BY t.is_featured DESC, t.usage_count DESC, t.created_at DESC';

    const [templates] = await db.execute(query, params);

    //  FIX: Safely parse variables
    const parsedTemplates = templates.map(t => ({
      ...t,
      variables: t.variables 
        ? (typeof t.variables === 'string' ? JSON.parse(t.variables) : t.variables)
        : []
    }));

    res.json(parsedTemplates);

  } catch (err) {
    console.error("GET TEMPLATES ERROR:", err);
    res.status(500).json({ message: "Failed to fetch templates" });
  }
}

/* ================= CREATE TEMPLATE ================= */
export async function createTemplate(req, res) {
  try {
    const adminId = req.admin.id;
    const { 
      name, type, title, message, variables, category, 
      image_url, is_featured 
    } = req.body;

    if (!name || !type || !title || !message) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const [result] = await db.execute(
      `INSERT INTO notification_templates 
       (name, type, title, message, variables, category, image_url, is_featured, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name, type, title, message,
        variables ? JSON.stringify(variables) : null,
        category || 'info',
        image_url || null,
        is_featured || false,
        adminId
      ]
    );

    res.status(201).json({
      message: "Template created successfully",
      templateId: result.insertId
    });

  } catch (err) {
    console.error("CREATE TEMPLATE ERROR:", err);
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: "Template name already exists" });
    }
    res.status(500).json({ message: "Failed to create template" });
  }
}

/* ================= UPDATE TEMPLATE ================= */
export async function updateTemplate(req, res) {
  try {
    const { templateId } = req.params;
    const { 
      name, type, title, message, variables, category, 
      image_url, is_active, is_featured 
    } = req.body;

    const updateFields = [];
    const params = [];

    if (name !== undefined) { updateFields.push("name = ?"); params.push(name); }
    if (type !== undefined) { updateFields.push("type = ?"); params.push(type); }
    if (title !== undefined) { updateFields.push("title = ?"); params.push(title); }
    if (message !== undefined) { updateFields.push("message = ?"); params.push(message); }
    if (variables !== undefined) {
      updateFields.push("variables = ?");
      params.push(JSON.stringify(variables));
    }
    if (category !== undefined) { updateFields.push("category = ?"); params.push(category); }
    if (image_url !== undefined) { updateFields.push("image_url = ?"); params.push(image_url); }
    if (is_active !== undefined) { updateFields.push("is_active = ?"); params.push(is_active); }
    if (is_featured !== undefined) { updateFields.push("is_featured = ?"); params.push(is_featured); }

    if (updateFields.length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    params.push(templateId);

    await db.execute(
      `UPDATE notification_templates SET ${updateFields.join(", ")} WHERE id = ?`,
      params
    );

    res.json({ message: "Template updated successfully" });

  } catch (err) {
    console.error("UPDATE TEMPLATE ERROR:", err);
    res.status(500).json({ message: "Failed to update template" });
  }
}

/* ================= DELETE TEMPLATE ================= */
export async function deleteTemplate(req, res) {
  try {
    const { templateId } = req.params;

    await db.execute("DELETE FROM notification_templates WHERE id = ?", [templateId]);

    res.json({ message: "Template deleted successfully" });

  } catch (err) {
    console.error("DELETE TEMPLATE ERROR:", err);
    res.status(500).json({ message: "Failed to delete template" });
  }
}

/* ================= GET NOTIFICATION PRESETS ================= */
export async function getPresets(req, res) {
  try {
    const [presets] = await db.execute(
      `SELECT p.*, u.username as created_by_username
       FROM notification_presets p
       LEFT JOIN users u ON p.created_by = u.id
       ORDER BY p.usage_count DESC, p.name ASC`
    );

    res.json(presets);

  } catch (err) {
    console.error("GET PRESETS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch presets" });
  }
}

/* ================= SEND NOTIFICATION TO SINGLE USER ================= */
export async function sendToUser(req, res) {
  try {
    const { 
      userId, type, title, message, actionUrl, actionText, 
      priority, imageUrl, expiresAt, scheduledFor 
    } = req.body;

    if (!userId || !type || !title || !message) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // If scheduled, add to queue
    if (scheduledFor) {
      await db.execute(
        `INSERT INTO notification_queue 
         (target_user_ids, title, message, type, image_url, action_url, action_text, priority, scheduled_for)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          JSON.stringify([userId]),
          title, message, type, imageUrl || null,
          actionUrl || null, actionText || null,
          priority || 'normal', scheduledFor
        ]
      );

      return res.json({
        message: "Notification scheduled successfully",
        scheduledFor
      });
    }

    // Send immediately
    const notificationId = await createNotification({
      userId,
      type,
      title,
      message,
      actionUrl,
      actionText,
      priority: priority || 'normal',
      expiresAt,
      metadata: { imageUrl: imageUrl || null }
    });

    res.json({
      message: "Notification sent successfully",
      notificationId
    });

  } catch (err) {
    console.error("SEND TO USER ERROR:", err);
    res.status(500).json({ message: "Failed to send notification" });
  }
}

/* ================= BULK SEND (Quick send to multiple users) ================= */
export async function bulkSend(req, res) {
  try {
    const { userIds, type, title, message, actionUrl, actionText, priority } = req.body;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ message: "User IDs array is required" });
    }

    if (!type || !title || !message) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    let sentCount = 0;
    let failedCount = 0;

    for (const userId of userIds) {
      try {
        await createNotification({
          userId,
          type,
          title,
          message,
          actionUrl,
          actionText,
          priority: priority || 'normal'
        });
        sentCount++;
      } catch (err) {
        console.error(`Failed to send to user ${userId}:`, err);
        failedCount++;
      }
    }

    res.json({
      message: "Bulk send completed",
      total: userIds.length,
      sent: sentCount,
      failed: failedCount
    });

  } catch (err) {
    console.error("BULK SEND ERROR:", err);
    res.status(500).json({ message: "Failed to send bulk notifications" });
  }
}

/* ================= CREATE CAMPAIGN (ENHANCED) ================= */
export async function createCampaign(req, res) {
  try {
    const adminId = req.admin.id;
    const {
      name, templateId, targetType, segmentType, targetCriteria,
      title, message, actionUrl, actionText, priority, imageUrl,
      scheduledAt, abTestEnabled, variantATitle, variantAMessage,
      variantBTitle, variantBMessage
    } = req.body;

    if (!name || !targetType || !title || !message) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const [result] = await db.execute(
      `INSERT INTO notification_campaigns
       (name, template_id, target_type, segment_type, target_criteria, 
        title, message, action_url, action_text, priority, image_url,
        scheduled_at, ab_test_enabled, variant_a_title, variant_a_message,
        variant_b_title, variant_b_message, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name, templateId || null, targetType, segmentType || 'all',
        targetCriteria ? JSON.stringify(targetCriteria) : null,
        title, message, actionUrl || null, actionText || null,
        priority || 'normal', imageUrl || null,
        scheduledAt || null,
        abTestEnabled || false,
        variantATitle || null, variantAMessage || null,
        variantBTitle || null, variantBMessage || null,
        adminId
      ]
    );

    res.status(201).json({
      message: "Campaign created successfully",
      campaignId: result.insertId
    });

  } catch (err) {
    console.error("CREATE CAMPAIGN ERROR:", err);
    res.status(500).json({ message: "Failed to create campaign" });
  }
}

/* ================= SEND CAMPAIGN (ENHANCED) ================= */
export async function sendCampaign(req, res) {
  try {
    const { campaignId } = req.params;

    // Get campaign details
    const [campaigns] = await db.execute(
      "SELECT * FROM notification_campaigns WHERE id = ?",
      [campaignId]
    );

    if (!campaigns.length) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    const campaign = campaigns[0];

    // Update status to sending
    await db.execute(
      "UPDATE notification_campaigns SET status = 'sending', started_at = NOW() WHERE id = ?",
      [campaignId]
    );

    // Get target users based on segment type
    let targetUsers = [];

    switch (campaign.segment_type || campaign.target_type) {
      case 'all':
      case 'all_users':
        const [allUsers] = await db.execute(
          "SELECT id FROM users WHERE is_active = TRUE"
        );
        targetUsers = allUsers.map(u => u.id);
        break;

      case 'active':
      case 'active_users':
        const [activeUsers] = await db.execute(
          `SELECT DISTINCT u.id FROM users u
           INNER JOIN user_activity_log a ON u.id = a.user_id
           WHERE u.is_active = TRUE 
           AND a.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)`
        );
        targetUsers = activeUsers.map(u => u.id);
        break;

      case 'inactive':
        const [inactiveUsers] = await db.execute(
          `SELECT u.id FROM users u
           LEFT JOIN user_activity_log a ON u.id = a.user_id 
           AND a.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
           WHERE u.is_active = TRUE AND a.id IS NULL`
        );
        targetUsers = inactiveUsers.map(u => u.id);
        break;

      case 'new':
        const [newUsers] = await db.execute(
          `SELECT id FROM users 
           WHERE is_active = TRUE 
           AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)`
        );
        targetUsers = newUsers.map(u => u.id);
        break;

      case 'returning':
        const [returningUsers] = await db.execute(
          `SELECT DISTINCT u.id FROM users u
           INNER JOIN user_activity_log a ON u.id = a.user_id
           WHERE u.is_active = TRUE 
           AND u.created_at < DATE_SUB(NOW(), INTERVAL 30 DAY)
           AND a.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)`
        );
        targetUsers = returningUsers.map(u => u.id);
        break;

      case 'high_engagement':
        const [engagedUsers] = await db.execute(
          `SELECT user_id as id, COUNT(*) as activity_count
           FROM user_activity_log
           WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
           GROUP BY user_id
           HAVING activity_count > 20
           ORDER BY activity_count DESC`
        );
        targetUsers = engagedUsers.map(u => u.id);
        break;

      case 'verified_users':
        const [verifiedUsers] = await db.execute(
          "SELECT id FROM users WHERE is_verified = TRUE AND is_active = TRUE"
        );
        targetUsers = verifiedUsers.map(u => u.id);
        break;

      case 'role':
      case 'custom':
        const criteria = JSON.parse(campaign.target_criteria || '{}');
        if (criteria.role) {
          const [roleUsers] = await db.execute(
            "SELECT id FROM users WHERE role = ? AND is_active = TRUE",
            [criteria.role]
          );
          targetUsers = roleUsers.map(u => u.id);
        } else if (criteria.userIds) {
          targetUsers = criteria.userIds;
        }
        break;

      case 'specific_users':
        const specificCriteria = JSON.parse(campaign.target_criteria || '{}');
        targetUsers = specificCriteria.userIds || [];
        break;
    }

    // Send notifications with A/B testing if enabled
    let sentCount = 0;
    let failedCount = 0;
    let variantACount = 0;
    let variantBCount = 0;

    for (const userId of targetUsers) {
      try {
        let notifTitle = campaign.title;
        let notifMessage = campaign.message;

        // A/B testing logic
        if (campaign.ab_test_enabled && campaign.variant_a_title && campaign.variant_b_title) {
          const useVariantA = Math.random() < 0.5;
          if (useVariantA) {
            notifTitle = campaign.variant_a_title;
            notifMessage = campaign.variant_a_message;
            variantACount++;
          } else {
            notifTitle = campaign.variant_b_title;
            notifMessage = campaign.variant_b_message;
            variantBCount++;
          }
        }

        await createNotification({
          userId,
          type: 'admin_announcement',
          title: notifTitle,
          message: notifMessage,
          actionUrl: campaign.action_url,
          actionText: campaign.action_text,
          priority: campaign.priority,
          metadata: { 
            campaignId: campaign.id,
            imageUrl: campaign.image_url 
          }
        });
        
        sentCount++;
      } catch (err) {
        console.error(`Failed to send notification to user ${userId}:`, err);
        failedCount++;
      }
    }

    // Update campaign status
    const updateQuery = campaign.ab_test_enabled
      ? `UPDATE notification_campaigns 
         SET status = 'completed', completed_at = NOW(),
             total_recipients = ?, sent_count = ?, failed_count = ?,
             variant_a_count = ?, variant_b_count = ?
         WHERE id = ?`
      : `UPDATE notification_campaigns 
         SET status = 'completed', completed_at = NOW(),
             total_recipients = ?, sent_count = ?, failed_count = ?
         WHERE id = ?`;

    const params = campaign.ab_test_enabled
      ? [targetUsers.length, sentCount, failedCount, variantACount, variantBCount, campaignId]
      : [targetUsers.length, sentCount, failedCount, campaignId];

    await db.execute(updateQuery, params);

    res.json({
      message: "Campaign sent successfully",
      totalRecipients: targetUsers.length,
      sentCount,
      failedCount,
      ...(campaign.ab_test_enabled && {
        variantACount,
        variantBCount
      })
    });

  } catch (err) {
    console.error("SEND CAMPAIGN ERROR:", err);
    
    await db.execute(
      "UPDATE notification_campaigns SET status = 'failed' WHERE id = ?",
      [req.params.campaignId]
    );

    res.status(500).json({ message: "Failed to send campaign" });
  }
}

/* ================= GET ALL CAMPAIGNS ================= */
export async function getCampaigns(req, res) {
  try {
    const { status, segment_type } = req.query;
    
    let query = `
      SELECT c.*, u.username as created_by_username
      FROM notification_campaigns c
      LEFT JOIN users u ON c.created_by = u.id
    `;
    
    const conditions = [];
    const params = [];
    
    if (status) {
      conditions.push('c.status = ?');
      params.push(status);
    }
    
    if (segment_type) {
      conditions.push('c.segment_type = ?');
      params.push(segment_type);
    }
    
    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }
    
    query += ' ORDER BY c.created_at DESC';

    const [campaigns] = await db.execute(query, params);

    //  FIX: Safely parse target_criteria
    const parsedCampaigns = campaigns.map(c => ({
      ...c,
      target_criteria: c.target_criteria 
        ? (typeof c.target_criteria === 'string' ? JSON.parse(c.target_criteria) : c.target_criteria)
        : null
    }));

    res.json(parsedCampaigns);

  } catch (err) {
    console.error("GET CAMPAIGNS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch campaigns" });
  }
}

/* ================= GET NOTIFICATION STATS (ENHANCED) ================= */
export async function getNotificationStats(req, res) {
  try {
    // Total notifications sent
    const [[{ total_notifications }]] = await db.execute(
      "SELECT COUNT(*) as total_notifications FROM notifications"
    );

    // Unread notifications
    const [[{ unread_notifications }]] = await db.execute(
      "SELECT COUNT(*) as unread_notifications FROM notifications WHERE is_read = FALSE"
    );

    // Notifications sent today
    const [[{ sent_today }]] = await db.execute(
      "SELECT COUNT(*) as sent_today FROM notifications WHERE DATE(created_at) = CURDATE()"
    );

    // Notifications by type
    const [byType] = await db.execute(
      `SELECT type, COUNT(*) as count 
       FROM notifications 
       GROUP BY type 
       ORDER BY count DESC`
    );

    // Campaign stats
    const [[{ total_campaigns }]] = await db.execute(
      "SELECT COUNT(*) as total_campaigns FROM notification_campaigns"
    );

    const [[{ active_campaigns }]] = await db.execute(
      "SELECT COUNT(*) as active_campaigns FROM notification_campaigns WHERE status IN ('scheduled', 'sending')"
    );

    const [[{ completed_campaigns }]] = await db.execute(
      "SELECT COUNT(*) as completed_campaigns FROM notification_campaigns WHERE status = 'completed'"
    );

    // Engagement metrics
    const [[{ avg_open_rate }]] = await db.execute(
      `SELECT ROUND(AVG(open_rate), 2) as avg_open_rate 
       FROM notification_campaigns 
       WHERE status = 'completed' AND open_rate IS NOT NULL`
    );

    const [[{ avg_click_rate }]] = await db.execute(
      `SELECT ROUND(AVG(click_rate), 2) as avg_click_rate 
       FROM notification_campaigns 
       WHERE status = 'completed' AND click_rate IS NOT NULL`
    );

    // Recent activity
    const [recentActivity] = await db.execute(
      `SELECT DATE(created_at) as date, COUNT(*) as count
       FROM notifications
       WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
       GROUP BY DATE(created_at)
       ORDER BY date DESC`
    );

    // Scheduled notifications
    const [[{ scheduled_count }]] = await db.execute(
      "SELECT COUNT(*) as scheduled_count FROM notification_queue WHERE status = 'pending'"
    );

    res.json({
      totalNotifications: total_notifications,
      unreadNotifications: unread_notifications,
      sentToday: sent_today,
      notificationsByType: byType,
      totalCampaigns: total_campaigns,
      activeCampaigns: active_campaigns,
      completedCampaigns: completed_campaigns,
      scheduledNotifications: scheduled_count,
      engagement: {
        averageOpenRate: avg_open_rate || 0,
        averageClickRate: avg_click_rate || 0
      },
      recentActivity
    });

  } catch (err) {
    console.error("GET NOTIFICATION STATS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch notification stats" });
  }
}

/* ================= GET NOTIFICATION CATEGORIES ================= */
export async function getCategories(req, res) {
  try {
    const [categories] = await db.execute(
      `SELECT * FROM notification_categories 
       WHERE is_active = TRUE 
       ORDER BY display_order ASC`
    );

    res.json(categories);

  } catch (err) {
    console.error("GET CATEGORIES ERROR:", err);
    res.status(500).json({ message: "Failed to fetch categories" });
  }
}