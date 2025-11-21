/**
 * Sentry Server Configuration
 * 
 * This file configures Sentry for server-side error tracking and performance monitoring.
 */

import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,

  // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  // Environment
  environment: process.env.NODE_ENV || 'development',

  // Release tracking
  release: process.env.VERCEL_GIT_COMMIT_SHA,

  // Ignore specific errors
  ignoreErrors: [
    // Expected Prisma errors
    'P2025', // Record not found
    // Network timeouts that are expected
    'ETIMEDOUT',
    'ECONNREFUSED',
  ],

  // Filter out sensitive data
  beforeSend(event, hint) {
    // Don't send events in development unless explicitly enabled
    if (process.env.NODE_ENV === 'development' && !process.env.SENTRY_ENABLE_DEV) {
      return null;
    }

    // Remove sensitive data from event
    if (event.request) {
      delete event.request.cookies;
      
      // Sanitize headers
      if (event.request.headers) {
        delete event.request.headers['authorization'];
        delete event.request.headers['cookie'];
      }

      // Sanitize query parameters
      if (event.request.query_string) {
        // Remove sensitive query params
        const sensitiveParams = ['token', 'password', 'secret', 'api_key'];
        sensitiveParams.forEach(param => {
          if (event.request?.query_string?.includes(param)) {
            event.request.query_string = event.request.query_string.replace(
              new RegExp(`${param}=[^&]*`, 'gi'),
              `${param}=[REDACTED]`
            );
          }
        });
      }
    }

    // Sanitize extra data
    if (event.extra) {
      const sensitiveKeys = ['password', 'token', 'secret', 'apiKey', 'api_key'];
      sensitiveKeys.forEach(key => {
        if (event.extra && key in event.extra) {
          event.extra[key] = '[REDACTED]';
        }
      });
    }

    return event;
  },

  // Configure integrations
  integrations: [
    // Add custom integrations here if needed
  ],
});
