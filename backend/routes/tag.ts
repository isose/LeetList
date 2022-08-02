import express from 'express';
import * as tagController from '../controllers/tagController';

const tagRouter = express.Router();

tagRouter.get('/tags', tagController.tags);

export default tagRouter;
