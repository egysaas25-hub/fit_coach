/**
 * Test Sentry Integration
 * 
 * This endpoint is used to test error monitoring and logging.
 * Visit /api/test-sentry to trigger test errors and verify Sentry is working.
 * 
 * IMPORTANT: Remove or disable this endpoint in production!
 */

import { NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';
import { ErrorHandler } from '@/lib/errors/error-handler';
import { logError, logInfo, logWarning } from '@/lib/errors/error-logger';

export async function GET(request: Request) {
  // Only allow in development or if explicitly enabled
  if (process.env.NODE_ENV === 'production' && !process.env.ENABLE_SENTRY_TEST) {
    return NextResponse.json(
      { error: 'Test endpoint disabled in production' },
      { status: 403 }
    );
  }

  const { searchParams } = new URL(request.url);
  const testType = searchParams.get('type') || 'all';

  const results: string[] = [];

  try {
    // Test 1: Direct Sentry exception
    if (testType === 'all' || testType === 'exception') {
      Sentry.captureException(new Error('Test exception from Sentry test endpoint'));
      results.push('✓ Sent test exception to Sentry');
    }

    // Test 2: Sentry message
    if (testType === 'all' || testType === 'message') {
      Sentry.captureMessage('Test message from Sentry test endpoint', 'info');
      results.push('✓ Sent test message to Sentry');
    }

    // Test 3: Error logger with different severities
    if (testType === 'all' || testType === 'logger') {
      logInfo('Test info log', { test: true });
      results.push('✓ Logged info message');

      logWarning('Test warning log', { test: true });
      results.push('✓ Logged warning message');

      logError(new Error('Test error from error logger'), 'medium', {
        action: 'test_sentry',
        metadata: { testType: 'logger' },
      });
      results.push('✓ Logged error with medium severity');
    }

    // Test 4: Critical error (should trigger monitoring)
    if (testType === 'all' || testType === 'critical') {
      logError(new Error('Test CRITICAL error'), 'critical', {
        action: 'test_sentry_critical',
        metadata: { testType: 'critical' },
      });
      results.push('✓ Logged critical error (should trigger monitoring)');
    }

    // Test 5: Error handler
    if (testType === 'all' || testType === 'handler') {
      try {
        throw new Error('Test error for error handler');
      } catch (error) {
        // This would normally return an error response
        // For testing, we just log it
        logError(error, 'high', {
          action: 'test_error_handler',
          metadata: { testType: 'handler' },
        });
        results.push('✓ Tested error handler');
      }
    }

    // Test 6: Custom context and tags
    if (testType === 'all' || testType === 'context') {
      Sentry.withScope((scope) => {
        scope.setTag('test_type', 'context');
        scope.setContext('test_context', {
          feature: 'error_monitoring',
          timestamp: new Date().toISOString(),
        });
        scope.setLevel('warning');
        Sentry.captureMessage('Test with custom context and tags');
      });
      results.push('✓ Sent error with custom context and tags');
    }

    // Test 7: Performance monitoring
    if (testType === 'all' || testType === 'performance') {
      const transaction = Sentry.startTransaction({
        op: 'test',
        name: 'Test Performance Transaction',
      });

      // Simulate some work
      await new Promise(resolve => setTimeout(resolve, 100));

      transaction.finish();
      results.push('✓ Sent performance transaction');
    }

    return NextResponse.json({
      success: true,
      message: 'Sentry test completed',
      results,
      instructions: [
        '1. Check your Sentry dashboard at https://sentry.io/',
        '2. Go to Issues tab to see captured errors',
        '3. Go to Performance tab to see transactions',
        '4. Verify that context and tags are captured correctly',
      ],
      testTypes: {
        all: 'Run all tests (default)',
        exception: 'Test exception capture',
        message: 'Test message capture',
        logger: 'Test error logger',
        critical: 'Test critical error',
        handler: 'Test error handler',
        context: 'Test custom context',
        performance: 'Test performance monitoring',
      },
      example: '/api/test-sentry?type=critical',
    });
  } catch (error) {
    return ErrorHandler.handle(error, {
      action: 'test_sentry',
      metadata: { testType },
    });
  }
}
