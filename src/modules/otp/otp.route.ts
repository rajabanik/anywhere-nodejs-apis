import { Router } from "express";
import { OtpController } from "./otp.controller";

const otpController = new OtpController();

const otpRouter: Router = Router();

otpRouter.post("/send-otp",otpController.sendOtp);

export default otpRouter;
