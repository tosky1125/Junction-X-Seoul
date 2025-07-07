import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export interface IConfig {
  port: number;
  nodeEnv: string;
  isDevelopment: boolean;
  isProduction: boolean;
  database: {
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
    connectionLimit: number;
  };
  tmap: {
    apiKey: string;
    apiUrl: string;
  };
  jwt: {
    secret: string;
    expiresIn: string;
    refreshSecret: string;
    refreshExpiresIn: string;
  };
  cors: {
    origin: string | string[];
  };
  rateLimit: {
    windowMs: number;
    max: number;
  };
  logging: {
    level: string;
    format: string;
  };
}

const config: IConfig = {
  port: parseInt(process.env['PORT'] ?? '3000', 10),
  nodeEnv: process.env['NODE_ENV'] ?? 'development',
  isDevelopment: process.env['NODE_ENV'] === 'development',
  isProduction: process.env['NODE_ENV'] === 'production',
  database: {
    host: process.env['DB_HOST'] ?? 'localhost',
    port: parseInt(process.env['DB_PORT'] ?? '3306', 10),
    user: process.env['DB_USER'] ?? 'root',
    password: process.env['DB_PASSWORD'] ?? '',
    database: process.env['DB_NAME'] ?? 'chobo_db',
    connectionLimit: parseInt(process.env['DB_CONNECTION_LIMIT'] ?? '10', 10),
  },
  tmap: {
    apiKey: process.env['TMAP_API_KEY'] ?? '',
    apiUrl: process.env['TMAP_API_URL'] ?? 'https://apis.openapi.sk.com/tmap',
  },
  jwt: {
    secret: process.env['JWT_SECRET'] ?? 'default-secret-key',
    expiresIn: process.env['JWT_EXPIRY'] ?? '24h',
    refreshSecret: process.env['JWT_REFRESH_SECRET'] ?? 'default-refresh-secret',
    refreshExpiresIn: process.env['JWT_REFRESH_EXPIRY'] ?? '7d',
  },
  cors: {
    origin: process.env['CORS_ORIGIN']?.split(',') ?? '*',
  },
  rateLimit: {
    windowMs: parseInt(process.env['RATE_LIMIT_WINDOW_MS'] ?? '900000', 10), // 15 minutes
    max: parseInt(process.env['RATE_LIMIT_MAX_REQUESTS'] ?? '100', 10),
  },
  logging: {
    level: process.env['LOG_LEVEL'] ?? 'info',
    format: process.env['LOG_FORMAT'] ?? 'combined',
  },
};

export default config;