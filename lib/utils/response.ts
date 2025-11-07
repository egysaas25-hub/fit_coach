import { NextResponse } from 'next/server';
// In a real application, you might use Zod's error types for more detailed validation errors.
// import { ZodError } from 'zod';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
    details?: any;
  };
  timestamp: string;
}

interface PaginatedApiResponse<T> extends ApiResponse<T[]> {
    pagination?: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    }
}

/**
 * Creates a standardized success response.
 * @param data - The payload to be included in the response.
 * @param status - The HTTP status code (default is 200).
 * @returns A NextResponse object.
 */
export function success<T>(data: T, status: number = 200): NextResponse {
  return NextResponse.json(
    {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    } as ApiResponse<T>,
    { status }
  );
}

/**
 * Creates a paginated success response.
 * @param data - The array of data for the current page.
 * @param pagination - Pagination metadata.
 * @param status - The HTTP status code (default is 200).
 * @returns A NextResponse object.
 */
export function paginatedSuccess<T>(data: T[], pagination: PaginatedApiResponse<T>['pagination'], status: number = 200): NextResponse {
    return NextResponse.json({
        success: true,
        data,
        pagination,
        timestamp: new Date().toISOString()
    } as PaginatedApiResponse<T>, { status });
}

/**
 * Creates a standardized error response.
 * @param message - The error message.
 * @param status - The HTTP status code.
 * @param details - Optional additional error details.
 * @returns A NextResponse object.
 */
export function error(message: string, status: number, details?: any): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: {
        message,
        details,
      },
      timestamp: new Date().toISOString(),
    } as ApiResponse<never>,
    { status }
  );
}

/**
 * Creates a validation error response.
 * @param errors - The validation errors (e.g., from Zod).
 * @returns A NextResponse object with a 400 status code.
 */
export function validationError(errors: any): NextResponse {
  return error('Validation failed', 400, errors);
}

/**
 * Creates a 401 Unauthorized error response.
 * @param message - The error message (default is 'Unauthorized').
 * @returns A NextResponse object.
 */
export function unauthorized(message: string = 'Unauthorized'): NextResponse {
  return error(message, 401);
}

/**
 * Creates a 403 Forbidden error response.
 * @param message - The error message (default is 'Forbidden').
 * @returns A NextResponse object.
 */
export function forbidden(message: string = 'Forbidden'): NextResponse {
  return error(message, 403);
}

/**
 * Creates a 404 Not Found error response.
 * @param resource - The name of the resource that was not found.
 * @returns A NextResponse object.
 */
export function notFound(resource: string = 'Resource'): NextResponse {
  return error(`${resource} not found`, 404);
}
