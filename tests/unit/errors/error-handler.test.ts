/**
 * Error Handler Tests
 * 
 * Tests for the centralized error handling system
 */

import { describe, it, expect } from 'vitest';
import { ErrorHandler, AppError, ErrorCode } from '@/lib/errors/error-handler';
import { Prisma } from '@prisma/client';
import { ZodError, z } from 'zod';

describe('ErrorHandler', () => {
  describe('AppError', () => {
    it('should create AppError with correct properties', () => {
      const error = new AppError(
        'Test error',
        400,
        ErrorCode.BAD_REQUEST,
        { field: 'test' }
      );

      expect(error.message).toBe('Test error');
      expect(error.statusCode).toBe(400);
      expect(error.code).toBe(ErrorCode.BAD_REQUEST);
      expect(error.details).toEqual({ field: 'test' });
      expect(error.name).toBe('AppError');
    });

    it('should default to 500 status code', () => {
      const error = new AppError('Test error');
      expect(error.statusCode).toBe(500);
      expect(error.code).toBe(ErrorCode.INTERNAL_ERROR);
    });
  });

  describe('getUserMessage', () => {
    it('should return message for AppError', () => {
      const error = new AppError('Custom message', 400, ErrorCode.BAD_REQUEST);
      const message = ErrorHandler.getUserMessage(error);
      expect(message).toBe('Custom message');
    });

    it('should return friendly message for ZodError', () => {
      const schema = z.object({ name: z.string() });
      try {
        schema.parse({});
      } catch (error) {
        const message = ErrorHandler.getUserMessage(error);
        expect(message).toBe('Please check your input and try again');
      }
    });

    it('should return friendly message for Prisma P2002 error', () => {
      const error = new Prisma.PrismaClientKnownRequestError(
        'Unique constraint failed',
        {
          code: 'P2002',
          clientVersion: '5.0.0',
          meta: { target: ['email'] },
        }
      );
      const message = ErrorHandler.getUserMessage(error);
      expect(message).toBe('This record already exists');
    });

    it('should return friendly message for Prisma P2025 error', () => {
      const error = new Prisma.PrismaClientKnownRequestError(
        'Record not found',
        {
          code: 'P2025',
          clientVersion: '5.0.0',
        }
      );
      const message = ErrorHandler.getUserMessage(error);
      expect(message).toBe('The requested record was not found');
    });

    it('should return generic message for unknown errors in production', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      const error = new Error('Internal error details');
      const message = ErrorHandler.getUserMessage(error);
      expect(message).toBe('An error occurred while processing your request');

      process.env.NODE_ENV = originalEnv;
    });

    it('should return actual message for errors in development', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      const error = new Error('Detailed error message');
      const message = ErrorHandler.getUserMessage(error);
      expect(message).toBe('Detailed error message');

      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('shouldRetry', () => {
    it('should return true for network errors', () => {
      const error = new Error('Network timeout');
      expect(ErrorHandler.shouldRetry(error)).toBe(true);
    });

    it('should return true for connection errors', () => {
      const error = new Error('ECONNREFUSED');
      expect(ErrorHandler.shouldRetry(error)).toBe(true);
    });

    it('should return true for Prisma connection errors', () => {
      const error = new Prisma.PrismaClientKnownRequestError(
        'Connection error',
        {
          code: 'P1001',
          clientVersion: '5.0.0',
        }
      );
      expect(ErrorHandler.shouldRetry(error)).toBe(true);
    });

    it('should return true for rate limit errors', () => {
      const error = new AppError(
        'Too many requests',
        429,
        ErrorCode.RATE_LIMIT_EXCEEDED
      );
      expect(ErrorHandler.shouldRetry(error)).toBe(true);
    });

    it('should return false for validation errors', () => {
      const error = new AppError(
        'Validation failed',
        400,
        ErrorCode.VALIDATION_ERROR
      );
      expect(ErrorHandler.shouldRetry(error)).toBe(false);
    });

    it('should return false for not found errors', () => {
      const error = new AppError('Not found', 404, ErrorCode.NOT_FOUND);
      expect(ErrorHandler.shouldRetry(error)).toBe(false);
    });
  });

  describe('handle', () => {
    it('should return NextResponse with correct status for AppError', () => {
      const error = new AppError('Test error', 400, ErrorCode.BAD_REQUEST);
      const response = ErrorHandler.handle(error, {
        action: 'test_action',
      });

      expect(response.status).toBe(400);
    });

    it('should return 400 for ZodError', () => {
      const schema = z.object({ name: z.string() });
      try {
        schema.parse({});
      } catch (error) {
        const response = ErrorHandler.handle(error, {
          action: 'validation',
        });
        expect(response.status).toBe(400);
      }
    });

    it('should return 404 for Prisma P2025 error', () => {
      const error = new Prisma.PrismaClientKnownRequestError(
        'Record not found',
        {
          code: 'P2025',
          clientVersion: '5.0.0',
        }
      );
      const response = ErrorHandler.handle(error, {
        action: 'find_record',
      });
      expect(response.status).toBe(404);
    });

    it('should return 500 for unknown errors', () => {
      const error = new Error('Unknown error');
      const response = ErrorHandler.handle(error, {
        action: 'unknown_action',
      });
      expect(response.status).toBe(500);
    });
  });
});

describe('ErrorCode', () => {
  it('should have all expected error codes', () => {
    expect(ErrorCode.VALIDATION_ERROR).toBe('VALIDATION_ERROR');
    expect(ErrorCode.UNAUTHORIZED).toBe('UNAUTHORIZED');
    expect(ErrorCode.FORBIDDEN).toBe('FORBIDDEN');
    expect(ErrorCode.NOT_FOUND).toBe('NOT_FOUND');
    expect(ErrorCode.BAD_REQUEST).toBe('BAD_REQUEST');
    expect(ErrorCode.CONFLICT).toBe('CONFLICT');
    expect(ErrorCode.RATE_LIMIT_EXCEEDED).toBe('RATE_LIMIT_EXCEEDED');
    expect(ErrorCode.INTERNAL_ERROR).toBe('INTERNAL_ERROR');
    expect(ErrorCode.DATABASE_ERROR).toBe('DATABASE_ERROR');
    expect(ErrorCode.EXTERNAL_SERVICE_ERROR).toBe('EXTERNAL_SERVICE_ERROR');
    expect(ErrorCode.UNKNOWN_ERROR).toBe('UNKNOWN_ERROR');
    expect(ErrorCode.DUPLICATE_ENTRY).toBe('DUPLICATE_ENTRY');
    expect(ErrorCode.FOREIGN_KEY_ERROR).toBe('FOREIGN_KEY_ERROR');
    expect(ErrorCode.RELATION_ERROR).toBe('RELATION_ERROR');
  });
});
