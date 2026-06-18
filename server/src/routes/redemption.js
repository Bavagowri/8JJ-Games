// // =====================================================
// // FILE: server/src/routes/redemption.js
// // COMPLETE WORKING VERSION - All endpoints
// // =====================================================

// import express from 'express';
// import { auth } from '../middleware/auth.js';
// import { adminAuth } from '../middleware/adminAuth.js';
// import { redeemCode, checkCode, generateUserCode } from '../services/redemptionService.js';
// import { db } from '../db.js';

// const router = express.Router();

// console.log('✅ Redemption routes loading...');

// // =====================================================
// // AUTO-GENERATE CODE ON LOGIN (USER ENDPOINT)
// // =====================================================

// /**
//  * POST /api/redemption/generate-user-code
//  * Auto-generate unique code for user after login
//  */
// router.post('/generate-user-code', auth, async (req, res) => {
//   try {
//     const userId = req.user.id;

//     console.log(`📝 Auto-generate code for user: ${userId}`);

//     // Check if user already has an unredeemed code
//     const [existingCode] = await db.query(`
//       SELECT rc.code FROM redeem_codes rc
//       LEFT JOIN user_redemptions ur ON rc.id = ur.code_id
//       WHERE rc.is_used = FALSE
//       LIMIT 1
//     `);

//     if (existingCode.length > 0) {
//       // Unused code exists
//       return res.status(200).json({
//         success: true,
//         code: existingCode[0].code,
//         message: 'You have an unused code'
//       });
//     }

//     // Generate new code for user
//     const code = await generateUserCode(userId);

//     return res.status(200).json({
//       success: true,
//       code,
//       message: 'Code generated successfully'
//     });

//   } catch (error) {
//     console.error('❌ Generate user code error:', error.message);
//     return res.status(500).json({
//       success: false,
//       message: error.message || 'Failed to generate code'
//     });
//   }
// });

// // =====================================================
// // REDEEM CODE (USER ENDPOINT)
// // =====================================================

// /**
//  * POST /api/redemption/redeem
//  * Redeem a code for logged-in user
//  */
// router.post('/redeem', auth, async (req, res) => {
//   try {
//     const { code } = req.body;
//     const userId = req.user.id;

//     console.log(`🎁 Redeem request - Code: ${code}, User: ${userId}`);

//     // Validation
//     if (!code || code.trim() === '') {
//       return res.status(400).json({
//         success: false,
//         message: 'Code is required'
//       });
//     }

//     // Redeem the code
//     const result = await redeemCode(code.trim().toUpperCase(), userId);
//     return res.status(200).json(result);

//   } catch (error) {
//     console.error('❌ Redeem error:', error.message);
    
//     const statusCode = error.message.includes('Invalid') || 
//                       error.message.includes('already') ? 400 : 500;
    
//     return res.status(statusCode).json({
//       success: false,
//       message: error.message || 'Failed to redeem code'
//     });
//   }
// });

// /**
//  * GET /api/redemption/check/:code
//  * Check code validity (without redeeming)
//  */
// router.get('/check/:code', auth, async (req, res) => {
//   try {
//     const { code } = req.params;
//     console.log(`🔍 Check code: ${code}`);
    
//     const info = await checkCode(code);
//     return res.status(200).json(info);
//   } catch (error) {
//     console.error('❌ Check code error:', error.message);
//     return res.status(500).json({
//       success: false,
//       message: 'Failed to check code'
//     });
//   }
// });

// /**
//  * GET /api/redemption/history
//  * Get user redemption history
//  */
// router.get('/history', auth, async (req, res) => {
//   try {
//     const userId = req.user.id;
//     console.log(`📜 Fetch history for user: ${userId}`);
    
//     const [redemptions] = await db.query(`
//       SELECT 
//         rc.code,
//         ur.points_added,
//         ur.redeemed_at
//       FROM user_redemptions ur
//       JOIN redeem_codes rc ON ur.code_id = rc.id
//       WHERE ur.user_id = ?
//       ORDER BY ur.redeemed_at DESC
//     `, [userId]);

//     return res.status(200).json({
//       success: true,
//       redemptions
//     });

//   } catch (error) {
//     console.error('❌ History fetch error:', error.message);
//     return res.status(500).json({
//       success: false,
//       message: 'Failed to fetch redemption history'
//     });
//   }
// });

// // =====================================================
// // ADMIN ENDPOINTS
// // =====================================================

// /**
//  * POST /api/redemption/admin/generate
//  * Admin only: Generate new redemption codes
//  */
// router.post('/admin/generate', adminAuth, async (req, res) => {
//   try {
//     const { quantity } = req.body;

//     console.log(`📋 Admin ${req.admin.id} - Generate codes request. Quantity: ${quantity}`);

//     // Validation
//     if (!quantity || quantity < 1 || quantity > 1000) {
//       return res.status(400).json({
//         success: false,
//         message: 'Quantity must be between 1 and 1000'
//       });
//     }

//     // Generate codes
//     const codes = [];
//     for (let i = 0; i < quantity; i++) {
//       try {
//         const code = await generateUserCode(null); // null = admin generated
//         codes.push(code);
//       } catch (err) {
//         console.error('Error generating individual code:', err);
//       }
//     }
    
//     return res.status(200).json({
//       success: true,
//       message: `Generated ${codes.length} codes`,
//       codes
//     });

//   } catch (error) {
//     console.error('❌ Generate codes error:', error.message);
//     return res.status(500).json({
//       success: false,
//       message: error.message || 'Failed to generate codes'
//     });
//   }
// });

// /**
//  * GET /api/redemption/admin/stats
//  * Admin only: Get redemption statistics
//  */
// router.get('/admin/stats', adminAuth, async (req, res) => {
//   try {
//     console.log(`📊 Admin ${req.admin.id} - Stats request`);

//     const [stats] = await db.query(`
//       SELECT 
//         COUNT(*) as total_codes,
//         SUM(CASE WHEN is_used = TRUE THEN 1 ELSE 0 END) as used_codes,
//         SUM(CASE WHEN is_used = FALSE THEN 1 ELSE 0 END) as available_codes,
//         SUM(CASE WHEN is_used = TRUE THEN points ELSE 0 END) as total_points_redeemed,
//         (SELECT COUNT(DISTINCT user_id) FROM user_redemptions) as unique_users
//       FROM redeem_codes
//     `);

//     return res.status(200).json({
//       success: true,
//       stats: stats[0]
//     });

//   } catch (error) {
//     console.error('❌ Stats error:', error.message);
//     return res.status(500).json({
//       success: false,
//       message: 'Failed to fetch stats'
//     });
//   }
// });

// /**
//  * GET /api/redemption/admin/codes
//  * Admin only: Get all codes with their status
//  */
// router.get('/admin/codes', adminAuth, async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 20;
//     const offset = (page - 1) * limit;

//     console.log(`📋 Admin ${req.admin.id} - Get codes. Page: ${page}`);

//     const [codes] = await db.query(`
//       SELECT 
//         rc.id,
//         rc.code,
//         rc.points,
//         rc.is_used,
//         rc.created_at,
//         rc.used_at,
//         u.username as redeemed_by
//       FROM redeem_codes rc
//       LEFT JOIN user_redemptions ur ON rc.id = ur.code_id
//       LEFT JOIN users u ON ur.user_id = u.id
//       ORDER BY rc.created_at DESC
//       LIMIT ? OFFSET ?
//     `, [limit, offset]);

//     const [countResult] = await db.query('SELECT COUNT(*) as total FROM redeem_codes');

//     return res.status(200).json({
//       success: true,
//       codes,
//       pagination: {
//         page,
//         limit,
//         total: countResult[0].total,
//         pages: Math.ceil(countResult[0].total / limit)
//       }
//     });

//   } catch (error) {
//     console.error('❌ Get codes error:', error.message);
//     return res.status(500).json({
//       success: false,
//       message: 'Failed to fetch codes'
//     });
//   }
// });

// console.log('✅ Redemption routes loaded successfully');

// export default router;

// =====================================================
// FILE: server/src/routes/redemption.js
// COMPLETE WORKING VERSION - One code per user
// =====================================================

import express from 'express';
import { auth } from '../middleware/auth.js';
import { adminAuth } from '../middleware/adminAuth.js';
import { redeemCode, checkCode, generateUserCode } from '../services/redemptionService.js';
import { db } from '../db/index.js';

const router = express.Router();

// console.log('✅ Redemption routes loading...');

// =====================================================
// AUTO-GENERATE CODE ON LOGIN (USER ENDPOINT)
// One code per user - only if they haven't received one before
// =====================================================

/**
 * POST /api/redemption/generate-user-code
 * Auto-generate unique code for user after login (ONE TIME ONLY)
 */
router.post('/generate-user-code', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    console.log(`📝 Auto-generate code request for user: ${userId}`);

    // Check if user has EVER redeemed a code before
    const [userRedemptions] = await db.query(`
      SELECT 
        rc.code,
        rc.is_used,
        ur.redeemed_at
      FROM user_redemptions ur
      JOIN redeem_codes rc ON ur.code_id = rc.id
      WHERE ur.user_id = ?
      ORDER BY ur.redeemed_at DESC
      LIMIT 1
    `, [userId]);

    // If user has already redeemed any code, don't generate a new one
    if (userRedemptions.length > 0) {
      // User has already claimed and used a code
      return res.status(200).json({
        success: false,
        message: 'You have already claimed your redemption code',
        already_claimed: true
      });
    }

    // User has never received a code - generate one
    const code = await generateUserCode(userId);

    return res.status(200).json({
      success: true,
      code,
      message: 'Code generated successfully'
    });

  } catch (error) {
    console.error('❌ Generate user code error:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate code'
    });
  }
});

// =====================================================
// REDEEM CODE (USER ENDPOINT)
// =====================================================

/**
 * POST /api/redemption/redeem
 * Redeem a code for logged-in user
 */
router.post('/redeem', auth, async (req, res) => {
  try {
    const { code } = req.body;
    const userId = req.user.id;

    console.log(`🎁 Redeem request - Code: ${code}, User: ${userId}`);

    // Validation
    if (!code || code.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Code is required'
      });
    }

    // Redeem the code
    const result = await redeemCode(code.trim().toUpperCase(), userId);
    return res.status(200).json(result);

  } catch (error) {
    console.error('❌ Redeem error:', error.message);
    
    const statusCode = error.message.includes('Invalid') || 
                      error.message.includes('already') ? 400 : 500;
    
    return res.status(statusCode).json({
      success: false,
      message: error.message || 'Failed to redeem code'
    });
  }
});

/**
 * GET /api/redemption/check/:code
 * Check code validity (without redeeming)
 */
router.get('/check/:code', auth, async (req, res) => {
  try {
    const { code } = req.params;
    console.log(`🔍 Check code: ${code}`);
    
    const info = await checkCode(code);
    return res.status(200).json(info);
  } catch (error) {
    console.error('❌ Check code error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to check code'
    });
  }
});

/**
 * GET /api/redemption/history
 * Get user redemption history
 */
router.get('/history', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(`📜 Fetch history for user: ${userId}`);
    
    const [redemptions] = await db.query(`
      SELECT 
        rc.code,
        ur.points_added,
        ur.redeemed_at
      FROM user_redemptions ur
      JOIN redeem_codes rc ON ur.code_id = rc.id
      WHERE ur.user_id = ?
      ORDER BY ur.redeemed_at DESC
    `, [userId]);

    return res.status(200).json({
      success: true,
      redemptions
    });

  } catch (error) {
    console.error('❌ History fetch error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch redemption history'
    });
  }
});

// =====================================================
// ADMIN ENDPOINTS
// =====================================================

/**
 * POST /api/redemption/admin/generate
 * Admin only: Generate new redemption codes
 */
router.post('/admin/generate', adminAuth, async (req, res) => {
  try {
    const { quantity } = req.body;

    console.log(`📋 Admin ${req.admin.id} - Generate codes request. Quantity: ${quantity}`);

    // Validation
    if (!quantity || quantity < 1 || quantity > 1000) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be between 1 and 1000'
      });
    }

    // Generate codes
    const codes = [];
    for (let i = 0; i < quantity; i++) {
      try {
        const code = await generateUserCode(null); // null = admin generated
        codes.push(code);
      } catch (err) {
        console.error('Error generating individual code:', err);
      }
    }
    
    return res.status(200).json({
      success: true,
      message: `Generated ${codes.length} codes`,
      codes
    });

  } catch (error) {
    console.error('❌ Generate codes error:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate codes'
    });
  }
});

/**
 * GET /api/redemption/admin/stats
 * Admin only: Get redemption statistics
 */
router.get('/admin/stats', adminAuth, async (req, res) => {
  try {
    console.log(`📊 Admin ${req.admin.id} - Stats request`);

    const [stats] = await db.query(`
      SELECT 
        COUNT(*) as total_codes,
        SUM(CASE WHEN is_used = TRUE THEN 1 ELSE 0 END) as used_codes,
        SUM(CASE WHEN is_used = FALSE THEN 1 ELSE 0 END) as available_codes,
        SUM(CASE WHEN is_used = TRUE THEN points ELSE 0 END) as total_points_redeemed,
        (SELECT COUNT(DISTINCT user_id) FROM user_redemptions) as unique_users
      FROM redeem_codes
    `);

    return res.status(200).json({
      success: true,
      stats: stats[0]
    });

  } catch (error) {
    console.error('❌ Stats error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch stats'
    });
  }
});

/**
 * GET /api/redemption/admin/codes
 * Admin only: Get all codes with their status
 */
router.get('/admin/codes', adminAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    console.log(`📋 Admin ${req.admin.id} - Get codes. Page: ${page}`);

    const [codes] = await db.query(`
      SELECT 
        rc.id,
        rc.code,
        rc.points,
        rc.is_used,
        rc.created_at,
        rc.used_at,
        u.username as redeemed_by
      FROM redeem_codes rc
      LEFT JOIN user_redemptions ur ON rc.id = ur.code_id
      LEFT JOIN users u ON ur.user_id = u.id
      ORDER BY rc.created_at DESC
      LIMIT ? OFFSET ?
    `, [limit, offset]);

    const [countResult] = await db.query('SELECT COUNT(*) as total FROM redeem_codes');

    return res.status(200).json({
      success: true,
      codes,
      pagination: {
        page,
        limit,
        total: countResult[0].total,
        pages: Math.ceil(countResult[0].total / limit)
      }
    });

  } catch (error) {
    console.error('❌ Get codes error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch codes'
    });
  }
});

console.log('✅ Redemption routes loaded successfully');

export default router;