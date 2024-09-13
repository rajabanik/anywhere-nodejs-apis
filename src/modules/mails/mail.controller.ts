import { Request, Response } from "express";
import { mailSchema } from "../../schemas/mails/mail.schema";
import { transporter } from "../../configs/mail.config";
import { ZodError } from "zod";
import dotenv from "dotenv";

dotenv.config();

export class MailController {

    constructor() { }

    async sendMail(req: Request, res: Response) {
        try {
            const validatedBody = mailSchema.parse(req.body);

            const { to, cc, bcc, subject, body, attachments } = validatedBody;

            const processedAttachments = Array.isArray(attachments)
                ? attachments.map((attachment: { filename: string; path: string }) => ({
                    filename: attachment.filename,
                    path: attachment.path,
                }))
                : [];

            const info = await transporter.sendMail({
                from: process.env.MAIL_FROM,
                to: to,
                cc: cc,
                bcc: bcc,
                subject: subject,
                text: body?.text,
                html: body?.html,
                attachments: processedAttachments,
            });
            console.log(info);
            return res.status(200).json({
                message: "Email sent successfully",
                status: 200
            });
        } catch (error) {
            console.log(error);
            if (error instanceof ZodError) {
                return res.status(400).json({
                    message: error.errors[0].message,
                    status: 400
                });
            }
            return res.status(400).json({
                message: "Failed to send mail",
                errors: error,
                status: 400
            });
        }
    }
}
