import { Router } from "express";
import { createUser } from "../../controllers/users/userController";
import { getProfileDetails } from "../../controllers/users/userController";

const userRouter = Router();

userRouter.post("/create-account", createUser);

userRouter.get("/get-profile-details",getProfileDetails);


export default userRouter;
