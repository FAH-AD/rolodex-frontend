import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().trim().min(1).max(255),
  email: z.string().trim().email().max(255),
  password: z.string().trim().min(8).max(16),
  role: z.enum(["admin", "manager", "sales", "developer", "client"]),
});

export type CreateUserValues = z.infer<typeof createUserSchema>;

export const initialValues: CreateUserValues = {
  name: "",
  email: "",
  password: "",
  role: "client",
};
