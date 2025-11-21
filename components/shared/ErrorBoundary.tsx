'use client';

/**
 * Error Boundary Component
 * 
 * Catches React errors and prevents full page crashes.
 * Provides user-friendly error UI and logs errors for debugging.
 */

import React, { Component, ReactNode } from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { logError } from '@/lib/errors/error-logger';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  level?: 'root' | 'page' | 'component';
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

/**
 * Error Boundary Component
 * 
 * Usage:
 * ```tsx
 * <ErrorBoundary level="page">
 *   <YourComponent />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log error with context
    const level = this.props.level || 'component';
    const severity = level === 'root' ? 'critical' : level === 'page' ? 'high' : 'medium';
    
    logError(error, severity, {
      action: 'React component error',
      metadata: {
        componentStack: errorInfo.componentStack,
        level,
      },
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    this.setState({
      errorInfo,
    });
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleReload = (): void => {
    window.location.reload();
  };

  handleGoHome = (): void => {
    window.location.href = '/admin/dashboard';
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI based on level
      const level = this.props.level || 'component';
      
      if (level === 'root') {
        return <RootErrorFallback onReload={this.handleReload} />;
      }

      if (level === 'page') {
        return (
          <PageErrorFallback
            error={this.state.error}
            onReset={this.handleReset}
            onGoHome={this.handleGoHome}
          />
        );
      }

      return (
        <ComponentErrorFallback
          error={this.state.error}
          onReset={this.handleReset}
        />
      );
    }

    return this.props.children;
  }
}

/**
 * Root-level error fallback (critical errors)
 */
function RootErrorFallback({ onReload }: { onReload: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-6">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Something went wrong
        </h1>
        <p className="text-gray-600 mb-6">
          We're sorry, but something unexpected happened. Please try reloading the page.
        </p>
        <Button onClick={onReload} className="w-full">
          <RefreshCw className="h-4 w-4 mr-2" />
          Reload Page
        </Button>
        <p className="text-sm text-gray-500 mt-4">
          If the problem persists, please contact support.
        </p>
      </div>
    </div>
  );
}

/**
 * Page-level error fallback
 */
function PageErrorFallback({
  error,
  onReset,
  onGoHome,
}: {
  error: Error | null;
  onReset: () => void;
  onGoHome: () => void;
}) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-6">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Unable to load this page
        </h2>
        <p className="text-gray-600 mb-6">
          {error?.message || 'An error occurred while loading this page.'}
        </p>
        <div className="flex gap-3 justify-center">
          <Button onClick={onReset} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
          <Button onClick={onGoHome}>
            <Home className="h-4 w-4 mr-2" />
            Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}

/**
 * Component-level error fallback
 */
function ComponentErrorFallback({
  error,
  onReset,
}: {
  error: Error | null;
  onReset: () => void;
}) {
  return (
    <div className="border border-red-200 bg-red-50 rounded-lg p-6 my-4">
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-sm font-medium text-red-900 mb-1">
            Component Error
          </h3>
          <p className="text-sm text-red-700 mb-3">
            {error?.message || 'This component encountered an error.'}
          </p>
          <Button onClick={onReset} size="sm" variant="outline">
            <RefreshCw className="h-3 w-3 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    </div>
  );
}

/**
 * Hook for using error boundary in functional components
 */
export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  return setError;
}
