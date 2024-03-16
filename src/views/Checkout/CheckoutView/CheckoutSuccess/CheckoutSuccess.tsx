// Routing
import { Link } from "react-router-dom";

// UI Components
import { Alert, Button, Container } from "@mantine/core";

export const CheckoutSuccess = () => {
  return (
    <Container size="md">
      <Alert title="Checkout successful" color="green" variant="light">
        Once your payment is confirmed, you can see your project in the dashboard and you will
        receive an email with the details
      </Alert>
      <Button component={Link} to="/dashboard/projects" mt="md" variant="default">
        Go to home page
      </Button>
    </Container>
  );
};
