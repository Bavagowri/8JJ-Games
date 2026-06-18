// server/src/controllers/matchPreviewController.js
import { db } from "../db/index.js";

export async function getMatchPreview(req, res) {
  try {
    // ─────────────────────────────────────────────
    // ✅ SAFE PAGINATION (SSR PROOF)
    // ─────────────────────────────────────────────
    const pageRaw = req.query.page;
    const limitRaw = req.query.limit;

    const safePage =
      Number.isInteger(Number(pageRaw)) && Number(pageRaw) > 0
        ? Number(pageRaw)
        : 1;

    const safeLimit =
      Number.isInteger(Number(limitRaw)) && Number(limitRaw) > 0
        ? Number(limitRaw)
        : 14;

    const offset = (safePage - 1) * safeLimit;

    console.log("✅ PAGINATION:", { safePage, safeLimit, offset });

    // ─────────────────────────────────────────────
    // 🔹 COMMON FILTER
    // ─────────────────────────────────────────────
    const baseFilter = `
      m.localteam_name IS NOT NULL
      AND m.visitorteam_name IS NOT NULL
      AND m.localteam_name != ''
      AND m.visitorteam_name != ''
      AND LOWER(m.localteam_name) NOT LIKE '%tbc%'
      AND LOWER(m.visitorteam_name) NOT LIKE '%tbc%'
    `;

    // ─────────────────────────────────────────────
    // 🔴 LIVE MATCHES (NO PAGINATION)
    // ─────────────────────────────────────────────
   const [liveMatches] = await db.execute(`
      SELECT
        m.id,
        m.localteam_name AS team_a,
        m.visitorteam_name AS team_b,
        m.starting_at,
        m.match_state,
        m.localteam_score,
        m.visitorteam_score,

        COALESCE(t1.logo_url,
          CONCAT('https://cdn.sportmonks.com/images/cricket/teams/', m.localteam_id, '.png')
        ) AS team_a_logo,

        COALESCE(t2.logo_url,
          CONCAT('https://cdn.sportmonks.com/images/cricket/teams/', m.visitorteam_id, '.png')
        ) AS team_b_logo

      FROM matches m
      LEFT JOIN teams t1 ON m.localteam_id = t1.sportmonks_id
      LEFT JOIN teams t2 ON m.visitorteam_id = t2.sportmonks_id

      WHERE ${baseFilter}
      AND m.match_state = 'live'

      -- ✅ FIXED LOGIC
      AND m.starting_at >= DATE_SUB(NOW(), INTERVAL 3 DAY)

      ORDER BY m.starting_at DESC
    `);

    // ─────────────────────────────────────────────
    // 🟡 UPCOMING MATCHES
    // ─────────────────────────────────────────────
    const [upcomingMatches] = await db.execute(
      `
      SELECT
        m.id,
        m.localteam_name AS team_a,
        m.visitorteam_name AS team_b,
        m.starting_at,
        m.match_state,
        m.localteam_score,
        m.visitorteam_score,

        COALESCE(t1.logo_url,
          CONCAT('https://cdn.sportmonks.com/images/cricket/teams/', m.localteam_id, '.png')
        ) AS team_a_logo,

        COALESCE(t2.logo_url,
          CONCAT('https://cdn.sportmonks.com/images/cricket/teams/', m.visitorteam_id, '.png')
        ) AS team_b_logo

      FROM matches m
      LEFT JOIN teams t1 ON m.localteam_id = t1.sportmonks_id
      LEFT JOIN teams t2 ON m.visitorteam_id = t2.sportmonks_id

      WHERE ${baseFilter}
      AND m.match_state = 'upcoming'
      AND m.starting_at >= NOW()

      ORDER BY m.starting_at ASC
      LIMIT ${safeLimit} OFFSET ${offset}
      `// ✅ ALWAYS SAFE VALUES
    );

    // ─────────────────────────────────────────────
    // 🔵 RECENT MATCHES
    // ─────────────────────────────────────────────
    const [recentMatches] = await db.execute(
      `
      SELECT
        m.id,
        m.localteam_name AS team_a,
        m.visitorteam_name AS team_b,
        m.starting_at,
        m.match_state,
        m.localteam_score,
        m.visitorteam_score,

        COALESCE(t1.logo_url,
          CONCAT('https://cdn.sportmonks.com/images/cricket/teams/', m.localteam_id, '.png')
        ) AS team_a_logo,

        COALESCE(t2.logo_url,
          CONCAT('https://cdn.sportmonks.com/images/cricket/teams/', m.visitorteam_id, '.png')
        ) AS team_b_logo

      FROM matches m
      LEFT JOIN teams t1 ON m.localteam_id = t1.sportmonks_id
      LEFT JOIN teams t2 ON m.visitorteam_id = t2.sportmonks_id

      WHERE ${baseFilter}
      AND m.match_state = 'completed'
      AND m.starting_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)

      ORDER BY m.starting_at DESC
      LIMIT ${safeLimit} OFFSET ${offset}
      `
    );

    // ─────────────────────────────────────────────
    // 🔢 COUNTS
    // ─────────────────────────────────────────────
    const [[{ upcomingTotal }]] = await db.execute(`
      SELECT COUNT(*) as upcomingTotal
      FROM matches m
      WHERE ${baseFilter}
      AND m.match_state = 'upcoming'
      AND m.starting_at >= NOW()
    `);

    const [[{ recentTotal }]] = await db.execute(`
      SELECT COUNT(*) as recentTotal
      FROM matches m
      WHERE ${baseFilter}
      AND m.match_state = 'completed'
      AND m.starting_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
    `);

    // ─────────────────────────────────────────────
    // 🎯 RESPONSE
    // ─────────────────────────────────────────────
    res.json({
      live: liveMatches,

      upcoming: {
        data: upcomingMatches,
        pagination: {
          page: safePage,
          limit: safeLimit,
          total: upcomingTotal,
          totalPages: Math.ceil(upcomingTotal / safeLimit),
        },
      },

      recent: {
        data: recentMatches,
        pagination: {
          page: safePage,
          limit: safeLimit,
          total: recentTotal,
          totalPages: Math.ceil(recentTotal / safeLimit),
        },
      },
    });

  } catch (err) {
    console.error("❌ MATCH PREVIEW ERROR:", err);
    res.status(500).json({
      message: "Failed to fetch match preview",
      error: err.message,
    });
  }
}