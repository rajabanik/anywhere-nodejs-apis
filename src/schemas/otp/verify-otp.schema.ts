import { z } from "zod";

export const verifyOtpSchema = z.object({
    userId: z
        .string({
            required_error: "userId is required",
            invalid_type_error: "userId must be a string",
        })
        .min(1, { message: "userId cannot be empty" }),

    otp: z
        .number({
            required_error: "otp is required",
            invalid_type_error: "otp must be a number",
        })
        .int()
        .refine(value => value.toString().length === 6, {
            message: "otp must be a 6-digit number",
        })
});
