/**
 * Hashes an OTP code for secure storage
 * @param code The OTP code to hash
 * @returns The hashed OTP code
 */
export function hashOtp(code: string): string {
  // Simple hash for mock (do NOT use in production)
  let hash = 0;
  for (let i = 0; i < code.length; i++) {
    hash = (hash << 5) - hash + code.charCodeAt(i);
    hash |= 0;
  }
  return String(hash);
}