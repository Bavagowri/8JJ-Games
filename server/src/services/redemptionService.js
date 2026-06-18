import { db } from "../db/index.js";
import { generateRedemptionCode } from "../utils/codeGenerator.js";

// console.log("✅ Redemption service loaded");

/**
 * Auto-generate unique code for user after login
 * @param {number} userId - User ID (optional, for admin-generated codes)
 * @returns {Promise<string>} Generated code
 */
export async function generateUserCode(userId) {
  try {
    let code = generateRedemptionCode();
    let attempts = 0;

    // Ensure uniqueness
    while (attempts < 10) {
      const [existing] = await db.query(
        "SELECT id FROM redeem_codes WHERE code = ?",
        [code],
      );

      if (existing.length === 0) {
        // Code is unique, insert it
        await db.query(
          "INSERT INTO redeem_codes (code, points, is_used) VALUES (?, 50, FALSE)",
          [code],
        );

        // console.log(`✅ Generated code: ${code}`);
        return code;
      }

      // Try again with new code
      code = generateRedemptionCode();
      attempts++;
    }

    throw new Error("Failed to generate unique code after 10 attempts");
  } catch (error) {
      // console.error("❌ Code generation error:", error);
    throw new Error(`Failed to generate code: ${error.message}`);
  }
}

/**
 * Redeem a code for a user
 * @param {string} code - Redemption code
 * @param {number} userId - User ID
 * @returns {Promise<Object>} Success response with points
 */
export async function redeemCode(code, userId) {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    //console.log(`🔄 Processing redemption - Code: ${code}, User: ${userId}`);

    // 1. Validate code exists and is unused
    const [codeResult] = await connection.query(
      "SELECT id, points, is_used FROM redeem_codes WHERE code = ?",
      [code.toUpperCase()],
    );

    if (codeResult.length === 0) {
      throw new Error("Invalid code");
    }

    const { id: codeId, points, is_used } = codeResult[0];

    if (is_used) {
      throw new Error("Code already used");
    }

    // 2. Check if user already redeemed this code
    const [userRedemption] = await connection.query(
      "SELECT id FROM user_redemptions WHERE user_id = ? AND code_id = ?",
      [userId, codeId],
    );

    if (userRedemption.length > 0) {
      throw new Error("You have already redeemed this code");
    }

    // 3. Get current user points from user_points table
    const [userPointsResult] = await connection.query(
      "SELECT total_points FROM user_points WHERE user_id = ?",
      [userId],
    );

    let currentPoints = 0;
    if (userPointsResult.length > 0) {
      currentPoints = userPointsResult[0].total_points;
    } else {
      // Create user_points record if doesn't exist
      await connection.query(
        'INSERT INTO user_points (user_id, total_points, current_level, current_tier) VALUES (?, 0, 1, "Bronze")',
        [userId],
      );
      currentPoints = 0;
    }

    // 4. Calculate new total points
    const newTotalPoints = currentPoints + points;

    // 5. Update user_points table
    await connection.query(
      "UPDATE user_points SET total_points = ? WHERE user_id = ?",
      [newTotalPoints, userId],
    );

    // 6. Update users table
    await connection.query(
      "UPDATE users SET points = ? WHERE id = ?",
      [newTotalPoints, userId],
    );

    //console.log(`✅ Points awarded: ${points}, New total: ${newTotalPoints}`);

    // 7. Mark code as used
    await connection.query(
      "UPDATE redeem_codes SET is_used = TRUE, used_at = NOW() WHERE id = ?",
      [codeId],
    );

    // 8. Record redemption history
    await connection.query(
      "INSERT INTO user_redemptions (user_id, code_id, points_added, redeemed_at) VALUES (?, ?, ?, NOW())",
      [userId, codeId, points],
    );

    // 9. Log activity
    await connection.query(
      "INSERT INTO user_activity_log (user_id, activity_type, points_awarded, metadata) VALUES (?, ?, ?, ?)",
      [userId, "code_redemption", points, JSON.stringify({ code, codeId })],
    );

    await connection.commit();

    return {
      success: true,
      message: "Code redeemed successfully",
      points_added: points,
      total_points: newTotalPoints,
    };
  } catch (error) {
    await connection.rollback();
    console.error("❌ Redemption error:", error.message);
    throw error;
  } finally {
    connection.release();
  }
}
/**
 * Check if a code exists (without redeeming)
 * @param {string} code - Redemption code
 * @returns {Promise<Object>} Code info
 */
export async function checkCode(code) {
  try {
    const [result] = await db.query(
      "SELECT id, is_used, points FROM redeem_codes WHERE code = ?",
      [code.toUpperCase()],
    );

    if (result.length === 0) {
      return { exists: false };
    }

    return {
      exists: true,
      is_used: result[0].is_used,
      points: result[0].points,
    };
  } catch (error) {
    console.error("❌ Check code error:", error);
    throw error;
  }
}
