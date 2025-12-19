const express = require("express");
const fetch = global.fetch; // Node 18+
const path = require("path");

const app = express();

/* ======================
   🔐 CORS (optional)
====================== */
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

/* ======================
   🔁 PROXY ENDPOINT
====================== */
app.get("/api/proxy", async (req, res) => {
  const target = req.query.url;

  if (!target) {
    return res.status(400).json({ error: "Missing URL" });
  }

  // Security allowlist
  if (
    !target.startsWith("https://h5games.online") &&
    !target.startsWith("https://s.h5games.online")
  ) {
    return res.status(403).json({ error: "Forbidden" });
  }

  try {
    const response = await fetch(target, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Referer": "https://h5games.online/",
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
    console.error("Proxy error:", err);
    res.status(500).json({ error: "Proxy failed" });
  }
});

/* ======================
   🌐 SERVE FRONTEND
====================== */
app.use(express.static(path.join(__dirname, "dist")));

app.get("*", (_, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

/* ======================
   🚀 START SERVER
====================== */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
