import { NextRequest, NextResponse } from 'next/server';
import { error } from '@/lib/utils/response';

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// In-memory rate limit store (use Redis in production)
const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Rate limiting middleware
 * @param maxRequests Maximum number of requests allowed
 * @param windowMs Time window in milliseconds
 */
export function rateLimit(maxRequests: number = 5, windowMs: number = 15 * 60 * 1000) {
  return async (req: NextRequest) => {
    const identifier = req.ip || req.headers.get('x-forwarded-for') || 'unknown';
    const now = Date.now();

    // Get or create rate limit entry
    let entry = rateLimitStore.get(identifier);

    // Clean up expired entries
    if (entry && entry.resetAt < now) {
      rateLimitStore.delete(identifier);
      entry = undefined;
    }

    if (!entry) {
      // Create new entry
      entry = {
        count: 1,
        resetAt: now + windowMs,
      };
      rateLimitStore.set(identifier, entry);
      return null; // Allow request
    }

    // Increment count
    entry.count++;

    if (entry.count > maxRequests) {
      const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
      return error(
        `Too many requests. Please try again in ${retryAfter} seconds.`,
        429
      );
    }

    return null; // Allow request
  };
}

/**
 * Apply rate limiting to a route handler
 */
export function withRateLimit(
  handler: (req: NextRequest, ...args: any[]) => Promise<NextResponse>,
  maxRequests: number = 5,
  windowMs: number = 15 * 60 * 1000
) {
  return async (req: NextRequest, ...args: any[]) => {
    const rateLimitResult = await rateLimit(maxRequests, windowMs)(req);
    if (rateLimitResult) {
      return rateLimitResult; // Return rate limit error
    }
    return handler(req, ...args);
  };
}