/**
 * Structured Error Logger
 * 
 * Provides structured logging for errors with:
 * - Severity levels
 * - Context information
 * - Environment-aware logging
 * - JSON formatting for production
 */

import { ErrorContext } from './error-handler';

/**
 * Error severity levels
 */
export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';

/**
 * Log entry structure
 */
interface LogEntry {
  timestamp: string;
  severity: ErrorSeverity;
  error: {
    name: string;
    message: string;
    stack?: string;
    code?: string;
  };
  context?: ErrorContext;
  environment: string;
}

/**
 * Color codes for console output (development only)
 */
const COLORS = {
  low: '\x1b[36m',      // Cyan
  medium: '\x1b[33m',   // Yellow
  high: '\x1b[31m',     // Red
  critical: '\x1b[35m', // Magenta
  reset: '\x1b[0m',
};

/**
 * Log error with structured format
 */
export function logError(
  error: unknown,
  severity: ErrorSeverity = 'medium',
  context?: ErrorContext
): void {
  const logEntry = buildLogEntry(error, severity, context);

  if (process.env.NODE_ENV === 'production') {
    logProductionError(logEntry);
  } else {
    logDevelopmentError(logEntry);
  }

  // Send critical errors to monitoring service
  if (severity === 'critical') {
    sendToMonitoring(logEntry);
  }
}

/**
 * Build structured log entry
 */
function buildLogEntry(
  error: unknown,
  severity: ErrorSeverity,
  context?: ErrorContext
): LogEntry {
  const timestamp = new Date().toISOString();
  const environment = process.env.NODE_ENV || 'development';

  let errorInfo: LogEntry['error'];

  if (error instanceof Error) {
    errorInfo = {
      name: error.name,
      message: error.message,
      stack: error.stack,
      code: (error as any).code,
    };
  } else if (typeof error === 'string') {
    errorInfo = {
      name: 'Error',
      message: error,
    };
  } else {
    errorInfo = {
      name: 'UnknownError',
      message: 'An unknown error occurred',
    };
  }

  return {
    timestamp,
    severity,
    error: errorInfo,
    context,
    environment,
  };
}

/**
 * Log error in production (JSON format)
 */
function logProductionError(logEntry: LogEntry): void {
  // Remove stack traces in production for security
  const sanitizedEntry = {
    ...logEntry,
    error: {
      ...logEntry.error,
      stack: undefined, // Don't log stack traces in production
    },
  };

  // Log as JSON for log aggregation services
  console.error(JSON.stringify(sanitizedEntry));
}

/**
 * Log error in development (human-readable format)
 */
function logDevelopmentError(logEntry: LogEntry): void {
  const color = COLORS[logEntry.severity];
  const reset = COLORS.reset;

  console.error('\n' + '='.repeat(80));
  console.error(`${color}[${logEntry.severity.toUpperCase()}] Error at ${logEntry.timestamp}${reset}`);
  console.error('='.repeat(80));
  
  console.error(`\n${color}Error:${reset}`, logEntry.error.name);
  console.error(`${color}Message:${reset}`, logEntry.error.message);
  
  if (logEntry.error.code) {
    console.error(`${color}Code:${reset}`, logEntry.error.code);
  }

  if (logEntry.context) {
    console.error(`\n${color}Context:${reset}`);
    console.error('  Action:', logEntry.context.action);
    if (logEntry.context.userId) {
      console.error('  User ID:', logEntry.context.userId);
    }
    if (logEntry.context.requestId) {
      console.error('  Request ID:', logEntry.context.requestId);
    }
    if (logEntry.context.metadata) {
      console.error('  Metadata:', JSON.stringify(logEntry.context.metadata, null, 2));
    }
  }

  if (logEntry.error.stack) {
    console.error(`\n${color}Stack Trace:${reset}`);
    console.error(logEntry.error.stack);
  }

  console.error('='.repeat(80) + '\n');
}

/**
 * Send critical errors to monitoring service
 * 
 * Integrates with Sentry for error tracking and alerting
 */
function sendToMonitoring(logEntry: LogEntry): void {
  // Only send to Sentry if DSN is configured
  if (!process.env.SENTRY_DSN && !process.env.NEXT_PUBLIC_SENTRY_DSN) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('🚨 Critical error - Sentry not configured:', {
        severity: logEntry.severity,
        error: logEntry.error.name,
        message: logEntry.error.message,
      });
    }
    return;
  }

  try {
    // Dynamically import Sentry to avoid issues if not configured
    import('@sentry/nextjs').then((Sentry) => {
      // Map our severity to Sentry severity
      const sentryLevel = mapSeverityToSentryLevel(logEntry.severity);

      // Create error object if we only have a message
      const error = new Error(logEntry.error.message);
      error.name = logEntry.error.name;
      if (logEntry.error.stack) {
        error.stack = logEntry.error.stack;
      }

      // Capture exception with context
      Sentry.captureException(error, {
        level: sentryLevel,
        tags: {
          errorCode: logEntry.error.code,
          environment: logEntry.environment,
        },
        contexts: {
          custom: {
            ...logEntry.context,
            timestamp: logEntry.timestamp,
          },
        },
        extra: {
          severity: logEntry.severity,
          errorName: logEntry.error.name,
        },
      });
    }).catch((err) => {
      console.error('Failed to send error to Sentry:', err);
    });
  } catch (err) {
    console.error('Error sending to monitoring service:', err);
  }
}

/**
 * Map our severity levels to Sentry severity levels
 */
function mapSeverityToSentryLevel(severity: ErrorSeverity): 'fatal' | 'error' | 'warning' | 'info' {
  switch (severity) {
    case 'critical':
      return 'fatal';
    case 'high':
      return 'error';
    case 'medium':
      return 'warning';
    case 'low':
      return 'info';
    default:
      return 'error';
  }
}

/**
 * Log info message
 */
export function logInfo(message: string, metadata?: Record<string, any>): void {
  const timestamp = new Date().toISOString();
  
  if (process.env.NODE_ENV === 'production') {
    console.log(JSON.stringify({
      timestamp,
      level: 'info',
      message,
      metadata,
    }));
  } else {
    console.log(`[INFO] ${timestamp}:`, message, metadata || '');
  }
}

/**
 * Log warning message
 */
export function logWarning(message: string, metadata?: Record<string, any>): void {
  const timestamp = new Date().toISOString();
  
  if (process.env.NODE_ENV === 'production') {
    console.warn(JSON.stringify({
      timestamp,
      level: 'warning',
      message,
      metadata,
    }));
  } else {
    console.warn(`[WARNING] ${timestamp}:`, message, metadata || '');
  }
}

/**
 * Log debug message (development only)
 */
export function logDebug(message: string, metadata?: Record<string, any>): void {
  if (process.env.NODE_ENV !== 'production') {
    const timestamp = new Date().toISOString();
    console.debug(`[DEBUG] ${timestamp}:`, message, metadata || '');
  }
}
