import { Router } from "express";
import multer from "multer";
import {
  userAccountCreation,
  getProfileDetails,
  updateProfilePhoto,
  userLogin
} from "./user.controller";

const userRouter: Router = Router();

const file = multer({ storage: multer.memoryStorage() });

userRouter.get("/get-profile-details", getProfileDetails);

userRouter.post("/create-account", userAccountCreation);

userRouter.post("/update-profile-photo", file.single("file"), updateProfilePhoto);

userRouter.post("/login", userLogin);

export default userRouter;
