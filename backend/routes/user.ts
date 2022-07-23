import express from 'express';
import * as authenticate from '../authenticate';
import * as userController from '../controllers/userController';

const userRouter = express.Router();

userRouter.post('/register', userController.register);

userRouter.post('/login', userController.login);

userRouter.get('/logout', authenticate.verifyUser, userController.logout);

userRouter.post('/refreshToken', userController.refreshToken);

export default userRouter;
