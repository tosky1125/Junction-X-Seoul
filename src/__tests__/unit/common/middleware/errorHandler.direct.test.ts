import { Request, Response, NextFunction } from 'express';
import { errorHandler } from '../../../../common/middleware/errorHandler';
import { AppError, ErrorCode } from '../../../../common/errors/AppError';

// This test file directly tests errorHandler without mocking to increase coverage

describe('ErrorHandler Middleware - Direct Tests', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;
  let mockStatus: jest.Mock;
  let mockJson: jest.Mock;

  beforeEach(() => {
    mockReq = {};
    mockStatus = jest.fn();
    mockJson = jest.fn();
    
    mockRes = {
      status: mockStatus.mockReturnThis(),
      json: mockJson.mockReturnThis(),
    };
    mockNext = jest.fn();

    // Mock console.error to avoid cluttering test output
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('AppError handling', () => {
    it('should handle BAD_REQUEST error', () => {
      const error = AppError.badRequest('Invalid input');
      
      errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'error',
          error: expect.objectContaining({
            code: 'BAD_REQUEST',
            message: 'Invalid input',
          }),
        })
      );
    });

    it('should handle UNAUTHORIZED error', () => {
      const error = AppError.unauthorized('Invalid token');
      
      errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      expect(mockStatus).toHaveBeenCalledWith(401);
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'error',
          error: expect.objectContaining({
            code: 'UNAUTHORIZED',
            message: 'Invalid token',
          }),
        })
      );
    });

    it('should handle FORBIDDEN error', () => {
      const error = AppError.forbidden('Access denied');
      
      errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      expect(mockStatus).toHaveBeenCalledWith(403);
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'error',
          error: expect.objectContaining({
            code: 'FORBIDDEN',
            message: 'Access denied',
          }),
        })
      );
    });

    it('should handle NOT_FOUND error', () => {
      const error = AppError.notFound('Resource not found');
      
      errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'error',
          error: expect.objectContaining({
            code: 'NOT_FOUND',
            message: 'Resource not found',
          }),
        })
      );
    });

    it('should handle CONFLICT error', () => {
      const error = AppError.conflict('Resource already exists');
      
      errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      expect(mockStatus).toHaveBeenCalledWith(409);
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'error',
          error: expect.objectContaining({
            code: 'CONFLICT',
            message: 'Resource already exists',
          }),
        })
      );
    });

    it('should handle VALIDATION_ERROR', () => {
      const error = AppError.validationError('Validation failed', { fields: ['email'] });
      
      errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'error',
          error: expect.objectContaining({
            code: 'VALIDATION_ERROR',
            message: 'Validation failed',
            details: { fields: ['email'] },
          }),
        })
      );
    });
  });

  describe('Non-AppError handling', () => {
    it('should handle plain Error objects', () => {
      const error = new Error('Something went wrong');
      
      errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'error',
          error: expect.objectContaining({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'An unexpected error occurred',
          }),
        })
      );
    });

    it('should handle errors with statusCode property', () => {
      const error: any = new Error('Custom error');
      error.statusCode = 502;
      
      errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      expect(mockStatus).toHaveBeenCalledWith(502);
    });
  });

  describe('Environment-specific behavior', () => {
    it('should include stack trace in development', () => {
      const originalEnv = process.env['NODE_ENV'];
      process.env['NODE_ENV'] = 'development';
      
      const error = new Error('Dev error');
      
      errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      const callArg = mockJson.mock.calls[0][0];
      expect(callArg).toHaveProperty('stack');
      expect(callArg.stack).toContain('Dev error');

      process.env['NODE_ENV'] = originalEnv;
    });

    it('should not include stack trace in production', () => {
      const originalEnv = process.env['NODE_ENV'];
      process.env['NODE_ENV'] = 'production';
      
      const error = new Error('Prod error');
      
      errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      const callArg = mockJson.mock.calls[0][0];
      expect(callArg).not.toHaveProperty('stack');

      process.env['NODE_ENV'] = originalEnv;
    });
  });

  describe('Non-operational errors', () => {
    it('should mask non-operational errors in production', () => {
      const originalEnv = process.env['NODE_ENV'];
      process.env['NODE_ENV'] = 'production';
      
      const error = new AppError(
        'Programming error',
        500,
        ErrorCode.INTERNAL_SERVER_ERROR,
        false // non-operational
      );
      
      errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.objectContaining({
            message: 'An unexpected error occurred',
          }),
        })
      );

      process.env['NODE_ENV'] = originalEnv;
    });

    it('should show actual message for non-operational errors in development', () => {
      const originalEnv = process.env['NODE_ENV'];
      process.env['NODE_ENV'] = 'development';
      
      const error = new AppError(
        'Programming error details',
        500,
        ErrorCode.INTERNAL_SERVER_ERROR,
        false // non-operational
      );
      
      errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.objectContaining({
            message: 'Programming error details',
          }),
        })
      );

      process.env['NODE_ENV'] = originalEnv;
    });
  });

  describe('Edge cases', () => {
    it('should handle errors without message', () => {
      const error = new Error();
      
      errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalled();
    });

    it('should handle null error', () => {
      const error = null as any;
      
      errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalled();
    });

    it('should handle undefined error', () => {
      const error = undefined as any;
      
      errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalled();
    });
  });
});