import { Request, Response, NextFunction } from 'express';
import { requestLogger, errorLogger } from '../../../../common/middleware/logger';

// Direct test without mocking to increase coverage

describe('Logger Middleware - Direct Tests', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response> & { on: jest.Mock };
  let mockNext: NextFunction;
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
    
    const onCallbacks: { [key: string]: Function } = {};
    mockRes = {
      statusCode: 200,
      on: jest.fn((event: string, callback: Function) => {
        onCallbacks[event] = callback;
        return mockRes as any;
      }),
      emit: (event: string) => {
        if (onCallbacks[event]) {
          onCallbacks[event]();
        }
      },
    } as any;
    
    mockNext = jest.fn();

    // Mock console methods
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('requestLogger', () => {
    it('should log request and response details', (done) => {
      requestLogger(mockReq as Request, mockRes as Response, mockNext);

      // Check request logging
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('[REQUEST]'),
        expect.objectContaining({
          method: 'GET',
          url: '/api/test',
          ip: '127.0.0.1',
          userAgent: 'test-agent',
        })
      );

      expect(mockNext).toHaveBeenCalled();

      // Simulate response finish
      setTimeout(() => {
        (mockRes as any).emit('finish');
        
        // Check response logging
        expect(consoleLogSpy).toHaveBeenCalledWith(
          expect.stringContaining('[RESPONSE]'),
          expect.objectContaining({
            method: 'GET',
            url: '/api/test',
            statusCode: 200,
          })
        );
        done();
      }, 10);
    });

    it('should log body and query in development mode', () => {
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

    it('should not log body and query in production mode', () => {
      const originalEnv = process.env['NODE_ENV'];
      process.env['NODE_ENV'] = 'production';

      requestLogger(mockReq as Request, mockRes as Response, mockNext);

      const logCall = consoleLogSpy.mock.calls[0];
      const loggedData = logCall[1];
      expect(loggedData).not.toHaveProperty('body');
      expect(loggedData).not.toHaveProperty('query');

      process.env['NODE_ENV'] = originalEnv;
    });

    it('should handle requests without headers', () => {
      mockReq.headers = undefined;
      
      requestLogger(mockReq as Request, mockRes as Response, mockNext);

      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('[REQUEST]'),
        expect.objectContaining({
          userAgent: undefined,
        })
      );
    });

    it('should handle requests without body', () => {
      mockReq.body = undefined;
      
      requestLogger(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it('should calculate response time', (done) => {
      const startTime = Date.now();
      jest.spyOn(Date, 'now')
        .mockReturnValueOnce(startTime)
        .mockReturnValueOnce(startTime + 150);

      requestLogger(mockReq as Request, mockRes as Response, mockNext);

      setTimeout(() => {
        (mockRes as any).emit('finish');
        
        expect(consoleLogSpy).toHaveBeenCalledWith(
          expect.stringContaining('[RESPONSE]'),
          expect.objectContaining({
            responseTime: 150,
          })
        );
        done();
      }, 10);
    });
  });

  describe('errorLogger', () => {
    it('should log error details and call next', () => {
      const error = new Error('Test error');
      
      errorLogger(error, mockReq as Request, mockRes as Response, mockNext);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('[ERROR]'),
        expect.objectContaining({
          message: 'Test error',
          method: 'GET',
          url: '/api/test',
          ip: '127.0.0.1',
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
          stack: expect.stringContaining('Dev error'),
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
      const loggedData = errorCall[1];
      expect(loggedData).not.toHaveProperty('stack');

      process.env['NODE_ENV'] = originalEnv;
    });

    it('should handle errors with statusCode', () => {
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

    it('should handle errors without message', () => {
      const error = new Error();
      
      errorLogger(error, mockReq as Request, mockRes as Response, mockNext);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('[ERROR]'),
        expect.objectContaining({
          message: '',
        })
      );
    });

    it('should handle non-Error objects', () => {
      const error = { custom: 'error' };
      
      errorLogger(error as any, mockReq as Request, mockRes as Response, mockNext);

      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(error);
    });

    it('should include body in error log for development', () => {
      const originalEnv = process.env['NODE_ENV'];
      process.env['NODE_ENV'] = 'development';
      
      const error = new Error('Request failed');
      
      errorLogger(error, mockReq as Request, mockRes as Response, mockNext);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('[ERROR]'),
        expect.objectContaining({
          body: { test: 'data' },
        })
      );

      process.env['NODE_ENV'] = originalEnv;
    });

    it('should not include body in error log for production', () => {
      const originalEnv = process.env['NODE_ENV'];
      process.env['NODE_ENV'] = 'production';
      
      const error = new Error('Request failed');
      
      errorLogger(error, mockReq as Request, mockRes as Response, mockNext);

      const errorCall = consoleErrorSpy.mock.calls[0];
      const loggedData = errorCall[1];
      expect(loggedData).not.toHaveProperty('body');

      process.env['NODE_ENV'] = originalEnv;
    });
  });

  describe('Edge cases', () => {
    it('should handle missing request properties', () => {
      mockReq = {};
      
      requestLogger(mockReq as Request, mockRes as Response, mockNext);

      expect(consoleLogSpy).toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalled();
    });

    it('should handle response without on method', () => {
      mockRes.on = undefined as any;
      
      expect(() => {
        requestLogger(mockReq as Request, mockRes as Response, mockNext);
      }).not.toThrow();
    });
  });
});