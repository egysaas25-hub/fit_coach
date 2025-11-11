/**
 * Auth Types
 */

export interface TokenPayload {
  userId: string;
  role: string;
  exp: number; // Expiration timestamp
}