import mongoose from 'mongoose';
import { StatusCodes } from 'http-status-codes';
import Api_error from '../utilities/api-error.util.js';
import { env_vars } from '../config/env-vars.cnfg.js';
import logger from '../config/logger.cnfg.js';

/**
 * @function error_converter
 * @description Convert an error to an Api_error.
 */
const error_converter = (_error, _request, _response, _next) => {
  let error = _error;

  // check if the error is an instance of Api_error:
  if (!(error instanceof Api_error)) {
    // check if the error is an instance of mongoose.Error:
    const statusCode =
      error.statusCode || error instanceof mongoose.Error
        ? StatusCodes.BAD_REQUEST
        : StatusCodes.INTERNAL_SERVER_ERROR;

    // define the error message:
    const message = error.message || StatusCodes[statusCode];

    // define the error stack:
    error = new Api_error(statusCode, message, false, _error.stack);
  }
  _next(error);
};

/**
 * @function error_handler
 * @description Handle the error.
 */
const error_handler = (_error, _request, _response, _next) => {
  let { statusCode, message } = _error;

  // set the default status code and message:
  if (env_vars.env === 'production' && !_error.isOperational) {
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    message = StatusCodes[StatusCodes.INTERNAL_SERVER_ERROR];
  }

  // set the error message:
  _response.locals.errorMessage = _error.message;

  // define the response:
  const response = {
    code: statusCode,
    message,
    ...(env_vars.env === 'development' && { stack: _error.stack }),
  };

  // log the error:
  if (env_vars.env === 'development') {
    logger.error(_error);
  }

  // send the response:
  _response.status(statusCode).send(response);
};

export { error_converter, error_handler };
