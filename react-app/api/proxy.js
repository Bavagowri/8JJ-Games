export default async function handler(req, res) {
  const target = req.query.url;
  if (!target) {
    return res.status(400).json({ error: "Missing URL" });
  }

  try {
    const response = await fetch(target);

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");

    const contentType = response.headers.get("content-type") || "application/octet-stream";
    res.setHeader("Content-Type", contentType);

    const arrayBuffer = await response.arrayBuffer();
    res.send(Buffer.from(arrayBuffer));

  } catch (err) {
    res.status(500).json({
      error: "Proxy error",
      details: err.toString(),
    });
  }
}
