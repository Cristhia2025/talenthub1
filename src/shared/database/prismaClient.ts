import { PrismaClient } from "@prisma/client";

export const createPrismaClient = (connectionString: string): PrismaClient =>
  new PrismaClient({ datasources: { db: { url: connectionString } } });
