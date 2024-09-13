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
        required_error: "Subject is required.",
        invalid_type_error: "Subject must be a string.",
    }).min(1, { message: "Subject cannot be empty." }),

    body: z.object({
        text: z.string().min(1, { message: "Text body must be a non-empty string." }).optional(),
        html: z.string().optional(),
    }).refine(data => data.text || data.html, {
        message: "At least one body format (text or html) is required.",
    }).optional()
        .refine(body => body !== undefined, {
            message: "Body is required."
        }),

    attachments: z.array(
        z.object({
            filename: z.string({
                required_error: "Filename is required for attachment.",
                invalid_type_error: "Filename must be a string.",
            }).min(1, { message: "Filename cannot be empty." }),
            path: z.string({
                required_error: "Path is required for attachment.",
                invalid_type_error: "Path must be a string.",
            }).min(1, { message: "Path cannot be empty." }),
        })
    ).optional(),
});
