import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const transporter = nodemailer.createTransport({
    host: process.env.MAIL_SERVER || "",
    port: Number(process.env.MAIL_PORT),
    secure: false,
    auth: {
        user: process.env.MAIL_USERNAME || "",
        pass: process.env.MAIL_PASSWORD || "",
    },
});