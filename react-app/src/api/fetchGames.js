export async function fetchGames() {
  const url =
    "https://corsproxy.io/?https://www.onlinegames.io/media/plugins/genGames/embed.json";

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("API failed");

    const data = await res.json();

    // Add tagList array
    return data.map((game, index) => ({
      ...game,
      tagList: game.tags.split(","),
      globalIndex: index
    }));

  } catch (err) {
    console.error("Game fetch failed:", err);
    return [];
  }
}
