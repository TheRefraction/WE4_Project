import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { connectPostgres } from './config/postgres';
import { connectMongo } from './config/mongo';
import router from './routes';
import { errorHandler } from './middlewares/errorHandler';

const app = express();
const PORT = 3000;
const allowedOrigins = new Set(
  (process.env.CORS_ORIGINS || '*')
    .split(',')
    .map(origin => origin.trim())
    .filter(Boolean)
);


app.use(helmet());
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.has(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error('Origin not allowed'));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));
app.use(express.json());

app.use('/api', router);
app.use(errorHandler);

const start = async () => {
  await connectPostgres();
  await connectMongo();
  app.listen(PORT, () => console.log(`Serving on port ${PORT}`));
};

start().catch(console.error);