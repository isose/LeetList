import express from 'express';
import * as listController from '../controllers/listController';

const listRouter = express.Router();

listRouter.get('/list/:id', listController.getList);

listRouter.post('/list', listController.createList);

listRouter.put('/list/:id', listController.updateList);

listRouter.delete('/list/:id', listController.deleteList);

listRouter.get('/lists', listController.lists);

listRouter.get('/my-lists', listController.myLists);

export default listRouter;
