// server/src/services/syncH5Games.js
import { db } from "../db/index.js";
import fetch from "node-fetch";

export async function syncH5Games() {
  const response = await fetch("https://h5games.online/freegames.json");
  const games = await response.json();

  for (const g of games) {
    const providerId = g.guid;
    const fileName = `${providerId}.webp`;

    const [result] = await db.execute(
      `
      INSERT INTO games 
      (provider_id, title, image, embed, description, category, source, is_active, total_plays, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        title = VALUES(title),
        image = VALUES(image),
        embed = VALUES(embed),
        description = VALUES(description),
        category = VALUES(category)
      `,
      [
        providerId,
        g.title,
        fileName,
        g.link,
        g.description,
        g.category,
        "h5games",
        1,               // is_active
        0,               // total_plays
        new Date()       // created_at
      ]
    );

    // 🔥 HANDLE TAGS
    if (g.tags) {
      const tagList = g.tags.toLowerCase().split(",");

      for (const tagName of tagList) {
        // Insert tag if not exists
        const [tagResult] = await db.execute(
          `INSERT IGNORE INTO tags (name) VALUES (?)`,
          [tagName.trim()]
        );

        // Get tag id
        const [tagRow] = await db.execute(
          `SELECT id FROM tags WHERE name = ?`,
          [tagName.trim()]
        );

        const tagId = tagRow[0].id;

        // Link game + tag
        await db.execute(
          `INSERT IGNORE INTO game_tags (game_id, tag_id)
           SELECT id, ? FROM games WHERE provider_id = ?`,
          [tagId, providerId]
        );
      }
    }
  }

  // console.log("H5 Games synced successfully");
}
