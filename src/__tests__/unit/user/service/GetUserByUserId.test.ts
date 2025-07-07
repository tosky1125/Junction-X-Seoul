import { GetUserByUserId } from '../../../../user/service/GetUserByUserId';
import { UserRepository } from '../../../../user/UserRepository';
import { UserNotExistError } from '../../../../user/error/UserNotExistError';
import { GetRecordsByUserId } from '../../../../DrivingRecord/service/GetRecordsByUserId';
import { GetCarsByUserId } from '../../../../car/service/GetCarsByUserId';
import { User } from '../../../../user/domain/User';

// Mock dependencies
jest.mock('../../../../user/UserRepository');
jest.mock('../../../../DrivingRecord/service/GetRecordsByUserId');
jest.mock('../../../../car/service/GetCarsByUserId');
jest.mock('../../../../user/domain/User');

describe('GetUserByUserId', () => {
  let service: GetUserByUserId;
  let mockUserRepository: jest.Mocked<UserRepository>;
  let mockGetRecordsByUserId: jest.Mocked<GetRecordsByUserId>;
  let mockGetCarsByUserId: jest.Mocked<GetCarsByUserId>;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup mock implementations
    mockUserRepository = {
      getUserDetailByUserId: jest.fn(),
    } as any;
    
    (UserRepository as jest.Mock).mockImplementation(() => mockUserRepository);
    
    mockGetRecordsByUserId = {
      execute: jest.fn(),
    } as any;
    
    (GetRecordsByUserId as jest.Mock).mockImplementation(() => mockGetRecordsByUserId);
    
    mockGetCarsByUserId = {
      execute: jest.fn(),
    } as any;
    
    (GetCarsByUserId as jest.Mock).mockImplementation(() => mockGetCarsByUserId);
    
    service = new GetUserByUserId();
  });

  describe('execute', () => {
    it('should return user with driving records and cars', async () => {
      const userId = 1;
      const mockUser = {
        setDrivingRecords: jest.fn(),
        setCars: jest.fn(),
      };
      const mockRecords = [{ recordId: 1 }, { recordId: 2 }];
      const mockCars = [{ carId: 1 }, { carId: 2 }];

      mockUserRepository.getUserDetailByUserId.mockResolvedValue(mockUser as any);
      mockGetRecordsByUserId.execute.mockResolvedValue(mockRecords as any);
      mockGetCarsByUserId.execute.mockResolvedValue(mockCars as any);

      const result = await service.execute(userId);

      expect(mockUserRepository.getUserDetailByUserId).toHaveBeenCalledWith(userId);
      expect(mockGetRecordsByUserId.execute).toHaveBeenCalledWith(userId);
      expect(mockGetCarsByUserId.execute).toHaveBeenCalledWith(userId);
      expect(mockUser.setDrivingRecords).toHaveBeenCalledWith(mockRecords);
      expect(mockUser.setCars).toHaveBeenCalledWith(mockCars);
      expect(result).toBe(mockUser);
    });

    it('should throw UserNotExistError when user not found', async () => {
      const userId = 999;
      
      mockUserRepository.getUserDetailByUserId.mockResolvedValue(null);

      await expect(service.execute(userId)).rejects.toThrow(UserNotExistError);
      
      expect(mockUserRepository.getUserDetailByUserId).toHaveBeenCalledWith(userId);
      expect(mockGetRecordsByUserId.execute).not.toHaveBeenCalled();
      expect(mockGetCarsByUserId.execute).not.toHaveBeenCalled();
    });

    it('should handle empty driving records and cars', async () => {
      const userId = 1;
      const mockUser = {
        setDrivingRecords: jest.fn(),
        setCars: jest.fn(),
      };

      mockUserRepository.getUserDetailByUserId.mockResolvedValue(mockUser as any);
      mockGetRecordsByUserId.execute.mockResolvedValue([]);
      mockGetCarsByUserId.execute.mockResolvedValue([]);

      const result = await service.execute(userId);

      expect(mockUser.setDrivingRecords).toHaveBeenCalledWith([]);
      expect(mockUser.setCars).toHaveBeenCalledWith([]);
      expect(result).toBe(mockUser);
    });

    it('should propagate errors from GetRecordsByUserId', async () => {
      const userId = 1;
      const mockUser = {
        setDrivingRecords: jest.fn(),
        setCars: jest.fn(),
      };
      const error = new Error('Database error');

      mockUserRepository.getUserDetailByUserId.mockResolvedValue(mockUser as any);
      mockGetRecordsByUserId.execute.mockRejectedValue(error);

      await expect(service.execute(userId)).rejects.toThrow(error);
    });

    it('should propagate errors from GetCarsByUserId', async () => {
      const userId = 1;
      const mockUser = {
        setDrivingRecords: jest.fn(),
        setCars: jest.fn(),
      };
      const error = new Error('Database error');

      mockUserRepository.getUserDetailByUserId.mockResolvedValue(mockUser as any);
      mockGetRecordsByUserId.execute.mockResolvedValue([]);
      mockGetCarsByUserId.execute.mockRejectedValue(error);

      await expect(service.execute(userId)).rejects.toThrow(error);
    });
  });
});