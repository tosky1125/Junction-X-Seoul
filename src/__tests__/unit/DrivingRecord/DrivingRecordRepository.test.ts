import { DrivingRecordRepository } from '../../../DrivingRecord/DrivingRecordRepository';
import { DatabaseConnection } from '../../../database/connection';

// Mock database connection
jest.mock('../../../database/connection');

describe('DrivingRecordRepository', () => {
  let repository: DrivingRecordRepository;
  let mockKnex: any;
  let mockQueryBuilder: any;

  beforeEach(() => {
    // Create a mock query builder for function calls
    mockQueryBuilder = {
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
      join: jest.fn().mockReturnThis(),
      leftJoin: jest.fn().mockReturnThis(),
      then: jest.fn(),
    };

    // Create mock knex instance
    mockKnex = jest.fn(() => mockQueryBuilder);
    mockKnex.select = mockQueryBuilder.select;
    mockKnex.from = mockQueryBuilder.from;
    mockKnex.where = mockQueryBuilder.where;
    mockKnex.raw = jest.fn();

    // Mock DatabaseConnection
    (DatabaseConnection as any).getInstance = jest.fn().mockReturnValue({
      getKnex: jest.fn().mockReturnValue(mockKnex),
    });

    repository = new DrivingRecordRepository();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getListByUserId', () => {
    it('should return driving records for a specific user', async () => {
      const userId = 1;
      const mockRecords = [
        {
          record_id: 1,
          user_id: 1,
          course_id: 101,
          driving_time: 45,
          distance: 25.5,
          date: '2023-01-01',
        },
        {
          record_id: 2,
          user_id: 1,
          course_id: 102,
          driving_time: 60,
          distance: 35.2,
          date: '2023-01-02',
        },
      ];

      mockQueryBuilder.orderBy.mockResolvedValueOnce(mockRecords);

      const result = await repository.getListByUserId(userId);

      expect(mockQueryBuilder.from).toHaveBeenCalledWith('driving_records');
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('user_id', userId);
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith('date', 'desc');
      expect(result).toEqual(mockRecords);
    });

    it('should return empty array when user has no records', async () => {
      const userId = 999;

      mockQueryBuilder.orderBy.mockResolvedValueOnce([]);

      const result = await repository.getListByUserId(userId);

      expect(result).toEqual([]);
    });

    it('should handle database errors', async () => {
      const userId = 1;
      const dbError = new Error('Database query failed');

      mockQueryBuilder.orderBy.mockRejectedValueOnce(dbError);

      await expect(repository.getListByUserId(userId)).rejects.toThrow(dbError);
    });
  });

  describe('getPracticalCourse', () => {
    it('should return all practical courses', async () => {
      const mockCourses = [
        {
          course_id: 1,
          name: 'Basic Driving Course',
          description: 'For beginners',
          duration: 60,
        },
        {
          course_id: 2,
          name: 'Advanced Driving Course',
          description: 'For experienced drivers',
          duration: 90,
        },
      ];

      mockQueryBuilder.from.mockResolvedValueOnce(mockCourses);

      const result = await repository.getPracticalCourse();

      expect(mockQueryBuilder.from).toHaveBeenCalledWith('practical_courses');
      expect(result).toEqual(mockCourses);
    });

    it('should return empty array when no courses exist', async () => {
      mockQueryBuilder.from.mockResolvedValueOnce([]);

      const result = await repository.getPracticalCourse();

      expect(result).toEqual([]);
    });

    it('should handle database errors', async () => {
      const dbError = new Error('Database connection failed');

      mockQueryBuilder.from.mockRejectedValueOnce(dbError);

      await expect(repository.getPracticalCourse()).rejects.toThrow(dbError);
    });
  });

  describe('insert', () => {
    it('should insert a new driving record', async () => {
      const recordData = {
        user_id: 1,
        course_id: 101,
        driving_time: 45,
        distance: 25.5,
        start_time: '2023-01-01 10:00:00',
        end_time: '2023-01-01 10:45:00',
      };

      const insertedId = [1];
      mockQueryBuilder.insert.mockResolvedValueOnce(insertedId);

      const result = await repository.insert(recordData);

      expect(mockKnex).toHaveBeenCalledWith('driving_records');
      expect(mockQueryBuilder.insert).toHaveBeenCalledWith(recordData);
      expect(result).toEqual(insertedId);
    });

    it('should handle insert errors', async () => {
      const recordData = { user_id: 1 };
      const dbError = new Error('Insert failed');

      mockQueryBuilder.insert.mockRejectedValueOnce(dbError);

      await expect(repository.insert(recordData)).rejects.toThrow(dbError);
    });
  });

  describe('getLastRecordByUserId', () => {
    it('should return the last driving record for a user', async () => {
      const userId = 1;
      const mockRecord = {
        record_id: 5,
        user_id: 1,
        course_id: 103,
        date: '2023-01-05',
      };

      mockQueryBuilder.first.mockResolvedValueOnce(mockRecord);

      const result = await repository.getLastRecordByUserId(userId);

      expect(mockQueryBuilder.where).toHaveBeenCalledWith('user_id', userId);
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith('date', 'desc');
      expect(mockQueryBuilder.first).toHaveBeenCalled();
      expect(result).toEqual(mockRecord);
    });

    it('should return null when user has no records', async () => {
      const userId = 999;

      mockQueryBuilder.first.mockResolvedValueOnce(null);

      const result = await repository.getLastRecordByUserId(userId);

      expect(result).toBeNull();
    });
  });

  describe('Database connection', () => {
    it('should get knex instance from DatabaseConnection', () => {
      const newRepo = new DrivingRecordRepository();
      
      expect(DatabaseConnection.getInstance).toHaveBeenCalled();
      expect((DatabaseConnection.getInstance() as any).getKnex).toHaveBeenCalled();
    });
  });
});