// server/src/scripts/importH5Games.js
import { db } from "../db/index.js";
import fetch from "node-fetch";

async function importH5Games() {
  const res = await fetch("https://h5games.online/freegames.json");
  const games = await res.json();

  for (const g of games) {
    const id =
      g.guid || g.title.replace(/\s+/g, "-").toLowerCase();

    const slug = g.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");


    /* 1️⃣ Insert or update game */
    await db.execute(
      `
      INSERT INTO games 
        (id, title, image, embed, category, source)
      VALUES (?, ?, ?, ?, ?, 'h5games')
      ON DUPLICATE KEY UPDATE
        title = VALUES(title),
        image = VALUES(image),
        embed = VALUES(embed),
        category = VALUES(category)
      `,
      [
        id,
        g.title,
        g.thumb,
        g.link,
        g.category
      ]
    );

    /* 2️⃣ Handle tags */
    if (g.tags) {
      const tagList = g.tags
        .split(",")
        .map(t => t.trim().toLowerCase());

      for (const tagName of tagList) {
        // Insert tag if not exists
        const [tagResult] = await db.execute(
          `
          INSERT INTO tags (name)
          VALUES (?)
          ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id)
          `,
          [tagName]
        );

        const tagId = tagResult.insertId;

        // Link game ↔ tag
        await db.execute(
          `
          INSERT IGNORE INTO game_tags (game_id, tag_id)
          VALUES (?, ?)
          `,
          [id, tagId]
        );
      }
    }
  }

  // console.log("✅ H5 Games + Tags Imported");
  process.exit();
}

importH5Games();
