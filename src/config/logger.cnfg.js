import winston from 'winston';
import { env_vars } from './env-vars.cnfg.js';

// define the logger by winston:
const enumerate_error_format = winston.format((info) => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack });
  }
  return info;
});

/**
 * @constant logger
 * @description A logger for logging messages.
 */
const logger = winston.createLogger({
  level: env_vars.env === 'development' ? 'debug' : 'info',
  format: winston.format.combine(
    enumerate_error_format(),
    env_vars.env === 'development'
      ? winston.format.colorize()
      : winston.format.uncolorize(),
    winston.format.splat(),
    winston.format.printf(({ level, message }) => `${level}: ${message}`),
  ),
  transports: [
    new winston.transports.Console({
      stderrLevels: ['error'],
    }),
  ],
});

export default logger;
