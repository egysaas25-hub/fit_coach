import { Prisma } from '@prisma/client';

/**
 * Map Prisma error codes to user-friendly messages
 */
export const PRISMA_ERROR_CODES = {
  P1000: 'Authentication failed against database server',
  P1001: 'Cannot reach database server',
  P1002: 'The database server was reached but timed out',
  P1003: 'Database does not exist',
  P1008: 'Operations timed out',
  P1009: 'Database already exists',
  P1010: 'User was denied access on the database',
  P1011: 'Error opening a TLS connection',
  P1012: 'Schema is empty',
  P1013: 'The provided database string is invalid',
  P1014: 'The underlying kind for a model does not exist',
  P1015: 'Your Prisma schema is using features that are not supported',
  P1016: 'Your raw query had an incorrect number of parameters',
  P1017: 'Server has closed the connection',
  
  P2000: 'The provided value for the column is too long for the column\'s type',
  P2001: 'The record searched for in the where condition does not exist',
  P2002: 'Unique constraint failed',
  P2003: 'Foreign key constraint failed',
  P2004: 'A constraint failed on the database',
  P2005: 'The value stored in the database for the field is invalid for the field\'s type',
  P2006: 'The provided value for the field is not valid',
  P2007: 'Data validation error',
  P2008: 'Failed to parse the query',
  P2009: 'Failed to validate the query',
  P2010: 'Raw query failed',
  P2011: 'Null constraint violation',
  P2012: 'Missing a required value',
  P2013: 'Missing the required argument',
  P2014: 'The change you are trying to make would violate the required relation',
  P2015: 'A related record could not be found',
  P2016: 'Query interpretation error',
  P2017: 'The records for relation are not connected',
  P2018: 'The required connected records were not found',
  P2019: 'Input error',
  P2020: 'Value out of range for the type',
  P2021: 'The table does not exist in the current database',
  P2022: 'The column does not exist in the current database',
  P2023: 'Inconsistent column data',
  P2024: 'Timed out fetching a new connection from the connection pool',
  P2025: 'An operation failed because it depends on one or more records that were required but not found',
  P2026: 'The current database provider doesn\'t support a feature that the query used',
  P2027: 'Multiple errors occurred on the database during query execution',
  P2028: 'Transaction API error',
  P2030: 'Cannot find a fulltext index to use for the search',
  P2031: 'Prisma needs to perform transactions, which requires your MongoDB server to be run as a replica set',
  P2033: 'A number used in the query does not fit into a 64 bit signed integer',
  P2034: 'Transaction failed due to a write conflict or a deadlock',
} as const;

/**
 * User-friendly error messages for common scenarios
 */
export const USER_FRIENDLY_MESSAGES = {
  P2001: 'The requested record was not found.',
  P2002: 'This record already exists. Please use different values.',
  P2003: 'Cannot delete this record because it is referenced by other data.',
  P2011: 'A required field is missing.',
  P2012: 'A required field is missing.',
  P2014: 'Cannot perform this action due to data relationships.',
  P2015: 'Related record not found.',
  P2025: 'The record you are trying to update or delete was not found.',
  P1001: 'Unable to connect to the database. Please try again later.',
  P1008: 'The operation took too long. Please try again.',
  P2024: 'Database is busy. Please try again in a moment.',
} as const;

/**
 * Handle Prisma errors and return user-friendly messages
 */
export function handlePrismaError(error: unknown): {
  message: string;
  code?: string;
  statusCode: number;
} {
  // Handle Prisma Client Known Request Error
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const code = error.code as keyof typeof USER_FRIENDLY_MESSAGES;
    const userMessage = USER_FRIENDLY_MESSAGES[code];
    const technicalMessage = PRISMA_ERROR_CODES[code];

    return {
      message: userMessage || technicalMessage || 'A database error occurred.',
      code: error.code,
      statusCode: getStatusCodeForError(error.code),
    };
  }

  // Handle Prisma Client Validation Error
  if (error instanceof Prisma.PrismaClientValidationError) {
    return {
      message: 'Invalid data provided. Please check your input.',
      statusCode: 400,
    };
  }

  // Handle Prisma Client Initialization Error
  if (error instanceof Prisma.PrismaClientInitializationError) {
    return {
      message: 'Database connection failed. Please try again later.',
      statusCode: 503,
    };
  }

  // Handle Prisma Client Rust Panic Error
  if (error instanceof Prisma.PrismaClientRustPanicError) {
    return {
      message: 'An unexpected database error occurred. Please try again.',
      statusCode: 500,
    };
  }

  // Handle generic errors
  if (error instanceof Error) {
    return {
      message: 'An unexpected error occurred.',
      statusCode: 500,
    };
  }

  return {
    message: 'An unknown error occurred.',
    statusCode: 500,
  };
}

/**
 * Get appropriate HTTP status code for Prisma error
 */
function getStatusCodeForError(code: string): number {
  switch (code) {
    case 'P2001': // Record not found
    case 'P2015': // Related record not found
    case 'P2025': // Record to update/delete not found
      return 404;
    
    case 'P2002': // Unique constraint violation
    case 'P2003': // Foreign key constraint violation
    case 'P2004': // Constraint violation
    case 'P2014': // Required relation violation
      return 409; // Conflict
    
    case 'P2011': // Null constraint violation
    case 'P2012': // Missing required value
    case 'P2013': // Missing required argument
    case 'P2006': // Invalid value
    case 'P2007': // Data validation error
    case 'P2019': // Input error
    case 'P2020': // Value out of range
      return 400; // Bad Request
    
    case 'P1001': // Cannot reach database
    case 'P1002': // Database timeout
    case 'P1008': // Operations timeout
    case 'P2024': // Connection pool timeout
      return 503; // Service Unavailable
    
    case 'P1000': // Authentication failed
    case 'P1010': // Access denied
      return 401; // Unauthorized
    
    default:
      return 500; // Internal Server Error
  }
}

/**
 * Log Prisma errors with appropriate detail level
 */
export function logPrismaError(error: unknown, context?: string): void {
  const errorInfo = handlePrismaError(error);
  
  console.error(`Prisma Error${context ? ` in ${context}` : ''}:`, {
    message: errorInfo.message,
    code: errorInfo.code,
    statusCode: errorInfo.statusCode,
    originalError: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Wrapper for Prisma operations with error handling
 */
export async function withPrismaErrorHandling<T>(
  operation: () => Promise<T>,
  context?: string
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    logPrismaError(error, context);
    throw error;
  }
}