import { z } from "zod";

export const schema = z.object({
  name: z
    .string({
      required_error: "Name is required",
      invalid_type_error: "Name must be a string",
    })
    .min(1, "Name is required"),
  description: z
    .string({
      required_error: "Description is required",
      invalid_type_error: "Description must be a string",
    })
    .min(1, "Description is required")
    .nullable(),
  orderIndex: z.number({
    required_error: "Order index is required",
    invalid_type_error: "Order index must be a number",
  }),
});
