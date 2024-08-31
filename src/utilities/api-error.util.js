/**
 * @class Api_error
 * @extends Error
 * @description Custom error class for API errors.
 * @param {number} statusCode - The HTTP status code.
 * @param {string} message - The error message.
 * @param {boolean} isOperational - The operational status of the error.
 * @param {string} stack - The error stack trace.
 * @returns {void}
 */
class Api_error extends Error {
  constructor(statusCode, message, isOperational = true, stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default Api_error;
