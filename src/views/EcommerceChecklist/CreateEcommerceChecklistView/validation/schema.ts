import { z } from "zod";

export const schema = z.object({
  name: z
    .string({
      required_error: "Name is required",
      invalid_type_error: "Name must be a string",
    })
    .min(1, "Name is required"),
  orderIndex: z
    .number({
      required_error: "Order index is required",
      invalid_type_error: "Order index must be a number",
    })
    .min(0, "Order index must be greater than or equal to 0"),
  color: z
    .string({
      required_error: "Color is required",
      invalid_type_error: "Color must be a string",
    })
    .min(1, "Color is required"),
  category: z
    .string({
      required_error: "Category is required",
      invalid_type_error: "Category must be a string",
    })
    .min(1, "Category is required"),
});
