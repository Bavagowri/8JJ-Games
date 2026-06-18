// react-app/src/utils/avatarUrl.js

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5050';

/**
 * Resolves an avatar path to a full URL pointing at the backend.
 * Handles three cases:
 *   1. Already a full URL (http/https)  → return as-is
 *   2. A relative path like /uploads/…  → prepend API_URL
 *   3. Null / undefined / empty         → return default avatar
 */
export function resolveAvatarUrl(avatar, fallback = '/images/default-avatar.png') {
  if (!avatar) return fallback;
  if (avatar.startsWith('http://') || avatar.startsWith('https://')) return avatar;
  // Relative path — point to backend
  return `${API_URL}${avatar.startsWith('/') ? '' : '/'}${avatar}`;
}