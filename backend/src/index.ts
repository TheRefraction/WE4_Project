import app from './app';
import { env } from './config/env';

const PORT = 3000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${env.NODE_ENV}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

// Graceful shutdown
const gracefulShutdown = () => {
  console.log('Received shutdown signal, closing server...');
  
  server.close(async () => {
    console.log('HTTP server closed');
    process.exit(0);
  });
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);