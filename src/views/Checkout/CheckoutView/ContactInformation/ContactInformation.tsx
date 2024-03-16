// Redux
import { useReduxSelector } from "@app/hook";
import { selectIsAuthenticated } from "@slices/authSlice";

// Mantine
import { Box, Button, Card, Text, TextInput } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";

// Validation
import { CheckoutFormValues } from "../checkoutValidation";

// Interfaces
import { Checkout } from "@interfaces/checkout";

// Props
type Props = {
  form: UseFormReturnType<CheckoutFormValues>;
  checkout: Checkout;
  handleSubmit: (values: CheckoutFormValues) => Promise<void>;
};

export const ContactInformation = ({ form, checkout, handleSubmit }: Props) => {
  const isAuthenticated = useReduxSelector(selectIsAuthenticated);

  return (
    <Card p="md" withBorder radius="md">
      <Text size="lg" weight={700}>
        Contact Information
      </Text>
      <Box mt="md">
        {checkout.user ? (
          <>
            <Text>{checkout.user.name}</Text>
            <Text>{checkout.user.name}</Text>
            <Text>{checkout.user.email}</Text>
            <Text>{checkout.user.phone}</Text>
          </>
        ) : (
          <>
            <div style={{ display: 'flex', gap: '16px' }}>
              <TextInput
                label="First Name"
                placeholder="Please enter your first name"
                withAsterisk
                disabled={isAuthenticated}
                {...form.getInputProps("name")}
              />
              <TextInput
                label="Last Name"
                placeholder="Please enter your last name"
                withAsterisk
                disabled={isAuthenticated}
                {...form.getInputProps("name")}
              />
            </div>
            <TextInput
              label="E-mail"
              placeholder="Please enter your e-mail"
              withAsterisk
              disabled={isAuthenticated}
              mt="xs"
              {...form.getInputProps("email")}
            />
          </>
        )}
      </Box>
      {!isAuthenticated && (
        <Button
          onClick={() => {
            const validation = form.validate();
            if (!validation.hasErrors) {
              handleSubmit(form.values);
            }
          }}
          type="submit"
          mt="md"
          form="rolodexCheckoutForm"
        >
          Create my free account
        </Button>
      )}
    </Card>
  );
};
