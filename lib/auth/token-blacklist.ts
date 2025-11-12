// In-memory blacklist for logged out tokens (in production, use Redis)
const tokenBlacklist = new Set<string>();

export function addToBlacklist(token: string) {
  tokenBlacklist.add(token);
}

export function isBlacklisted(token: string): boolean {
  return tokenBlacklist.has(token);
}

export function removeFromBlacklist(token: string) {
  tokenBlacklist.delete(token);
}