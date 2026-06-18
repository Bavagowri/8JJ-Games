import crypto from 'crypto';

/**
 * Generate a random alphanumeric code
 * Format: 8 uppercase alphanumeric characters (e.g., A9F3K2XQ)
 */
export function generateRedemptionCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(crypto.randomInt(0, chars.length));
  }
  return code;
}

// console.log('✅ Code generator utility loaded');