import request from 'supertest';
import express from 'express';
import CarController from '../../../car/CarController';
import { GetCarsByUserId } from '../../../car/service/GetCarsByUserId';
import { UserNotExistError } from '../../../user/error/UserNotExistError';
import { errorHandler } from '../../../common/middleware/errorHandler';

// Mock only the service layer
jest.mock('../../../car/service/GetCarsByUserId');

describe('CarController', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/cars', CarController.getRouter());
    app.use(errorHandler); // Add error handler to properly handle errors
    
    jest.clearAllMocks();
  });

  describe('initializeRoutes', () => {
    it('should register GET /user/:userId route', () => {
      const router = CarController.getRouter();
      const routes = router.stack
        .filter((layer: any) => layer.route)
        .map((layer: any) => ({
          path: layer.route.path,
          methods: layer.route.methods,
        }));

      expect(routes).toContainEqual({
        path: '/user/:userId',
        methods: expect.objectContaining({ get: true }),
      });
    });
  });

  describe('GET /api/cars/user/:userId', () => {
    it('should return cars data successfully', async () => {
      const mockCars = [
        {
          carId: 1,
          manufacturer: 'Toyota',
          model: 'Camry',
          userId: 1,
        },
        {
          carId: 2,
          manufacturer: 'Honda',
          model: 'Civic',
          userId: 1,
        },
      ];

      const mockExecute = jest.fn().mockResolvedValue(mockCars);
      (GetCarsByUserId as jest.Mock).mockImplementation(() => ({
        execute: mockExecute,
      }));

      const response = await request(app)
        .get('/api/cars/user/1')
        .expect(200);

      expect(mockExecute).toHaveBeenCalledWith(1);
      expect(response.body).toMatchObject({
        status: 'success',
        data: mockCars,
      });
    });

    it('should return empty array when user has no cars', async () => {
      const mockExecute = jest.fn().mockResolvedValue([]);
      (GetCarsByUserId as jest.Mock).mockImplementation(() => ({
        execute: mockExecute,
      }));

      const response = await request(app)
        .get('/api/cars/user/1')
        .expect(200);

      expect(mockExecute).toHaveBeenCalledWith(1);
      expect(response.body).toMatchObject({
        status: 'success',
        data: [],
      });
    });

    it('should handle UserNotExistError', async () => {
      const mockExecute = jest.fn().mockRejectedValue(new UserNotExistError());
      (GetCarsByUserId as jest.Mock).mockImplementation(() => ({
        execute: mockExecute,
      }));

      const response = await request(app)
        .get('/api/cars/user/999')
        .expect(404);

      expect(mockExecute).toHaveBeenCalledWith(999);
      expect(response.body).toMatchObject({
        status: 'error',
        error: {
          code: 'NOT_FOUND',
        },
      });
    });

    it('should rethrow other errors', async () => {
      const otherError = new Error('Database error');
      const mockExecute = jest.fn().mockRejectedValue(otherError);
      (GetCarsByUserId as jest.Mock).mockImplementation(() => ({
        execute: mockExecute,
      }));

      const response = await request(app)
        .get('/api/cars/user/1')
        .expect(500);

      expect(response.body).toMatchObject({
        status: 'error',
        error: {
          code: 'INTERNAL_SERVER_ERROR',
        },
      });
    });

    it('should validate userId parameter', async () => {
      const response = await request(app)
        .get('/api/cars/user/invalid')
        .expect(400);

      expect(response.body).toMatchObject({
        status: 'error',
        error: {
          code: 'VALIDATION_ERROR',
        },
      });
    });

    it('should parse userId as number', async () => {
      const mockExecute = jest.fn().mockResolvedValue([]);
      (GetCarsByUserId as jest.Mock).mockImplementation(() => ({
        execute: mockExecute,
      }));

      await request(app)
        .get('/api/cars/user/456')
        .expect(200);

      expect(mockExecute).toHaveBeenCalledWith(456);
    });
  });

  describe('validation middleware', () => {
    it('should have validation for userId parameter', () => {
      const router = CarController.getRouter();
      const route = router.stack.find((layer: any) => 
        layer.route?.path === '/user/:userId' && layer.route?.methods.get
      );

      // The middleware stack includes validation before the handler
      expect(route?.route?.stack.length).toBeGreaterThan(1);
    });
  });
});