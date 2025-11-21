/**
 * API Error Response Tests
 * 
 * Tests for API error handling and response formatting
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NextRequest, NextResponse } from 'next/server';
import { ErrorHandler, ErrorResponses, AppError, ErrorCode } from '@/lib/errors/error-handler';
import { Prisma } from '@prisma/client';
import { ZodError, z } from 'zod';

describe('API Error Responses', () => {
  describe('ErrorResponses helpers', () => {
    it('should create unauthorized response', async () => {
      const response = ErrorResponses.unauthorized('Invalid token');
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error.code).toBe(ErrorCode.UNAUTHORIZED);
      expect(data.error.message).toBe('Invalid token');
      expect(data.error.timestamp).toBeDefined();
      expect(data.error.requestId).toBeDefined();
    });

    it('should create forbidden response', async () => {
      const response = ErrorResponses.forbidden('Access denied');
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.error.code).toBe(ErrorCode.FORBIDDEN);
      expect(data.error.message).toBe('Access denied');
    });

    it('should create not found response', async () => {
      const response = ErrorResponses.notFound('User');
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error.code).toBe(ErrorCode.NOT_FOUND);
      expect(data.error.message).toBe('User not found');
    });

    it('should create bad request response', async () => {
      const response = ErrorResponses.badRequest('Invalid input', { field: 'email' });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error.code).toBe(ErrorCode.BAD_REQUEST);
      expect(data.error.message).toBe('Invalid input');
      expect(data.error.details).toEqual({ field: 'email' });
    });

    it('should create conflict response', async () => {
      const response = ErrorResponses.conflict('Resource already exists');
      const data = await response.json();

      expect(response.status).toBe(409);
      expect(data.error.code).toBe(ErrorCode.CONFLICT);
      expect(data.error.message).toBe('Resource already exists');
    });

    it('should create rate limit response', async () => {
      const response = ErrorResponses.tooManyRequests('Rate limit exceeded');
      const data = await response.json();

      expect(response.status).toBe(429);
      expect(data.error.code).toBe(ErrorCode.RATE_LIMIT_EXCEEDED);
      expect(data.error.message).toBe('Rate limit exceeded');
    });

    it('should create internal error response', async () => {
      const response = ErrorResponses.internalError('Server error');
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error.code).toBe(ErrorCode.INTERNAL_ERROR);
      expect(data.error.message).toBe('Server error');
    });
  });

  describe('ErrorHandler.handle', () => {
    beforeEach(() => {
      vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    it('should handle AppError correctly', async () => {
      const error = new AppError('Custom error', 400, ErrorCode.BAD_REQUEST);
      const response = ErrorHandler.handle(error, {
        action: 'test_action',
        userId: 'user123',
      });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error.code).toBe(ErrorCode.BAD_REQUEST);
      expect(data.error.message).toBe('Custom error');
      expect(data.error.requestId).toBeDefined();
      expect(data.error.timestamp).toBeDefined();
    });

    it('should handle ZodError with field details', async () => {
      const schema = z.object({
        email: z.string().email(),
        age: z.number().min(18),
      });

      try {
        schema.parse({ email: 'invalid', age: 10 });
      } catch (error) {
        const response = ErrorHandler.handle(error, {
          action: 'validate_input',
        });
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.error.code).toBe(ErrorCode.VALIDATION_ERROR);
        expect(data.error.message).toBe('Validation failed');
        expect(data.error.details).toBeInstanceOf(Array);
        expect(data.error.details.length).toBeGreaterThan(0);
        expect(data.error.details[0]).toHaveProperty('field');
        expect(data.error.details[0]).toHaveProperty('message');
      }
    });

    it('should handle Prisma unique constraint error', async () => {
      const error = new Prisma.PrismaClientKnownRequestError(
        'Unique constraint failed',
        {
          code: 'P2002',
          clientVersion: '5.0.0',
          meta: { target: ['email'] },
        }
      );

      const response = ErrorHandler.handle(error, {
        action: 'create_user',
      });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error.code).toBe(ErrorCode.DUPLICATE_ENTRY);
      expect(data.error.message).toBe('Duplicate entry for email');
      expect(data.error.details).toEqual({ fields: ['email'] });
    });

    it('should handle Prisma record not found error', async () => {
      const error = new Prisma.PrismaClientKnownRequestError(
        'Record not found',
        {
          code: 'P2025',
          clientVersion: '5.0.0',
        }
      );

      const response = ErrorHandler.handle(error, {
        action: 'find_user',
      });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error.code).toBe(ErrorCode.NOT_FOUND);
      expect(data.error.message).toBe('Record not found');
    });

    it('should handle Prisma foreign key error', async () => {
      const error = new Prisma.PrismaClientKnownRequestError(
        'Foreign key constraint failed',
        {
          code: 'P2003',
          clientVersion: '5.0.0',
        }
      );

      const response = ErrorHandler.handle(error, {
        action: 'create_record',
      });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error.code).toBe(ErrorCode.FOREIGN_KEY_ERROR);
      expect(data.error.message).toBe('Related record not found');
    });

    it('should handle Prisma relation error', async () => {
      const error = new Prisma.PrismaClientKnownRequestError(
        'Required relation violation',
        {
          code: 'P2014',
          clientVersion: '5.0.0',
        }
      );

      const response = ErrorHandler.handle(error, {
        action: 'delete_record',
      });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error.code).toBe(ErrorCode.RELATION_ERROR);
      expect(data.error.message).toBe('Cannot delete record with related data');
    });

    it('should handle generic Error', async () => {
      const error = new Error('Something went wrong');
      const response = ErrorHandler.handle(error, {
        action: 'generic_action',
      });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error.code).toBe(ErrorCode.INTERNAL_ERROR);
      expect(data.error.requestId).toBeDefined();
    });

    it('should include context in error logging', async () => {
      const logSpy = vi.spyOn(ErrorHandler, 'logError');
      const error = new Error('Test error');
      const context = {
        action: 'test_action',
        userId: 'user123',
        metadata: { key: 'value' },
      };

      ErrorHandler.handle(error, context);

      expect(logSpy).toHaveBeenCalledWith(
        error,
        expect.any(String),
        expect.objectContaining({
          action: 'test_action',
          userId: 'user123',
          metadata: { key: 'value' },
        })
      );
    });

    it('should generate unique request IDs', async () => {
      const error1 = new Error('Error 1');
      const error2 = new Error('Error 2');

      const response1 = ErrorHandler.handle(error1, { action: 'action1' });
      const response2 = ErrorHandler.handle(error2, { action: 'action2' });

      const data1 = await response1.json();
      const data2 = await response2.json();

      expect(data1.error.requestId).toBeDefined();
      expect(data2.error.requestId).toBeDefined();
      expect(data1.error.requestId).not.toBe(data2.error.requestId);
    });

    it('should include timestamp in ISO format', async () => {
      const error = new Error('Test error');
      const response = ErrorHandler.handle(error, { action: 'test' });
      const data = await response.json();

      expect(data.error.timestamp).toBeDefined();
      expect(() => new Date(data.error.timestamp)).not.toThrow();
      expect(new Date(data.error.timestamp).toISOString()).toBe(data.error.timestamp);
    });
  });

  describe('Error response format', () => {
    it('should have consistent error response structure', async () => {
      const error = new AppError('Test', 400, ErrorCode.BAD_REQUEST);
      const response = ErrorHandler.handle(error, { action: 'test' });
      const data = await response.json();

      expect(data).toHaveProperty('error');
      expect(data.error).toHaveProperty('code');
      expect(data.error).toHaveProperty('message');
      expect(data.error).toHaveProperty('timestamp');
      expect(data.error).toHaveProperty('requestId');
    });

    it('should not expose sensitive information in production', async () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      const error = new Error('Internal database connection string: postgres://user:pass@host');
      const response = ErrorHandler.handle(error, { action: 'test' });
      const data = await response.json();

      expect(data.error.message).not.toContain('postgres://');
      expect(data.error.message).not.toContain('pass@');

      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('Status code mapping', () => {
    it('should map validation errors to 400', async () => {
      const schema = z.object({ name: z.string() });
      try {
        schema.parse({});
      } catch (error) {
        const response = ErrorHandler.handle(error, { action: 'validate' });
        expect(response.status).toBe(400);
      }
    });

    it('should map not found errors to 404', async () => {
      const error = new Prisma.PrismaClientKnownRequestError('Not found', {
        code: 'P2025',
        clientVersion: '5.0.0',
      });
      const response = ErrorHandler.handle(error, { action: 'find' });
      expect(response.status).toBe(404);
    });

    it('should map unknown errors to 500', async () => {
      const error = new Error('Unknown error');
      const response = ErrorHandler.handle(error, { action: 'unknown' });
      expect(response.status).toBe(500);
    });

    it('should respect custom status codes in AppError', async () => {
      const error = new AppError('Custom', 418, ErrorCode.BAD_REQUEST);
      const response = ErrorHandler.handle(error, { action: 'test' });
      expect(response.status).toBe(418);
    });
  });
});
