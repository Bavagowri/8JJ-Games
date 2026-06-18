// server/src/services/fetch.service.js



export async function proxyFetch(url) {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0",
      "Referer": "https://h5games.online/"
    }
  });

  const contentType =
    response.headers.get("content-type") || "application/octet-stream";

  const buffer = Buffer.from(await response.arrayBuffer());

  return { buffer, contentType };
}
