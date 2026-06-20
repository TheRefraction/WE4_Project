import { MongoClient, Db, MongoClientOptions } from 'mongodb';
import { env } from './env';

let client: MongoClient | null = null;
let db: Db | null = null;

const options: MongoClientOptions = {
  maxPoolSize: 20,
  minPoolSize: 2,
  maxIdleTimeMS: 30000,
  connectTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

export const connectMongoDB = async (): Promise<Db> => {
  try {
    const uri = env.MONGO_URI;

    client = new MongoClient(uri, options);
    await client.connect();
    db = client.db();

    console.log('Connected to MongoDB');

    return db;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
};

export const closeMongoDB = async (): Promise<void> => {
  if (client) {
    await client.close();
    console.log('MongoDB connection closed');
  }
};

export const getDB = (): Db => {
  if (!db) {
    throw new Error('MongoDB not connected. Call connectMongoDB first.');
  }
  return db;
};

export const getCollection = <T extends Document>(name: string) => {
  return getDB().collection<T>(name);
};