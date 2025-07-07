import { Request, Response, NextFunction } from 'express';
import { errorHandler } from '../../../../common/middleware/errorHandler';
import { AppError, ErrorCode } from '../../../../common/errors/AppError';

describe('ErrorHandler Middleware', () => {
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

  it('should handle AppError with default status code', () => {
    const error = AppError.badRequest('Invalid input');
    
    errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

    expect(mockStatus).toHaveBeenCalledWith(400);
    expect(mockJson).toHaveBeenCalledWith({
      status: 'error',
      error: {
        code: 'BAD_REQUEST',
        message: 'Invalid input',
        details: undefined,
      },
      timestamp: expect.any(String),
    });
  });

  it('should handle AppError with custom details', () => {
    const error = AppError.badRequest('Validation failed', { fields: ['email'] });
    
    errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

    expect(mockStatus).toHaveBeenCalledWith(400);
    expect(mockJson).toHaveBeenCalledWith({
      status: 'error',
      error: {
        code: 'BAD_REQUEST',
        message: 'Validation failed',
        details: { fields: ['email'] },
      },
      timestamp: expect.any(String),
    });
  });

  it('should handle generic Error as internal server error', () => {
    const error = new Error('Something went wrong');
    
    errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

    expect(mockStatus).toHaveBeenCalledWith(500);
    expect(mockJson).toHaveBeenCalledWith({
      status: 'error',
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred',
      },
      timestamp: expect.any(String),
    });
  });

  it('should handle errors with custom status code', () => {
    const error: any = new Error('Custom error');
    error.statusCode = 502;
    
    errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

    expect(mockStatus).toHaveBeenCalledWith(502);
    expect(mockJson).toHaveBeenCalledWith({
      status: 'error',
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred',
      },
      timestamp: expect.any(String),
    });
  });

  it('should handle non-operational AppError in production', () => {
    const originalEnv = process.env['NODE_ENV'];
    process.env['NODE_ENV'] = 'production';
    
    const error = new AppError('Programming error', 500, ErrorCode.INTERNAL_SERVER_ERROR, false);
    
    errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

    expect(mockStatus).toHaveBeenCalledWith(500);
    expect(mockJson).toHaveBeenCalledWith({
      status: 'error',
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred',
      },
      timestamp: expect.any(String),
    });

    process.env['NODE_ENV'] = originalEnv;
  });

  it('should include stack trace in development mode', () => {
    const originalEnv = process.env['NODE_ENV'];
    process.env['NODE_ENV'] = 'development';
    
    const error = new Error('Dev error');
    
    errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

    expect(mockJson).toHaveBeenCalledWith(
      expect.objectContaining({
        stack: expect.any(String),
      })
    );

    process.env['NODE_ENV'] = originalEnv;
  });

  it('should not include stack trace in production mode', () => {
    const originalEnv = process.env['NODE_ENV'];
    process.env['NODE_ENV'] = 'production';
    
    const error = new Error('Prod error');
    
    errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

    expect(mockJson).toHaveBeenCalledWith(
      expect.not.objectContaining({
        stack: expect.any(String),
      })
    );

    process.env['NODE_ENV'] = originalEnv;
  });
});