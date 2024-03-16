import { z } from "zod";

export const newProjectRequestSchema = z
  .object({
    storeURL: z.string({
      required_error: "Please provide a store URL",
      invalid_type_error: "Please provide a valid store URL",
    }),
    needNewStore: z.boolean(),
    signupForm: z.boolean(),
    description: z
      .string({
        required_error: "Please provide a description",
        invalid_type_error: "Please provide a description",
      })
      .min(30, "Please provide more details, description must be at least 30 characters"),
    title: z.string({
      required_error: "Please provide a title",
      invalid_type_error: "Please provide a title",
    }),
    continueWithEmail: z.boolean(),
    email: z.string({
      required_error: "Please provide an email",
      invalid_type_error: "Please provide a valid email",
    }),
  })
  .superRefine((schema, ctx) => {
    if (!schema.needNewStore && schema.storeURL === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please provide a store URL",
        path: ["storeURL"],
      });
    }
    if (schema.continueWithEmail) {
      const isValidEmail = z.string().email().safeParse(schema.email);
      if (!isValidEmail.success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please provide a valid email address",
          path: ["email"],
        });
      }
    }
  });

export type NewProjectRequestValues = z.infer<typeof newProjectRequestSchema>;

export const initialValues: NewProjectRequestValues = {
  storeURL: "",
  needNewStore: false,
  signupForm: false,
  continueWithEmail: false,
  description: "",
  title: "",
  email: "",
};
