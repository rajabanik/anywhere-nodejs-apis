import { Router } from "express";
import multer from "multer";
import { createUser, getProfileDetails, updateProfilePhoto } from "../../controllers/users/user.controller";

const userRouter: Router = Router();

const file = multer({ storage: multer.memoryStorage() });

userRouter.get("/get-profile-details", getProfileDetails);

userRouter.post("/create-account", createUser);

userRouter.post("/update-profile-photo", file.single("file"), updateProfilePhoto);

export default userRouter;
