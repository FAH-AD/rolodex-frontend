import { z } from "zod";

export const createServiceSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    image: z
      .instanceof(File, {
        message: "Valid image is required",
      })
      .nullable(),
    cost: z.number().min(0, "Cost must be greater than 0"),
    deliveryInDays: z.number().min(0, "Delivery in days must be greater than 0"),
    orderIndex: z.number().min(0, "Order index must be greater than 0"),
    tags: z.array(z.string()),
  })
  .required();

export type CreateServiceValues = z.infer<typeof createServiceSchema>;

export const initialValues: CreateServiceValues = {
  title: "",
  description: "",
  image: null,
  cost: 90,
  deliveryInDays: 1,
  orderIndex: 0,
  tags: [],
};
