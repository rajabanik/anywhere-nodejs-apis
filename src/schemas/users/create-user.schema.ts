import { z } from "zod";
import validator from "validator";

export const createUserSchema = z.object({
  username: z
    .string({
      required_error: "username is required",
      invalid_type_error: "username must be a string",
    })
    .min(1, { message: "username cannot be empty" })
    .max(50, { message: "username cannot be more than 50 characters" })
    .regex(/^[a-zA-Z0-9_]+$/, { message: "Username can only contain letters, digits, and underscores and cannot contain spaces" }),
  fullName: z
    .string({
      required_error: "fullName is required",
      invalid_type_error: "fullName must be a string",
    })
    .min(1, { message: "fullName cannot be empty" })
    .max(100, { message: "fullName cannot be more than 100 characters" }),
  email: z
    .string({
      required_error: "email is required",
    })
    .min(1, { message: "email cannot be empty" })
    .refine((value) => validator.isEmail(value), {
      message: "Invalid email address",
    }),
});
