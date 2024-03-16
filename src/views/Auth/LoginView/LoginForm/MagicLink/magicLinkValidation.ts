import { z } from "zod";

export const magicLinkSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .trim()
    .min(1, "Email is required")
    .email("Invalid email address"),
});

export type MagicLinkValues = z.infer<typeof magicLinkSchema>;
