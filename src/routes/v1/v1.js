import express from 'express';
import { admin_routes } from './admin.routes.js';
import { user_routes } from './user.routes.js';

const v1 = express.Router();

v1.use('/admin', admin_routes);
v1.use('/user', user_routes);

export default v1;
