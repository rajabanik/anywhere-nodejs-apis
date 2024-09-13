import validator from "validator";
import z from "zod";

export const loginSchema = z.object({
    email: z
    .string({
      required_error: "Email is required",
    })
    .min(1, { message: "Email cannot be empty" })
    .refine((value) => validator.isEmail(value), {
      message: "Invalid email address",
    }),
})