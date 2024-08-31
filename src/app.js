import express from 'express';
import expressEjsLayouts from 'express-ejs-layouts';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import cors from 'cors';
import { StatusCodes } from 'http-status-codes';
import { log_success, log_error } from './config/morgan.cnfg.js';
import { env_vars } from './config/env-vars.cnfg.js';
import Api_error from './utilities/api-error.util.js';
import {
  error_converter,
  error_handler,
} from './middlewares/server_error.mw.js';
import v1 from './routes/v1/v1.js';

const app = express();

if (env_vars.env !== 'development') {
  app.use(log_success);
  app.use(log_error);
}

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(mongoSanitize());

// enable cors
app.use(cors());
app.options('*', cors());

// set static folder
app.use(express.static('public'));

// enable expressEjsLayouts
app.use(expressEjsLayouts);

// set layout file
app.set('layout', 'layouts/main');

// set view engine
app.set('view engine', 'ejs');

// v1 api routes
app.use('/v1', v1);

// send back a 404 error for any unknown api request
app.use((_request, _response, _next) => {
  _next(new Api_error(StatusCodes.NOT_FOUND, 'Route not found'));
});

// convert error to Api_error, if needed
app.use(error_converter);

// handle error
app.use(error_handler);

// export the app
export default app;
