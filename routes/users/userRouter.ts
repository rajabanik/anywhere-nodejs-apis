import { Router } from 'express';
import { createUser } from '../../controllers/users/userController';

const userRouter = Router();

userRouter.post('/create-account', createUser);

export default userRouter;
