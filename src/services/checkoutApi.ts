import { emptyApi } from "./emptyApi";

// Interfaces
import { Checkout } from "@interfaces/checkout";

export const checkoutApi = emptyApi.injectEndpoints({
  endpoints: (builder) => ({
    getCheckout: builder.query<Checkout, string>({
      query: (id) => `/checkout/${id}`,
      providesTags: (result, _error, id) => (result ? [{ type: "Checkout", id }] : []),
    }),
    createCheckout: builder.mutation<Checkout, CreateCheckoutParams>({
      query: (body) => ({
        url: "/checkout",
        method: "POST",
        body,
      }),
    }),
    completeCheckoutForFree: builder.mutation<Checkout, CompleteCheckoutForFreeParams>({
      query: (body) => ({
        url: `/checkout/${body.id}/complete`,
        method: "POST",
        body: body,
      }),
    }),
    updateCheckoutStatusToWaitingForCapture: builder.mutation<Checkout, string>({
      query: (id) => ({
        url: `/checkout/${id}/waiting_for_capture`,
        method: "PATCH",
      }),
      invalidatesTags: (result, _error, id) => (result ? [{ type: "Checkout", id }] : []),
    }),
  }),
});

export const {
  useGetCheckoutQuery,
  useCreateCheckoutMutation,
  useCompleteCheckoutForFreeMutation,
  useUpdateCheckoutStatusToWaitingForCaptureMutation,
} = checkoutApi;

interface CreateCheckoutParams {
  offerId?: number;
  serviceId?: number;
  amount: number;
}

interface CompleteCheckoutForFreeParams {
  id: string;
  offerId?: number;
  serviceId?: number;
}
