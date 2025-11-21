/**
 * Error Boundary Component Tests
 * 
 * Tests for React error boundary component
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ErrorBoundary, useErrorHandler } from '@/components/shared/ErrorBoundary';
import * as errorLogger from '@/lib/errors/error-logger';

// Mock error logger
vi.mock('@/lib/errors/error-logger', () => ({
  logError: vi.fn(),
}));

// Component that throws an error
function ThrowError({ shouldThrow = false }: { shouldThrow?: boolean }) {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>No error</div>;
}

describe('ErrorBoundary', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Suppress console errors in tests
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  describe('Component rendering', () => {
    it('should render children when no error occurs', () => {
      render(
        <ErrorBoundary>
          <div>Test content</div>
        </ErrorBoundary>
      );

      expect(screen.getByText('Test content')).toBeInTheDocument();
    });

    it('should catch errors and render fallback UI', () => {
      render(
        <ErrorBoundary level="component">
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByText('Component Error')).toBeInTheDocument();
    });

    it('should render custom fallback when provided', () => {
      render(
        <ErrorBoundary fallback={<div>Custom fallback</div>}>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByText('Custom fallback')).toBeInTheDocument();
    });
  });

  describe('Error levels', () => {
    it('should render root-level error fallback', () => {
      render(
        <ErrorBoundary level="root">
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      expect(screen.getByText('Reload Page')).toBeInTheDocument();
    });

    it('should render page-level error fallback', () => {
      render(
        <ErrorBoundary level="page">
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByText('Unable to load this page')).toBeInTheDocument();
      expect(screen.getByText('Try Again')).toBeInTheDocument();
      expect(screen.getByText('Go to Dashboard')).toBeInTheDocument();
    });

    it('should render component-level error fallback', () => {
      render(
        <ErrorBoundary level="component">
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByText('Component Error')).toBeInTheDocument();
      expect(screen.getByText('Retry')).toBeInTheDocument();
    });
  });

  describe('Error logging', () => {
    it('should log error with correct severity for root level', () => {
      render(
        <ErrorBoundary level="root">
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(errorLogger.logError).toHaveBeenCalledWith(
        expect.any(Error),
        'critical',
        expect.objectContaining({
          action: 'React component error',
          metadata: expect.objectContaining({
            level: 'root',
          }),
        })
      );
    });

    it('should log error with correct severity for page level', () => {
      render(
        <ErrorBoundary level="page">
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(errorLogger.logError).toHaveBeenCalledWith(
        expect.any(Error),
        'high',
        expect.objectContaining({
          action: 'React component error',
          metadata: expect.objectContaining({
            level: 'page',
          }),
        })
      );
    });

    it('should log error with correct severity for component level', () => {
      render(
        <ErrorBoundary level="component">
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(errorLogger.logError).toHaveBeenCalledWith(
        expect.any(Error),
        'medium',
        expect.objectContaining({
          action: 'React component error',
          metadata: expect.objectContaining({
            level: 'component',
          }),
        })
      );
    });

    it('should call custom onError handler when provided', () => {
      const onError = vi.fn();

      render(
        <ErrorBoundary onError={onError}>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(onError).toHaveBeenCalledWith(
        expect.any(Error),
        expect.objectContaining({
          componentStack: expect.any(String),
        })
      );
    });
  });

  describe('Error recovery', () => {
    it('should reset error state when retry is clicked', () => {
      const { rerender } = render(
        <ErrorBoundary level="component">
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByText('Component Error')).toBeInTheDocument();

      // Click retry button
      const retryButton = screen.getByText('Retry');
      retryButton.click();

      // Rerender with no error
      rerender(
        <ErrorBoundary level="component">
          <ThrowError shouldThrow={false} />
        </ErrorBoundary>
      );

      expect(screen.getByText('No error')).toBeInTheDocument();
    });
  });

  describe('Error messages', () => {
    it('should display error message in page-level fallback', () => {
      const ErrorComponent = () => {
        throw new Error('Custom error message');
      };

      render(
        <ErrorBoundary level="page">
          <ErrorComponent />
        </ErrorBoundary>
      );

      expect(screen.getByText('Custom error message')).toBeInTheDocument();
    });

    it('should display error message in component-level fallback', () => {
      const ErrorComponent = () => {
        throw new Error('Component error message');
      };

      render(
        <ErrorBoundary level="component">
          <ErrorComponent />
        </ErrorBoundary>
      );

      expect(screen.getByText('Component error message')).toBeInTheDocument();
    });
  });
});

describe('useErrorHandler', () => {
  it('should throw error when set', () => {
    function TestComponent() {
      const handleError = useErrorHandler();
      
      return (
        <button onClick={() => handleError(new Error('Test error'))}>
          Throw error
        </button>
      );
    }

    expect(() => {
      render(
        <ErrorBoundary>
          <TestComponent />
        </ErrorBoundary>
      );
      
      screen.getByText('Throw error').click();
    }).not.toThrow();

    // Error should be caught by boundary
    expect(screen.getByText('Component Error')).toBeInTheDocument();
  });
});
