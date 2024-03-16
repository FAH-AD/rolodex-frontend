import { z } from "zod";

export const slackRelationSchema = z.object({
  userId: z
    .string({
      required_error: "User ID is required",
      invalid_type_error: "User ID must be a number",
    })
    .min(1, "User ID is required"),
  slackId: z
    .string({
      required_error: "Slack ID is required",
      invalid_type_error: "Slack ID must be a string",
    })
    .min(1, "Slack ID is required"),
});
