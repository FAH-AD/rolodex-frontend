import { z } from "zod";

export const changePrimaryManagerValidationSchema = z.object({
  managerId: z
    .string({ required_error: "Please select a manager", invalid_type_error: "Invalid input type" })
    .min(1, "Please select a manager"),
});

export type ChangePrimaryManagerValues = z.infer<typeof changePrimaryManagerValidationSchema>;
