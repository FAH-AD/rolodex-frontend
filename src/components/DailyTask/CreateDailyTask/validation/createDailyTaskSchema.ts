import { z } from "zod";

export const createDailyTaskSchema = z.object({
  name: z
    .string({
      required_error: "Name is required",
      invalid_type_error: "Name must be a string",
    })
    .trim()
    .min(1, "Name is required")
    .max(255, "Name must be less than 255 characters"),
  description: z
    .string({
      required_error: "Description is required",
      invalid_type_error: "Description must be a string",
    })
    .trim()
    .min(1, "Description is required")
    .nullable(),
  dueDate: z
    .string({
      required_error: "Due date is required",
      invalid_type_error: "Due date must be a string",
    })
    .nullable(),
});
