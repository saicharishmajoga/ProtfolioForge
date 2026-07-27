import app from './app';
import { env } from './config/env';
import { logger } from './config/logger';
import prisma from './database/prisma';

async function bootstrap() {
  try {
    // 1. Verify database connectivity at boot time
    logger.info('🔌 Connecting to PostgreSQL database via Prisma...');
    await prisma.$connect();
    logger.info('✅ Database connection established successfully');

    // 2. Start the HTTP server
    const server = app.listen(env.PORT, () => {
      logger.info(`🚀 Server running in [${env.NODE_ENV}] mode on http://localhost:${env.PORT}`);
      logger.info(`📖 API documentation available at http://localhost:${env.PORT}/api-docs`);
    });

    // Handle process signals for graceful shutdown
    const gracefulShutdown = async (signal: string) => {
      logger.info(`Received ${signal}. Shutting down server gracefully...`);
      server.close(async () => {
        logger.info('HTTP server closed.');
        await prisma.$disconnect();
        logger.info('Database connections closed.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error: any) {
    logger.error(`❌ Failed to start the server: ${error.message}`);
    process.exit(1);
  }
}

// Global Exception & Rejection Handlers
process.on('uncaughtException', (error) => {
  logger.error('💥 Uncaught Exception! Shutting down...', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

bootstrap();
