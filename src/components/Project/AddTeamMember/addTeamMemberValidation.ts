import { z } from "zod";

export const addTeamMemberSchema = z.object({
  userId: z
    .string({
      required_error: "Please select a user",
      invalid_type_error: "Invalid input type",
    })
    .min(1, "Please select a user"),
});

export type AddTeamMemberValues = z.infer<typeof addTeamMemberSchema>;
