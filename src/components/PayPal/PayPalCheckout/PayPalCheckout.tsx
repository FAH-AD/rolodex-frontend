import { useEffect, useState } from "react";

// PayPal
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";

// UI Components
import { LoadingOverlay } from "@mantine/core";

// UI Utils
import { showNotification } from "@mantine/notifications";

// Icons
import { IconX } from "@tabler/icons";

const currency = "USD";
const style = { layout: "vertical" };

// Props
type Props = {
  amount: string;
  showSpinner?: boolean;
  disabled?: boolean;
  onOrderCreate?: (orderId: string) => void;
  onOrderCapture?: (orderId: string) => void;
};

export const PayPalCheckout = ({
  amount,
  onOrderCreate,
  onOrderCapture,
  showSpinner = true,
  disabled = false,
}: Props) => {
  // usePayPalScriptReducer can be use only inside children of PayPalScriptProviders
  // This is the main reason to wrap the PayPalButtons in a new component
  const [{ options, isPending }, dispatch] = usePayPalScriptReducer();
  const [isCapturing, setIsCapturing] = useState(false);

  const handleError = (error: any) => {
    console.log(error);
    if (error?.message !== "INVALID_CONTACT_INFORMATION") {
      showNotification({
        title: "Payment failed",
        message: "Please try again",
        color: "red",
        icon: <IconX />,
      });
    }
  };

  useEffect(() => {
    dispatch({
      type: "resetOptions",
      value: {
        ...options,
        currency: currency,
      },
    });
  }, [currency, showSpinner]);

  return (
    <>
      {isCapturing && <LoadingOverlay visible />}
      {showSpinner && isPending && <LoadingOverlay visible />}
      <PayPalButtons
        style={{ layout: "vertical", label: "pay", color: "silver" }}
        disabled={disabled}
        forceReRender={[amount, currency, style]}
        fundingSource={undefined}
        onError={handleError}
        createOrder={async (_data, actions) => {
          try {
            const orderId = await actions.order.create({
              purchase_units: [
                {
                  amount: {
                    currency_code: currency,
                    value: amount,
                  },
                },
              ],
            });
            onOrderCreate?.(orderId);
            return orderId;
          } catch (error: any) {
            handleError(error);
            return "";
          }
        }}
        onApprove={async (_data, actions) => {
          if (!actions.order) return;
          try {
            setIsCapturing(true);
            await actions.order.capture();
            onOrderCapture?.(_data.orderID);
          } catch (error: any) {
            handleError(error);
          } finally {
            setIsCapturing(false);
          }
        }}
      />
    </>
  );
};
