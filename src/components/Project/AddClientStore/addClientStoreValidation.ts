import { z } from "zod";

export const addClientStoreSchema = z.object({
  url: z
    .string({
      required_error: "URL is required",
      invalid_type_error: "URL is not valid",
    })
    .min(1, "URL is required")
    .url("URL is not valid"),
});

export type AddClientStoreValues = z.infer<typeof addClientStoreSchema>;
