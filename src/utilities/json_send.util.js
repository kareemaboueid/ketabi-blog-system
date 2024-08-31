import { getStatusMessage } from 'http-status-message';

/**
 * @class Jsend
 * @description Custom Jsend class for Jsend responses.
 * @param {number} status - The HTTP status code.
 * @param {object} data - The data object.
 * @returns {void}
 */

class Json_send {
  constructor(status, data) {
    this.message = 'Success';
    this.status = {
      code: status,
      message: getStatusMessage(status, 'short').message,
    };
    this.data = Array.isArray(data) ? data : [data];
    this.results = Array.isArray(data) ? data.length : 1;
  }
}

export default Json_send;
