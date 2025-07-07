import { GetPracticalCourse } from '../../../../DrivingRecord/service/GetPracticalCourse';
import { DrivingRecordRepository } from '../../../../DrivingRecord/DrivingRecordRepository';

// Mock dependencies
jest.mock('../../../../DrivingRecord/DrivingRecordRepository');

describe('GetPracticalCourse', () => {
  let service: GetPracticalCourse;
  let mockDrivingRecordRepository: jest.Mocked<DrivingRecordRepository>;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup mock implementation
    mockDrivingRecordRepository = {
      getPracticalCourse: jest.fn(),
    } as any;
    
    (DrivingRecordRepository as jest.Mock).mockImplementation(() => mockDrivingRecordRepository);
    
    service = new GetPracticalCourse();
  });

  describe('execute', () => {
    it('should return practical courses', async () => {
      const mockCourses = [
        {
          courseId: 1,
          name: 'Basic Driving Course',
          description: 'For beginners',
          duration: 60,
        },
        {
          courseId: 2,
          name: 'Advanced Driving Course',
          description: 'For experienced drivers',
          duration: 90,
        },
        {
          courseId: 3,
          name: 'Highway Driving Course',
          description: 'Highway and expressway driving',
          duration: 120,
        },
      ];

      mockDrivingRecordRepository.getPracticalCourse.mockResolvedValue(mockCourses);

      const result = await service.execute();

      expect(mockDrivingRecordRepository.getPracticalCourse).toHaveBeenCalled();
      expect(result).toEqual(mockCourses);
    });

    it('should return empty array when no courses available', async () => {
      mockDrivingRecordRepository.getPracticalCourse.mockResolvedValue([]);

      const result = await service.execute();

      expect(mockDrivingRecordRepository.getPracticalCourse).toHaveBeenCalled();
      expect(result).toEqual([]);
    });

    it('should propagate errors from repository', async () => {
      const error = new Error('Failed to fetch courses');
      
      mockDrivingRecordRepository.getPracticalCourse.mockRejectedValue(error);

      await expect(service.execute()).rejects.toThrow(error);
      expect(mockDrivingRecordRepository.getPracticalCourse).toHaveBeenCalled();
    });

    it('should handle null/undefined response from repository', async () => {
      mockDrivingRecordRepository.getPracticalCourse.mockResolvedValue(null as any);

      const result = await service.execute();

      expect(result).toBeNull();
    });
  });
});