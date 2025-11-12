import { NextRequest, NextResponse } from 'next/server';
import { ZodSchema } from 'zod';
import { validationError } from '@/lib/utils/response';

type RequestHandler = (req: NextRequest, ...args: any[]) => Promise<NextResponse>;

/**
 * A higher-order function that creates a middleware for validating a request body against a Zod schema.
 * @param schema - The Zod schema to validate against.
 * @param handler - The route handler to execute if validation is successful.
 * @returns A request handler that performs validation before executing the main handler.
 */
export function withValidation<T>(
  schema: ZodSchema<T>,
  handler: (req: NextRequest, validatedBody: T, ...args: any[]) => Promise<NextResponse>
): RequestHandler {
  return async (req: NextRequest, ...args: any[]) => {
    try {
      console.log('Validation middleware: Parsing request body');
      const body = await req.json();
      console.log('Validation middleware: Request body:', body);
      const validatedBody = schema.parse(body);
      console.log('Validation middleware: Validated body:', validatedBody);
      return handler(req, validatedBody, ...args);
    } catch (error: any) {
      console.error('Validation middleware: Validation error:', error);
      // Log specific validation issues
      if (error.errors) {
        console.error('Validation middleware: Detailed validation errors:', error.errors);
        error.errors.forEach((err: any, index: number) => {
          console.error(`Validation middleware: Error ${index + 1}:`, {
            path: err.path,
            message: err.message,
            code: err.code,
            expected: err.expected,
            received: err.received
          });
        });
      }
      if (error.errors) {
        return validationError(error.errors);
      }
      return validationError(error);
    }
  };
}