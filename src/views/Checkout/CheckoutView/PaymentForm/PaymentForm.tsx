import { Suspense, lazy, useState } from "react";

// Routing
import { useNavigate } from "react-router-dom";

// Services
import { useCreateOrderMutation } from "@services/paypalApi";
import {
  useCompleteCheckoutForFreeMutation,
  useUpdateCheckoutStatusToWaitingForCaptureMutation,
} from "@services/checkoutApi";

// Redux
import { useReduxSelector } from "@app/hook";
import { selectUser } from "@slices/authSlice";

// Mantine
import {
  Alert,
  Box,
  Button,
  Card,
  Checkbox,
  Group,
  LoadingOverlay,
  Radio,
  Text,
  Paper
} from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { closeAllModals, openModal } from "@mantine/modals";

// PayPal
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

// Stripe
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

// Interfaces
import { Checkout } from "@interfaces/checkout";

// Validation
import { CheckoutFormValues } from "../checkoutValidation";
import { IconInfoCircle } from "@tabler/icons";

// Lazy Imports
const StripeCheckout = lazy(() => import("@components/Stripe/StripeCheckout"));
const PayPalCheckout = lazy(() => import("@components/PayPal/PayPalCheckout"));

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// Props
type Props = {
  form: UseFormReturnType<CheckoutFormValues>;
  checkout: Checkout;
  balance: number | undefined
};

export const PaymentForm = ({ form, checkout, balance }: Props) => {
  const navigate = useNavigate();
  if (typeof balance == 'undefined') {
    balance = 0;
  }

  // State
  const [paymentMethod, setPaymentMethod] = useState("");
  const [useExistingBalance, setUseExistingBalance] = useState(false);
  const [amount, setAmount] = useState(checkout.amount);

  // Redux
  const user = useReduxSelector(selectUser);

  // Mutations
  const [completeCheckoutForFree, { isLoading: isCompletingCheckoutForFree }] =
    useCompleteCheckoutForFreeMutation();
  const [createOrder, { isLoading: isCreatingPaypalOrder }] =
    useCreateOrderMutation();
  const [
    updateCheckoutStatusToWaitingForCapture,
    { isLoading: isUpdatingStatus },
  ] = useUpdateCheckoutStatusToWaitingForCaptureMutation();

  const handlePaypalOrderCreate = async (orderId: string) => {
    try {
      await createOrder({
        orderId,
        checkoutId: checkout.id,
      }).unwrap();
    } catch { }
  };

  const handleCompleteCheckoutForFree = async () => {
    try {
      await completeCheckoutForFree({
        id: checkout.id,
        offerId: checkout.offerId ?? undefined,
        serviceId: checkout.serviceId ?? undefined,
      }).unwrap();
    } catch { }
  };

  const handlePaymentSuccess = async () => {
    try {
      if (!checkout.user) {
        openModal({
          title: "Success",
          children: (
            <>
              <Alert color="green">
                Once your payment is confirmed, you can see your project in the
                dashboard and you will receive an email with the details. You
                can continue to the dashboard now.
              </Alert>
              <Button
                onClick={() => {
                  closeAllModals();
                  navigate("/dashboard/projects");
                }}
                fullWidth
                mt="md"
              >
                Continue to Dashboard
              </Button>
            </>
          ),
          onClose: () => {
            closeAllModals();
            navigate("/dashboard/projects");
          },
        });
      }

      if (checkout.status !== "PREDEFINED") {
        await updateCheckoutStatusToWaitingForCapture(checkout.id).unwrap();
      }
    } catch { }
  };

  return (
    <div>
      <Card withBorder radius="md" p="md">
        <Text size="lg" weight={700}>
          Order Review
        </Text>
        <LoadingOverlay visible={isCreatingPaypalOrder || isUpdatingStatus} />
        <Card>
        <Group position="apart">
          <Text>Subtotal:</Text>
          <Text size="md">${checkout.amount}</Text>
        </Group>
        <Group position="apart">
          <Text>Balance:</Text>
          <Text size="md">${balance}</Text>
        </Group>
        </Card>
        {useExistingBalance && (
          <Group position="apart">
            <Text>Use Existing Balance:</Text>
            <Text size="lg" weight={700}>
              - ${checkout.amount}
            </Text>
          </Group>
        )}

        <Card
          withBorder
          style={{
            background: 'linear-gradient(to bottom, #AAB2FD, #3E50FF)',
            color: 'white',
          }}
          radius="md"
        >
          <Group position="apart">
            <Text style={{fontSize:'15px'}}>Total:</Text>
            <Text style={{fontSize:'22px'}}>${amount}</Text>
          </Group>
        </Card>

      </Card>
      {user && user.balance > 0 ? (
        <Group position="apart" mt="md">
          <Text size="sm">Use my existing balance (${user.balance})</Text>
          <Checkbox
            checked={useExistingBalance}
            onChange={(e) => {
              setUseExistingBalance(e.currentTarget.checked);
              if (e.currentTarget.checked) {
                if (user.balance >= checkout.amount) {
                  return setAmount(0);
                }
                return setAmount(checkout.amount - user.balance);
              }
              setAmount(checkout.amount);
            }}
          />
        </Group>
      ) : null}
      <Text mt="md" align="center" size="xs">All payments are secured by 256-bit encryption</Text>
      {amount > 0 ? (
        <Card withBorder mt="md">
          <Radio.Group
            value={paymentMethod}
            onChange={setPaymentMethod}
            label="Payment Method"
          >
            <Radio value="paypal" label="PayPal" />
            <Radio value="stripe" label="Credit/Debit Card" />
          </Radio.Group>
          <Suspense fallback={<LoadingOverlay visible />}>
            <Box mt="md" style={{ position: "relative" }}>
              {!user ? (
                <Alert color="blue" icon={<IconInfoCircle />}>
                  Please complete your account creation first
                </Alert>
              ) : null}
              {paymentMethod === "stripe" && user && (
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
                    disabled={!user}
                    metadata={{
                      clientId: user.id,
                      clientEmail: user.email,
                      checkoutId: checkout.id,
                      offerId: checkout.offerId || undefined,
                      serviceId: checkout.serviceId || undefined,
                    }}
                    onSuccess={handlePaymentSuccess}
                  />
                </Elements>
              )}
              {paymentMethod === "paypal" && user && (
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
                    disabled={!user}
                    onOrderCreate={handlePaypalOrderCreate}
                    onOrderCapture={handlePaymentSuccess}
                  />
                </PayPalScriptProvider>
              )}
            </Box>
          </Suspense>
        </Card>
      ) : (
        <Button
          mt="md"
          fullWidth
          loading={isCompletingCheckoutForFree}
          onClick={handleCompleteCheckoutForFree}
        >
          Complete Checkout for Free
        </Button>
      )}
    </div>
  );
};
