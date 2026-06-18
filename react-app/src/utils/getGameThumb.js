// react-app/src/utils/getGameThumb.js

const R2_BASE =
  import.meta.env.VITE_ASSETS_BASE_URL ||
  "https://assets.8jjgames.com";

export function getGameThumb(game) {
  if (!game) return "/images/game-placeholder.png";

  // Self-hosted games: source === "self" OR provider_id starts with "self_"
  const isSelfHosted = game.source === "self" || game.provider_id?.startsWith("self_");

  if (isSelfHosted && game.image) {
    return game.image;
  }

  // H5 / external games — use R2 CDN
  if (game.image) {
    return `${R2_BASE}/game-thumbs-webp/${game.image}`;
  }

  return "/images/game-placeholder.png";
}