import { z } from "zod";

export const updateUserSchema = z.object({
  name: z.string().trim().min(1).max(255),
  email: z.string().trim().email().max(255),
  role: z.enum(["admin", "manager", "sales", "developer", "client"]),
  hasAccessToPrivateResources: z.boolean(),
});

export type UpdateUserValues = z.infer<typeof updateUserSchema>;
