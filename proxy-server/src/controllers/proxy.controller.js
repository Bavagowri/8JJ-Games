import { fetchExternal } from "../services/fetch.service.js";

export async function proxyRequest(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "Missing URL" });
  }

  try {
    const { buffer, contentType } = await fetchExternal(url);
    res.setHeader("Content-Type", contentType);
    res.send(buffer);
  } catch (err) {
    console.error("Proxy error:", err);
    res.status(500).json({ error: "Proxy failed" });
  }
}
 