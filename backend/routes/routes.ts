import express from 'express';
import questionRouter from './question';

const routes = express.Router();

routes.use(express.json());
routes.use('/', questionRouter);

export default routes;
