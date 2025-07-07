import { Request, Response } from 'express';
import DrivingRecordController from '../../../DrivingRecord/DrivingRecordController';
import { GetRecordsByUserId } from '../../../DrivingRecord/service/GetRecordsByUserId';
import { GetPracticalCourse } from '../../../DrivingRecord/service/GetPracticalCourse';
import { InsertDrivingRecord } from '../../../DrivingRecord/service/InsertDrivingRecord';
import { UserNotExistError } from '../../../user/error/UserNotExistError';
import { PayloadValidationError } from '../../../infra/PayloadValidationError';
import { AppError } from '../../../common/errors/AppError';
import { ResponseHandler } from '../../../common/utils/responseHandler';

// Mock dependencies
jest.mock('../../../DrivingRecord/service/GetRecordsByUserId');
jest.mock('../../../DrivingRecord/service/GetPracticalCourse');
jest.mock('../../../DrivingRecord/service/InsertDrivingRecord');
jest.mock('../../../common/utils/responseHandler');

describe('DrivingRecordController', () => {
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
    it('should register all required routes', () => {
      const router = DrivingRecordController.getRouter();
      const routes = router.stack
        .filter((layer: any) => layer.route)
        .map((layer: any) => ({
          path: layer.route.path,
          methods: layer.route.methods,
        }));

      expect(routes).toContainEqual({
        path: '/',
        methods: expect.objectContaining({ post: true }),
      });
      expect(routes).toContainEqual({
        path: '/practical-courses',
        methods: expect.objectContaining({ get: true }),
      });
      expect(routes).toContainEqual({
        path: '/user/:userId',
        methods: expect.objectContaining({ get: true }),
      });
    });
  });

  describe('insertRecord', () => {
    const insertRecordHandler = (DrivingRecordController as any).insertRecord.bind(DrivingRecordController);

    it('should create driving record successfully', async () => {
      const mockBody = {
        userId: 1,
        courseId: 101,
        startTime: '2023-01-01T10:00:00Z',
        endTime: '2023-01-01T11:00:00Z',
      };
      const mockResult = {
        recordId: 1,
        ...mockBody,
      };

      mockReq.body = mockBody;
      const mockExecute = jest.fn().mockResolvedValue(mockResult);
      (InsertDrivingRecord as jest.Mock).mockImplementation(() => ({
        execute: mockExecute,
      }));

      await insertRecordHandler(mockReq as Request, mockRes as Response);

      expect(mockExecute).toHaveBeenCalledWith(mockBody);
      expect(ResponseHandler.created).toHaveBeenCalledWith(mockRes, mockResult);
    });

    it('should handle PayloadValidationError', async () => {
      const mockBody = { invalid: 'data' };
      mockReq.body = mockBody;
      
      const mockExecute = jest.fn().mockRejectedValue(new PayloadValidationError());
      (InsertDrivingRecord as jest.Mock).mockImplementation(() => ({
        execute: mockExecute,
      }));

      await expect(
        insertRecordHandler(mockReq as Request, mockRes as Response)
      ).rejects.toThrow(AppError);
    });

    it('should rethrow other errors', async () => {
      mockReq.body = { userId: 1 };
      const otherError = new Error('Database error');
      
      const mockExecute = jest.fn().mockRejectedValue(otherError);
      (InsertDrivingRecord as jest.Mock).mockImplementation(() => ({
        execute: mockExecute,
      }));

      await expect(
        insertRecordHandler(mockReq as Request, mockRes as Response)
      ).rejects.toThrow(otherError);
    });
  });

  describe('getPracticalCourse', () => {
    const getPracticalCourseHandler = (DrivingRecordController as any).getPracticalCourse.bind(DrivingRecordController);

    it('should return practical courses successfully', async () => {
      const mockCourses = [
        { courseId: 1, name: 'Basic Course' },
        { courseId: 2, name: 'Advanced Course' },
      ];

      const mockExecute = jest.fn().mockResolvedValue(mockCourses);
      (GetPracticalCourse as jest.Mock).mockImplementation(() => ({
        execute: mockExecute,
      }));

      await getPracticalCourseHandler(mockReq as Request, mockRes as Response);

      expect(mockExecute).toHaveBeenCalled();
      expect(ResponseHandler.success).toHaveBeenCalledWith(mockRes, mockCourses);
    });

    it('should handle empty courses', async () => {
      const mockExecute = jest.fn().mockResolvedValue([]);
      (GetPracticalCourse as jest.Mock).mockImplementation(() => ({
        execute: mockExecute,
      }));

      await getPracticalCourseHandler(mockReq as Request, mockRes as Response);

      expect(mockExecute).toHaveBeenCalled();
      expect(ResponseHandler.success).toHaveBeenCalledWith(mockRes, []);
    });
  });

  describe('getRecordsByUserId', () => {
    const getRecordsByUserIdHandler = (DrivingRecordController as any).getRecordsByUserId.bind(DrivingRecordController);

    it('should return driving records successfully', async () => {
      const mockRecords = [
        {
          recordId: 1,
          userId: 1,
          courseId: 101,
          date: '2023-01-01',
        },
        {
          recordId: 2,
          userId: 1,
          courseId: 102,
          date: '2023-01-02',
        },
      ];

      mockReq.params = { userId: '1' };
      const mockExecute = jest.fn().mockResolvedValue(mockRecords);
      (GetRecordsByUserId as jest.Mock).mockImplementation(() => ({
        execute: mockExecute,
      }));

      await getRecordsByUserIdHandler(mockReq as Request, mockRes as Response);

      expect(mockExecute).toHaveBeenCalledWith(1);
      expect(ResponseHandler.success).toHaveBeenCalledWith(mockRes, mockRecords);
    });

    it('should handle UserNotExistError', async () => {
      mockReq.params = { userId: '999' };
      const mockExecute = jest.fn().mockRejectedValue(new UserNotExistError());
      (GetRecordsByUserId as jest.Mock).mockImplementation(() => ({
        execute: mockExecute,
      }));

      await expect(
        getRecordsByUserIdHandler(mockReq as Request, mockRes as Response)
      ).rejects.toThrow(AppError);

      expect(mockExecute).toHaveBeenCalledWith(999);
    });

    it('should rethrow other errors', async () => {
      mockReq.params = { userId: '1' };
      const otherError = new Error('Database error');
      const mockExecute = jest.fn().mockRejectedValue(otherError);
      (GetRecordsByUserId as jest.Mock).mockImplementation(() => ({
        execute: mockExecute,
      }));

      await expect(
        getRecordsByUserIdHandler(mockReq as Request, mockRes as Response)
      ).rejects.toThrow(otherError);
    });

    it('should parse userId as number', async () => {
      mockReq.params = { userId: '789' };
      const mockExecute = jest.fn().mockResolvedValue([]);
      (GetRecordsByUserId as jest.Mock).mockImplementation(() => ({
        execute: mockExecute,
      }));

      await getRecordsByUserIdHandler(mockReq as Request, mockRes as Response);

      expect(mockExecute).toHaveBeenCalledWith(789);
    });
  });

  describe('validation middleware', () => {
    it('should have validation for POST / route', () => {
      const router = DrivingRecordController.getRouter();
      const route = router.stack.find((layer: any) => 
        layer.route?.path === '/' && layer.route?.methods.post
      );

      // The middleware stack includes validation before the handler
      expect(route?.route?.stack.length).toBeGreaterThan(1);
    });

    it('should have validation for GET /user/:userId route', () => {
      const router = DrivingRecordController.getRouter();
      const route = router.stack.find((layer: any) => 
        layer.route?.path === '/user/:userId' && layer.route?.methods.get
      );

      // The middleware stack includes validation before the handler
      expect(route?.route?.stack.length).toBeGreaterThan(1);
    });
  });
});