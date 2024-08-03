import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URL = process.env.MONGODB_URI || "";

export const getDb = async () => {
  const client: MongoClient = await MongoClient.connect(MONGO_URL);
  return client.db();
};