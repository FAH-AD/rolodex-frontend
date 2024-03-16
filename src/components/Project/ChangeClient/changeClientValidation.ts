import { z } from "zod";

export const changeClientSchema = z.object({
  clientId: z
    .string({
      required_error: "Client is required",
      invalid_type_error: "Client is required",
    })
    .min(1, "Client is required"),
});

export type ChangeClientValues = z.infer<typeof changeClientSchema>;
