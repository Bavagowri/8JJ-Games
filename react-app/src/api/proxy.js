export default async function handler(req, res) {
  const target = req.query.url;

  if (!target) {
    return res.status(400).json({ error: "Missing URL" });
  }

  try {
    const response = await fetch(target);
    let html = await response.text();

    const base = target.split("/").slice(0, -1).join("/");

    // Rewrite relative URLs → absolute URLs
    html = html
      .replace(/src="\//g, `src="https://www.onlinegames.io/`)
      .replace(/href="\//g, `href="https://www.onlinegames.io/`)
      .replace(/src="(?!http)([^"]+)"/g, `src="${base}/$1"`)
      .replace(/href="(?!http)([^"]+)"/g, `href="${base}/$1"`);

    res.setHeader("Content-Type", "text/html");
    res.status(200).send(html);
  } catch (e) {
    res.status(500).json({ error: "Proxy failed", details: e.message });
  }
}
