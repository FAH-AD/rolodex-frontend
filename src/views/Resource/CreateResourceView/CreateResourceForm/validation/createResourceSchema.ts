import { z } from "zod";

export const createResourceSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().min(1),
  color: z.string().min(1),
  isPrivate: z.boolean(),
});
