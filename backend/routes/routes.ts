import express from 'express';
import listRouter from './list';
import questionRouter from './question';
import tagRouter from './tag';
import userRouter from './user';

const routes = express.Router();

routes.use(express.json());
routes.use('/api', listRouter);
routes.use('/api', questionRouter);
routes.use('/api', tagRouter);
routes.use('/api', userRouter);

export default routes;
