// No import needed for type-only usage

// Mock knex
jest.mock('knex', () => {
  const mockKnex = jest.fn(() => {
    const instance = {
      raw: jest.fn().mockResolvedValue({ rows: [{ 1: 1 }] }),
      destroy: jest.fn().mockResolvedValue(undefined),
      on: jest.fn(),
    };
    return instance;
  });
  return { default: mockKnex };
});

describe('Database Connection', () => {
  let db: any;
  let DatabaseConnection: any;

  beforeEach(() => {
    // Clear module cache
    jest.resetModules();
    
    // Set environment variables
    process.env['DB_HOST'] = 'test-host';
    process.env['DB_PORT'] = '3306';
    process.env['DB_USER'] = 'test-user';
    process.env['DB_PASSWORD'] = 'test-password';
    process.env['DB_NAME'] = 'test-db';
    
    // Import after setting env vars
    DatabaseConnection = require('../../../database/connection').DatabaseConnection;
  });

  afterEach(async () => {
    // Clean up connection
    if (db) {
      await db.disconnect();
    }
    jest.clearAllMocks();
  });

  describe('getInstance', () => {
    it('should create a singleton instance', () => {
      const instance1 = DatabaseConnection.getInstance();
      const instance2 = DatabaseConnection.getInstance();

      expect(instance1).toBe(instance2);
    });

    it('should initialize with correct configuration', () => {
      DatabaseConnection.getInstance();
      const knexMock = require('knex').default;

      expect(knexMock).toHaveBeenCalledWith({
        client: 'mysql2',
        connection: {
          host: 'test-host',
          port: 3306,
          user: 'test-user',
          password: 'test-password',
          database: 'test-db',
          charset: 'utf8mb4',
          timezone: '+00:00',
        },
        pool: {
          min: 2,
          max: 10,
          acquireTimeoutMillis: 30000,
          createTimeoutMillis: 30000,
          destroyTimeoutMillis: 5000,
          idleTimeoutMillis: 30000,
          reapIntervalMillis: 1000,
          createRetryIntervalMillis: 200,
        },
        acquireConnectionTimeout: 30000,
        debug: false,
      });
    });

    it('should enable debug mode in development', () => {
      process.env['NODE_ENV'] = 'development';
      jest.resetModules();
      
      const DevDatabaseConnection = require('../../../database/connection').DatabaseConnection;
      DevDatabaseConnection.getInstance();
      const knexMock = require('knex').default;

      expect(knexMock).toHaveBeenCalledWith(
        expect.objectContaining({
          debug: true,
        })
      );
    });
  });

  describe('getKnex', () => {
    it('should return the knex instance', () => {
      const instance = DatabaseConnection.getInstance();
      const knex = instance.getKnex();

      expect(knex).toBeDefined();
      expect(knex.raw).toBeDefined();
    });
  });

  describe('connect', () => {
    it('should successfully connect to database', async () => {
      const instance = DatabaseConnection.getInstance();
      await instance.connect();

      const knex = instance.getKnex();
      expect(knex.raw).toHaveBeenCalledWith('SELECT 1');
    });

    it('should handle connection errors', async () => {
      const instance = DatabaseConnection.getInstance();
      const knex = instance.getKnex();
      
      knex.raw.mockRejectedValueOnce(new Error('Connection failed'));

      await expect(instance.connect()).rejects.toThrow('Connection failed');
    });

    it('should not connect twice', async () => {
      const instance = DatabaseConnection.getInstance();
      const knex = instance.getKnex();

      await instance.connect();
      await instance.connect();

      expect(knex.raw).toHaveBeenCalledTimes(1);
    });
  });

  describe('disconnect', () => {
    it('should destroy the connection pool', async () => {
      const instance = DatabaseConnection.getInstance();
      const knex = instance.getKnex();

      await instance.connect();
      await instance.disconnect();

      expect(knex.destroy).toHaveBeenCalled();
    });

    it('should handle disconnection when not connected', async () => {
      const instance = DatabaseConnection.getInstance();
      
      // Should not throw
      await expect(instance.disconnect()).resolves.toBeUndefined();
    });
  });

  describe('connection events', () => {
    it('should set up error handler on knex instance', () => {
      const instance = DatabaseConnection.getInstance();
      const knex = instance.getKnex();

      expect(knex.on).toHaveBeenCalledWith('error', expect.any(Function));
    });
  });
});