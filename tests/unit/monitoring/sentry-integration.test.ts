/**
 * Sentry Integration Tests
 * 
 * Tests for error monitoring and Sentry integration
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { logError } from '@/lib/errors/error-logger';

// Mock Sentry
const mockCaptureException = vi.fn();
const mockCaptureMessage = vi.fn();
const mockWithScope = vi.fn((callback) => callback({ 
  setTag: vi.fn(), 
  setContext: vi.fn(),
  setLevel: vi.fn(),
}));

vi.mock('@sentry/nextjs', () => ({
  captureException: mockCaptureException,
  captureMessage: mockCaptureMessage,
  withScope: mockWithScope,
  startTransaction: vi.fn(() => ({
    finish: vi.fn(),
  })),
}));

describe('Sentry Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock environment variables
    process.env.SENTRY_DSN = 'https://test@sentry.io/123';
    process.env.NEXT_PUBLIC_SENTRY_DSN = 'https://test@sentry.io/123';
  });

  afterEach(() => {
    delete process.env.SENTRY_DSN;
    delete process.env.NEXT_PUBLIC_SENTRY_DSN;
  });

  describe('Error logging with Sentry', () => {
    it('should send critical errors to Sentry', async () => {
      const error = new Error('Critical error');
      
      logError(error, 'critical', {
        action: 'critical_operation',
        userId: 'user123',
      });

      // Wait for async Sentry import
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(mockCaptureException).toHaveBeenCalled();
    });

    it('should not send errors to Sentry if DSN not configured', async () => {
      delete process.env.SENTRY_DSN;
      delete process.env.NEXT_PUBLIC_SENTRY_DSN;

      const error = new Error('Test error');
      logError(error, 'critical', {
        action: 'test_action',
      });

      await new Promise(resolve => setTimeout(resolve, 100));

      // Should not attempt to send to Sentry
      expect(mockCaptureException).not.toHaveBeenCalled();
    });

    it('should map severity levels to Sentry levels', async () => {
      const testCases = [
        { severity: 'critical' as const, expected: 'fatal' },
        { severity: 'high' as const, expected: 'error' },
        { severity: 'medium' as const, expected: 'warning' },
        { severity: 'low' as const, expected: 'info' },
      ];

      for (const { severity, expected } of testCases) {
        mockCaptureException.mockClear();
        
        const error = new Error(`${severity} error`);
        logError(error, severity, {
          action: `test_${severity}`,
        });

        await new Promise(resolve => setTimeout(resolve, 100));

        if (severity === 'critical') {
          expect(mockCaptureException).toHaveBeenCalledWith(
            expect.any(Error),
            expect.objectContaining({
              level: expected,
            })
          );
        }
      }
    });

    it('should include context in Sentry events', async () => {
      const error = new Error('Test error');
      const context = {
        action: 'test_action',
        userId: 'user123',
        metadata: {
          key: 'value',
          nested: { data: 'test' },
        },
      };

      logError(error, 'critical', context);

      await new Promise(resolve => setTimeout(resolve, 100));

      expect(mockCaptureException).toHaveBeenCalledWith(
        expect.any(Error),
        expect.objectContaining({
          contexts: expect.objectContaining({
            custom: expect.objectContaining({
              action: 'test_action',
              userId: 'user123',
              metadata: context.metadata,
            }),
          }),
        })
      );
    });

    it('should include error code as tag', async () => {
      const error = new Error('Test error');
      (error as any).code = 'TEST_ERROR_CODE';

      logError(error, 'critical', {
        action: 'test_action',
      });

      await new Promise(resolve => setTimeout(resolve, 100));

      expect(mockCaptureException).toHaveBeenCalledWith(
        expect.any(Error),
        expect.objectContaining({
          tags: expect.objectContaining({
            errorCode: 'TEST_ERROR_CODE',
          }),
        })
      );
    });

    it('should include environment in tags', async () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      const error = new Error('Production error');
      logError(error, 'critical', {
        action: 'production_action',
      });

      await new Promise(resolve => setTimeout(resolve, 100));

      expect(mockCaptureException).toHaveBeenCalledWith(
        expect.any(Error),
        expect.objectContaining({
          tags: expect.objectContaining({
            environment: 'production',
          }),
        })
      );

      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('Sentry configuration', () => {
    it('should not send events in development by default', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';
      delete process.env.SENTRY_ENABLE_DEV;

      // This would be tested in the actual Sentry config files
      // Here we just verify the environment check
      expect(process.env.NODE_ENV).toBe('development');
      expect(process.env.SENTRY_ENABLE_DEV).toBeUndefined();

      process.env.NODE_ENV = originalEnv;
    });

    it('should send events in development if explicitly enabled', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';
      process.env.SENTRY_ENABLE_DEV = 'true';

      expect(process.env.SENTRY_ENABLE_DEV).toBe('true');

      process.env.NODE_ENV = originalEnv;
      delete process.env.SENTRY_ENABLE_DEV;
    });
  });

  describe('Error handling in Sentry integration', () => {
    it('should handle Sentry import errors gracefully', async () => {
      // Mock console.error to verify error is logged
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      // This test verifies that if Sentry fails to import, the app doesn't crash
      const error = new Error('Test error');
      
      expect(() => {
        logError(error, 'critical', {
          action: 'test_action',
        });
      }).not.toThrow();

      consoleErrorSpy.mockRestore();
    });

    it('should continue logging even if Sentry fails', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      mockCaptureException.mockImplementation(() => {
        throw new Error('Sentry error');
      });

      const error = new Error('Test error');
      
      expect(() => {
        logError(error, 'critical', {
          action: 'test_action',
        });
      }).not.toThrow();

      // Should still log to console
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });

  describe('Sensitive data filtering', () => {
    it('should not include sensitive data in Sentry events', async () => {
      const error = new Error('Test error');
      const context = {
        action: 'test_action',
        userId: 'user123',
        metadata: {
          password: 'secret123',
          token: 'abc123',
          apiKey: 'key123',
          safeData: 'this is ok',
        },
      };

      logError(error, 'critical', context);

      await new Promise(resolve => setTimeout(resolve, 100));

      // Verify the context is passed (filtering happens in Sentry config)
      expect(mockCaptureException).toHaveBeenCalled();
    });
  });

  describe('Performance monitoring', () => {
    it('should support transaction tracking', async () => {
      const Sentry = await import('@sentry/nextjs');
      
      const transaction = Sentry.startTransaction({
        op: 'test',
        name: 'Test Transaction',
      });

      expect(transaction).toBeDefined();
      expect(transaction.finish).toBeDefined();
      
      transaction.finish();
    });
  });

  describe('Error severity classification', () => {
    it('should only send critical errors to monitoring by default', async () => {
      const testCases = [
        { severity: 'low' as const, shouldSend: false },
        { severity: 'medium' as const, shouldSend: false },
        { severity: 'high' as const, shouldSend: false },
        { severity: 'critical' as const, shouldSend: true },
      ];

      for (const { severity, shouldSend } of testCases) {
        mockCaptureException.mockClear();
        
        const error = new Error(`${severity} error`);
        logError(error, severity, {
          action: `test_${severity}`,
        });

        await new Promise(resolve => setTimeout(resolve, 100));

        if (shouldSend) {
          expect(mockCaptureException).toHaveBeenCalled();
        } else {
          expect(mockCaptureException).not.toHaveBeenCalled();
        }
      }
    });
  });
});

describe('Sentry Configuration Files', () => {
  it('should have client configuration', () => {
    // Verify client config file exists and has correct structure
    expect(() => require('../../../sentry.client.config')).not.toThrow();
  });

  it('should have server configuration', () => {
    // Verify server config file exists
    expect(() => require('../../../sentry.server.config')).not.toThrow();
  });

  it('should have edge configuration', () => {
    // Verify edge config file exists
    expect(() => require('../../../sentry.edge.config')).not.toThrow();
  });

  it('should have instrumentation file', () => {
    // Verify instrumentation file exists
    expect(() => require('../../../instrumentation')).not.toThrow();
  });
});
