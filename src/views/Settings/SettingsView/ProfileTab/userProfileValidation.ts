import { z } from "zod";

export const userProfileSchema = z.object({
  name: z
    .string({
      required_error: "Name is required",
      invalid_type_error: "Name must be a string",
    })
    .min(1, "Name is required"),
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .max(255, "Email must be less than 255 characters")
    .email("Email must be a valid email address"),
  phone: z
    .string({
      required_error: "Phone is required",
      invalid_type_error: "Phone must be a string",
    })
    .max(255, "Phone must be less than 255 characters")
    .nullable(),
  image: z
    .string({
      required_error: "Image is required",
      invalid_type_error: "Image URL must be a string",
    })
    .nullable(),
  stores: z
    .array(
      z.object({
        name: z
          .string({
            required_error: "Store name is required",
            invalid_type_error: "Store name must be a string",
          })
          .min(1, "Store name is required")
          .nullable(),
        url: z.string().url("Please enter a valid URL"),
      })
    )
    .max(5, "You can only have up to 5 stores")
    .refine(
      (stores) => {
        // Check if there are any duplicate store urls
        const storeUrls = stores.map((store) => store.url);
        const uniqueStoreUrls = new Set(storeUrls);
        return storeUrls.length === uniqueStoreUrls.size;
      },
      {
        message: "Store URLs must be unique",
      }
    ),
});

export type UserProfileValues = z.infer<typeof userProfileSchema>;

export const initialValues: UserProfileValues = {
  name: "",
  email: "",
  phone: "",
  image: null,
  stores: [],
};
