import { Router } from "express";
import { MailController } from "./mail.controller";

const mailController = new MailController();

const mailRouter: Router = Router();

mailRouter.post("/send-email", mailController.sendMail);

export default mailRouter;
