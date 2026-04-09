import { Server } from 'http';
import app from './app';
import config from './config';
import { prisma } from './lib/prisma';

let server: Server;

async function main() {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');

    server = app.listen(config.port, () => {
      console.log(`🚀 HelpMate app listening on port ${config.port}`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
}

main();

// Handle unhandled promise rejections
process.on('unhandledRejection', async (err) => {
  console.log(`😈 Unhandled Rejection detected, shutting down...`);
  console.error(err);

  if (server) {
    server.close(async () => {
      await prisma.$disconnect();
      process.exit(1);
    });
  } else {
    await prisma.$disconnect();
    process.exit(1);
  }
});

// Handle uncaught exceptions
process.on('uncaughtException', async (err) => {
  console.log(`😈 Uncaught Exception detected, shutting down...`);
  console.error(err);
  await prisma.$disconnect();
  process.exit(1);
});

// Handle termination signals for graceful shutdown
process.on('SIGTERM', async () => {
  console.log('👋 SIGTERM received. Shutting down gracefully...');
  if (server) {
    server.close(async () => {
      console.log('🛑 Process terminated!');
      await prisma.$disconnect();
      process.exit(0);
    });
  } else {
    await prisma.$disconnect();
    process.exit(0);
  }
});

process.on('SIGINT', async () => {
  console.log('👋 SIGINT received. Shutting down gracefully...');
  if (server) {
    server.close(async () => {
      console.log('🛑 Process terminated!');
      await prisma.$disconnect();
      process.exit(0);
    });
  } else {
    await prisma.$disconnect();
    process.exit(0);
  }
});
