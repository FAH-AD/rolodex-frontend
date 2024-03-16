import { z } from "zod";

export const changeStatusSchema = z.object({
  id: z.string(),
});

export type ChangeStatusValues = z.infer<typeof changeStatusSchema>;
