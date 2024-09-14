import { z } from "zod";
import validator from "validator";

export const mailSchema = z.object({
    to: z.union([
        z.string().refine(value => validator.isEmail(value), {
            message: "Invalid email address provided in 'to'.",
        }),
        z.array(z.string().refine(value => validator.isEmail(value), {
            message: "Invalid email address provided in 'to' array.",
        }))
    ]).refine(
        value => Array.isArray(value) ? value.length > 0 : true,
        { message: "At least one recipient is required in 'to'." }
    ),

    cc: z.union([
        z.string().refine(value => validator.isEmail(value), {
            message: "Invalid email address provided in 'cc'.",
        }).optional(),
        z.array(z.string().refine(value => validator.isEmail(value), {
            message: "Invalid email address provided in 'cc' array.",
        })).optional(),
    ]).optional(),

    bcc: z.union([
        z.string().refine(value => validator.isEmail(value), {
            message: "Invalid email address provided in 'bcc'.",
        }).optional(),
        z.array(z.string().refine(value => validator.isEmail(value), {
            message: "Invalid email address provided in 'bcc' array.",
        })).optional(),
    ]).optional(),

    subject: z.string({
        required_error: "subject is required.",
        invalid_type_error: "subject must be a string.",
    }).min(1, { message: "subject cannot be empty." }),

    body: z.object({
        text: z.string().min(1, { message: "text body must be a non-empty string." }).optional(),
        html: z.string().optional(),
    }).refine(data => data.text || data.html, {
        message: "At least one body format (text or html) is required.",
    }).optional()
        .refine(body => body !== undefined, {
            message: "body is required."
        }),

    attachments: z.array(
        z.object({
            filename: z.string({
                required_error: "filename is required for attachment.",
                invalid_type_error: "filename must be a string.",
            }).min(1, { message: "filename cannot be empty." }),
            path: z.string({
                required_error: "path is required for attachment.",
                invalid_type_error: "path must be a string.",
            }).min(1, { message: "path cannot be empty." }),
        })
    ).optional(),
});
