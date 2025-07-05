import { Request, Response, NextFunction } from 'express';
import config from '../../config';

export interface ILogContext {
  requestId: string;
  method: string;
  url: string;
  ip: string;
  userAgent?: string;
  userId?: string;
  duration?: number;
  statusCode?: number;
  error?: Error;
}

class Logger {
  private log(level: string, message: string, context?: ILogContext): void {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      ...context,
    };

    if (config.isProduction) {
      console.log(JSON.stringify(logEntry));
    } else {
      console.log(`[${timestamp}] [${level}] ${message}`, context ?? '');
    }
  }

  public info(message: string, context?: ILogContext): void {
    this.log('INFO', message, context);
  }

  public warn(message: string, context?: ILogContext): void {
    this.log('WARN', message, context);
  }

  public error(message: string, context?: ILogContext): void {
    this.log('ERROR', message, context);
  }

  public debug(message: string, context?: ILogContext): void {
    if (config.isDevelopment) {
      this.log('DEBUG', message, context);
    }
  }
}

export const logger = new Logger();

// Request logging middleware
export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const startTime = Date.now();
  const requestId = Math.random().toString(36).substring(7);

  // Attach request ID to request object
  (req as any).requestId = requestId;

  // Log request
  logger.info('Incoming request', {
    requestId,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip ?? 'unknown',
    userAgent: req.get('user-agent'),
  });

  // Log response
  const originalSend = res.send;
  res.send = function (data: any): Response {
    const duration = Date.now() - startTime;
    
    logger.info('Outgoing response', {
      requestId,
      method: req.method,
      url: req.originalUrl,
      ip: req.ip ?? 'unknown',
      statusCode: res.statusCode,
      duration,
    });

    return originalSend.call(this, data);
  };

  next();
};