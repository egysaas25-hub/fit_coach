// In a real application, you would use a library like 'bcrypt' to hash passwords.
// For this mock backend, we'll use simple string comparison for simplicity.

/**
 * Mocks password hashing. In a real implementation, this would generate a secure hash.
 * @param password - The plain-text password.
 * @returns The "hashed" password (in this case, just the original password with a prefix).
 */
export function hashPassword(password: string): string {
  // This is not a secure hash. Do not use in production.
  return `mock-hashed-${password}`;
}

/**
 * Mocks password comparison. In a real implementation, this would compare the plain-text password
 * with the stored hash.
 * @param password - The plain-text password to check.
 * @param hash - The stored "hash" to compare against.
 * @returns True if the password matches the hash, otherwise false.
 */
export function comparePassword(password: string, hash: string): boolean {
  return hash === `mock-hashed-${password}`;
}
