import express from 'express';
import { StatusCodes } from 'http-status-codes';
import Json_send from '../../utilities/json_send.util.js';

/**
 * @fileoverview User Router
 * @description User router for user endpoints and controllers.
 */
export const user_routes = express.Router();

user_routes.get('/', (_request, _response) => {
  _response.status(StatusCodes.OK).json(
    new Json_send(StatusCodes.OK, {
      name: 'User API',
      message: 'Welcome to the User API',
    }),
  );
});
