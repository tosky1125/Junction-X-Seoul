import { GetCarsByUserId } from '../../../../car/service/GetCarsByUserId';
import { CarRepository } from '../../../../car/CarRepository';
import { DatabaseConnection } from '../../../../database/connection';

// Mock only the database connection
jest.mock('../../../../database/connection');

describe('GetCarsByUserId Service - Direct Test', () => {
  let service: GetCarsByUserId;
  let mockKnex: any;

  beforeEach(() => {
    // Mock knex instance
    mockKnex = {
      select: jest.fn().mockReturnThis(),
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      first: jest.fn(),
      then: jest.fn(),
    };

    // Mock DatabaseConnection
    (DatabaseConnection as any).getInstance = jest.fn().mockReturnValue({
      getKnex: jest.fn().mockReturnValue(mockKnex),
    });

    service = new GetCarsByUserId();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should create CarRepository and call getCarListByUserId', async () => {
      const userId = 1;
      const mockCars = [
        { car_id: 1, manufacturer: 'Toyota', model: 'Camry' },
        { car_id: 2, manufacturer: 'Honda', model: 'Civic' },
      ];

      // Mock the database response
      mockKnex.where.mockReturnValueOnce(Promise.resolve(mockCars));

      const result = await service.execute(userId);

      // Verify that CarRepository is instantiated (constructor is called)
      expect(DatabaseConnection.getInstance).toHaveBeenCalled();
      
      // The result should be the cars returned by the repository
      expect(result).toEqual(mockCars);
    });

    it('should handle empty result', async () => {
      const userId = 999;

      // Mock empty database response
      mockKnex.where.mockReturnValueOnce(Promise.resolve([]));

      const result = await service.execute(userId);

      expect(result).toEqual([]);
    });

    it('should propagate database errors', async () => {
      const userId = 1;
      const dbError = new Error('Database connection failed');

      // Mock database error
      mockKnex.where.mockRejectedValueOnce(dbError);

      await expect(service.execute(userId)).rejects.toThrow(dbError);
    });
  });
});