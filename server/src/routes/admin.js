
// server/src/routes/admin.js

import express from "express";
import { adminAuth } from "../middleware/adminAuth.js";
import { db } from "../db/index.js";

const router = express.Router();

// 🔐 Protect all admin routes
router.use(adminAuth);

/* ================= DASHBOARD STATS ================= */
router.get("/stats", async (req, res) => {
  try {
    console.log("📊 Fetching dashboard stats...");
    
    const [[{ total_users }]] = await db.execute("SELECT COUNT(*) as total_users FROM users");
    const [[{ active_users }]] = await db.execute("SELECT COUNT(*) as active_users FROM users WHERE is_active = TRUE");
    const [[{ new_today }]] = await db.execute("SELECT COUNT(*) as new_today FROM users WHERE DATE(created_at) = CURDATE()");
    const [[{ new_week }]] = await db.execute("SELECT COUNT(*) as new_week FROM users WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)");
    const [[{ total_collections }]] = await db.execute("SELECT COUNT(*) as total_collections FROM user_collections");
    const [[{ verified_users }]] = await db.execute("SELECT COUNT(*) as verified_users FROM users WHERE is_verified = TRUE");

    const stats = {
      totalUsers: total_users,
      activeUsers: active_users,
      newToday: new_today,
      newThisWeek: new_week,
      totalCollections: total_collections,
      verifiedUsers: verified_users,
      growthRate: total_users > 0 ? ((new_week / total_users) * 100).toFixed(2) : 0
    };

    // console.log("✅ Stats fetched:", stats);
    res.json(stats);
  } catch (err) {
    // console.error("❌ STATS ERROR:", err);
    res.status(500).json({ 
      message: "Failed to fetch stats",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

/* ================= USERS LIST (pagination & filters) ================= */
router.get("/users", async (req, res) => {
  try {
      // console.log("👥 Fetching users with params:", req.query);
    
    let { page = 1, limit = 10, search = "", role = "", status = "", verified = "" } = req.query;

    // Convert page & limit to integers and validate
    page = parseInt(page, 10);
    limit = parseInt(limit, 10);
    
    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(limit) || limit < 1 || limit > 100) limit = 10;

    const offset = (page - 1) * limit;

    const whereConditions = [];
    const queryParams = [];

    if (search && search.trim()) {
      whereConditions.push("(username LIKE ? OR email LIKE ?)");
      queryParams.push(`%${search.trim()}%`, `%${search.trim()}%`);
    }
    if (role && role.trim()) {
      whereConditions.push("role = ?");
      queryParams.push(role.trim());
    }
    if (status === "active") {
      whereConditions.push("is_active = TRUE");
    } else if (status === "inactive") {
      whereConditions.push("is_active = FALSE");
    }
    if (verified === "true") {
      whereConditions.push("is_verified = TRUE");
    } else if (verified === "false") {
      whereConditions.push("is_verified = FALSE");
    }

    const whereClause = whereConditions.length ? `WHERE ${whereConditions.join(" AND ")}` : "";

    // Total users count
    const countQuery = `SELECT COUNT(*) as total FROM users ${whereClause}`;
    // console.log("📝 Count Query:", countQuery);
    // console.log("📝 Count Params:", queryParams);
    
    const [[{ total }]] = await db.execute(countQuery, queryParams);
    console.log(`📊 Total users matching criteria: ${total}`);

    // Paginated users - Use db.query instead of db.execute for LIMIT/OFFSET
    const userQuery = `
      SELECT id, username, email, role, provider, is_verified, is_active, 
             created_at, updated_at, about_me
      FROM users
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;
    
    // console.log("📝 User Query:", userQuery);
    // console.log("📝 User Query Params:", queryParams); 
    
    const [users] = await db.query(userQuery, queryParams);
    // console.log(`✅ Found ${users.length} users`);

    const response = {
      users,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };

    res.json(response);
  } catch (err) {
    console.error("❌ GET USERS ERROR:", err);
    res.status(500).json({ 
      message: "Failed to fetch users",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
});

/* ================= GET SINGLE USER ================= */
router.get("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
      // console.log(`👤 Fetching user ${id}`);

    const [users] = await db.execute(
      `SELECT id, username, email, role, provider, is_verified, is_active, created_at, updated_at,
        about_me, interests, avatar, failed_login_attempts, lock_until
       FROM users WHERE id = ?`,
      [id]
    );

    if (!users.length) {
      // console.log(`❌ User ${id} not found`);
      return res.status(404).json({ message: "User not found" });
    }

    //  FIX #1: Get collections count with proper error handling
    let collection_count = 0;
    try {
      const [[collectionResult]] = await db.execute(
        "SELECT COUNT(*) as collection_count FROM user_collections WHERE user_id = ?",
        [id]
      );
      collection_count = collectionResult?.collection_count || 0;
      // console.log(`📚 User ${id} has ${collection_count} collections`);
    } catch (e) {
      console.warn("⚠️ Failed to fetch collections:", e.message);
    }

    //  FIX #2: Get activities count with proper error handling
    let activity_count = 0;
    try {
      const [[activityResult]] = await db.execute(
        "SELECT COUNT(*) as activity_count FROM user_activity_log WHERE user_id = ?",
        [id]
      );
      activity_count = activityResult?.activity_count || 0;
      // console.log(`🎮 User ${id} has ${activity_count} activities`);
    } catch (e) {
      console.warn("⚠️ Failed to fetch activities:", e.message);
    }

    const userData = {
      ...users[0],
      stats: { 
        collections: collection_count,
        activities: activity_count 
      }
    };

      // console.log(`✅ User ${id} fetched successfully with stats:`, userData.stats);
    res.json(userData);
  } catch (err) {
    console.error("❌ GET USER ERROR:", err);
    res.status(500).json({ 
      message: "Failed to fetch user",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

/* ================= UPDATE USER ================= */
router.put("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, role, is_verified, is_active, about_me } = req.body;
    
      // console.log(`✏️ Updating user ${id}:`, req.body);

    const [existing] = await db.execute("SELECT id, provider FROM users WHERE id = ?", [id]);
    if (!existing.length) {
      // console.log(`❌ User ${id} not found`);
      return res.status(404).json({ message: "User not found" });
    }

    //  FIX #3: Prevent email change for OAuth users
    if (existing[0].provider === 'google' && email && email !== existing[0].email) {
      // console.log(`❌ Cannot change email for Google OAuth user ${id}`);
      return res.status(400).json({ 
        message: "Cannot change email for Google authenticated users" 
      });
    }

    const updateFields = [];
    const params = [];

    if (username !== undefined) { updateFields.push("username = ?"); params.push(username); }
    if (email !== undefined && existing[0].provider !== 'google') { 
      updateFields.push("email = ?"); 
      params.push(email); 
    }
    if (role !== undefined) { updateFields.push("role = ?"); params.push(role); }
    if (is_verified !== undefined) { updateFields.push("is_verified = ?"); params.push(is_verified); }
    if (is_active !== undefined) { updateFields.push("is_active = ?"); params.push(is_active); }
    if (about_me !== undefined) { updateFields.push("about_me = ?"); params.push(about_me); }

    if (!updateFields.length) {
      return res.status(400).json({ message: "No fields to update" });
    }

    params.push(id);

    await db.execute(`UPDATE users SET ${updateFields.join(", ")} WHERE id = ?`, params);
     console.log(`✅ User ${id} updated successfully`);
    res.json({ message: "User updated successfully" });
  } catch (err) {
    console.error("❌ UPDATE USER ERROR:", err);
    res.status(500).json({ 
      message: "Failed to update user",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

/* ================= TOGGLE USER STATUS ================= */
router.patch("/users/:id/toggle", async (req, res) => {
  try {
    const { id } = req.params;
       // console.log(`🔄 Toggling status for user ${id}`);
    
    await db.execute("UPDATE users SET is_active = NOT is_active WHERE id = ?", [id]);
    // console.log(`✅ User ${id} status toggled`);
    res.json({ message: "User status updated" });
  } catch (err) {
    console.error("❌ TOGGLE USER ERROR:", err);
    res.status(500).json({ 
      message: "Failed to toggle user status",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

/* ================= DELETE USER ================= */
router.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
       // console.log(`🗑️ Deleting user ${id}`);
    
    const [existing] = await db.execute("SELECT id FROM users WHERE id = ?", [id]);
    if (!existing.length) {
      // console.log(`❌ User ${id} not found`);
      return res.status(404).json({ message: "User not found" });
    }

    await db.execute("DELETE FROM users WHERE id = ?", [id]);
    console.log(`✅ User ${id} deleted`);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("❌ DELETE USER ERROR:", err);
    res.status(500).json({ 
      message: "Failed to delete user",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

/* ================= USER GROWTH ================= */
router.get("/analytics/user-growth", async (req, res) => {
  try {
    let { days = 30 } = req.query;
    days = parseInt(days, 10) || 30;
    
      console.log(`📈 Fetching user growth for ${days} days`);

    const [growth] = await db.execute(
      `SELECT DATE(created_at) as date, COUNT(*) as count
       FROM users
       WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
       GROUP BY DATE(created_at)
       ORDER BY date ASC`,
      [days]
    );

      console.log(`✅ Growth data fetched: ${growth.length} data points`);
    res.json(growth);
  } catch (err) {
    console.error("❌ USER GROWTH ERROR:", err);
    res.status(500).json({ 
      message: "Failed to fetch user growth data",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

/* ================= PROVIDER DISTRIBUTION ================= */
router.get("/analytics/providers", async (req, res) => {
  try {
      // console.log("📊 Fetching provider distribution");
    
    const [providers] = await db.execute(
      `SELECT provider, COUNT(*) as count
       FROM users
       GROUP BY provider`
    );
    
    // console.log(`✅ Provider data fetched: ${providers.length} providers`);
    res.json(providers);
  } catch (err) {
    console.error("❌ PROVIDER STATS ERROR:", err);
    res.status(500).json({ 
      message: "Failed to fetch provider stats",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

export default router;