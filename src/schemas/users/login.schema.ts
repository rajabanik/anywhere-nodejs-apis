import validator from "validator";
import z from "zod";

export const loginSchema = z.object({
    email: z
    .string({
      required_error: "Email key is missing",
    })
    .min(1, { message: "Email is required" })
    .refine((value) => validator.isEmail(value), {
      message: "Invalid email address",
    }),
})