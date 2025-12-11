// server.cjs (CommonJS)
const express = require("express");
const app = express();

app.get("/api/proxy", async (req, res) => {
  const target = req.query.url;

  if (!target) {
    return res.status(400).json({ error: "Missing URL" });
  }

  try {
    const response = await fetch(target);

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", response.headers.get("content-type"));

    const arrayBuffer = await response.arrayBuffer();
    res.send(Buffer.from(arrayBuffer));

  } catch (err) {
    console.error("Proxy error:", err);
    res.status(500).json({ error: "Proxy failed" });
  }
});

const PORT = 5174;
app.listen(PORT, () => {
  console.log("Local proxy running on http://localhost:" + PORT);
});
