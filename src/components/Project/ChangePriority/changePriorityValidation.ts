import { z } from "zod";

export const changePrioritySchema = z.object({
  priority: z.enum(["low", "normal", "high", "urgent"]),
});

export type ChangePriorityValues = z.infer<typeof changePrioritySchema>;
