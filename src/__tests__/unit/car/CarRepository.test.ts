import { CarRepository } from '../../../car/CarRepository';
import { DatabaseConnection } from '../../../database/connection';

// Mock database connection
jest.mock('../../../database/connection');

describe('CarRepository', () => {
  let repository: CarRepository;
  let mockKnex: any;

  beforeEach(() => {
    // Create a mock knex instance with chainable methods
    mockKnex = {
      select: jest.fn().mockReturnThis(),
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      first: jest.fn(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      del: jest.fn().mockReturnThis(),
      returning: jest.fn().mockReturnThis(),
    };

    // Mock DatabaseConnection
    (DatabaseConnection as any).getInstance = jest.fn().mockReturnValue({
      getKnex: jest.fn().mockReturnValue(mockKnex),
    });

    repository = new CarRepository();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getCarListByUserId', () => {
    it('should return cars for a specific user', async () => {
      const userId = 1;
      const mockCars = [
        {
          car_id: 1,
          user_id: 1,
          manufacturer: 'Toyota',
          model: 'Camry',
          year: 2020,
        },
        {
          car_id: 2,
          user_id: 1,
          manufacturer: 'Honda',
          model: 'Civic',
          year: 2021,
        },
      ];

      // Mock the final promise resolution
      mockKnex.where.mockResolvedValueOnce(mockCars);

      const result = await repository.getCarListByUserId(userId);

      // Verify the query chain
      expect(mockKnex.select).toHaveBeenCalledWith('*');
      expect(mockKnex.from).toHaveBeenCalledWith('cars');
      expect(mockKnex.where).toHaveBeenCalledWith('user_id', userId);
      expect(result).toEqual(mockCars);
    });

    it('should return empty array when user has no cars', async () => {
      const userId = 999;

      mockKnex.where.mockResolvedValueOnce([]);

      const result = await repository.getCarListByUserId(userId);

      expect(mockKnex.where).toHaveBeenCalledWith('user_id', userId);
      expect(result).toEqual([]);
    });

    it('should handle database errors', async () => {
      const userId = 1;
      const dbError = new Error('Database query failed');

      mockKnex.where.mockRejectedValueOnce(dbError);

      await expect(repository.getCarListByUserId(userId)).rejects.toThrow(dbError);
    });

    it('should use correct table name', async () => {
      const userId = 1;
      mockKnex.where.mockResolvedValueOnce([]);

      await repository.getCarListByUserId(userId);

      expect(mockKnex.from).toHaveBeenCalledWith('cars');
    });
  });

  describe('Database connection', () => {
    it('should get knex instance from DatabaseConnection', () => {
      const newRepo = new CarRepository();
      
      expect(DatabaseConnection.getInstance).toHaveBeenCalled();
      expect((DatabaseConnection.getInstance() as any).getKnex).toHaveBeenCalled();
    });
  });
});