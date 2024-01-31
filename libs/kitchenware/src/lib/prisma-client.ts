import { PrismaClient } from './prisma/client';
import { logger } from './logger';

export const prismaClient = new PrismaClient({
  // log: ['query', 'info', 'warn'],
});

const connectToDb = async () => {
  try {
    await prismaClient.$connect();
    logger.info('Connected to database');
  } catch (error: unknown) {
    logger.error(error);
    process.exit(1);
  }
};

export { connectToDb };
