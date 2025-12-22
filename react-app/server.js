import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const fetch = global.fetch;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const ROOT_DIR = path.resolve(__dirname);

/* ======================
   🔐 CORS
====================== */
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use(express.json());

/* ======================
   🔁 PROXY ENDPOINT
====================== */
app.get("/api/proxy", async (req, res) => {
  const target = req.query.url;

  if (!target) {
    return res.status(400).json({ error: "Missing URL" });
  }

  if (
    !target.startsWith("https://h5games.online") &&
    !target.startsWith("https://s.h5games.online")
  ) {
    return res.status(403).json({ error: "Forbidden" });
  }

  try {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), 15000);

    const response = await fetch(target, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0",
        Referer: "https://h5games.online/",
      },
    });

    const buffer = Buffer.from(await response.arrayBuffer());

    res.setHeader(
      "Content-Type",
      response.headers.get("content-type") ||
        "application/octet-stream"
    );
    res.setHeader("Cache-Control", "public, max-age=86400");

    res.send(buffer);
  } catch (err) {
    console.error("Proxy error:", err.message);
    res.status(500).json({ error: "Proxy failed" });
  }
});


/* ======================
   🌐 SERVE FRONTEND (Express 5 safe)
====================== */
app.use(express.static(path.join(ROOT_DIR, "dist")));

app.use((req, res) => {
  res.sendFile(path.join(ROOT_DIR, "dist", "index.html"));
});


/* ======================
   🚀 START SERVER
====================== */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
