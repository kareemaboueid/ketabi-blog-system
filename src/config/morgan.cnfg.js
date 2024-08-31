import morgan from 'morgan';
import { StatusCodes } from 'http-status-codes';
import { env_vars } from './env-vars.cnfg.js';
import logger from './logger.cnfg.js';

// define the token for the message:
morgan.token(
  'message',
  (_request, _response) => _response.locals.errorMessage || '',
);

// define the IP format:
const get_ip_format = () =>
  env_vars.env === 'production' ? ':remote-addr - ' : '';

// define the success response format:
const success_response_format = `${get_ip_format()}:method :url :status - :response-time ms`;

// define the error response format:
const error_response_format = `${get_ip_format()}:method :url :status - :response-time ms - message: :message`;

// define the success log:
const log_success = morgan(success_response_format, {
  skip: (_request, _response) =>
    _response.statusCode >= Number(StatusCodes.BAD_REQUEST),
  stream: { write: (message) => logger.info(message.trim()) },
});

// define the error log:
const log_error = morgan(error_response_format, {
  skip: (_request, _response) =>
    _response.statusCode < Number(StatusCodes.BAD_REQUEST),
  stream: { write: (message) => logger.error(message.trim()) },
});

export { log_success, log_error };
