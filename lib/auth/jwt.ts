// In a real application, you would use a library like 'jsonwebtoken' or 'jose'.
// For this mock backend, we'll use simple base64 encoding to simulate tokens.

import { isBlacklisted } from '@/app/api/auth/logout/route';

export interface TokenPayload {
  userId: string;
  role: string;
  exp: number; // Expiration timestamp
}

// Mock secret key
const MOCK_SECRET = 'your-super-secret-key-that-is-not-secret';

/**
 * Generates a mock JWT token.
 * @param userId - The ID of the user.
 * @param role - The role of the user.
 * @returns A mock JWT token.
 */
export async function generateToken(userId: string, role: string): Promise<string> {
  const payload: TokenPayload = {
    userId,
    role,
    exp: Date.now() + 60 * 60 * 1000, // Expires in 1 hour
  };

  // Simple base64 encoding to simulate a token
  const header = Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT' })).toString(
    'base64'
  );
  const body = Buffer.from(JSON.stringify(payload)).toString('base64');

  return `${header}.${body}.mock_signature`;
}

/**
 * Verifies a mock JWT token.
 * @param token - The mock JWT token.
 * @returns The token payload if the token is valid and not expired, otherwise null.
 */
export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    // Check if token is blacklisted
    if (isBlacklisted(token)) {
      console.log('Token is blacklisted');
      return null;
    }

    const [header, body, signature] = token.split('.');
    if (!header || !body || !signature) {
      return null;
    }

    const payload: TokenPayload = JSON.parse(
      Buffer.from(body, 'base64').toString('utf-8')
    );

    // Check for expiration
    if (payload.exp < Date.now()) {
      console.log('Mock token expired');
      return null;
    }

    return payload;
  } catch (error) {
    console.error('Invalid mock token:', error);
    return null;
  }
}

/**
 * Mocks the refresh token functionality.
 * In a real implementation, this would handle refresh tokens to issue new access tokens.
 * @param token - The refresh token.
 * @returns A new mock access token.
 */
export async function refreshToken(token: string): Promise<string> {
  // For simplicity, we'll just re-use the verify logic and generate a new token
  const payload = await verifyToken(token);
  if (!payload) {
    throw new Error('Invalid refresh token');
  }
  return generateToken(payload.userId, payload.role);
}