import { z } from "zod";

export const updateOtpStatusSchema = z.object({
    otpId: z
        .string({
            required_error: "otpId is required",
            invalid_type_error: "otpId must be a string",
        })
        .min(1, { message: "otpId cannot be empty" })
});
