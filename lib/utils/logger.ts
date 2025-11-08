import { NextRequest } from 'next/server';

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4,
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
  stack?: string;
  requestId?: string;
}

class Logger {
  private minLevel: LogLevel = LogLevel.INFO;
  private logs: LogEntry[] = [];
  private maxLogs: number = 1000;

  constructor() {
    // Set log level from environment
    const envLevel = process.env.LOG_LEVEL?.toUpperCase();
    if (envLevel && LogLevel[envLevel as keyof typeof LogLevel] !== undefined) {
      this.minLevel = LogLevel[envLevel as keyof typeof LogLevel];
    }
  }

  private formatLevel(level: LogLevel): string {
    const colors = {
      [LogLevel.DEBUG]: '\x1b[36m', // Cyan
      [LogLevel.INFO]: '\x1b[32m', // Green
      [LogLevel.WARN]: '\x1b[33m', // Yellow
      [LogLevel.ERROR]: '\x1b[31m', // Red
      [LogLevel.FATAL]: '\x1b[35m', // Magenta
    };
    const reset = '\x1b[0m';
    const levelName = LogLevel[level].padEnd(5);
    return `${colors[level]}${levelName}${reset}`;
  }

  private formatTimestamp(): string {
    return new Date().toISOString();
  }

  private log(
    level: LogLevel,
    message: string,
    context?: Record<string, any>,
    error?: Error
  ): void {
    if (level < this.minLevel) return;

    const timestamp = this.formatTimestamp();
    const logEntry: LogEntry = {
      timestamp,
      level,
      message,
      context,
      stack: error?.stack,
      requestId: context?.requestId,
    };

    // Store in memory
    this.logs.push(logEntry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Console output
    const levelStr = this.formatLevel(level);
    const contextStr = context ? ` ${JSON.stringify(context)}` : '';
    const stackStr = error?.stack ? `\n${error.stack}` : '';

    console.log(`[${timestamp}] ${levelStr} ${message}${contextStr}${stackStr}`);

    // In production, you would also:
    // - Send to external logging service (Datadog, Sentry, etc.)
    // - Write to file
    // - Send alerts for ERROR/FATAL
  }

  debug(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  info(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.INFO, message, context);
  }

  warn(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.WARN, message, context);
  }

  error(message: string, error?: Error | unknown, context?: Record<string, any>): void {
    const err = error instanceof Error ? error : undefined;
    this.log(LogLevel.ERROR, message, context, err);
  }

  fatal(message: string, error?: Error | unknown, context?: Record<string, any>): void {
    const err = error instanceof Error ? error : undefined;
    this.log(LogLevel.FATAL, message, context, err);
  }

  // Get recent logs (for debugging/admin dashboard)
  getRecentLogs(count: number = 100): LogEntry[] {
    return this.logs.slice(-count);
  }

  // Clear logs
  clearLogs(): void {
    this.logs = [];
  }

  // Get logs by level
  getLogsByLevel(level: LogLevel): LogEntry[] {
    return this.logs.filter((log) => log.level === level);
  }

  // Get logs by request ID
  getLogsByRequestId(requestId: string): LogEntry[] {
    return this.logs.filter((log) => log.requestId === requestId);
  }

  // Export logs as JSON
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}

// Singleton instance
export const logger = new Logger();

// Helper to add request context to logger
export function withRequestContext(req: NextRequest, context: Record<string, any> = {}) {
  return {
    ...context,
    requestId: req.headers.get('x-request-id') || generateRequestId(),
    method: req.method,
    url: req.url,
    ip: req.ip || req.headers.get('x-forwarded-for') || 'unknown',
    userAgent: req.headers.get('user-agent') || 'unknown',
  };
}

// Generate unique request ID
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substring(7)}`;
}