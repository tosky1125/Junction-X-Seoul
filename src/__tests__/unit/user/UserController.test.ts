import { Request, Response } from 'express';
import UserController from '../../../user/UserController';
import { GetUserByUserId } from '../../../user/service/GetUserByUserId';
import { UserNotExistError } from '../../../user/error/UserNotExistError';
import { AppError } from '../../../common/errors/AppError';
import { ResponseHandler } from '../../../common/utils/responseHandler';

// Mock dependencies
jest.mock('../../../user/service/GetUserByUserId');
jest.mock('../../../common/utils/responseHandler');

describe('UserController', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    mockReq = {
      params: {},
      body: {},
      query: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  describe('initializeRoutes', () => {
    it('should register GET /:userId route', () => {
      const router = UserController.getRouter();
      const routes = router.stack
        .filter((layer: any) => layer.route)
        .map((layer: any) => ({
          path: layer.route.path,
          methods: layer.route.methods,
        }));

      expect(routes).toContainEqual({
        path: '/:userId',
        methods: expect.objectContaining({ get: true }),
      });
    });
  });

  describe('getUserById', () => {
    const getUserByIdHandler = (UserController as any).getUserById.bind(UserController);

    it('should return user data successfully', async () => {
      const mockUser = {
        userId: 1,
        name: 'Test User',
        email: 'test@example.com',
      };

      mockReq.params = { userId: '1' };
      const mockExecute = jest.fn().mockResolvedValue(mockUser);
      (GetUserByUserId as jest.Mock).mockImplementation(() => ({
        execute: mockExecute,
      }));

      await getUserByIdHandler(mockReq as Request, mockRes as Response);

      expect(mockExecute).toHaveBeenCalledWith(1);
      expect(ResponseHandler.success).toHaveBeenCalledWith(mockRes, mockUser);
    });

    it('should handle UserNotExistError', async () => {
      mockReq.params = { userId: '999' };
      const mockExecute = jest.fn().mockRejectedValue(new UserNotExistError());
      (GetUserByUserId as jest.Mock).mockImplementation(() => ({
        execute: mockExecute,
      }));

      await expect(
        getUserByIdHandler(mockReq as Request, mockRes as Response)
      ).rejects.toThrow(AppError);

      expect(mockExecute).toHaveBeenCalledWith(999);
    });

    it('should rethrow other errors', async () => {
      mockReq.params = { userId: '1' };
      const otherError = new Error('Database error');
      const mockExecute = jest.fn().mockRejectedValue(otherError);
      (GetUserByUserId as jest.Mock).mockImplementation(() => ({
        execute: mockExecute,
      }));

      await expect(
        getUserByIdHandler(mockReq as Request, mockRes as Response)
      ).rejects.toThrow(otherError);
    });

    it('should parse userId as number', async () => {
      mockReq.params = { userId: '123' };
      const mockExecute = jest.fn().mockResolvedValue({ userId: 123 });
      (GetUserByUserId as jest.Mock).mockImplementation(() => ({
        execute: mockExecute,
      }));

      await getUserByIdHandler(mockReq as Request, mockRes as Response);

      expect(mockExecute).toHaveBeenCalledWith(123);
    });
  });

  describe('validation middleware', () => {
    it('should have validation for userId parameter', () => {
      const router = UserController.getRouter();
      const route = router.stack.find((layer: any) => 
        layer.route?.path === '/:userId' && layer.route?.methods.get
      );

      // The middleware stack includes validation before the handler
      expect(route?.route?.stack.length).toBeGreaterThan(1);
    });
  });
});