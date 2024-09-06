import { Router } from "express";
import { createUser } from "../../controllers/users/userController";
import { getUserMiscellaneousDetailsById } from "../../controllers/users/userController";

const userRouter = Router();

userRouter.post("/create-account", createUser);
userRouter.get('/get-profile-details',getUserMiscellaneousDetailsById);


export default userRouter;
