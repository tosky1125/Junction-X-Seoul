import { GetCarsByUserId } from '../../../../car/service/GetCarsByUserId';
import { CarRepository } from '../../../../car/CarRepository';

// Mock dependencies
jest.mock('../../../../car/CarRepository');

describe('GetCarsByUserId', () => {
  let service: GetCarsByUserId;
  let mockCarRepository: jest.Mocked<CarRepository>;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup mock implementation
    mockCarRepository = {
      getCarListByUserId: jest.fn(),
    } as any;
    
    (CarRepository as jest.Mock).mockImplementation(() => mockCarRepository);
    
    service = new GetCarsByUserId();
  });

  describe('execute', () => {
    it('should return cars for given userId', async () => {
      const userId = 1;
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

      mockCarRepository.getCarListByUserId.mockResolvedValue(mockCars);

      const result = await service.execute(userId);

      expect(mockCarRepository.getCarListByUserId).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockCars);
    });

    it('should return empty array when user has no cars', async () => {
      const userId = 2;
      
      mockCarRepository.getCarListByUserId.mockResolvedValue([]);

      const result = await service.execute(userId);

      expect(mockCarRepository.getCarListByUserId).toHaveBeenCalledWith(userId);
      expect(result).toEqual([]);
    });

    it('should propagate errors from repository', async () => {
      const userId = 1;
      const error = new Error('Database connection failed');
      
      mockCarRepository.getCarListByUserId.mockRejectedValue(error);

      await expect(service.execute(userId)).rejects.toThrow(error);
      expect(mockCarRepository.getCarListByUserId).toHaveBeenCalledWith(userId);
    });

    it('should handle null/undefined response from repository', async () => {
      const userId = 1;
      
      mockCarRepository.getCarListByUserId.mockResolvedValue(null as any);

      const result = await service.execute(userId);

      expect(result).toBeNull();
    });
  });
});