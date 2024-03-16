import { emptyApi } from "./emptyApi";

export const stripeApi = emptyApi.injectEndpoints({
  endpoints: (build) => ({
    createPaymentIntent: build.mutation<CreatePaymentIntentResponse, CreatePaymentIntentParams>({
      query: (body) => ({
        url: "/stripe/payment_intent",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useCreatePaymentIntentMutation } = stripeApi;

interface CreatePaymentIntentResponse {
  clientSecret: string;
}

interface CreatePaymentIntentParams {
  amount: number;
  metadata?: PaymentIntentMetadata;
}

export interface PaymentIntentMetadata {
  clientId: number | null;
  clientEmail: string | null;
  checkoutId?: string;
  serviceId?: number;
  offerId?: number;
}
