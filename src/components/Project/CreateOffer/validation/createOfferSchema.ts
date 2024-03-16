import { z } from "zod";

export const createOfferSchema = z.object({
  amount: z.number().min(1),
  deliveryInDays: z.number().min(1),
});
