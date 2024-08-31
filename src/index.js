import mongoose from 'mongoose';
import app from './app.js';
import { env_vars } from './config/env-vars.cnfg.js';
import logger from './config/logger.cnfg.js';

// define the server
let server;

// define the exit process handler
const exit_process_handler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else process.exit(1);
};

// define the unexpected error handler
const unexpected_error_handler = (error) => {
  logger.error(error);
  exit_process_handler();
};

// define the MongoDB URI
const db_uri = env_vars.mongoose.url
  .replace('%USERNAME%', env_vars.mongoose.username)
  .replace('%PASSWORD%', env_vars.mongoose.password)
  .replace(
    '%DBNAME%',
    env_vars.env === 'development'
      ? env_vars.mongoose.test_db
      : env_vars.mongoose.real_db,
  );

// connect to MongoDB
mongoose
  .connect(db_uri)
  .then(() => {
    logger.info(`Connected to MongoDB [${mongoose.connection.name}]`);
    server = app.listen(env_vars.port, () => {
      logger.info(`Server listening [${env_vars.port}]`);
    });
  })
  .catch((error) => {
    logger.error(`Failed to connect to MongoDB: ${error}`);
    exit_process_handler();
  });

// define the process event listeners on 'uncaughtException'
process.on('uncaughtException', unexpected_error_handler);

// define the process event listeners on 'unhandledRejection'
process.on('unhandledRejection', unexpected_error_handler);

// define the process event listeners on 'SIGTERM'
process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) server.close();
});
