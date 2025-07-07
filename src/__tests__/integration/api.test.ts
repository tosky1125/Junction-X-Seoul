import request from 'supertest';
import express from 'express';
import UserController from '../../user/UserController';
import CarController from '../../car/CarController';
import DrivingRecordController from '../../DrivingRecord/DrivingRecordController';
import { errorHandler } from '../../common/middleware/errorHandler';
import { GetUserByUserId } from '../../user/service/GetUserByUserId';
import { GetCarsByUserId } from '../../car/service/GetCarsByUserId';
import { GetRecordsByUserId } from '../../DrivingRecord/service/GetRecordsByUserId';
import { GetPracticalCourse } from '../../DrivingRecord/service/GetPracticalCourse';
import { InsertDrivingRecord } from '../../DrivingRecord/service/InsertDrivingRecord';

// Mock services
jest.mock('../../user/service/GetUserByUserId');
jest.mock('../../car/service/GetCarsByUserId');
jest.mock('../../DrivingRecord/service/GetRecordsByUserId');
jest.mock('../../DrivingRecord/service/GetPracticalCourse');
jest.mock('../../DrivingRecord/service/InsertDrivingRecord');

describe('API Integration Tests', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    
    // Mount controllers
    app.use('/api/users', UserController.getRouter());
    app.use('/api/cars', CarController.getRouter());
    app.use('/api/driving-records', DrivingRecordController.getRouter());
    
    // Error handler
    app.use(errorHandler);
    
    jest.clearAllMocks();
  });

  describe('User API', () => {
    describe('GET /api/users/:userId', () => {
      it('should return user with 200 status', async () => {
        const mockUser = {
          userId: 1,
          name: 'Test User',
          setDrivingRecords: jest.fn(),
          setCars: jest.fn(),
        };
        
        (GetUserByUserId as jest.Mock).mockImplementation(() => ({
          execute: jest.fn().mockResolvedValue(mockUser),
        }));

        const response = await request(app)
          .get('/api/users/1')
          .expect(200);

        expect(response.body).toMatchObject({
          status: 'success',
          data: expect.objectContaining({
            userId: 1,
            name: 'Test User',
          }),
        });
      });

      it('should return 400 for invalid userId', async () => {
        const response = await request(app)
          .get('/api/users/invalid')
          .expect(400);

        expect(response.body.status).toBe('error');
        expect(response.body.error.code).toBe('VALIDATION_ERROR');
      });

      it('should return 404 when user not found', async () => {
        const { UserNotExistError } = require('../../user/error/UserNotExistError');
        
        (GetUserByUserId as jest.Mock).mockImplementation(() => ({
          execute: jest.fn().mockRejectedValue(new UserNotExistError()),
        }));

        const response = await request(app)
          .get('/api/users/999')
          .expect(404);

        expect(response.body.status).toBe('error');
        expect(response.body.error.code).toBe('NOT_FOUND');
      });
    });
  });

  describe('Car API', () => {
    describe('GET /api/cars/user/:userId', () => {
      it('should return cars for user', async () => {
        const mockCars = [
          { carId: 1, manufacturer: 'Toyota', model: 'Camry' },
          { carId: 2, manufacturer: 'Honda', model: 'Civic' },
        ];
        
        (GetCarsByUserId as jest.Mock).mockImplementation(() => ({
          execute: jest.fn().mockResolvedValue(mockCars),
        }));

        const response = await request(app)
          .get('/api/cars/user/1')
          .expect(200);

        expect(response.body).toMatchObject({
          status: 'success',
          data: mockCars,
        });
      });

      it('should return empty array when user has no cars', async () => {
        (GetCarsByUserId as jest.Mock).mockImplementation(() => ({
          execute: jest.fn().mockResolvedValue([]),
        }));

        const response = await request(app)
          .get('/api/cars/user/1')
          .expect(200);

        expect(response.body.data).toEqual([]);
      });
    });
  });

  describe('Driving Record API', () => {
    describe('POST /api/driving-records', () => {
      it('should create driving record', async () => {
        const mockRecord = {
          recordId: 1,
          userId: 1,
          courseId: 101,
          startTime: '2023-01-01T10:00:00Z',
          endTime: '2023-01-01T11:00:00Z',
        };
        
        (InsertDrivingRecord as jest.Mock).mockImplementation(() => ({
          execute: jest.fn().mockResolvedValue(mockRecord),
        }));

        const response = await request(app)
          .post('/api/driving-records')
          .send({
            userId: 1,
            courseId: 101,
            startTime: '2023-01-01T10:00:00Z',
            endTime: '2023-01-01T11:00:00Z',
          })
          .expect(201);

        expect(response.body).toMatchObject({
          status: 'success',
          data: mockRecord,
        });
      });

      it('should validate required fields', async () => {
        const response = await request(app)
          .post('/api/driving-records')
          .send({
            userId: 1,
            // Missing required fields
          })
          .expect(400);

        expect(response.body.status).toBe('error');
        expect(response.body.error.code).toBe('VALIDATION_ERROR');
      });
    });

    describe('GET /api/driving-records/practical-courses', () => {
      it('should return practical courses', async () => {
        const mockCourses = [
          { courseId: 1, name: 'Basic Course' },
          { courseId: 2, name: 'Advanced Course' },
        ];
        
        (GetPracticalCourse as jest.Mock).mockImplementation(() => ({
          execute: jest.fn().mockResolvedValue(mockCourses),
        }));

        const response = await request(app)
          .get('/api/driving-records/practical-courses')
          .expect(200);

        expect(response.body).toMatchObject({
          status: 'success',
          data: mockCourses,
        });
      });
    });

    describe('GET /api/driving-records/user/:userId', () => {
      it('should return driving records for user', async () => {
        const mockRecords = [
          { recordId: 1, userId: 1, courseId: 101 },
          { recordId: 2, userId: 1, courseId: 102 },
        ];
        
        (GetRecordsByUserId as jest.Mock).mockImplementation(() => ({
          execute: jest.fn().mockResolvedValue(mockRecords),
        }));

        const response = await request(app)
          .get('/api/driving-records/user/1')
          .expect(200);

        expect(response.body).toMatchObject({
          status: 'success',
          data: mockRecords,
        });
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle 404 for unknown routes', async () => {
      const response = await request(app)
        .get('/api/unknown')
        .expect(404);

      expect(response.body).toMatchObject({
        status: 'error',
        error: expect.objectContaining({
          message: expect.any(String),
        }),
      });
    });

    it('should handle server errors', async () => {
      (GetUserByUserId as jest.Mock).mockImplementation(() => ({
        execute: jest.fn().mockRejectedValue(new Error('Database error')),
      }));

      const response = await request(app)
        .get('/api/users/1')
        .expect(500);

      expect(response.body.status).toBe('error');
      expect(response.body.error.code).toBe('INTERNAL_SERVER_ERROR');
    });
  });
});