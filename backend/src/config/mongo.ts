import { MongoClient, Db } from 'mongodb';

let db: Db;

export const connectMongo = async (): Promise<void> => {
  const uri = process.env.MONGO_URI || '';
  const client = new MongoClient(uri);
  await client.connect();
  db = client.db();
  console.log('Connected to MongoDB');
};

export const getMongo = (): Db => {
  if (!db) throw new Error('MongoDB is not initialized.');
  return db;
};