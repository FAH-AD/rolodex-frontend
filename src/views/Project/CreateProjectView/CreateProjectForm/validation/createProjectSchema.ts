import { z } from "zod";

export const createProjectSchema = z.object({
  clientEmail: z
    .string({
      required_error: "Client email is required",
      invalid_type_error: "Client email must be a string",
    })
    .email("Invalid email"),
  title: z
    .string({
      required_error: "Title is required",
      invalid_type_error: "Title must be a string",
    })
    .min(1, "Title is required"),
  description: z
    .string({
      required_error: "Description is required",
      invalid_type_error: "Description must be a string",
    })
    .min(1, "Description is required"),
  budget: z
    .number({
      required_error: "Budget is required",
      invalid_type_error: "Budget must be a number",
    })
    .min(29, "Budget must be at least $29"),
  deliveryInDays: z
    .number({
      required_error: "Delivery in days is required",
      invalid_type_error: "Delivery in days must be a number",
    })
    .min(1, "Delivery in days must be at least 1 day"),
  managers: z.array(z.any()).min(1, "Please select at least one manager"),
});
