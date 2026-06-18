// api/fetchH5Games.js
import thumbsList from "../data/game-image-list.json";

const thumbsSet = new Set(thumbsList);

const BLOCKED_GAME_KEYWORDS = [
  "unhook",
  "bra",
  "adult",
  "sex",
  "kiss",
  "poop",
  "gold miner",
  "spank dora butt"
];


export async function fetchH5Games() {
  const res = await fetch(
    `/api/proxy?url=${encodeURIComponent(
      "https://h5games.online/freegames.json"
    )}`
  );
  if (!res.ok) {
  throw new Error(`Proxy failed: ${res.status}`);
}


  const data = await res.json();

  return data
    // 🚫 BLOCK UNWANTED GAMES FIRST
    .filter(g => {
      const title = g.title?.toLowerCase() || "";
      return !BLOCKED_GAME_KEYWORDS.some(keyword =>
        title.includes(keyword)
      );
    })

    //MAP CLEAN DATA
    .map((g, i) => {
      const fileName = `${g.guid || g.title}.jpg`
        .replace(/\s+/g, "-")
        .toLowerCase();

      const localThumbPath = `game-thumbs/${fileName}`;

      const hasCustomThumb = thumbsSet.has(localThumbPath);

      return {
        id: g.guid || `h5-${i}`,
        title: g.title,

        // THIS IS THE KEY PART
        image: hasCustomThumb
          ? `/${localThumbPath}`
          : `/api/proxy?url=${encodeURIComponent(g.thumb)}`,

        embed: g.link,
        description: g.description,
        category: g.category === "puzzle" ? "puzzles" : g.category,
        tagList: g.tags?.toLowerCase().split(",") || [],
        source: "h5games",
      };
    });
}
