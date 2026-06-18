const ALLOWED_DOMAINS = ["h5games.online"];

export async function fetchExternal(url) {
  if (!ALLOWED_DOMAINS.some(d => url.includes(d))) {
    throw new Error("Blocked domain");
  }

  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0",
      "Referer": "https://h5games.online/"
    }
  });

  return {
    buffer: Buffer.from(await response.arrayBuffer()),
    contentType: response.headers.get("content-type")
  };
}
