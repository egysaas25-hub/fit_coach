import { NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { ZodError } from 'zod'

/**
 * Custom application error class
 */
export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message)
    this.name = 'AppError'
  }
}

/**
 * Handle API errors and return appropriate NextResponse
 */
export function handleAPIError(error: unknown): NextResponse {
  console.error('API Error:', error)

  // Handle AppError
  if (error instanceof AppError) {
    return NextResponse.json(
      { error: error.message, code: error.code },
      { status: error.statusCode }
    )
  }

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      },
      { status: 400 }
    )
  }

  // Handle Prisma errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        // Unique constraint violation
        const target = (error.meta?.target as string[]) || []
        return NextResponse.json(
          {
            error: `Duplicate entry for ${target.join(', ')}`,
            code: 'DUPLICATE_ENTRY',
          },
          { status: 400 }
        )

      case 'P2025':
        // Record not found
        return NextResponse.json(
          { error: 'Record not found', code: 'NOT_FOUND' },
          { status: 404 }
        )

      case 'P2003':
        // Foreign key constraint failed
        return NextResponse.json(
          { error: 'Related record not found', code: 'FOREIGN_KEY_ERROR' },
          { status: 400 }
        )

      case 'P2014':
        // Required relation violation
        return NextResponse.json(
          { error: 'Cannot delete record with related data', code: 'RELATION_ERROR' },
          { status: 400 }
        )

      default:
        return NextResponse.json(
          { error: 'Database error', code: 'DATABASE_ERROR' },
          { status: 500 }
        )
    }
  }

  // Handle Prisma validation errors
  if (error instanceof Prisma.PrismaClientValidationError) {
    return NextResponse.json(
      { error: 'Invalid data provided', code: 'VALIDATION_ERROR' },
      { status: 400 }
    )
  }

  // Handle standard Error
  if (error instanceof Error) {
    return NextResponse.json(
      { error: error.message, code: 'ERROR' },
      { status: 500 }
    )
  }

  // Handle unknown errors
  return NextResponse.json(
    { error: 'Internal server error', code: 'UNKNOWN_ERROR' },
    { status: 500 }
  )
}

/**
 * Common error responses
 */
export const ErrorResponses = {
  unauthorized: () =>
    NextResponse.json(
      { error: 'Unauthorized', code: 'UNAUTHORIZED' },
      { status: 401 }
    ),

  forbidden: () =>
    NextResponse.json(
      { error: 'Forbidden', code: 'FORBIDDEN' },
      { status: 403 }
    ),

  notFound: (resource: string = 'Resource') =>
    NextResponse.json(
      { error: `${resource} not found`, code: 'NOT_FOUND' },
      { status: 404 }
    ),

  badRequest: (message: string = 'Bad request') =>
    NextResponse.json(
      { error: message, code: 'BAD_REQUEST' },
      { status: 400 }
    ),

  conflict: (message: string = 'Conflict') =>
    NextResponse.json(
      { error: message, code: 'CONFLICT' },
      { status: 409 }
    ),

  tooManyRequests: (message: string = 'Too many requests') =>
    NextResponse.json(
      { error: message, code: 'RATE_LIMIT_EXCEEDED' },
      { status: 429 }
    ),

  internalError: (message: string = 'Internal server error') =>
    NextResponse.json(
      { error: message, code: 'INTERNAL_ERROR' },
      { status: 500 }
    ),
}
