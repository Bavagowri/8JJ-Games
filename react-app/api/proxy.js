export default async function handler(req, res) {
  const target = req.query.url;

  if (!target) {
    return res.status(400).json({ error: "Missing URL" });
  }

  // allow both JSON + images
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
        "Referer": "https://h5games.online/"
      }
    });

    const buffer = await response.arrayBuffer();

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Content-Type",
      response.headers.get("content-type") || "application/octet-stream"
    );
    res.setHeader("Cache-Control", "public, max-age=86400");

    res.status(200).send(Buffer.from(buffer));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Proxy failed" });
  }
}
