import { z } from "zod";

export const editEstimatedHoursSchema = z.object({
  estimatedHours: z.number().min(1).nullable(),
});

export type EditEstimatedHoursValues = z.infer<typeof editEstimatedHoursSchema>;
