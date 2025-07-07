import { GetRecordsByUserId } from '../../../../DrivingRecord/service/GetRecordsByUserId';
import { DrivingRecordRepository } from '../../../../DrivingRecord/DrivingRecordRepository';

// Mock dependencies
jest.mock('../../../../DrivingRecord/DrivingRecordRepository');

describe('GetRecordsByUserId', () => {
  let service: GetRecordsByUserId;
  let mockDrivingRecordRepository: jest.Mocked<DrivingRecordRepository>;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup mock implementation
    mockDrivingRecordRepository = {
      getListByUserId: jest.fn(),
    } as any;
    
    (DrivingRecordRepository as jest.Mock).mockImplementation(() => mockDrivingRecordRepository);
    
    service = new GetRecordsByUserId();
  });

  describe('execute', () => {
    it('should return driving records for given userId', async () => {
      const userId = 1;
      const mockRecords = [
        {
          recordId: 1,
          userId: 1,
          courseId: 101,
          date: '2023-01-01',
          distance: 25.5,
          drivingTime: 45,
        },
        {
          recordId: 2,
          userId: 1,
          courseId: 102,
          date: '2023-01-02',
          distance: 30.2,
          drivingTime: 50,
        },
      ];

      mockDrivingRecordRepository.getListByUserId.mockResolvedValue(mockRecords);

      const result = await service.execute(userId);

      expect(mockDrivingRecordRepository.getListByUserId).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockRecords);
    });

    it('should return empty array when user has no driving records', async () => {
      const userId = 2;
      
      mockDrivingRecordRepository.getListByUserId.mockResolvedValue([]);

      const result = await service.execute(userId);

      expect(mockDrivingRecordRepository.getListByUserId).toHaveBeenCalledWith(userId);
      expect(result).toEqual([]);
    });

    it('should propagate errors from repository', async () => {
      const userId = 1;
      const error = new Error('Database query failed');
      
      mockDrivingRecordRepository.getListByUserId.mockRejectedValue(error);

      await expect(service.execute(userId)).rejects.toThrow(error);
      expect(mockDrivingRecordRepository.getListByUserId).toHaveBeenCalledWith(userId);
    });

    it('should handle null/undefined response from repository', async () => {
      const userId = 1;
      
      mockDrivingRecordRepository.getListByUserId.mockResolvedValue(null as any);

      const result = await service.execute(userId);

      expect(result).toBeNull();
    });

    it('should handle different userId types', async () => {
      const userId = 999;
      const mockRecords = [{ recordId: 1 }];
      
      mockDrivingRecordRepository.getListByUserId.mockResolvedValue(mockRecords);

      const result = await service.execute(userId);

      expect(mockDrivingRecordRepository.getListByUserId).toHaveBeenCalledWith(999);
      expect(result).toEqual(mockRecords);
    });
  });
});