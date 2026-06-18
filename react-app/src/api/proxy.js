export default async function handler(req, res) {
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
    const response = await fetch(target, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        Referer: "https://h5games.online/",
      },
    });

    if (!response.ok) {
      return res.status(response.status).send("Upstream error");
    }

    const contentType = response.headers.get("content-type") || "";

    // JSON handling (THIS IS THE KEY FIX)
    if (contentType.includes("application/json")) {
      const json = await response.json();
      return res.status(200).json(json);
    }

    // Binary handling (images, etc.)
    const buffer = Buffer.from(await response.arrayBuffer());

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", "public, max-age=86400");

    return res.status(200).send(buffer);

  } catch (e) {
    console.error("Proxy error:", e);
    return res.status(500).json({ error: "Proxy failed" });
  }
}
