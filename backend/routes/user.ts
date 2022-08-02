import express from 'express';
import * as userController from '../controllers/userController';

const userRouter = express.Router();

userRouter.post('/register', userController.register);

userRouter.post('/login', userController.login);

userRouter.get('/logout', userController.logout);

userRouter.get('/refreshToken', userController.refreshToken);

export default userRouter;
