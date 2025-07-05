import express, { Application } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import config from './config';
import { errorHandler, requestLogger, logger } from './common/middleware';
import { initializeDatabase, closeDatabase } from './database/connection';
import { AppError } from './common/errors/AppError';

// Import controllers
import UserController from './user/UserController';
import DrivingRecordController from './DrivingRecord/DrivingRecordController';
import TmapController from './TMap/TmapController';

class App {
  private app: Application;

  public constructor() {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares(): void {
    // Security middleware
    this.app.use(helmet());
    this.app.use(cors({
      origin: config.cors.origin,
      credentials: true,
    }));

    // Rate limiting
    const limiter = rateLimit({
      windowMs: config.rateLimit.windowMs,
      max: config.rateLimit.max,
      message: 'Too many requests from this IP',
      standardHeaders: true,
      legacyHeaders: false,
    });
    this.app.use('/api', limiter);

    // Compression
    this.app.use(compression());

    // Body parsing
    this.app.use(bodyParser.json({ limit: '10mb' }));
    this.app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

    // Request logging
    this.app.use(requestLogger);

    // Health check endpoint
    this.app.get('/health', (_req, res) => {
      res.json({ status: 'ok', timestamp: new Date().toISOString() });
    });
  }

  private initializeRoutes(): void {
    // API routes
    this.app.use('/api/users', UserController.getRouter());
    this.app.use('/api/driving-records', DrivingRecordController.getRouter());
    this.app.use('/api/tmap', TmapController.getRouter());

    // 404 handler
    this.app.use('*', (req, _res, _next) => {
      throw AppError.notFound(`Route ${req.originalUrl} not found`);
    });
  }

  private initializeErrorHandling(): void {
    this.app.use(errorHandler);
  }

  public async start(): Promise<void> {
    try {
      // Initialize database
      await initializeDatabase();

      // Start server
      this.app.listen(config.port, () => {
        logger.info(`Server started successfully`, {
          requestId: 'system',
          method: 'startup',
          url: 'server',
          ip: 'localhost',
          port: config.port,
          environment: config.nodeEnv,
        });
      });
    } catch (error) {
      logger.error('Failed to start server', {
        requestId: 'system',
        method: 'startup',
        url: 'server',
        ip: 'localhost',
        error: error as Error,
      });
      process.exit(1);
    }
  }

  public async stop(): Promise<void> {
    await closeDatabase();
    logger.info('Server stopped');
  }
}

// Create and start the application
const app = new App();

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  await app.stop();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully');
  await app.stop();
  process.exit(0);
});

// Handle uncaught errors
process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception', {
    requestId: 'system',
    method: 'error',
    url: 'uncaught',
    ip: 'localhost',
    error,
  });
  process.exit(1);
});

process.on('unhandledRejection', (reason: any) => {
  logger.error('Unhandled Rejection', {
    requestId: 'system',
    method: 'error',
    url: 'unhandled',
    ip: 'localhost',
    error: new Error(reason),
  });
  process.exit(1);
});

// Start the application
app.start().catch((error) => {
  logger.error('Failed to start application', {
    requestId: 'system',
    method: 'startup',
    url: 'app',
    ip: 'localhost',
    error,
  });
  process.exit(1);
});