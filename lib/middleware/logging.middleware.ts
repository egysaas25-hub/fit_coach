import { NextRequest, NextResponse } from 'next/server';
import { logger, withRequestContext } from '@/lib/utils/logger';

interface RequestLog {
  requestId: string;
  method: string;
  url: string;
  ip: string;
  userAgent: string;
  startTime: number;
  userId?: string;
}

// Store active requests
const activeRequests = new Map<string, RequestLog>();

/**
 * Generate or retrieve request ID
 */
function getRequestId(req: NextRequest): string {
  const existingId = req.headers.get('x-request-id');
  if (existingId) return existingId;

  return `req_${Date.now()}_${Math.random().toString(36).substring(7)}`;
}

/**
 * Log incoming request
 */
export function logRequest(req: NextRequest): string {
  const requestId = getRequestId(req);
  const context = withRequestContext(req);

  const requestLog: RequestLog = {
    requestId,
    method: req.method,
    url: req.url,
    ip: context.ip,
    userAgent: context.userAgent,
    startTime: Date.now(),
  };

  activeRequests.set(requestId, requestLog);

  logger.info(`→ ${req.method} ${req.url}`, {
    requestId,
    ip: context.ip,
    userAgent: context.userAgent,
  });

  return requestId;
}

/**
 * Log outgoing response
 */
export function logResponse(
  requestId: string,
  response: NextResponse,
  userId?: string
): void {
  const requestLog = activeRequests.get(requestId);

  if (requestLog) {
    const duration = Date.now() - requestLog.startTime;
    const status = response.status;

    const context = {
      requestId,
      method: requestLog.method,
      url: requestLog.url,
      status,
      duration: `${duration}ms`,
      userId,
    };

    // Log with appropriate level based on status
    if (status >= 500) {
      logger.error(`← ${status} ${requestLog.method} ${requestLog.url}`, undefined, context);
    } else if (status >= 400) {
      logger.warn(`← ${status} ${requestLog.method} ${requestLog.url}`, context);
    } else {
      logger.info(`← ${status} ${requestLog.method} ${requestLog.url}`, context);
    }

    // Clean up
    activeRequests.delete(requestId);
  }
}

/**
 * Middleware wrapper for route handlers
 */
export function withLogging(
  handler: (req: NextRequest, ...args: any[]) => Promise<NextResponse>
) {
  return async (req: NextRequest, ...args: any[]): Promise<NextResponse> => {
    const requestId = logRequest(req);

    try {
      const response = await handler(req, ...args);

      // Add request ID to response headers
      response.headers.set('x-request-id', requestId);

      // Extract user ID from token if available
      const authHeader = req.headers.get('authorization');
      let userId: string | undefined;

      if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        try {
          // Simple extraction from mock token
          const payload = JSON.parse(
            Buffer.from(token.split('.')[1], 'base64').toString()
          );
          userId = payload.userId;
        } catch {
          // Ignore parsing errors
        }
      }

      logResponse(requestId, response, userId);

      return response;
    } catch (error) {
      logger.error('Request handler error', error, { requestId });

      // Still log the response even on error
      const errorResponse = NextResponse.json(
        { error: 'Internal Server Error' },
        { status: 500 }
      );
      errorResponse.headers.set('x-request-id', requestId);
      logResponse(requestId, errorResponse);

      throw error;
    }
  };
}

/**
 * Log authentication attempts
 */
export function logAuthAttempt(
  req: NextRequest,
  email: string,
  success: boolean,
  reason?: string
): void {
  const context = withRequestContext(req, {
    email,
    success,
    reason,
  });

  if (success) {
    logger.info('Authentication successful', context);
  } else {
    logger.warn('Authentication failed', { ...context, reason });
  }
}

/**
 * Log data modifications
 */
export function logDataModification(
  action: 'create' | 'update' | 'delete',
  entity: string,
  entityId: string,
  userId: string,
  changes?: Record<string, any>
): void {
  logger.info(`Data ${action}: ${entity}`, {
    action,
    entity,
    entityId,
    userId,
    changes,
  });
}

/**
 * Log permission denied
 */
export function logPermissionDenied(
  userId: string,
  resource: string,
  action: string
): void {
  logger.warn('Permission denied', {
    userId,
    resource,
    action,
  });
}