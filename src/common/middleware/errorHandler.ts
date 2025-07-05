import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';
import config from '../../config';

interface IErrorResponse {
  status: 'error';
  code: string;
  message: string;
  details?: unknown;
  stack?: string;
  timestamp: string;
  path: string;
  method: string;
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  let error: AppError;

  if (err instanceof AppError) {
    error = err;
  } else {
    // Convert non-AppError errors to AppError
    error = AppError.internalServerError(
      config.isDevelopment ? err.message : 'An unexpected error occurred',
    );
  }

  // Log error for monitoring
  if (!error.isOperational) {
    console.error('ERROR:', {
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
      stack: error.stack,
      details: error.details,
      request: {
        method: req.method,
        url: req.originalUrl,
        headers: req.headers,
        body: req.body,
        params: req.params,
        query: req.query,
      },
    });
  }

  const response: IErrorResponse = {
    status: 'error',
    code: error.code,
    message: error.message,
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
    method: req.method,
  };

  // Include details in development mode
  if (config.isDevelopment) {
    response.details = error.details;
    response.stack = error.stack;
  }

  res.status(error.statusCode).json(response);
};