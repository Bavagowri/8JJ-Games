export default async function handler(req, res) {
  const target = req.query.url;

  if (!target) {
    return res.status(400).json({ error: "Missing URL" });
  }

  try {
    const response = await fetch(target);

    const contentType = response.headers.get("content-type") || "";

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", contentType);

    // Stream response directly (best method)
    const body = await response.arrayBuffer();
    res.send(Buffer.from(body));
  } catch (e) {
    res.status(500).json({ error: "Proxy failed", details: e.toString() });
  }
}
