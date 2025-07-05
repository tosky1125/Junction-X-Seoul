export enum ErrorCode {
  // Client errors
  BAD_REQUEST = 'BAD_REQUEST',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  TOO_MANY_REQUESTS = 'TOO_MANY_REQUESTS',

  // Server errors
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  DATABASE_ERROR = 'DATABASE_ERROR',
  EXTERNAL_API_ERROR = 'EXTERNAL_API_ERROR',

  // Business logic errors
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  USER_ALREADY_EXISTS = 'USER_ALREADY_EXISTS',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  INVALID_TOKEN = 'INVALID_TOKEN',
  CAR_NOT_FOUND = 'CAR_NOT_FOUND',
  DRIVING_RECORD_NOT_FOUND = 'DRIVING_RECORD_NOT_FOUND',
  INSUFFICIENT_PERMISSIONS = 'INSUFFICIENT_PERMISSIONS',
}

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: ErrorCode;
  public readonly isOperational: boolean;
  public readonly details?: unknown;

  public constructor(
    message: string,
    statusCode: number = 500,
    code: ErrorCode = ErrorCode.INTERNAL_SERVER_ERROR,
    isOperational: boolean = true,
    details?: unknown,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;
    this.details = details;

    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }

  public static badRequest(message: string = 'Bad Request', details?: unknown): AppError {
    return new AppError(message, 400, ErrorCode.BAD_REQUEST, true, details);
  }

  public static unauthorized(message: string = 'Unauthorized', details?: unknown): AppError {
    return new AppError(message, 401, ErrorCode.UNAUTHORIZED, true, details);
  }

  public static forbidden(message: string = 'Forbidden', details?: unknown): AppError {
    return new AppError(message, 403, ErrorCode.FORBIDDEN, true, details);
  }

  public static notFound(message: string = 'Not Found', details?: unknown): AppError {
    return new AppError(message, 404, ErrorCode.NOT_FOUND, true, details);
  }

  public static conflict(message: string = 'Conflict', details?: unknown): AppError {
    return new AppError(message, 409, ErrorCode.CONFLICT, true, details);
  }

  public static validationError(message: string = 'Validation Error', details?: unknown): AppError {
    return new AppError(message, 422, ErrorCode.VALIDATION_ERROR, true, details);
  }

  public static tooManyRequests(message: string = 'Too Many Requests', details?: unknown): AppError {
    return new AppError(message, 429, ErrorCode.TOO_MANY_REQUESTS, true, details);
  }

  public static internalServerError(
    message: string = 'Internal Server Error',
    details?: unknown,
  ): AppError {
    return new AppError(message, 500, ErrorCode.INTERNAL_SERVER_ERROR, false, details);
  }

  public static databaseError(message: string = 'Database Error', details?: unknown): AppError {
    return new AppError(message, 500, ErrorCode.DATABASE_ERROR, false, details);
  }

  public static externalApiError(
    message: string = 'External API Error',
    details?: unknown,
  ): AppError {
    return new AppError(message, 502, ErrorCode.EXTERNAL_API_ERROR, false, details);
  }
}