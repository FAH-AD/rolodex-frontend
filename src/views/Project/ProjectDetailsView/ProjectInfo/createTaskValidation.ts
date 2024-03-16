import { z } from "zod";

export const createTaskSchema = z.object({
  title: z
    .string({
      required_error: "Title is required",
      invalid_type_error: "Title must be a string",
    })
    .trim()
    .min(1, "Title is required"),
  description: z
    .string({
      required_error: "Description is required",
      invalid_type_error: "Description must be a string",
    })
    .trim()
    .min(1, "Description is required")
    .nullable(),
});

export type CreateTaskValues = z.infer<typeof createTaskSchema>;

export const initialValues: CreateTaskValues = {
  title: "",
  description: null,
};
