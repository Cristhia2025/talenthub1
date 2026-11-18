import { MongoClient } from "mongodb";

export const createMongoClient = (uri: string): MongoClient =>
  new MongoClient(uri, { serverSelectionTimeoutMS: 2000 });