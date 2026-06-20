import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import routes from './routes';

import { errorMiddleware, AppError } from './middlewares/error.middleware';
import { connectMongoDB } from './config/mongo';
import { pgPool } from './config/postgres';
import { env } from './config/env';

class App {
  public app: Application;

  constructor() {
    this.app = express();

    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares(): void {
    const allowedOrigins = new Set(
    env.CORS_ORIGINS
        .split(',')
        .map(origin => origin.trim())
        .filter(Boolean)
    );

    this.app.use(helmet());
    this.app.use(cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.has(origin)) {
                callback(null, true);
            } else {
                callback(new AppError('Origin not allowed', 403));
            }
        },
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    }));

    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(morgan('combined'));
  }

  private initializeRoutes(): void {
    this.app.use('/api', routes);
    
    this.app.get('/api/health', (req: Request, res: Response) => {
      res.json({ status: 'OK', timestamp: new Date() });
    });
  }

  private initializeErrorHandling(): void {
    this.app.use(errorMiddleware);
  }

  public async init(): Promise<void> {
    try {
      await Promise.all([
        // Initialize PostgreSQL
        pgPool.query('SELECT 1'),

        // Initialize MongoDB
        connectMongoDB(),
      ]);
    } catch (error) {
      console.error('Database initialization failed:', error);
      process.exit(1);
    }
  }

  public getApp(): Application {
    return this.app;
  }
}

export default new App();