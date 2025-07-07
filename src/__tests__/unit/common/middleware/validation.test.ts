import { Request, Response, NextFunction } from 'express';
import { validate } from '../../../../common/middleware/validation';
import { AppError } from '../../../../common/errors/AppError';

describe('Validation Middleware', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockReq = {
      body: {},
      query: {},
      params: {},
    };
    mockRes = {};
    mockNext = jest.fn();
  });

  describe('required validation', () => {
    it('should pass when required field is present', () => {
      mockReq.body = { username: 'testuser' };
      const middleware = validate([{ field: 'username', required: true }]);
      
      middleware(mockReq as Request, mockRes as Response, mockNext);
      
      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should fail when required field is missing', () => {
      const middleware = validate([{ field: 'username', required: true }]);
      
      expect(() => {
        middleware(mockReq as Request, mockRes as Response, mockNext);
      }).toThrow(AppError);
    });

    it('should fail when required field is empty string', () => {
      mockReq.body = { username: '' };
      const middleware = validate([{ field: 'username', required: true }]);
      
      expect(() => {
        middleware(mockReq as Request, mockRes as Response, mockNext);
      }).toThrow(AppError);
    });
  });

  describe('type validation', () => {
    it('should pass when type matches', () => {
      mockReq.body = { age: 25, name: 'John', active: true };
      const middleware = validate([
        { field: 'age', type: 'number' },
        { field: 'name', type: 'string' },
        { field: 'active', type: 'boolean' },
      ]);
      
      middleware(mockReq as Request, mockRes as Response, mockNext);
      
      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should fail when type does not match', () => {
      mockReq.body = { age: '25' };
      const middleware = validate([{ field: 'age', type: 'number' }]);
      
      expect(() => {
        middleware(mockReq as Request, mockRes as Response, mockNext);
      }).toThrow(AppError);
    });
  });

  describe('string length validation', () => {
    it('should pass when string length is within range', () => {
      mockReq.body = { password: 'secure123' };
      const middleware = validate([
        { field: 'password', type: 'string', min: 6, max: 20 },
      ]);
      
      middleware(mockReq as Request, mockRes as Response, mockNext);
      
      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should fail when string is too short', () => {
      mockReq.body = { password: 'abc' };
      const middleware = validate([
        { field: 'password', type: 'string', min: 6 },
      ]);
      
      expect(() => {
        middleware(mockReq as Request, mockRes as Response, mockNext);
      }).toThrow(AppError);
    });

    it('should fail when string is too long', () => {
      mockReq.body = { password: 'a'.repeat(30) };
      const middleware = validate([
        { field: 'password', type: 'string', max: 20 },
      ]);
      
      expect(() => {
        middleware(mockReq as Request, mockRes as Response, mockNext);
      }).toThrow(AppError);
    });
  });

  describe('number range validation', () => {
    it('should pass when number is within range', () => {
      mockReq.body = { age: 25 };
      const middleware = validate([
        { field: 'age', type: 'number', min: 18, max: 100 },
      ]);
      
      middleware(mockReq as Request, mockRes as Response, mockNext);
      
      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should fail when number is too small', () => {
      mockReq.body = { age: 10 };
      const middleware = validate([
        { field: 'age', type: 'number', min: 18 },
      ]);
      
      expect(() => {
        middleware(mockReq as Request, mockRes as Response, mockNext);
      }).toThrow(AppError);
    });
  });

  describe('pattern validation', () => {
    it('should pass when pattern matches', () => {
      mockReq.body = { email: 'test@example.com' };
      const middleware = validate([
        { field: 'email', pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
      ]);
      
      middleware(mockReq as Request, mockRes as Response, mockNext);
      
      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should fail when pattern does not match', () => {
      mockReq.body = { email: 'invalid-email' };
      const middleware = validate([
        { field: 'email', pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
      ]);
      
      expect(() => {
        middleware(mockReq as Request, mockRes as Response, mockNext);
      }).toThrow(AppError);
    });
  });

  describe('custom validation', () => {
    it('should pass when custom validation returns true', () => {
      mockReq.body = { even: 4 };
      const middleware = validate([
        { field: 'even', custom: (value) => (value as number) % 2 === 0 },
      ]);
      
      middleware(mockReq as Request, mockRes as Response, mockNext);
      
      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should fail when custom validation returns false', () => {
      mockReq.body = { even: 3 };
      const middleware = validate([
        { field: 'even', custom: (value) => (value as number) % 2 === 0, message: 'Must be even' },
      ]);
      
      expect(() => {
        middleware(mockReq as Request, mockRes as Response, mockNext);
      }).toThrow(AppError);
    });
  });

  describe('location validation', () => {
    it('should validate query parameters', () => {
      mockReq.query = { page: '1' };
      const middleware = validate([
        { field: 'page', required: true },
      ], 'query');
      
      middleware(mockReq as Request, mockRes as Response, mockNext);
      
      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should validate route parameters', () => {
      mockReq.params = { id: '123' };
      const middleware = validate([
        { field: 'id', required: true },
      ], 'params');
      
      middleware(mockReq as Request, mockRes as Response, mockNext);
      
      expect(mockNext).toHaveBeenCalledWith();
    });
  });
});