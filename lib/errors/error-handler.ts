/**
 * Centralized Error Handler
 * 
 * Provides unified error handling across the application with:
 * - Structured error logging
 * - User-friendly error messages
 * - Error severity classification
 * - Retry logic determination
 */

import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';

/**
 * Error severity levels
 */
export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';

/**
 * Error context for additional debugging information
 */
export interface ErrorContext {
  userId?: string;
  action: string;
  metadata?: Record<string, any>;
  requestId?: string;
}

/**
 * Standard error response format
 */
export interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: any;
    timestamp: string;
    requestId: string;
  };
}

/**
 * Error codes used throughout the application
 */
export enum ErrorCode {
  // Client errors (4xx)
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  BAD_REQUEST = 'BAD_REQUEST',
  CONFLICT = 'CONFLICT',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  
  // Server errors (5xx)
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  
  // Business logic errors
  DUPLICATE_ENTRY = 'DUPLICATE_ENTRY',
  FOREIGN_KEY_ERROR = 'FOREIGN_KEY_ERROR',
  RELATION_ERROR = 'RELATION_ERROR',
}

/**
 * Custom application error class
 */
export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public code: ErrorCode = ErrorCode.INTERNAL_ERROR,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Centralized error handler class
 */
export class ErrorHandler {
  /**
   * Generate a unique request ID
   */
  private static generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Handle errors and return appropriate NextResponse
   */
  static handle(error: unknown, context?: ErrorContext): NextResponse {
    const requestId = context?.requestId || this.generateRequestId();
    
    // Log the error
    const severity = this.getErrorSeverity(error);
    const logContext: ErrorContext = {
      action: context?.action || 'unknown',
      userId: context?.userId,
      metadata: context?.metadata,
      requestId,
    };
    this.logError(error, severity, logContext);

    // Build error response
    const errorResponse = this.buildErrorResponse(error, requestId);
    const statusCode = this.getStatusCode(error);

    return NextResponse.json(errorResponse, { status: statusCode });
  }

  /**
   * Build standardized error response
   */
  private static buildErrorResponse(error: unknown, requestId: string): ErrorResponse {
    const timestamp = new Date().toISOString();
    
    // Handle AppError
    if (error instanceof AppError) {
      return {
        error: {
          code: error.code,
          message: error.message,
          details: error.details,
          timestamp,
          requestId,
        },
      };
    }

    // Handle Zod validation errors
    if (error instanceof ZodError) {
      return {
        error: {
          code: ErrorCode.VALIDATION_ERROR,
          message: 'Validation failed',
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
          })),
          timestamp,
          requestId,
        },
      };
    }

    // Handle Prisma errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return this.buildPrismaErrorResponse(error, timestamp, requestId);
    }

    // Handle Prisma validation errors
    if (error instanceof Prisma.PrismaClientValidationError) {
      return {
        error: {
          code: ErrorCode.VALIDATION_ERROR,
          message: 'Invalid data provided',
          timestamp,
          requestId,
        },
      };
    }

    // Handle standard Error
    if (error instanceof Error) {
      return {
        error: {
          code: ErrorCode.INTERNAL_ERROR,
          message: this.getUserMessage(error),
          timestamp,
          requestId,
        },
      };
    }

    // Handle unknown errors
    return {
      error: {
        code: ErrorCode.UNKNOWN_ERROR,
        message: 'An unexpected error occurred',
        timestamp,
        requestId,
      },
    };
  }

  /**
   * Build error response for Prisma errors
   */
  private static buildPrismaErrorResponse(
    error: Prisma.PrismaClientKnownRequestError,
    timestamp: string,
    requestId: string
  ): ErrorResponse {
    switch (error.code) {
      case 'P2002': {
        // Unique constraint violation
        const target = (error.meta?.target as string[]) || [];
        return {
          error: {
            code: ErrorCode.DUPLICATE_ENTRY,
            message: `Duplicate entry for ${target.join(', ')}`,
            details: { fields: target },
            timestamp,
            requestId,
          },
        };
      }

      case 'P2025':
        // Record not found
        return {
          error: {
            code: ErrorCode.NOT_FOUND,
            message: 'Record not found',
            timestamp,
            requestId,
          },
        };

      case 'P2003':
        // Foreign key constraint failed
        return {
          error: {
            code: ErrorCode.FOREIGN_KEY_ERROR,
            message: 'Related record not found',
            timestamp,
            requestId,
          },
        };

      case 'P2014':
        // Required relation violation
        return {
          error: {
            code: ErrorCode.RELATION_ERROR,
            message: 'Cannot delete record with related data',
            timestamp,
            requestId,
          },
        };

      default:
        return {
          error: {
            code: ErrorCode.DATABASE_ERROR,
            message: 'Database error occurred',
            timestamp,
            requestId,
          },
        };
    }
  }

  /**
   * Get HTTP status code for error
   */
  private static getStatusCode(error: unknown): number {
    if (error instanceof AppError) {
      return error.statusCode;
    }

    if (error instanceof ZodError) {
      return 400;
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002':
        case 'P2003':
        case 'P2014':
          return 400;
        case 'P2025':
          return 404;
        default:
          return 500;
      }
    }

    if (error instanceof Prisma.PrismaClientValidationError) {
      return 400;
    }

    return 500;
  }

  /**
   * Get user-friendly error message
   */
  static getUserMessage(error: unknown): string {
    if (error instanceof AppError) {
      return error.message;
    }

    if (error instanceof ZodError) {
      return 'Please check your input and try again';
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002':
          return 'This record already exists';
        case 'P2025':
          return 'The requested record was not found';
        case 'P2003':
          return 'Cannot complete operation due to missing related data';
        case 'P2014':
          return 'Cannot delete this record because it is being used';
        default:
          return 'A database error occurred';
      }
    }

    if (error instanceof Prisma.PrismaClientValidationError) {
      return 'Invalid data provided';
    }

    if (error instanceof Error) {
      // Don't expose internal error messages in production
      if (process.env.NODE_ENV === 'production') {
        return 'An error occurred while processing your request';
      }
      return error.message;
    }

    return 'An unexpected error occurred';
  }

  /**
   * Determine if an error should trigger a retry
   */
  static shouldRetry(error: unknown): boolean {
    // Retry on network errors
    if (error instanceof Error) {
      const message = error.message.toLowerCase();
      if (
        message.includes('network') ||
        message.includes('timeout') ||
        message.includes('econnrefused') ||
        message.includes('enotfound')
      ) {
        return true;
      }
    }

    // Retry on specific Prisma errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Retry on connection errors
      if (error.code === 'P1001' || error.code === 'P1002') {
        return true;
      }
    }

    // Retry on rate limit errors
    if (error instanceof AppError && error.code === ErrorCode.RATE_LIMIT_EXCEEDED) {
      return true;
    }

    return false;
  }

  /**
   * Get error severity level
   */
  private static getErrorSeverity(error: unknown): ErrorSeverity {
    // Critical errors
    if (error instanceof Prisma.PrismaClientInitializationError) {
      return 'critical';
    }

    if (error instanceof AppError) {
      if (error.statusCode >= 500) {
        return 'high';
      }
      if (error.statusCode === 401 || error.statusCode === 403) {
        return 'medium';
      }
      return 'low';
    }

    // High severity for database errors
    if (
      error instanceof Prisma.PrismaClientKnownRequestError ||
      error instanceof Prisma.PrismaClientValidationError
    ) {
      return 'medium';
    }

    // Low severity for validation errors
    if (error instanceof ZodError) {
      return 'low';
    }

    // Default to high for unknown errors
    return 'high';
  }

  /**
   * Log error with context
   * This is a basic implementation. For full structured logging, use error-logger.ts
   */
  static logError(error: unknown, severity: ErrorSeverity, context?: ErrorContext): void {
    const timestamp = new Date().toISOString();
    
    if (process.env.NODE_ENV === 'production') {
      // Production: JSON format
      console.error(JSON.stringify({
        timestamp,
        severity,
        error: error instanceof Error ? {
          name: error.name,
          message: error.message,
          code: (error as any).code,
        } : { message: String(error) },
        context,
      }));
    } else {
      // Development: Human-readable format
      console.error(`\n[${severity.toUpperCase()}] Error at ${timestamp}`);
      console.error('Error:', error);
      if (context) {
        console.error('Context:', context);
      }
    }
  }
}

/**
 * Common error response helpers
 */
export const ErrorResponses = {
  unauthorized: (message: string = 'Unauthorized') =>
    NextResponse.json(
      {
        error: {
          code: ErrorCode.UNAUTHORIZED,
          message,
          timestamp: new Date().toISOString(),
          requestId: `req_${Date.now()}`,
        },
      },
      { status: 401 }
    ),

  forbidden: (message: string = 'Forbidden') =>
    NextResponse.json(
      {
        error: {
          code: ErrorCode.FORBIDDEN,
          message,
          timestamp: new Date().toISOString(),
          requestId: `req_${Date.now()}`,
        },
      },
      { status: 403 }
    ),

  notFound: (resource: string = 'Resource') =>
    NextResponse.json(
      {
        error: {
          code: ErrorCode.NOT_FOUND,
          message: `${resource} not found`,
          timestamp: new Date().toISOString(),
          requestId: `req_${Date.now()}`,
        },
      },
      { status: 404 }
    ),

  badRequest: (message: string = 'Bad request', details?: any) =>
    NextResponse.json(
      {
        error: {
          code: ErrorCode.BAD_REQUEST,
          message,
          details,
          timestamp: new Date().toISOString(),
          requestId: `req_${Date.now()}`,
        },
      },
      { status: 400 }
    ),

  conflict: (message: string = 'Conflict') =>
    NextResponse.json(
      {
        error: {
          code: ErrorCode.CONFLICT,
          message,
          timestamp: new Date().toISOString(),
          requestId: `req_${Date.now()}`,
        },
      },
      { status: 409 }
    ),

  tooManyRequests: (message: string = 'Too many requests') =>
    NextResponse.json(
      {
        error: {
          code: ErrorCode.RATE_LIMIT_EXCEEDED,
          message,
          timestamp: new Date().toISOString(),
          requestId: `req_${Date.now()}`,
        },
      },
      { status: 429 }
    ),

  internalError: (message: string = 'Internal server error') =>
    NextResponse.json(
      {
        error: {
          code: ErrorCode.INTERNAL_ERROR,
          message,
          timestamp: new Date().toISOString(),
          requestId: `req_${Date.now()}`,
        },
      },
      { status: 500 }
    ),
};
