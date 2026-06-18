// server/src/routes/sitemap.routes.js
import express from "express";
import { db } from "../db/index.js";

const router = express.Router();

// ─── Constants ────────────────────────────────────────────────────────────────
const BASE_URL    = "https://staging.8jjgames.com";
const ASSETS_BASE = "https://assets.8jjgames.com";
const CACHE_TTL   = 60 * 60 * 1000; // 1 hour in ms

// ─── Blocked slugs (mirrors react-app/src/utils/blockedGames.js) ─────────────
const BLOCKED_SLUGS = new Set([
  "unhook-the-bra",
  "unhook-bra",
  "bra-unhooking",
  "christmas-day-beach-kiss",
  "christmas-princess-kissing",
  "poop-it",
  "poop-clicker",
]);

// ─── Self-hosted games (guaranteed fallback if not yet in DB) ─────────────────
const SELF_HOSTED_SLUGS = [
  "warfare-area-2", "assault-zone", "bullet-fury-2", "park-the-police-car",
  "game-the-cargo", "warfare-area-3", "truck-space", "park-the-taxi-2",
  "hard-wheels-winter", "trials-ride-2", "tractor-trial-2", "assault-time",
  "hard-wheels-winter-2", "truck-space-2", "park-the-taxi-3", "the-cargo-2",
  "game-hasty-cargo",
];

// ─── Static pages ─────────────────────────────────────────────────────────────
const STATIC_PAGES = [
  { url: "/",                        changefreq: "daily",   priority: "1.0" },
  { url: "/all-8jj-games",           changefreq: "daily",   priority: "0.9" },
  { url: "/categories",              changefreq: "weekly",  priority: "0.8" },
  { url: "/predictions",             changefreq: "daily",   priority: "0.8" },
  { url: "/leaderboard",             changefreq: "daily",   priority: "0.7" },
  { url: "/predictions/leaderboard", changefreq: "daily",   priority: "0.7" },
  { url: "/faq",                     changefreq: "monthly", priority: "0.6" },
  { url: "/about",                   changefreq: "monthly", priority: "0.5" },
  { url: "/contact",                 changefreq: "monthly", priority: "0.5" },
  { url: "/privacy-policy",          changefreq: "yearly",  priority: "0.3" },
  { url: "/disclaimer",              changefreq: "yearly",  priority: "0.3" },
  { url: "/terms-and-conditions",    changefreq: "yearly",  priority: "0.3" },
  { url: "/responsible-gaming",      changefreq: "yearly",  priority: "0.3" },
  { url: "/terms-of-service",        changefreq: "yearly",  priority: "0.3" },
];

// ─── Per-sitemap cache ────────────────────────────────────────────────────────
const cache = {
  index:      { xml: null, expiry: 0 },
  static:     { xml: null, expiry: 0 },
  games:      { xml: null, expiry: 0 },
  categories: { xml: null, expiry: 0 },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function escapeXml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function formatDate(date) {
  try {
    return new Date(date).toISOString().split("T")[0];
  } catch {
    return new Date().toISOString().split("T")[0];
  }
}

function todayDate() {
  return new Date().toISOString().split("T")[0];
}

// Mirrors the frontend getGameThumb() logic exactly
// encodeURI() ensures spaces in paths like "HARD WHEELS WINTER 2/thumb.jpg"
// become valid percent-encoded URLs that Google accepts
function getThumbUrl(game) {
  if (!game.image) return null;
  if (game.source === "self") {
    // Self-hosted: image is a local path e.g. /games/WARFARE AREA 2/thumb.jpg
    return encodeURI(`${BASE_URL}${game.image}`);
  }
  // H5 games: image is a filename served from R2
  return encodeURI(`${ASSETS_BASE}/game-thumbs-webp/${game.image}`);
}

// Priority scoring based on admin flags + engagement
function getGamePriority(game) {
  if (game.is_featured) return "0.95";
  if (game.is_hot)      return "0.90";
  if (game.is_top_pick) return "0.85";
  const plays = parseInt(game.total_plays, 10) || 0;
  if (plays > 10000) return "0.80";
  if (plays > 1000)  return "0.75";
  if (plays > 100)   return "0.70";
  return "0.65";
}

// ─── Sitemap generators ───────────────────────────────────────────────────────

function generateIndex() {
  const today = todayDate();
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',

    "  <sitemap>",
    `    <loc>${BASE_URL}/sitemap-static.xml</loc>`,
    `    <lastmod>${today}</lastmod>`,
    "  </sitemap>",

    "  <sitemap>",
    `    <loc>${BASE_URL}/sitemap-games.xml</loc>`,
    `    <lastmod>${today}</lastmod>`,
    "  </sitemap>",

    "  <sitemap>",
    `    <loc>${BASE_URL}/sitemap-categories.xml</loc>`,
    `    <lastmod>${today}</lastmod>`,
    "  </sitemap>",

    "</sitemapindex>",
  ].join("\n");
}

function generateStatic() {
  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ];

  for (const page of STATIC_PAGES) {
    lines.push("  <url>");
    lines.push(`    <loc>${BASE_URL}${page.url}</loc>`);
    lines.push(`    <lastmod>${todayDate()}</lastmod>`);
    lines.push(`    <changefreq>${page.changefreq}</changefreq>`);
    lines.push(`    <priority>${page.priority}</priority>`);
    lines.push("  </url>");
  }

  lines.push("</urlset>");
  return lines.join("\n");
}

async function generateGames() {
  // Fetch all active games — ordered so featured/hot/top-pick come first
  // which makes the sitemap easier for Google to prioritise on first crawl
  const [games] = await db.query(`
    SELECT
      g.provider_id,
      g.title,
      g.image,
      g.source,
      g.category,
      g.updated_at,
      g.is_featured,
      g.is_hot,
      g.is_top_pick,
      g.total_plays
    FROM games g
    WHERE g.is_active = 1
    ORDER BY
      g.is_featured DESC,
      g.is_hot      DESC,
      g.is_top_pick DESC,
      g.total_plays DESC,
      g.updated_at  DESC
  `);

  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset',
    '  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
    '  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
  ];

  const foundSelfHosted = new Set();

  for (const game of games) {
    const slug = game.provider_id;
    if (!slug || BLOCKED_SLUGS.has(slug)) continue;

    if (game.source === "self") foundSelfHosted.add(slug);

    const thumbUrl = getThumbUrl(game);
    const priority = getGamePriority(game);
    const lastmod  = formatDate(game.updated_at);

    lines.push("  <url>");
    lines.push(`    <loc>${BASE_URL}/games/${escapeXml(slug)}</loc>`);
    lines.push(`    <lastmod>${lastmod}</lastmod>`);
    lines.push(`    <changefreq>monthly</changefreq>`);
    lines.push(`    <priority>${priority}</priority>`);

    // Google image sitemap extension — helps game thumbnails appear in image search
    if (thumbUrl) {
      lines.push("    <image:image>");
      lines.push(`      <image:loc>${escapeXml(thumbUrl)}</image:loc>`);
      lines.push(`      <image:title>${escapeXml(game.title)}</image:title>`);
      if (game.category) {
        lines.push(`      <image:caption>Play ${escapeXml(game.title)} - Free ${escapeXml(game.category)} game on 8JJ Games</image:caption>`);
      }
      lines.push("    </image:image>");
    }

    lines.push("  </url>");
  }

  // Safety net: add self-hosted games that may not be in DB yet
  for (const slug of SELF_HOSTED_SLUGS) {
    if (foundSelfHosted.has(slug) || BLOCKED_SLUGS.has(slug)) continue;
    lines.push("  <url>");
    lines.push(`    <loc>${BASE_URL}/games/${escapeXml(slug)}</loc>`);
    lines.push(`    <lastmod>${todayDate()}</lastmod>`);
    lines.push(`    <changefreq>monthly</changefreq>`);
    lines.push(`    <priority>0.65</priority>`);
    lines.push("  </url>");
  }

  lines.push("</urlset>");
  return lines.join("\n");
}

async function generateCategories() {
  // All distinct categories
  const [categories] = await db.query(`
    SELECT
      LOWER(TRIM(category)) AS slug,
      COUNT(*) AS game_count
    FROM games
    WHERE is_active = 1 AND category IS NOT NULL AND category != ''
    GROUP BY slug
    ORDER BY game_count DESC
  `);

  // All distinct tags (many are used as category routes too e.g. /categories/action)
  const [tags] = await db.query(`
    SELECT
      LOWER(TRIM(t.name)) AS slug,
      COUNT(DISTINCT g.id) AS game_count
    FROM tags t
    JOIN game_tags gt ON t.id = gt.tag_id
    JOIN games g      ON gt.game_id = g.id
    WHERE g.is_active = 1
    GROUP BY slug
    ORDER BY game_count DESC
  `);

  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ];

  const seen = new Set();

  function addEntry(slug, gameCount) {
    if (!slug || seen.has(slug)) return;
    seen.add(slug);

    // More games → higher priority
    let priority = "0.60";
    if (gameCount > 100) priority = "0.85";
    else if (gameCount > 50)  priority = "0.80";
    else if (gameCount > 20)  priority = "0.75";
    else if (gameCount > 5)   priority = "0.70";

    lines.push("  <url>");
    lines.push(`    <loc>${BASE_URL}/categories/${escapeXml(slug)}</loc>`);
    lines.push(`    <lastmod>${todayDate()}</lastmod>`);
    lines.push(`    <changefreq>weekly</changefreq>`);
    lines.push(`    <priority>${priority}</priority>`);
    lines.push("  </url>");
  }

  // Categories first (primary navigation pages)
  for (const row of categories) addEntry(row.slug, row.game_count);
  // Tags second (deduplicated — won't add if already added as a category)
  for (const row of tags) addEntry(row.slug, row.game_count);

  lines.push("</urlset>");
  return lines.join("\n");
}

// ─── Cache wrapper ────────────────────────────────────────────────────────────
async function getCached(key, generatorFn) {
  const now   = Date.now();
  const entry = cache[key];
  if (entry.xml && now < entry.expiry) return entry.xml;
  const xml    = await generatorFn();
  entry.xml    = xml;
  entry.expiry = now + CACHE_TTL;
  return xml;
}

function sendXml(res, xml) {
  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.setHeader("X-Robots-Tag", "noindex"); // sitemap files themselves shouldn't be indexed
  res.send(xml);
}

// ─── Routes ───────────────────────────────────────────────────────────────────

// Sitemap index — this is what you submit to Google Search Console
router.get("/sitemap.xml", async (req, res) => {
  try {
    sendXml(res, await getCached("index", generateIndex));
  } catch (err) {
    console.error("❌ Sitemap index error:", err);
    res.status(500).send("Failed to generate sitemap");
  }
});

// Static pages sitemap
router.get("/sitemap-static.xml", async (req, res) => {
  try {
    sendXml(res, await getCached("static", generateStatic));
  } catch (err) {
    console.error("❌ Sitemap static error:", err);
    res.status(500).send("Failed to generate sitemap");
  }
});

// All game pages with image extension
router.get("/sitemap-games.xml", async (req, res) => {
  try {
    sendXml(res, await getCached("games", generateGames));
  } catch (err) {
    console.error("❌ Sitemap games error:", err);
    res.status(500).send("Failed to generate sitemap");
  }
});

// All category + tag pages
router.get("/sitemap-categories.xml", async (req, res) => {
  try {
    sendXml(res, await getCached("categories", generateCategories));
  } catch (err) {
    console.error("❌ Sitemap categories error:", err);
    res.status(500).send("Failed to generate sitemap");
  }
});

export default router;