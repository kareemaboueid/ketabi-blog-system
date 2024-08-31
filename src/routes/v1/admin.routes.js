import express from 'express';
import { StatusCodes } from 'http-status-codes';
import Json_send from '../../utilities/json_send.util.js';

/**
 * @fileoverview Admin Router
 * @description Admin router for admin endpoints and controllers.
 */
export const admin_routes = express.Router();

admin_routes.get('/', (_request, _response) => {
  _response
    .status(StatusCodes.OK)
    .json(new Json_send(StatusCodes.OK, { message: 'Admin route' }));
});
