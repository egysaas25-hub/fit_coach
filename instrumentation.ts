/**
 * Next.js Instrumentation
 * 
 * This file is used to initialize monitoring and observability tools.
 * It runs once when the server starts.
 */

export async function register() {
  // Only run on server
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Import Sentry server config
    await import('./sentry.server.config');
  }

  // Only run on edge
  if (process.env.NEXT_RUNTIME === 'edge') {
    // Import Sentry edge config
    await import('./sentry.edge.config');
  }
}
