import { z } from "zod";
import validator from "validator";

export const userSchema = z.object({
  fullName: z
    .string({
      required_error: "Full name is required",
      invalid_type_error: "Full name must be a string",
    })
    .min(3, { message: "Full name cannot be an empty string" })
    .max(100, { message: "username should not be more than 100 characters" }),
  username: z
    .string({
      required_error: "Username is required",
      invalid_type_error: "Username name must be a string",
    })
    .min(3, { message: "Username cannot be an empty string" }),
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .refine((value) => validator.isEmail(value), {
      message: "Invalid email address",
    }),
});
