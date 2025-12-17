const RECENT_KEY = "8jj_recent_v1";

export function loadRecent() {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveRecent(list) {
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(list));
  } catch {}
}

export function pushRecent(game) {
  const list = loadRecent().filter((g) => g.id !== game.id);
  list.unshift({
    id: game.id,
    title: game.title,
    image: game.image,
    category: game.category || "",
    gameId: game.gameId,
    externalUrl: game.externalUrl,
    ts: Date.now(),
  });
  if (list.length > 12) list.length = 12;
  saveRecent(list);
}
