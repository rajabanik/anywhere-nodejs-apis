import { z } from "zod";
import validator from "validator";

export const createUserSchema = z.object({
  username: z
    .string({
      required_error: "Username is required",
      invalid_type_error: "Username name must be a string",
    })
    .min(1, { message: "Username is required" })
    .max(50, { message: "Username cannot not be more than 50 characters" }),
  fullName: z
    .string({
      required_error: "Full name is required",
      invalid_type_error: "Full name must be a string",
    })
    .min(1, { message: "Full name is required" })
    .max(100, { message: "Full name cannot not be more than 100 characters" }),
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .refine((value) => validator.isEmail(value), {
      message: "Invalid email address",
    }),
});
