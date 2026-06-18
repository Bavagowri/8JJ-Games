// react-app/src/utils/levelProgress.js
import { LEVELS } from "../config/levels";

export function getLevelProgress(points, level) {
  const current = LEVELS.find(l => l.level === level);
  const next = LEVELS.find(l => l.level === level + 1);

  // Max level (Immortal)
  if (!current || !next) {
    return {
      percent: 100,
      remaining: 0,
      currentName: current?.name || "Immortal",
      nextName: null
    };
  }

  const gained = points - current.minPoints;
  const needed = next.minPoints - current.minPoints;

  const percent = Math.min(100, Math.floor((gained / needed) * 100));
  const remaining = Math.max(0, next.minPoints - points);

  return {
    percent,
    remaining,
    currentName: current.name,
    nextName: next.name
  };
}
