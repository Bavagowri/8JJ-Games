export default async function handler(req, res) {
  const targetUrl = req.query.url;

  if (!targetUrl) {
    return res.status(400).json({ error: "Missing URL" });
  }

  const response = await fetch(targetUrl);
  let html = await response.text();

  // Remove iframe blocking headers
  res.setHeader("Content-Security-Policy", "");
  res.setHeader("X-Frame-Options", "");
  res.setHeader("Access-Control-Allow-Origin", "*");

  res.status(200).send(html);
}
