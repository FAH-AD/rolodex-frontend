import { z } from "zod";

export const createRequestSchema = z.object({
  title: z
    .string({
      required_error: "Title is required",
      invalid_type_error: "Title must be a string",
    })
    .trim()
    .min(1, "Title is required")
    .max(255, "Title must be less than 255 characters"),
  description: z
    .string({
      required_error: "Description is required",
      invalid_type_error: "Description must be a string",
    })
    .trim()
    .min(1, "Description is required"),
  budget: z
    .number({
      required_error: "Budget is required",
      invalid_type_error: "Budget must be a number",
    })
    .min(1, "Budget must be greater than or equal to 1")
    .nullable(),
  deliveryInDays: z
    .number({
      required_error: "Delivery in days is required",
      invalid_type_error: "Delivery in days must be a number",
    })
    .min(1, "Delivery in days must be greater than or equal to 1"),
});
