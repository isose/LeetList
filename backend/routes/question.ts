import express from 'express';
import * as questionController from '../controllers/questionController';

const questionRouter = express.Router();

questionRouter.get('/questions', questionController.questions);

export default questionRouter;
