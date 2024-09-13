import { z } from "zod";
import validator from "validator";

export const sendOtpSchema = z.object({
    userId: z
        .string({
            required_error: "User ID is required",
            invalid_type_error: "User ID must be a string",
        })
        .min(1, { message: "User ID cannot be empty" }),

    username: z
        .string({
            required_error: "Username is required",
            invalid_type_error: "Username must be a string",
        })
        .min(1, { message: "Username cannot be empty" })
        .max(50, { message: "Username cannot be more than 50 characters" })
        .regex(/^[a-zA-Z0-9_]+$/, { message: "Username can only contain letters, digits, and underscores, and cannot contain spaces" }),

    fullName: z
        .string({
            invalid_type_error: "Full name must be a string",
        })
        .max(100, { message: "Full name cannot be more than 100 characters" })
        .optional(),

    email: z
        .string({
            required_error: "Email is required",
            invalid_type_error: "Email must be a string",
        })
        .min(1, { message: "Email cannot be empty" })
        .refine((value) => validator.isEmail(value), {
            message: "Invalid email address",
        }),
});
