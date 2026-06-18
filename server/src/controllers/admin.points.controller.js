import { db } from "../db/index.js";

/* ================= GET ALL RULES ================= */
export const getAllRules = async (req, res) => {
  try {
    const [rules] = await db.execute(
      "SELECT * FROM points_rules ORDER BY id DESC"
    );
    res.json(rules);
  } catch (err) {
    console.error("❌ GET RULES ERROR:", err);
    res.status(500).json({ message: "Failed to fetch rules" });
  }
};

/* ================= CREATE RULE ================= */
export const createRule = async (req, res) => {
  try {
    const {
      activity_type,
      points,
      min_points,
      max_points,
      daily_limit,
      cooldown_minutes
    } = req.body;

    if (!activity_type) {
      return res.status(400).json({ message: "Activity type is required" });
    }

    await db.execute(
      `
      INSERT INTO points_rules
      (activity_type, points, min_points, max_points, daily_limit, cooldown_minutes)
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        activity_type,
        points || null,
        min_points || null,
        max_points || null,
        daily_limit || null,
        cooldown_minutes || null
      ]
    );


    res.json({ message: "Rule created successfully" });
  } catch (err) {
    console.error("❌ CREATE RULE ERROR:", err);
    res.status(500).json({ message: "Failed to create rule" });
  }
};

/* ================= UPDATE RULE ================= */
export const updateRule = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      points,
      min_points,
      max_points,
      daily_limit,
      cooldown_minutes,
      is_active
    } = req.body;

    await db.execute(
      `
      UPDATE points_rules
      SET points = ?,
          min_points = ?,
          max_points = ?,
          daily_limit = ?,
          cooldown_minutes = ?,
          is_active = ?
      WHERE id = ?
      `,
      [
        points ?? null,
        min_points ?? null,
        max_points ?? null,
        daily_limit ?? null,
        cooldown_minutes ?? null,
        is_active ?? true,
        id
      ]
    );

    res.json({ message: "Rule updated successfully" });
  } catch (err) {
    console.error("❌ UPDATE RULE ERROR:", err);
    res.status(500).json({ message: "Failed to update rule" });
  }
};

/* ================= DELETE RULE ================= */
export const deleteRule = async (req, res) => {
  try {
    const { id } = req.params;

    await db.execute("DELETE FROM points_rules WHERE id = ?", [id]);

    res.json({ message: "Rule deleted successfully" });
  } catch (err) {
    console.error("❌ DELETE RULE ERROR:", err);
    res.status(500).json({ message: "Failed to delete rule" });
  }
};

/* ================= USER TRANSACTIONS ================= */
export const getUserTransactions = async (req, res) => {
  try {
    const { userId } = req.params;

    const [transactions] = await db.execute(
      `
      SELECT *
      FROM points_transactions
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT 100
      `,
      [userId]
    );

    res.json(transactions);
  } catch (err) {
    console.error("❌ USER TRANSACTIONS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch user transactions" });
  }
};

/* ================= USER TOTAL POINTS ================= */
export const getUserTotalPoints = async (req, res) => {
  try {
    const { userId } = req.params;

    const [[result]] = await db.execute(
      `
      SELECT COALESCE(SUM(points), 0) AS total_points
      FROM points_transactions
      WHERE user_id = ?
      `,
      [userId]
    );

    res.json(result);
  } catch (err) {
    console.error("❌ TOTAL POINTS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch total points" });
  }
};

/* ================= ADMIN MANUAL ADJUST ================= */
  export const adjustUserPoints = async (req, res) => {
    const connection = await db.getConnection();

    try {
      const { user_id, points } = req.body;

      if (!user_id || !points) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      await connection.beginTransaction();

      // 1️⃣ Insert transaction
      await connection.execute(
        `
        INSERT INTO points_transactions
        (user_id, activity_type, points, note)
        VALUES (?, 'admin_adjustment', ?, ?)
        `,
        [user_id, points, note ?? null]
      );
            // 2️⃣ Update wallet
      await connection.execute(
        `
        INSERT INTO user_points (user_id, total_points)
        VALUES (?, ?)
        ON DUPLICATE KEY UPDATE
        total_points = total_points + VALUES(total_points)
        `,
        [user_id, points]
      );

      // 3️⃣ Get new total
      const [[wallet]] = await connection.execute(
        `SELECT total_points FROM user_points WHERE user_id = ?`,
        [user_id]
      );

      const totalPoints = wallet.total_points;

      // 4️⃣ Calculate level/tier
      const newLevel = Math.floor(totalPoints / 250) + 1;

      let newTier = "Bronze";
      if (totalPoints >= 2000) newTier = "Diamond";
      else if (totalPoints >= 1500) newTier = "Platinum";
      else if (totalPoints >= 1000) newTier = "Gold";
      else if (totalPoints >= 500) newTier = "Silver";

      // 5️⃣ Update both tables
      await connection.execute(
        `
        UPDATE user_points
        SET current_level = ?, current_tier = ?
        WHERE user_id = ?
        `,
        [newLevel, newTier, user_id]
      );

      await connection.execute(
        `
        UPDATE users
        SET points = ?, level = ?, tier = ?
        WHERE id = ?
        `,
        [totalPoints, newLevel, newTier, user_id]
      );

      await connection.commit();

      res.json({ message: "Points adjusted successfully" });

    } catch (err) {
      await connection.rollback();
      res.status(500).json({ message: err.message });
    } finally {
      connection.release();
    }
  };

/* ================= BULK ADMIN ADJUST ================= */
export const bulkAdjustPoints = async (req, res) => {
  const connection = await db.getConnection();

  try {
    const { user_ids, points, note } = req.body;

    if (!Array.isArray(user_ids) || user_ids.length === 0) {
      return res.status(400).json({ message: "No users selected" });
    }

    if (!points || isNaN(points)) {
      return res.status(400).json({ message: "Invalid points value" });
    }

    await connection.beginTransaction();

    for (const userId of user_ids) {
    // 1️⃣ Insert transaction
    await connection.execute(
      `
      INSERT INTO points_transactions
      (user_id, activity_type, points, note)
      VALUES (?, 'admin_adjustment', ?, ?)
      `,
      [userId, points, note ?? null]
    );

    // 2️⃣ Update wallet
    await connection.execute(
      `
      INSERT INTO user_points (user_id, total_points)
      VALUES (?, ?)
      ON DUPLICATE KEY UPDATE
      total_points = total_points + VALUES(total_points)
      `,
      [userId, points]
    );

    // 3️⃣ Get new total
    const [[wallet]] = await connection.execute(
      `SELECT total_points FROM user_points WHERE user_id = ?`,
      [userId]
    );

    const totalPoints = wallet.total_points;

    // 4️⃣ Recalculate level
    const newLevel = Math.floor(totalPoints / 250) + 1;

    let newTier = "Bronze";
    if (totalPoints >= 2000) newTier = "Diamond";
    else if (totalPoints >= 1500) newTier = "Platinum";
    else if (totalPoints >= 1000) newTier = "Gold";
    else if (totalPoints >= 500) newTier = "Silver";

    // 5️⃣ Update wallet level/tier
    await connection.execute(
      `
      UPDATE user_points
      SET current_level = ?, current_tier = ?
      WHERE user_id = ?
      `,
      [newLevel, newTier, userId]
    );

    // 6️⃣ Sync users table
    await connection.execute(
      `
      UPDATE users
      SET points = ?, level = ?, tier = ?
      WHERE id = ?
      `,
      [totalPoints, newLevel, newTier, userId]
    );
  }

    await connection.commit();

    res.json({ message: "Points awarded successfully" });

  } catch (err) {
    await connection.rollback();
    console.error("❌ BULK ADJUST ERROR:", err);
    res.status(500).json({ message: err.message });
  } finally {
    connection.release();
  }
};

/* ================= GET ALL USERS WITH POINTS ================= */
export const getAllUsersWithPoints = async (req, res) => {
  try {
    const [users] = await db.execute(`
      SELECT 
        u.id,
        u.username,
        u.email,
        COALESCE(up.total_points, 0) as total_points,
        up.current_level,
        up.current_tier
      FROM users u
      LEFT JOIN user_points up ON u.id = up.user_id
      ORDER BY total_points DESC
    `);

    res.json(users);
  } catch (err) {
    console.error("❌ GET USERS POINTS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};
