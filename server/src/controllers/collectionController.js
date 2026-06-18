// server/src/controllers/collectionController.js

import { db } from "../db/index.js";

/* Add to collection */
// export async function addToCollection(req, res) {
//   const userId = req.user.id;
//   const { game_id, title, source, category, image } = req.body;

//   console.log("📥 Add to collection request:", { userId, game_id, title, source, category, image });

//   if (!game_id) {
//     return res.status(400).json({ message: "game_id is required" });
//   }

//   try {
//     // Ensure no undefined values - convert to null explicitly
//     const gameTitle = title || null;
//     const gameSource = source || null;
//     const gameCategory = category || null;
//     const imageUrl = image || source || null;

//     console.log("🔍 Processed values:", { 
//       gameId: game_id, 
//       gameTitle, 
//       gameSource, 
//       gameCategory, 
//       imageUrl 
//     });

//     await db.execute(
//       `INSERT INTO user_collections (user_id, game_id, game_title, game_source, category, image_url)
//        VALUES (?, ?, ?, ?, ?, ?)
//        ON DUPLICATE KEY UPDATE 
//          game_title = VALUES(game_title), 
//          game_source = VALUES(game_source),
//          category = VALUES(category),
//          image_url = VALUES(image_url)`,
//       [userId, String(game_id), gameTitle, gameSource, gameCategory, imageUrl]
//     );

//     console.log(`✅ Added game ${game_id} (${gameTitle}) to collection for user ${userId}`);
//     return res.json({ message: "Added to collection", success: true });
//   } catch (err) {
//     console.error("❌ ADD COLLECTION ERROR:", err);
//     console.error("Error details:", {
//       code: err.code,
//       errno: err.errno,
//       sqlMessage: err.sqlMessage
//     });
//     return res.status(500).json({ 
//       message: "Failed to add to collection", 
//       error: process.env.NODE_ENV === 'development' ? err.sqlMessage || err.message : undefined 
//     });
//   }
// }

export async function addToCollection(req, res) {
  const userId = req.user.id;
  const { game_id } = req.body;

  if (!game_id) {
    return res.status(400).json({ message: "game_id is required" });
  }

  try {
    await db.execute(
      `
      INSERT INTO user_collections (user_id, game_id)
      VALUES (?, ?)
      ON DUPLICATE KEY UPDATE created_at = CURRENT_TIMESTAMP
      `,
      [userId, String(game_id)]
    );

    return res.json({ success: true, message: "Added to collection" });

  } catch (err) {
    console.error("ADD COLLECTION ERROR:", err);
    return res.status(500).json({ message: "Failed to add to collection" });
  }
}

/* Remove from collection */
// export async function removeFromCollection(req, res) {
//   const userId = req.user.id;
//   const { gameId } = req.params;

//   console.log("🗑️ Remove from collection request:", { userId, gameId });

//   if (!gameId) {
//     return res.status(400).json({ message: "gameId is required" });
//   }

//   try {
//     const [result] = await db.execute(
//       `DELETE FROM user_collections WHERE user_id = ? AND game_id = ?`,
//       [userId, String(gameId)]
//     );

//     if (result.affectedRows === 0) {
//       console.log(`⚠️ Game ${gameId} not found in collection for user ${userId}`);
//       return res.status(404).json({ message: "Game not found in collection" });
//     }

//     console.log(`✅ Removed game ${gameId} from collection for user ${userId}`);
//     return res.json({ message: "Removed from collection", success: true });
//   } catch (err) {
//     console.error("❌ REMOVE COLLECTION ERROR:", err);
//     return res.status(500).json({ 
//       message: "Failed to remove from collection", 
//       error: process.env.NODE_ENV === 'development' ? err.message : undefined 
//     });
//   }
// }

export async function removeFromCollection(req, res) {
  const userId = req.user.id;
  const { gameId } = req.params;

  if (!gameId) {
    return res.status(400).json({ message: "gameId is required" });
  }

  try {
    const [result] = await db.execute(
      `DELETE FROM user_collections WHERE user_id = ? AND game_id = ?`,
      [userId, String(gameId)]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Game not found in collection" });
    }

    return res.json({ success: true, message: "Removed from collection" });

  } catch (err) {
    console.error("REMOVE COLLECTION ERROR:", err);
    return res.status(500).json({ message: "Failed to remove from collection" });
  }
}

/* Get my collection from DB */
// export const getMyCollection = async (req, res) => {
//   try {
//     const userId = req.user.id;

//     console.log(`📚 Fetching collection for user ${userId}`);

//     const [rows] = await db.execute(
//       `SELECT 
//         id,
//         game_id, 
//         game_title, 
//         game_source,
//         category,
//         image_url,
//         created_at
//        FROM user_collections
//        WHERE user_id = ?
//        ORDER BY created_at DESC`,
//       [userId]
//     );

//     console.log(`✅ Fetched ${rows.length} collection items for user ${userId}`);
//     res.json(rows);
//   } catch (err) {
//     console.error("❌ GET COLLECTION ERROR:", err);
//     res.status(500).json({ 
//       message: "Failed to fetch collection", 
//       error: process.env.NODE_ENV === 'development' ? err.message : undefined 
//     });
//   }
// };

export const getMyCollection = async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await db.execute(
      `
      SELECT 
        g.id,
        g.provider_id,
        g.title,
        g.image,
        g.r2_thumb,
        g.category,
        g.total_plays,
        g.source,
        g.created_at
      FROM user_collections uc
      JOIN games g ON g.provider_id = uc.game_id
      WHERE uc.user_id = ?
        AND g.is_active = 1
      ORDER BY uc.created_at DESC
      `,
      [userId]
    );

    res.json({
      success: true,
      data: rows
    });

  } catch (err) {
    console.error("GET COLLECTION ERROR:", err);
    res.status(500).json({ message: "Failed to fetch collection" });
  }
};