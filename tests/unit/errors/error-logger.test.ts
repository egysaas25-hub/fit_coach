/**
 * Error Logger Tests
 * 
 * Tests for the structured error logging system
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { logError, logInfo, logWarning, logDebug } from '@/lib/errors/error-logger';

describe('Error Logger', () => {
  let consoleErrorSpy: any;
  let consoleLogSpy: any;
  let consoleWarnSpy: any;
  let consoleDebugSpy: any;

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    consoleDebugSpy = vi.spyOn(console, 'debug').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('logError', () => {
    it('should log error with severity', () => {
      const error = new Error('Test error');
      logError(error, 'high', {
        action: 'test_action',
        userId: 'user123',
      });

      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    it('should log error without context', () => {
      const error = new Error('Test error');
      logError(error, 'medium');

      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    it('should handle string errors', () => {
      logError('String error message', 'low');

      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    it('should handle unknown error types', () => {
      logError({ unknown: 'error' }, 'medium');

      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    it('should log in JSON format in production', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      const error = new Error('Production error');
      logError(error, 'high', {
        action: 'production_action',
      });

      expect(consoleErrorSpy).toHaveBeenCalled();
      const loggedData = consoleErrorSpy.mock.calls[0][0];
      
      // In production, should be JSON string
      expect(typeof loggedData).toBe('string');
      
      // Should be valid JSON
      const parsed = JSON.parse(loggedData);
      expect(parsed).toHaveProperty('timestamp');
      expect(parsed).toHaveProperty('severity');
      expect(parsed).toHaveProperty('error');
      expect(parsed.error).not.toHaveProperty('stack'); // Stack removed in production

      process.env.NODE_ENV = originalEnv;
    });

    it('should log with stack trace in development', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      const error = new Error('Development error');
      logError(error, 'medium', {
        action: 'dev_action',
      });

      expect(consoleErrorSpy).toHaveBeenCalled();

      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('logInfo', () => {
    it('should log info message', () => {
      logInfo('Test info message', { key: 'value' });

      expect(consoleLogSpy).toHaveBeenCalled();
    });

    it('should log info without metadata', () => {
      logInfo('Simple info message');

      expect(consoleLogSpy).toHaveBeenCalled();
    });

    it('should log in JSON format in production', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      logInfo('Production info', { data: 'test' });

      expect(consoleLogSpy).toHaveBeenCalled();
      const loggedData = consoleLogSpy.mock.calls[0][0];
      
      // Should be JSON string in production
      expect(typeof loggedData).toBe('string');
      const parsed = JSON.parse(loggedData);
      expect(parsed.level).toBe('info');
      expect(parsed.message).toBe('Production info');

      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('logWarning', () => {
    it('should log warning message', () => {
      logWarning('Test warning', { reason: 'test' });

      expect(consoleWarnSpy).toHaveBeenCalled();
    });

    it('should log warning without metadata', () => {
      logWarning('Simple warning');

      expect(consoleWarnSpy).toHaveBeenCalled();
    });

    it('should log in JSON format in production', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      logWarning('Production warning', { data: 'test' });

      expect(consoleWarnSpy).toHaveBeenCalled();
      const loggedData = consoleWarnSpy.mock.calls[0][0];
      
      // Should be JSON string in production
      expect(typeof loggedData).toBe('string');
      const parsed = JSON.parse(loggedData);
      expect(parsed.level).toBe('warning');

      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('logDebug', () => {
    it('should log debug message in development', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      logDebug('Debug message', { debug: 'data' });

      expect(consoleDebugSpy).toHaveBeenCalled();

      process.env.NODE_ENV = originalEnv;
    });

    it('should not log debug message in production', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      logDebug('Debug message', { debug: 'data' });

      expect(consoleDebugSpy).not.toHaveBeenCalled();

      process.env.NODE_ENV = originalEnv;
    });
  });
});
