import { z } from "zod";
import validator from "validator";

export const createUserSchema = z.object({
  username: z
    .string({
      required_error: "Username key is missing",
      invalid_type_error: "Username must be a string",
    })
    .min(1, { message: "Username is required" })
    .max(50, { message: "Username cannot be more than 50 characters" })
    .regex(/^[a-zA-Z0-9_]+$/, { message: "Username can only contain letters, digits, and underscores and cannot contain spaces" }),
  fullName: z
    .string({
      required_error: "Full name key is missing",
      invalid_type_error: "Full name must be a string",
    })
    .min(1, { message: "Full name is required" })
    .max(100, { message: "Full name cannot be more than 100 characters" }),
  email: z
    .string({
      required_error: "Email key is missing",
    })
    .min(1, { message: "Email is required" })
    .refine((value) => validator.isEmail(value), {
      message: "Invalid email address",
    }),
});
