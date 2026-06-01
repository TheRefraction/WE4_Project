import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { connectPostgres } from './config/postgres';
import { connectMongo } from './config/mongo';
import router from './routes';
import { errorHandler } from './middlewares/errorHandler';

const app = express();
const PORT = process.env.API_PORT || 3000;

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());

app.use('/api', router);
app.use(errorHandler);

const start = async () => {
  await connectPostgres();
  await connectMongo();
  app.listen(PORT, () => console.log(`Serving on port ${PORT}`));
};

start().catch(console.error);