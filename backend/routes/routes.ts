import express from 'express';
import questionRouter from './question';
import tagRouter from './tag';

const routes = express.Router();

routes.use(express.json());
routes.use('/', questionRouter);
routes.use('/', tagRouter);

export default routes;
