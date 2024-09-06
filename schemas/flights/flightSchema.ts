import { z } from "zod";

export const flightSchema = z.object({
    originLocationCode: z.string({
        required_error: "Origin location code is required",
        invalid_type_error: "Origin location code must be a string",
    })
        .min(1, { message: "Origin location code is required" }),

    destinationLocationCode: z.string({
        required_error: "Destination location code is required",
        invalid_type_error: "Destination location code must be a string",
    })
        .min(1, { message: "Destination location code is required" }),

    departureDate: z.string({
        required_error: "Departure date is required",
        invalid_type_error: "Departure date must be a string",
    })
        .min(1, { message: "Departure date is required" })
        .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Departure date must be in the format YYYY-MM-DD" }),

    adults: z.number({
        required_error: "Number of adults is required",
        invalid_type_error: "Number of adults must be an integer",
    })
        .int()
        .positive({ message: "Number of adults must be a positive integer" }),

    nonStop: z.union([z.boolean(), z.undefined()]).optional(),

    max: z.number({
        required_error: "Max number of results is required",
        invalid_type_error: "Max number of results must be an integer",
    })
        .int()
        .positive({ message: "Max number of results must be a positive integer" }),

    currencyCode: z.string().optional().refine(
        value => value === undefined || typeof value === "string",
        { message: "Currency code must be a string" }
    ),
});
