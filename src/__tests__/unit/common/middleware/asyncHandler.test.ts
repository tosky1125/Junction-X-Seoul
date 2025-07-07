import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '../../../../common/middleware/asyncHandler';

describe('AsyncHandler Middleware', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockReq = {};
    mockRes = {};
    mockNext = jest.fn();
  });

  it('should call the async function and pass control to next middleware on success', async () => {
    const mockAsyncFn = jest.fn().mockResolvedValue(undefined);
    const wrapped = asyncHandler(mockAsyncFn);

    await wrapped(mockReq as Request, mockRes as Response, mockNext);

    expect(mockAsyncFn).toHaveBeenCalledWith(mockReq, mockRes, mockNext);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should catch errors and pass them to next middleware', async () => {
    const error = new Error('Test error');
    const mockAsyncFn = jest.fn().mockRejectedValue(error);
    const wrapped = asyncHandler(mockAsyncFn);

    await wrapped(mockReq as Request, mockRes as Response, mockNext);

    expect(mockAsyncFn).toHaveBeenCalledWith(mockReq, mockRes, mockNext);
    expect(mockNext).toHaveBeenCalledWith(error);
  });

  it('should handle synchronous errors', async () => {
    const error = new Error('Sync error');
    const mockAsyncFn = jest.fn(() => {
      throw error;
    });
    const wrapped = asyncHandler(mockAsyncFn);

    // No need to await since it's handling sync errors
    wrapped(mockReq as Request, mockRes as Response, mockNext);
    
    // Wait for the promise to resolve
    await new Promise(resolve => setImmediate(resolve));

    expect(mockNext).toHaveBeenCalledWith(error);
  });
});