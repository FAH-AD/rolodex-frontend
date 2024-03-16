import { z } from "zod";

export const schema = z.object({
  estimatedDeliveryDate: z
    .date({
      required_error: "Delivery date is required",
      invalid_type_error: "Please enter a valid date",
    })
    .min(new Date(), "Delivery date must be in the future"),
});
