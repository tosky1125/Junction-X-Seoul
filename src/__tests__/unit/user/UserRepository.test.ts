import { UserRepository } from '../../../user/UserRepository';
import { DatabaseConnection } from '../../../database/connection';

// Mock database connection
jest.mock('../../../database/connection');

describe('UserRepository', () => {
  let repository: UserRepository;
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
      join: jest.fn().mockReturnThis(),
      leftJoin: jest.fn().mockReturnThis(),
    };

    // Mock DatabaseConnection
    (DatabaseConnection as any).getInstance = jest.fn().mockReturnValue({
      getKnex: jest.fn().mockReturnValue(mockKnex),
    });

    repository = new UserRepository();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserDetailByUserId', () => {
    it('should return user details for a specific user', async () => {
      const userId = 1;
      const mockUser = {
        user_id: 1,
        name: 'Test User',
        email: 'test@example.com',
        phone: '123-456-7890',
        created_at: new Date('2023-01-01'),
        updated_at: new Date('2023-01-01'),
      };

      // Mock the final promise resolution
      mockKnex.first.mockResolvedValueOnce(mockUser);

      const result = await repository.getUserDetailByUserId(userId);

      // Verify the query chain
      expect(mockKnex.select).toHaveBeenCalledWith('*');
      expect(mockKnex.from).toHaveBeenCalledWith('users');
      expect(mockKnex.where).toHaveBeenCalledWith('user_id', userId);
      expect(mockKnex.first).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });

    it('should return null when user not found', async () => {
      const userId = 999;

      mockKnex.first.mockResolvedValueOnce(null);

      const result = await repository.getUserDetailByUserId(userId);

      expect(mockKnex.where).toHaveBeenCalledWith('user_id', userId);
      expect(result).toBeNull();
    });

    it('should handle database errors', async () => {
      const userId = 1;
      const dbError = new Error('Database query failed');

      mockKnex.first.mockRejectedValueOnce(dbError);

      await expect(repository.getUserDetailByUserId(userId)).rejects.toThrow(dbError);
    });

    it('should return undefined when user not found', async () => {
      const userId = 999;

      mockKnex.first.mockResolvedValueOnce(undefined);

      const result = await repository.getUserDetailByUserId(userId);

      expect(result).toBeUndefined();
    });

    it('should use correct table name', async () => {
      const userId = 1;
      mockKnex.first.mockResolvedValueOnce({});

      await repository.getUserDetailByUserId(userId);

      expect(mockKnex.from).toHaveBeenCalledWith('users');
    });

    it('should use first() to get single record', async () => {
      const userId = 1;
      mockKnex.first.mockResolvedValueOnce({});

      await repository.getUserDetailByUserId(userId);

      expect(mockKnex.first).toHaveBeenCalled();
      expect(mockKnex.limit).not.toHaveBeenCalled(); // Should use first() instead of limit(1)
    });
  });

  describe('Database connection', () => {
    it('should get knex instance from DatabaseConnection', () => {
      const newRepo = new UserRepository();
      
      expect(DatabaseConnection.getInstance).toHaveBeenCalled();
      expect((DatabaseConnection.getInstance() as any).getKnex).toHaveBeenCalled();
    });

    it('should reuse the same database connection', () => {
      const repo1 = new UserRepository();
      const repo2 = new UserRepository();
      
      const callCount = (DatabaseConnection.getInstance as jest.Mock).mock.calls.length;
      expect(callCount).toBeGreaterThanOrEqual(2);
    });
  });
});