import { AppError, ErrorCode } from '../../../../common/errors/AppError';

describe('AppError', () => {
  describe('constructor', () => {
    it('should create an error with default values', () => {
      const error = new AppError('Test error');
      
      expect(error.message).toBe('Test error');
      expect(error.statusCode).toBe(500);
      expect(error.code).toBe(ErrorCode.INTERNAL_SERVER_ERROR);
      expect(error.isOperational).toBe(true);
      expect(error.details).toBeUndefined();
    });

    it('should create an error with custom values', () => {
      const details = { field: 'test' };
      const error = new AppError('Custom error', 400, ErrorCode.BAD_REQUEST, false, details);
      
      expect(error.message).toBe('Custom error');
      expect(error.statusCode).toBe(400);
      expect(error.code).toBe(ErrorCode.BAD_REQUEST);
      expect(error.isOperational).toBe(false);
      expect(error.details).toEqual(details);
    });
  });

  describe('static methods', () => {
    it('should create a bad request error', () => {
      const error = AppError.badRequest('Bad request test');
      
      expect(error.message).toBe('Bad request test');
      expect(error.statusCode).toBe(400);
      expect(error.code).toBe(ErrorCode.BAD_REQUEST);
      expect(error.isOperational).toBe(true);
    });

    it('should create an unauthorized error', () => {
      const error = AppError.unauthorized();
      
      expect(error.message).toBe('Unauthorized');
      expect(error.statusCode).toBe(401);
      expect(error.code).toBe(ErrorCode.UNAUTHORIZED);
    });

    it('should create a forbidden error', () => {
      const error = AppError.forbidden('Access denied');
      
      expect(error.message).toBe('Access denied');
      expect(error.statusCode).toBe(403);
      expect(error.code).toBe(ErrorCode.FORBIDDEN);
    });

    it('should create a not found error', () => {
      const error = AppError.notFound('Resource not found');
      
      expect(error.message).toBe('Resource not found');
      expect(error.statusCode).toBe(404);
      expect(error.code).toBe(ErrorCode.NOT_FOUND);
    });

    it('should create a conflict error', () => {
      const error = AppError.conflict('Duplicate entry');
      
      expect(error.message).toBe('Duplicate entry');
      expect(error.statusCode).toBe(409);
      expect(error.code).toBe(ErrorCode.CONFLICT);
    });

    it('should create a validation error with details', () => {
      const details = { errors: ['Field required'] };
      const error = AppError.validationError('Validation failed', details);
      
      expect(error.message).toBe('Validation failed');
      expect(error.statusCode).toBe(422);
      expect(error.code).toBe(ErrorCode.VALIDATION_ERROR);
      expect(error.details).toEqual(details);
    });

    it('should create an internal server error', () => {
      const error = AppError.internalServerError();
      
      expect(error.message).toBe('Internal Server Error');
      expect(error.statusCode).toBe(500);
      expect(error.code).toBe(ErrorCode.INTERNAL_SERVER_ERROR);
      expect(error.isOperational).toBe(false);
    });

    it('should create a database error', () => {
      const error = AppError.databaseError('Connection failed');
      
      expect(error.message).toBe('Connection failed');
      expect(error.statusCode).toBe(500);
      expect(error.code).toBe(ErrorCode.DATABASE_ERROR);
      expect(error.isOperational).toBe(false);
    });
  });
});