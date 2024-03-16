import { emptyApi } from "./emptyApi";

export const paypalApi = emptyApi.injectEndpoints({
  endpoints: (build) => ({
    createOrder: build.mutation<any, CreateOrderParams>({
      query: (body) => ({
        url: "/paypal/order",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useCreateOrderMutation } = paypalApi;

interface CreateOrderParams {
  orderId: string;
  checkoutId: string;
}

interface UpdateOrderParams {
  orderId: string;
  status: string;
}
