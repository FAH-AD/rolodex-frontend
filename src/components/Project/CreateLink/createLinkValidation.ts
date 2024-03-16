import { z } from "zod";

export const createLinkSchema = z.object({
  name: z
    .string({
      required_error: "Name is required",
      invalid_type_error: "Name must be a string",
    })
    .min(1, "Name is required")
    .max(255, "Name must be less than 255 characters"),
  url: z
    .string({
      required_error: "URL is required",
      invalid_type_error: "URL must be a string",
    })
    .url("URL is not valid"),
  type: z.enum(["googleDrive", "figma", "other"]),
});

export type CreateLinkValues = z.infer<typeof createLinkSchema>;
