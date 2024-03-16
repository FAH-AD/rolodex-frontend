import { FormEvent, useEffect, useState } from "react";

// Services
import { useCreatePaymentIntentMutation, PaymentIntentMetadata } from "@services/stripeApi";

// Redux
import { useReduxSelector } from "@app/hook";
import { selectUser } from "@slices/authSlice";

// UI Utils
import { Alert, Button, Group, Paper, useMantineTheme } from "@mantine/core";

// Icons
import { IconAlertCircle } from "@tabler/icons";

// Stripe
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { PaymentIntent } from "@stripe/stripe-js";

// Assets
import PoweredByStripeLogo from "@assets/images/powered-by-stripe.svg";

// Props
type Props = {
  amount: number;
  metadata?: PaymentIntentMetadata;
  disabled?: boolean;
  onSuccess?: (paymentIntent: PaymentIntent) => void;
};

export const StripeCheckout = ({ amount, metadata, disabled = false, onSuccess }: Props) => {
  const stripe = useStripe();
  const elements = useElements();
  const theme = useMantineTheme();
  const user = useReduxSelector(selectUser);

  const [paymentIntentClientSecret, setPaymentIntentClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [createPaymentIntent] = useCreatePaymentIntentMutation();

  useEffect(() => {
    if (!stripe || !paymentIntentClientSecret) {
      return;
    }

    setIsLoading(true);

    stripe
      .retrievePaymentIntent(paymentIntentClientSecret)
      .then(({ paymentIntent }) => {
        switch (paymentIntent?.status) {
          case "succeeded":
            onSuccess?.(paymentIntent);
            break;
          case "processing":
            setIsLoading(true);
            break;
          case "requires_payment_method":
            setError("Your payment was not successful, please try again.");
            break;
          default:
            setError("Something went wrong.");
            break;
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [stripe, paymentIntentClientSecret]);

  const handleSubmit = async (e: FormEvent) => {
    try {
      e.preventDefault();

      if (!stripe || !elements) {
        // Stripe.js has not yet loaded.
        // Make sure to disable form submission until Stripe.js has loaded.
        return;
      }

      const card = elements.getElement(CardElement);

      if (!card) {
        return;
      }

      setIsLoading(true);

      const paymentIntent = await createPaymentIntent({ amount, metadata }).unwrap();

      const result = await stripe.confirmCardPayment(paymentIntent.clientSecret, {
        payment_method: {
          card,
          billing_details: {
            name: user?.name,
            email: user?.email,
          },
        },
      });

      setPaymentIntentClientSecret(result.paymentIntent?.client_secret || null);

      // This point will only be reached if there is an immediate error when
      // confirming the payment. Otherwise, your customer will be redirected to
      // your `return_url`. For some payment methods like iDEAL, your customer will
      // be redirected to an intermediate site first to authorize the payment, then
      // redirected to the `return_url`.
      if (result.error) {
        setError(result.error.message || "Something went wrong.");
      }
    } catch {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <Paper withBorder p="sm">
        <CardElement
          options={{
            disabled,
            style: {
              base: {
                fontSize: `${theme.fontSizes.sm}px`,
                color: theme.colorScheme === "dark" ? "#fff" : "#000",
              },
              invalid: {
                color: theme.colors.red[6],
                iconColor: theme.colors.red[6],
              },
            },
          }}
        />
      </Paper>
      <Button
        size="sm"
        fullWidth
        mt="md"
        loading={isLoading}
        disabled={!stripe || !elements || disabled}
        type="submit"
        id="submit"
      >
        <span id="button-text">
          {isLoading ? <div className="spinner" id="spinner"></div> : "Pay now"}
        </span>
      </Button>
      {/* Show any error or success messages */}
      {error && (
        <Alert color="red" mt="md" icon={<IconAlertCircle />}>
          {error}
        </Alert>
      )}
      <Group position="center" mt="md">
        <img src={PoweredByStripeLogo} alt="powered by Stripe" height={25} />
      </Group>
    </form>
  );
};
