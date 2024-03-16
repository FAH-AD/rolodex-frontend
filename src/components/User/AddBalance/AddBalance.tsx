import React, { useState } from "react";

// Services
import { useCreateOrderMutation } from "@services/paypalApi";
import { useCreateCheckoutMutation } from "@services/checkoutApi";

// Redux
import { useReduxSelector } from "@app/hook";
import { selectUser } from "@slices/authSlice";

// UI Components
import { Box, Loader, LoadingOverlay, SegmentedControl, Select } from "@mantine/core";

// UI Utils
import { showNotification } from "@mantine/notifications";
import { closeModal } from "@mantine/modals";

// Icons
import { IconCircleCheck } from "@tabler/icons";

// PayPal
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

// Stripe
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

// Lazy Imports
const StripeCheckout = React.lazy(() => import("@components/Stripe/StripeCheckout"));
const PayPalCheckout = React.lazy(() => import("@components/PayPal/PayPalCheckout"));

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export const AddBalance = () => {
  // State
  const [amount, setAmount] = useState(50);
  const [paymentMethod, setPaymentMethod] = useState("");

  // Redux
  const user = useReduxSelector(selectUser);

  // Mutations
  const [createOrder, { isLoading: isCreatingPaypalOrder }] = useCreateOrderMutation();
  const [createCheckout, { isLoading: isCreatingCheckout }] = useCreateCheckoutMutation();

  // Handlers
  const handlePaypalOrderCreate = async (orderId: string) => {
    try {
      const checkout = await createCheckout({ amount }).unwrap();
      await createOrder({
        orderId,
        checkoutId: checkout.id,
      }).unwrap();
    } catch {}
  };

  return (
    <div>
      <LoadingOverlay visible={isCreatingPaypalOrder || isCreatingCheckout} />
      <Select
        label="Select amount"
        mb="md"
        value={amount.toString()}
        onChange={(value) => {
          if (value) {
            setAmount(parseInt(value));
          }
        }}
        data={[
          {
            label: "$50",
            value: "50",
          },
          {
            label: "$100",
            value: "100",
          },
          {
            label: "$200",
            value: "200",
          },
          {
            label: "$500",
            value: "500",
          },
          {
            label: "$1000",
            value: "1000",
          },
          {
            label: "$2000",
            value: "2000",
          },
        ]}
      />
      <SegmentedControl
        fullWidth
        value={paymentMethod}
        onChange={setPaymentMethod}
        data={[
          {
            label: "Stripe",
            value: "stripe",
          },
          {
            label: "PayPal",
            value: "paypal",
          },
        ]}
      />
      <React.Suspense fallback={<Loader />}>
        <Box mt="md">
          {paymentMethod === "stripe" && (
            <Elements
              stripe={stripePromise}
              options={{
                appearance: {
                  theme: "stripe",
                },
                loader: "always",
              }}
            >
              <StripeCheckout
                amount={amount}
                metadata={{
                  clientId: user!.id,
                  clientEmail: user!.email,
                }}
                onSuccess={(paymentIntent) => {
                  closeModal("addBalance");
                  showNotification({
                    title: "Success",
                    message: `Your payment of $${paymentIntent.amount / 100} was successful.`,
                    color: "green",
                    icon: <IconCircleCheck />,
                  });
                }}
              />
            </Elements>
          )}
          {paymentMethod === "paypal" && (
            <PayPalScriptProvider
              deferLoading={true}
              options={{
                "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID,
                components: "buttons",
                currency: "USD",
              }}
            >
              <PayPalCheckout
                amount={amount.toString()}
                onOrderCreate={handlePaypalOrderCreate}
                onOrderCapture={() => {
                  closeModal("addBalance");
                  showNotification({
                    title: "Success",
                    message: `Your payment of $${amount} was successful.`,
                    color: "green",
                    icon: <IconCircleCheck />,
                  });
                }}
              />
            </PayPalScriptProvider>
          )}
        </Box>
      </React.Suspense>
    </div>
  );
};
