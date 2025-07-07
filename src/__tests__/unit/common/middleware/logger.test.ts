import { Request, Response, NextFunction } from 'express';
import { requestLogger, errorLogger } from '../../../../common/middleware/logger';

describe('Logger Middleware', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;
  let originalConsoleLog: any;
  let originalConsoleError: any;
  let consoleLogSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    mockReq = {
      method: 'GET',
      url: '/api/test',
      headers: {
        'user-agent': 'test-agent',
      },
      ip: '127.0.0.1',
      body: { test: 'data' },
      query: { page: '1' },
    };
    
    mockRes = {
      statusCode: 200,
      on: jest.fn((event, callback) => {
        if (event === 'finish') {
          callback();
        }
      }),
    };
    
    mockNext = jest.fn();

    // Mock Date.now to have consistent timestamps
    jest.spyOn(Date, 'now').mockReturnValue(1000);

    // Mock console methods
    originalConsoleLog = console.log;
    originalConsoleError = console.error;
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
    console.log = originalConsoleLog;
    console.error = originalConsoleError;
  });

  describe('requestLogger', () => {
    it('should log request details and call next', () => {
      requestLogger(mockReq as Request, mockRes as Response, mockNext);

      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('[REQUEST]'),
        expect.objectContaining({
          method: 'GET',
          url: '/api/test',
          ip: '127.0.0.1',
          userAgent: 'test-agent',
          timestamp: expect.any(String),
        })
      );
      expect(mockNext).toHaveBeenCalled();
    });

    it('should log response details on finish', (done) => {
      mockRes.on = jest.fn((event, callback) => {
        if (event === 'finish') {
          // Simulate response finish
          setTimeout(() => {
            callback();
            
            expect(consoleLogSpy).toHaveBeenCalledWith(
              expect.stringContaining('[RESPONSE]'),
              expect.objectContaining({
                method: 'GET',
                url: '/api/test',
                statusCode: 200,
                responseTime: expect.any(Number),
                timestamp: expect.any(String),
              })
            );
            done();
          }, 10);
        }
      });

      requestLogger(mockReq as Request, mockRes as Response, mockNext);
    });

    it('should include body in development mode', () => {
      const originalEnv = process.env['NODE_ENV'];
      process.env['NODE_ENV'] = 'development';

      requestLogger(mockReq as Request, mockRes as Response, mockNext);

      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('[REQUEST]'),
        expect.objectContaining({
          body: { test: 'data' },
          query: { page: '1' },
        })
      );

      process.env['NODE_ENV'] = originalEnv;
    });

    it('should not include body in production mode', () => {
      const originalEnv = process.env['NODE_ENV'];
      process.env['NODE_ENV'] = 'production';

      requestLogger(mockReq as Request, mockRes as Response, mockNext);

      const logCall = consoleLogSpy.mock.calls[0];
      expect(logCall[1]).not.toHaveProperty('body');
      expect(logCall[1]).not.toHaveProperty('query');

      process.env['NODE_ENV'] = originalEnv;
    });
  });

  describe('errorLogger', () => {
    it('should log error details and call next with error', () => {
      const error = new Error('Test error');
      
      errorLogger(error, mockReq as Request, mockRes as Response, mockNext);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('[ERROR]'),
        expect.objectContaining({
          message: 'Test error',
          method: 'GET',
          url: '/api/test',
          ip: '127.0.0.1',
          timestamp: expect.any(String),
        })
      );
      expect(mockNext).toHaveBeenCalledWith(error);
    });

    it('should include stack trace in development mode', () => {
      const originalEnv = process.env['NODE_ENV'];
      process.env['NODE_ENV'] = 'development';
      
      const error = new Error('Dev error');
      
      errorLogger(error, mockReq as Request, mockRes as Response, mockNext);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('[ERROR]'),
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
      
      errorLogger(error, mockReq as Request, mockRes as Response, mockNext);

      const errorCall = consoleErrorSpy.mock.calls[0];
      expect(errorCall[1]).not.toHaveProperty('stack');

      process.env['NODE_ENV'] = originalEnv;
    });

    it('should handle errors with statusCode property', () => {
      const error: any = new Error('Custom error');
      error.statusCode = 404;
      
      errorLogger(error, mockReq as Request, mockRes as Response, mockNext);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('[ERROR]'),
        expect.objectContaining({
          statusCode: 404,
        })
      );
    });
  });
});