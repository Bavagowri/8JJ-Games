// =====================================================
// FILE: server/src/routes/leaderboard.js
// Complete Leaderboard Routes
// =====================================================

// import express from 'express';
// import { auth } from '../middleware/auth.js';
// import { db } from '../db.js';

// const router = express.Router();

// console.log('✅ Leaderboard routes loading...');

// /**
//  * GET /api/leaderboard
//  * Get leaderboard data with various filters
//  * Query params:
//  * - period: all-time (default), weekly, monthly, daily
//  * - tab: global (default), friends, country
//  * - limit: number of results (default 100)
//  */
// router.get('/', auth, async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { period = 'weekly', tab = 'global', limit = 100 } = req.query;
    
//     console.log(`📊 Leaderboard request - User: ${userId}, Period: ${period}, Tab: ${tab}`);

//     let leaderboardData = [];
//     let currentUserData = null;

//     // Build the base query based on period
//     let dateFilter = '';
//     switch (period) {
//       case 'daily':
//         dateFilter = 'AND DATE(ual.created_at) = CURDATE()';
//         break;
//       case 'weekly':
//         dateFilter = 'AND YEARWEEK(ual.created_at, 1) = YEARWEEK(CURDATE(), 1)';
//         break;
//       case 'monthly':
//         dateFilter = 'AND YEAR(ual.created_at) = YEAR(CURDATE()) AND MONTH(ual.created_at) = MONTH(CURDATE())';
//         break;
//       case 'all-time':
//       default:
//         dateFilter = '';
//         break;
//     }

//     // Global leaderboard
//     if (tab === 'global') {
//       const [rows] = await db.query(`
//         SELECT 
//           u.id as userId,
//           u.username,
//           u.avatar,
//           u.country,
//           COALESCE(up.total_points, u.points, 0) as score,
//           COALESCE(up.current_tier, u.tier, 'Bronze') as tier,
//           COALESCE(up.current_level, u.level, 1) as level
//         FROM users u
//         LEFT JOIN user_points up ON u.id = up.user_id
//         WHERE u.is_active = TRUE
//           AND u.role = 'user'
//         ORDER BY score DESC
//         LIMIT ?
//       `, [parseInt(limit)]);

//       leaderboardData = rows.map((row, index) => ({
//         ...row,
//         rank: index + 1,
//         change: 0 // Will be calculated if you store previous rankings
//       }));

//       // Find current user's position
//       const userIndex = leaderboardData.findIndex(p => p.userId === userId);
//       if (userIndex !== -1) {
//         currentUserData = leaderboardData[userIndex];
//       } else {
//         // User not in top results, fetch their actual rank
//         const [userRank] = await db.query(`
//           SELECT COUNT(*) + 1 as rank
//           FROM users u
//           LEFT JOIN user_points up ON u.id = up.user_id
//           WHERE COALESCE(up.total_points, u.points, 0) > (
//             SELECT COALESCE(up2.total_points, u2.points, 0)
//             FROM users u2
//             LEFT JOIN user_points up2 ON u2.id = up2.user_id
//             WHERE u2.id = ?
//           )
//           AND u.is_active = TRUE
//           AND u.role = 'user'
//         `, [userId]);

//         const [userData] = await db.query(`
//           SELECT 
//             u.id as userId,
//             u.username,
//             u.avatar,
//             COALESCE(up.total_points, u.points, 0) as score,
//             COALESCE(up.current_tier, u.tier, 'Bronze') as tier,
//             COALESCE(up.current_level, u.level, 1) as level
//           FROM users u
//           LEFT JOIN user_points up ON u.id = up.user_id
//           WHERE u.id = ?
//         `, [userId]);

//         if (userData.length > 0) {
//           currentUserData = {
//             ...userData[0],
//             rank: userRank[0].rank,
//             change: 0
//           };
//         }
//       }
//     }

//     // Friends leaderboard
//     else if (tab === 'friends') {
//       // Get user's friends (users they referred or who referred them)
//       const [rows] = await db.query(`
//         SELECT DISTINCT
//           u.id as userId,
//           u.username,
//           u.avatar,
//           COALESCE(up.total_points, u.points, 0) as score,
//           COALESCE(up.current_tier, u.tier, 'Bronze') as tier,
//           COALESCE(up.current_level, u.level, 1) as level
//         FROM users u
//         LEFT JOIN user_points up ON u.id = up.user_id
//         WHERE (u.referred_by = ? OR u.id IN (
//           SELECT id FROM users WHERE referred_by = ?
//         ))
//         AND u.is_active = TRUE AND u.role = 'user'
//         ORDER BY score DESC
//         LIMIT ?
//       `, [userId, userId, parseInt(limit)]);

//       leaderboardData = rows.map((row, index) => ({
//         ...row,
//         rank: index + 1,
//         change: 0
//       }));

//       // Add current user if not already in list
//       const userInList = leaderboardData.find(p => p.userId === userId);
//       if (!userInList) {
//         const [userData] = await db.query(`
//           SELECT 
//             u.id as userId,
//             u.username,
//             u.avatar,
//             COALESCE(up.total_points, u.points, 0) as score,
//             COALESCE(up.current_tier, u.tier, 'Bronze') as tier,
//             COALESCE(up.current_level, u.level, 1) as level
//           FROM users u
//           LEFT JOIN user_points up ON u.id = up.user_id
//           WHERE u.id = ?
//         `, [userId]);

//         if (userData.length > 0) {
//           currentUserData = {
//             ...userData[0],
//             rank: leaderboardData.length + 1,
//             change: 0
//           };
//         }
//       } else {
//         currentUserData = userInList;
//       }
//     }

//     // Country leaderboard
//     else if (tab === 'country') {
//       // First, get the user's country
//       const [userCountry] = await db.query(
//         'SELECT country FROM users WHERE id = ?',
//         [userId]
//       );

//       const country = userCountry[0]?.country || 'LK';

//       const [rows] = await db.query(`
//         SELECT 
//           u.id as userId,
//           u.username,
//           u.avatar,
//           u.country,
//           COALESCE(up.total_points, u.points, 0) as score,
//           COALESCE(up.current_tier, u.tier, 'Bronze') as tier,
//           COALESCE(up.current_level, u.level, 1) as level
//         FROM users u
//         LEFT JOIN user_points up ON u.id = up.user_id
//         WHERE u.country = ? AND u.is_active = TRUE AND u.role = 'user'
//         ORDER BY score DESC
//         LIMIT ?
//       `, [country, parseInt(limit)]);

//       leaderboardData = rows.map((row, index) => ({
//         ...row,
//         rank: index + 1,
//         change: 0
//       }));

//       const userIndex = leaderboardData.findIndex(p => p.userId === userId);
//       if (userIndex !== -1) {
//         currentUserData = leaderboardData[userIndex];
//       } else {
//         const [userRank] = await db.query(`
//           SELECT COUNT(*) + 1 as rank
//           FROM users u
//           LEFT JOIN user_points up ON u.id = up.user_id
//           WHERE u.country = ?
//           AND COALESCE(up.total_points, u.points, 0) > (
//             SELECT COALESCE(up2.total_points, u2.points, 0)
//             FROM users u2
//             LEFT JOIN user_points up2 ON u2.id = up2.user_id
//             WHERE u2.id = ?
//           )
//           AND u.is_active = TRUE
//           AND u.role = 'user'
//         `, [country, userId]);

//         const [userData] = await db.query(`
//           SELECT 
//             u.id as userId,
//             u.username,
//             u.avatar,
//             COALESCE(up.total_points, u.points, 0) as score,
//             COALESCE(up.current_tier, u.tier, 'Bronze') as tier,
//             COALESCE(up.current_level, u.level, 1) as level
//           FROM users u
//           LEFT JOIN user_points up ON u.id = up.user_id
//           WHERE u.id = ?
//         `, [userId]);

//         if (userData.length > 0) {
//           currentUserData = {
//             ...userData[0],
//             rank: userRank[0].rank,
//             change: 0
//           };
//         }
//       }
//     }

//     // Get total player count
//     const [totalCount] = await db.query(
//       'SELECT COUNT(*) as total FROM users WHERE is_active = TRUE'
//     );

//     return res.status(200).json({
//       success: true,
//       data: leaderboardData,
//       currentUser: currentUserData,
//       meta: {
//         total: totalCount[0].total,
//         period,
//         tab,
//         limit: parseInt(limit)
//       }
//     });

//   } catch (error) {
//     console.error('❌ Leaderboard error:', error);
//     return res.status(500).json({
//       success: false,
//       message: 'Failed to fetch leaderboard',
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// });

// /**
//  * GET /api/leaderboard/user/:userId
//  * Get specific user's leaderboard position
//  */
// router.get('/user/:userId', auth, async (req, res) => {
//   try {
//     const { userId } = req.params;
    
//     const [userRank] = await db.query(`
//       SELECT COUNT(*) + 1 as rank
//       FROM users u
//       LEFT JOIN user_points up ON u.id = up.user_id
//       WHERE COALESCE(up.total_points, u.points, 0) > (
//         SELECT COALESCE(up2.total_points, u2.points, 0)
//         FROM users u2
//         LEFT JOIN user_points up2 ON u2.id = up2.user_id
//         WHERE u2.id = ?
//       )
//       AND u.is_active = TRUE
//       AND u.role = 'user'
//     `, [userId]);

//     const [userData] = await db.query(`
//       SELECT 
//         u.id as userId,
//         u.username,
//         u.avatar,
//         COALESCE(up.total_points, u.points, 0) as score,
//         COALESCE(up.current_tier, u.tier, 'Bronze') as tier,
//         COALESCE(up.current_level, u.level, 1) as level
//       FROM users u
//       LEFT JOIN user_points up ON u.id = up.user_id
//       WHERE u.id = ?
//     `, [userId]);

//     if (userData.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: 'User not found'
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       data: {
//         ...userData[0],
//         rank: userRank[0].rank
//       }
//     });

//   } catch (error) {
//     console.error('❌ User rank error:', error);
//     return res.status(500).json({
//       success: false,
//       message: 'Failed to fetch user rank'
//     });
//   }
// });

// console.log('✅ Leaderboard routes loaded successfully');

// export default router;

import express from "express";
import { auth } from "../middleware/auth.js";
import { db } from "../db/index.js";

const router = express.Router();

console.log("✅ Leaderboard routes loaded");

/**
 * GET /api/leaderboard
 * Query params:
 * - period: daily | weekly | monthly | all-time
 * - tab: global | friends | country
 * - limit: number (default 100)
 */
router.get("/", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { period = "weekly", tab = "global", limit = 100 } = req.query;

    console.log(`📊 Leaderboard → user=${userId}, period=${period}, tab=${tab}`);

    // -------------------------------
    // Period filter
    // -------------------------------
    let dateFilter = "";
    switch (period) {
      case "daily":
        dateFilter = "AND ual.created_at >= CURDATE()";
        break;
      case "weekly":
        dateFilter = "AND ual.created_at >= NOW() - INTERVAL 7 DAY";
        break;
      case "monthly":
        dateFilter = "AND ual.created_at >= NOW() - INTERVAL 30 DAY";
        break;
      case "all-time":
      default:
        dateFilter = "";
    }

    const scoreSelect =
      period === "all-time"
        ? "u.points"
        : "COALESCE(SUM(ual.points_awarded), 0)";

    let leaderboardData = [];
    let currentUser = null;

    // ======================================================
    // 🌍 GLOBAL LEADERBOARD
    // ======================================================
    if (tab === "global") {
      const [rows] = await db.query(
        `
        SELECT
          u.id AS userId,
          u.username,
          u.avatar,
          u.country,
          u.level,
          u.tier,
          ${scoreSelect} AS score
        FROM users u
        LEFT JOIN user_activity_log ual
          ON u.id = ual.user_id
          ${period !== "all-time" ? dateFilter : ""}
        WHERE u.is_active = 1
          AND u.role = 'user'
        GROUP BY u.id
        ORDER BY score DESC
        LIMIT ?
      `,
        [parseInt(limit)]
      );

      leaderboardData = rows.map((row, i) => ({
        ...row,
        score: Number(row.score),
        rank: i + 1,
        change: 0,
      }));

      currentUser = leaderboardData.find((u) => u.userId === userId) || null;
    }

    // ======================================================
    // 👥 FRIENDS LEADERBOARD
    // ======================================================
    else if (tab === "friends") {
      const [rows] = await db.query(
        `
        SELECT
          u.id AS userId,
          u.username,
          u.avatar,
          u.level,
          u.tier,
          ${scoreSelect} AS score
        FROM users u
        LEFT JOIN user_activity_log ual
          ON u.id = ual.user_id
          ${period !== "all-time" ? dateFilter : ""}
        WHERE (
          u.referred_by = ?
          OR u.id IN (SELECT id FROM users WHERE referred_by = ?)
        )
        AND u.is_active = 1
        AND u.role = 'user'
        GROUP BY u.id
        ORDER BY score DESC
        LIMIT ?
      `,
        [userId, userId, parseInt(limit)]
      );

      leaderboardData = rows.map((row, i) => ({
        ...row,
        score: Number(row.score),
        rank: i + 1,
        change: 0,
      }));

      currentUser = leaderboardData.find((u) => u.userId === userId) || null;
    }

    // ======================================================
    // 🌏 COUNTRY LEADERBOARD
    // ======================================================
    else if (tab === "country") {
      const [[userCountry]] = await db.query(
        "SELECT country FROM users WHERE id = ?",
        [userId]
      );

      if (!userCountry?.country) {
        return res.json({
          success: true,
          data: [],
          currentUser: null,
          meta: { period, tab, total: 0 },
        });
      }

      const [rows] = await db.query(
        `
        SELECT
          u.id AS userId,
          u.username,
          u.avatar,
          u.country,
          u.level,
          u.tier,
          ${scoreSelect} AS score
        FROM users u
        LEFT JOIN user_activity_log ual
          ON u.id = ual.user_id
          ${period !== "all-time" ? dateFilter : ""}
        WHERE u.country = ?
          AND u.is_active = 1
          AND u.role = 'user'
        GROUP BY u.id
        ORDER BY score DESC
        LIMIT ?
      `,
        [userCountry.country, parseInt(limit)]
      );

      leaderboardData = rows.map((row, i) => ({
        ...row,
        score: Number(row.score),
        rank: i + 1,
        change: 0,
      }));

      currentUser = leaderboardData.find((u) => u.userId === userId) || null;
    }

    // -------------------------------
    // Total players count
    // -------------------------------
    const [[count]] = await db.query(
      "SELECT COUNT(*) AS total FROM users WHERE is_active = 1 AND role = 'user'"
    );

    return res.json({
      success: true,
      data: leaderboardData,
      currentUser,
      meta: {
        total: count.total,
        period,
        tab,
        limit: parseInt(limit),
      },
    });
  } catch (err) {
    console.error("❌ Leaderboard error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to load leaderboard",
    });
  }
});

export default router;