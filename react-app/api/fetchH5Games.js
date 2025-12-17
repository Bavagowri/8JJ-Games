// api/fetchH5Games.js
export async function fetchH5Games() {
  const res = await fetch(
    `/api/proxy?url=${encodeURIComponent(
      "https://h5games.online/freegames.json"
    )}`
  );

  const data = await res.json();

  return data.map((g, i) => ({
    id: g.guid || i,
    title: g.title,

    // 🔥 IMAGE MUST ALSO GO THROUGH PROXY
    image: `/api/proxy?url=${encodeURIComponent(g.thumb)}`,

    embed: g.link,
    description: g.description,

    category: g.category === "puzzle" ? "puzzles" : g.category,
    tagList: g.tags.toLowerCase().split(","),

    source: "h5games"
  }));
}
