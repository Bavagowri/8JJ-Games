// server.cjs
const express = require("express");
const fetch = global.fetch; // Node 18+ (you have this)
const app = express();

app.get("/api/proxy", async (req, res) => {
  const target = req.query.url;
  if (!target) {
    return res.status(400).json({ error: "Missing URL" });
  }

  try {
    const response = await fetch(target, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Referer": "https://h5games.online/"
      }
    });

    const contentType = response.headers.get("content-type");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", contentType);

    const buffer = Buffer.from(await response.arrayBuffer());
    res.send(buffer);

  } catch (err) {
    console.error("Proxy error:", err);
    res.status(500).json({ error: "Proxy failed" });
  }
});

app.listen(5174, () => {
  console.log("Proxy running on http://localhost:5174");
});
