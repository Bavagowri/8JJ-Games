// server/src/controllers/games.controller.js

import { db } from "../db/index.js";

function formatGames(rows) {
  return rows.map((g) => ({
    ...g,
    tagList: g.tags ? g.tags.split(",") : [],
  }));
}

// ==============================
// 🎮 GET ALL GAMES
// ==============================

export const getAllGames = async (req, res) => {
  try {
    const { source, limit, offset, search } = req.query;

    let sql = `
      SELECT 
        g.*,
        GROUP_CONCAT(DISTINCT t.name) as tags
      FROM games g
      LEFT JOIN game_tags gt ON g.id = gt.game_id
      LEFT JOIN tags t ON gt.tag_id = t.id
      WHERE g.is_active = 1
    `;

    const params = [];

    if (source) {
      sql += " AND g.source = ?";
      params.push(source);
    }

    //  Search support — used by MobileSearchOverlay & SearchOverlay
    if (search && search.trim()) {
      sql += " AND g.title LIKE ?";
      params.push(`%${search.trim()}%`);
    }

    sql += " GROUP BY g.id ORDER BY g.created_at DESC";

    //  Interpolate LIMIT/OFFSET directly — MySQL2 prepared statements
    // can reject numeric bound params for LIMIT/OFFSET clauses
    if (limit) {
      sql += ` LIMIT ${Number(limit)}`;
    }

    if (offset) {
      sql += ` OFFSET ${Number(offset)}`;
    }

    //  Use db.query() not db.execute() — dynamically-built SQL with mixed
    // placeholder + interpolated LIMIT/OFFSET causes ER_WRONG_ARGUMENTS in mysql2
    const [rows] = await db.query(sql, params);

    res.json({
      success: true,
      data: formatGames(rows),
    });
  } catch (err) {
    console.error("GET GAMES ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Failed to load games",
    });
  }
};

// ==============================
// 🔥 POPULAR GAMES
// ==============================

export const getPopularGames = async (req, res) => {
  try {
    let limit = parseInt(req.query.limit, 10);
    if (isNaN(limit) || limit <= 0) limit = 12;
    if (limit > 100) limit = 100;

    const sql = `
      SELECT 
        g.id, g.provider_id, g.title, g.image, g.r2_thumb,
        g.embed, g.category, g.source, g.is_active,
        g.created_at, g.total_plays, g.last_played_at, g.is_featured,
        GROUP_CONCAT(DISTINCT t.name) as tags
      FROM games g
      LEFT JOIN game_tags gt ON g.id = gt.game_id
      LEFT JOIN tags t ON gt.tag_id = t.id
      WHERE g.is_active = 1
      GROUP BY g.id
      ORDER BY g.total_plays DESC
      LIMIT ${limit}
    `;

    const [rows] = await db.query(sql);
    res.json({ data: rows });
  } catch (err) {
    console.error("POPULAR ERROR:", err);
    res.status(500).json({ error: "Failed to fetch popular games" });
  }
};

// ==============================
// 🔥 HOT GAMES (ADMIN CONTROLLED)
// ==============================

export const getHotGames = async (req, res) => {
  try {
    let limit = parseInt(req.query.limit, 10);
    if (isNaN(limit) || limit <= 0) limit = 12;

    const [rows] = await db.execute(`
      SELECT 
        g.*,
        GROUP_CONCAT(DISTINCT t.name) as tags
      FROM games g
      LEFT JOIN game_tags gt ON g.id = gt.game_id
      LEFT JOIN tags t ON gt.tag_id = t.id
      WHERE g.is_hot = 1 AND g.is_active = 1
      GROUP BY g.id
      ORDER BY g.hot_order ASC
      LIMIT ${Number(limit)}
    `);

    res.json({ success: true, data: rows });
  } catch (err) {
    console.error("HOT ERROR:", err);
    res.status(500).json({ success: false, message: "Failed to load hot games" });
  }
};

// ==============================
// ⭐ FEATURED
// ==============================

export const getFeaturedGames = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT 
        g.*,
        GROUP_CONCAT(DISTINCT t.name) as tags
      FROM games g
      LEFT JOIN game_tags gt ON g.id = gt.game_id
      LEFT JOIN tags t ON gt.tag_id = t.id
      WHERE g.is_featured = 1 AND g.is_active = 1
      GROUP BY g.id
      ORDER BY g.created_at DESC
    `);

    res.json({ success: true, data: formatGames(rows) });
  } catch (err) {
    console.error("FEATURED ERROR:", err);
    res.status(500).json({ success: false, message: "Failed to load featured games" });
  }
};

// ==============================
// ⭐ TOP PICKS
// ==============================

export const getTopPickGames = async (req, res) => {
  try {
    let limit = parseInt(req.query.limit, 10);
    if (isNaN(limit) || limit <= 0) limit = 33;

    const [rows] = await db.query(`
      SELECT 
        g.*,
        GROUP_CONCAT(DISTINCT t.name) as tags
      FROM games g
      LEFT JOIN game_tags gt ON g.id = gt.game_id
      LEFT JOIN tags t ON gt.tag_id = t.id
      WHERE g.is_top_pick = 1 AND g.is_active = 1
      GROUP BY g.id
      ORDER BY g.top_pick_order ASC
      LIMIT ${limit}
    `);

    res.json({ success: true, data: rows });
  } catch (err) {
    console.error("TOP PICKS ERROR:", err);
    res.status(500).json({ success: false });
  }
};

// ==============================
// 📂 BY CATEGORY
// ==============================

export const getGamesByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const [rows] = await db.execute(
      `
      SELECT 
        g.*,
        GROUP_CONCAT(DISTINCT t.name) as tags
      FROM games g
      LEFT JOIN game_tags gt ON g.id = gt.game_id
      LEFT JOIN tags t ON gt.tag_id = t.id
      WHERE LOWER(g.category) = LOWER(?) AND g.is_active = 1
      GROUP BY g.id
      ORDER BY g.created_at DESC
      `,
      [category]
    );

    res.json({ success: true, data: formatGames(rows) });
  } catch (err) {
    console.error("CATEGORY ERROR:", err);
    res.status(500).json({ success: false, message: "Failed to load category games" });
  }
};

// ==============================
// 🏷 BY TAG
// ==============================

export const getGamesByTag = async (req, res) => {
  try {
    const { tag } = req.params;

    const [rows] = await db.execute(
      `
      SELECT 
        g.*,
        GROUP_CONCAT(DISTINCT t2.name) as tags
      FROM games g
      JOIN game_tags gt ON g.id = gt.game_id
      JOIN tags t ON t.id = gt.tag_id
      LEFT JOIN game_tags gt2 ON g.id = gt2.game_id
      LEFT JOIN tags t2 ON gt2.tag_id = t2.id
      WHERE t.name = ? AND g.is_active = 1
      GROUP BY g.id
      ORDER BY g.created_at DESC
      `,
      [tag.toLowerCase()]
    );

    res.json({ success: true, data: formatGames(rows) });
  } catch (err) {
    console.error("TAG ERROR:", err);
    res.status(500).json({ success: false, message: "Failed to load tag games" });
  }
};

// ==============================
// 🕒 RECENT
// ==============================

export const getRecentGames = async (req, res) => {
  try {
    let limit = parseInt(req.query.limit, 10);
    if (isNaN(limit) || limit <= 0) limit = 20;

    const [rows] = await db.execute(`
      SELECT 
        g.*,
        GROUP_CONCAT(DISTINCT t.name) as tags
      FROM games g
      LEFT JOIN game_tags gt ON g.id = gt.game_id
      LEFT JOIN tags t ON gt.tag_id = t.id
      WHERE g.is_active = 1
      GROUP BY g.id
      ORDER BY g.created_at DESC
      LIMIT ${Number(limit)}
    `);

    res.json({ success: true, data: formatGames(rows) });
  } catch (err) {
    console.error("RECENT ERROR:", err);
    res.status(500).json({ success: false, message: "Failed to load recent games" });
  }
};

// ==============================
// 🎮 GAME BY SLUG (provider_id)
// ==============================

export const getGameBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const [rows] = await db.execute(
      `SELECT * FROM games WHERE provider_id = ? AND is_active = 1 LIMIT 1`,
      [slug]
    );

    if (!rows.length) {
      return res.status(404).json({ success: false });
    }

    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error("GAME DETAIL ERROR:", err);
    res.status(500).json({ success: false });
  }
};

// ==============================
// 🔗 RELATED GAMES
// ==============================

export const getRelatedGames = async (req, res) => {
  try {
    const { slug } = req.params;

    const [currentRows] = await db.execute(
      `SELECT id, category FROM games WHERE provider_id = ? AND is_active = 1 LIMIT 1`,
      [slug]
    );

    if (!currentRows.length) {
      return res.status(404).json({ success: false });
    }

    const { id, category } = currentRows[0];

    // Step 1: same-category games first
    const [sameCat] = await db.execute(
      `
      SELECT id, provider_id, title, image, r2_thumb, category
      FROM games
      WHERE category = ? AND id != ? AND is_active = 1
      ORDER BY total_plays DESC
      LIMIT 24
      `,
      [category, id]
    );

    const NEEDED = 24;
    let results = sameCat;

    // Step 2: if we don't have enough, fill with popular games from other categories
    if (results.length < NEEDED) {
      const remaining = NEEDED - results.length;
      const excludeIds = [id, ...results.map((g) => g.id)];
      const placeholders = excludeIds.map(() => "?").join(", ");

      const [filler] = await db.execute(
        `
        SELECT id, provider_id, title, image, r2_thumb, category
        FROM games
        WHERE id NOT IN (${placeholders}) AND is_active = 1
        ORDER BY total_plays DESC
        LIMIT ${remaining}
        `,
        excludeIds
      );

      results = [...results, ...filler];
    }

    res.json({ success: true, data: results });
  } catch (err) {
    console.error("RELATED GAMES ERROR:", err);
    res.status(500).json({ success: false });
  }
};

// ==============================
// 🛠 ADMIN: PAGINATED GAME MANAGER
// ==============================

export const getAdminGames = async (req, res) => {
  try {
    let { page = 1, limit = 20, search = "" } = req.query;

    page = parseInt(page, 10);
    limit = parseInt(limit, 10);
    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(limit) || limit < 1) limit = 20;

    const offset = (page - 1) * limit;

    let whereClause = "WHERE 1=1";
    const params = [];

    if (search) {
      whereClause += " AND g.title LIKE ?";
      params.push(`%${search}%`);
    }

    const [countRows] = await db.execute(
      `SELECT COUNT(*) as total FROM games g ${whereClause}`,
      params
    );
    const total = countRows[0].total;

    const [rows] = await db.execute(
      `
      SELECT g.id, g.title, g.is_hot, g.is_featured, g.is_top_pick, g.top_pick_order
      FROM games g
      ${whereClause}
      ORDER BY g.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
      `,
      params
    );

    res.json({
      success: true,
      data: rows,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("ADMIN GAMES ERROR:", err);
    res.status(500).json({ success: false });
  }
};

// =====================================================================
// PERF FIX (Step 6): Home Bundle endpoint — replaces 17 parallel API
// calls from MobileHome.jsx with a single request.
//
// HOW IT WORKS:
// All 17 queries still run in parallel via Promise.all on the DB side
// so DB load is identical. The difference is the browser now makes
// 1 HTTP request instead of 17, saving ~16 round trips and eliminating
// the React batch-re-render storm that caused 600ms+ TBT.
//
// HELPER FUNCTIONS (defined once below, used only by getHomeBundle):
//   tagSQL(tag)  — builds [sql, params] for a tag-filtered query
//   catSQL(cat)  — builds [sql, params] for a category-filtered query
// =====================================================================

// Helper: returns [sql, params] for games matching a tag name
function tagSQL(tag) {
  return [
    `SELECT g.*, GROUP_CONCAT(DISTINCT t2.name) as tags
     FROM games g
     JOIN game_tags gt  ON g.id = gt.game_id
     JOIN tags t        ON t.id = gt.tag_id
     LEFT JOIN game_tags gt2 ON g.id = gt2.game_id
     LEFT JOIN tags t2       ON gt2.tag_id = t2.id
     WHERE t.name = ? AND g.is_active = 1
     GROUP BY g.id
     ORDER BY g.created_at DESC
     LIMIT 12`,
    [tag],
  ];
}

// Helper: returns [sql, params] for games matching a category name
function catSQL(cat) {
  return [
    `SELECT g.*, GROUP_CONCAT(DISTINCT t.name) as tags
     FROM games g
     LEFT JOIN game_tags gt ON g.id = gt.game_id
     LEFT JOIN tags t       ON gt.tag_id = t.id
     WHERE LOWER(g.category) = LOWER(?) AND g.is_active = 1
     GROUP BY g.id
     ORDER BY g.created_at DESC
     LIMIT 12`,
    [cat],
  ];
}

export const getHomeBundle = async (req, res) => {
  try {
    // All 17 queries fire in parallel — same DB load as the old 17 fetches,
    // but only 1 HTTP round trip from the client.
    const [
      hotRows,
      featuredRows,
      topPicksRows,
      popularRows,
      basketballRows,
      actionRows,
      puzzlesRows,
      drivingRows,
      halloweenRows,
      cardRows,
      simulationRows,
      skillRows,
      footballRows,
      horrorRows,
      platformerRows,
      christmasRows,
      princessRows,
    ] = await Promise.all([
      // Hot games — ordered by admin-controlled hot_order
      db.execute(`
        SELECT g.*, GROUP_CONCAT(DISTINCT t.name) as tags
        FROM games g
        LEFT JOIN game_tags gt ON g.id = gt.game_id
        LEFT JOIN tags t ON gt.tag_id = t.id
        WHERE g.is_hot = 1 AND g.is_active = 1
        GROUP BY g.id
        ORDER BY g.hot_order ASC
        LIMIT 6
      `),
      // Featured games
      db.execute(`
        SELECT g.*, GROUP_CONCAT(DISTINCT t.name) as tags
        FROM games g
        LEFT JOIN game_tags gt ON g.id = gt.game_id
        LEFT JOIN tags t ON gt.tag_id = t.id
        WHERE g.is_featured = 1 AND g.is_active = 1
        GROUP BY g.id
        ORDER BY g.created_at DESC
        LIMIT 12
      `),
      // Top picks
      db.execute(`
        SELECT g.*, GROUP_CONCAT(DISTINCT t.name) as tags
        FROM games g
        LEFT JOIN game_tags gt ON g.id = gt.game_id
        LEFT JOIN tags t ON gt.tag_id = t.id
        WHERE g.is_top_pick = 1 AND g.is_active = 1
        GROUP BY g.id
        ORDER BY g.top_pick_order ASC
        LIMIT 12
      `),
      // Popular (by total plays)
      db.query(`
        SELECT g.*, GROUP_CONCAT(DISTINCT t.name) as tags
        FROM games g
        LEFT JOIN game_tags gt ON g.id = gt.game_id
        LEFT JOIN tags t ON gt.tag_id = t.id
        WHERE g.is_active = 1
        GROUP BY g.id
        ORDER BY g.total_plays DESC
        LIMIT 12
      `),
      // Tag-based and category-based sections
      db.execute(...tagSQL("basketball")),
      db.execute(...tagSQL("action")),
      db.execute(...catSQL("puzzles")),
      db.execute(...catSQL("driving")),
      db.execute(...tagSQL("halloween")),
      db.execute(...tagSQL("card")),
      db.execute(...tagSQL("simulation")),
      db.execute(...tagSQL("skill")),
      db.execute(...tagSQL("football")),
      db.execute(...tagSQL("zombie")),
      db.execute(...tagSQL("platformer")),
      db.execute(...tagSQL("christmas")),
      db.execute(...catSQL("princess")),
    ]);

    res.json({
      success: true,
      data: {
        hot:        formatGames(hotRows[0]),
        featured:   formatGames(featuredRows[0]),
        topPicks:   formatGames(topPicksRows[0]),
        popular:    formatGames(popularRows[0]),
        basketball: formatGames(basketballRows[0]),
        action:     formatGames(actionRows[0]),
        puzzles:    formatGames(puzzlesRows[0]),
        driving:    formatGames(drivingRows[0]),
        halloween:  formatGames(halloweenRows[0]),
        card:       formatGames(cardRows[0]),
        simulation: formatGames(simulationRows[0]),
        skill:      formatGames(skillRows[0]),
        football:   formatGames(footballRows[0]),
        horror:     formatGames(horrorRows[0]),
        platformer: formatGames(platformerRows[0]),
        christmas:  formatGames(christmasRows[0]),
        princess:   formatGames(princessRows[0]),
      },
    });
  } catch (err) {
    console.error("HOME BUNDLE ERROR:", err);
    res.status(500).json({ success: false, message: "Failed to load home bundle" });
  }
};