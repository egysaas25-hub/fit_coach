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
      const body = await req.json();
      const validatedBody = schema.parse(body);
      return handler(req, validatedBody, ...args);
    } catch (error: any) {
      if (error.errors) {
        return validationError(error.errors);
      }
      return validationError(error);
    }
  };
}
