// server/src/services/syncSelfHostedGames.js
import { db } from "../db/index.js";
import selfHostedGames from "../data/selfHostedGames.js"; // move array to backend

export async function syncSelfHostedGames() {
  for (const g of selfHostedGames) {

    const providerId = `self_${g.id}`;
    // const fileName = `${providerId}.webp`;
    await db.execute(
      `
      INSERT INTO games
        (provider_id, title, image, embed, description, category, source, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, 1)
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
        g.image,
        g.embed,
        g.description,
        g.category,
        "self"
      ]
    );

    // 🔥 TAG HANDLING
    if (g.tagList && g.tagList.length > 0) {
      for (const tagName of g.tagList) {

        // Insert tag if not exists
        await db.execute(
          `INSERT IGNORE INTO tags (name) VALUES (?)`,
          [tagName.toLowerCase()]
        );

        // Get tag id
        const [tagRow] = await db.execute(
          `SELECT id FROM tags WHERE name = ?`,
          [tagName.toLowerCase()]
        );

        const tagId = tagRow[0].id;

        // Link game + tag
        await db.execute(
          `
          INSERT IGNORE INTO game_tags (game_id, tag_id)
          SELECT id, ?
          FROM games
          WHERE provider_id = ?
          `,
          [tagId, providerId]
        );
      }
    }
  }

  //console.log("✅ Self-hosted games synced successfully");
}
