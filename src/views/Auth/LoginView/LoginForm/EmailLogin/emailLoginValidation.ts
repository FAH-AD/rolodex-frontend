import { z } from "zod";

export const emailLoginSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .trim()
    .min(1, "Email is required")
    .email("Invalid email address"),
  password: z
    .string({
      required_error: "Password is required",
      invalid_type_error: "Password must be a string",
    })
    .trim()
    .min(1, "Password is required"),
  rememberMe: z.boolean(),
});

export type EmailLoginValues = z.infer<typeof emailLoginSchema>;
