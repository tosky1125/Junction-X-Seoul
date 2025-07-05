import knex, { Knex } from 'knex';
import config from '../config';
import { logger } from '../common/middleware';
import { AppError } from '../common/errors/AppError';

let db: Knex | null = null;

export const initializeDatabase = async (): Promise<Knex> => {
  if (db) {
    return db;
  }

  try {
    db = knex({
      client: 'mysql2',
      connection: {
        host: config.database.host,
        port: config.database.port,
        user: config.database.user,
        password: config.database.password,
        database: config.database.database,
        timezone: '+00:00',
        charset: 'utf8mb4',
      },
      pool: {
        min: 2,
        max: config.database.connectionLimit,
        createTimeoutMillis: 3000,
        acquireTimeoutMillis: 30000,
        idleTimeoutMillis: 30000,
        reapIntervalMillis: 1000,
        createRetryIntervalMillis: 100,
      },
      debug: config.isDevelopment,
    });

    // Test connection
    await db.raw('SELECT 1');
    logger.info('Database connection established successfully');

    return db;
  } catch (error) {
    logger.error('Failed to connect to database', {
      requestId: 'system',
      method: 'startup',
      url: 'database',
      ip: 'localhost',
      error: error as Error,
    });
    throw AppError.databaseError('Failed to connect to database', error);
  }
};

export const getDatabase = (): Knex => {
  if (!db) {
    throw AppError.databaseError('Database not initialized');
  }
  return db;
};

export const closeDatabase = async (): Promise<void> => {
  if (db) {
    await db.destroy();
    db = null;
    logger.info('Database connection closed');
  }
};