export function generateReferralCode(username) {
  const base = username.slice(0, 4).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${base}${random}`;
}
