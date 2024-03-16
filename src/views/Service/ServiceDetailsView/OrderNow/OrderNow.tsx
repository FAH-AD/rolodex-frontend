// Routing
import { Link } from "react-router-dom";

// UI Components
import { Button, Group, Paper, Badge, Stack, TextInput, CopyButton } from "@mantine/core";

// Hooks
import { useVerifyRole } from "@hooks/auth/useVerifyRole";

// Interfaces
import { Service } from "@interfaces/service";

// Props
type OrderNowProps = {
  service: Service;
};

export const OrderNow = ({ service }: OrderNowProps) => {
  const { user, verifyRole } = useVerifyRole();

  return (
    <Paper withBorder p={16}>
      <Group>
        <Badge size="lg" color="green" variant="outline">
          ${service.cost}
        </Badge>
        <Badge size="lg" color="cyan" variant="outline">
          {service.deliveryInDays} day delivery
        </Badge>
      </Group>
      {verifyRole("client") && (
        <Stack>
          <Button fullWidth mt="md" component={Link} to={`/checkout/${service.slug}`}>
            Order Now
          </Button>
          <TextInput
            label={`Share this URL to earn 10% ($${
              service.cost * 0.1
            }) when someone buys this service`}
            value={`https://dashboard.ecomrolodex.com/checkout/${service.slug}?ref=${user?.referenceId}`}
            readOnly
            rightSection={
              <CopyButton
                value={`https://dashboard.ecomrolodex.com/checkout/${service.slug}?ref=${user?.referenceId}`}
              >
                {({ copied, copy }) => (
                  <Button
                    color={copied ? "teal" : "blue"}
                    onClick={copy}
                    style={{ marginRight: 32 }}
                  >
                    {copied ? "Copied" : "Copy"}
                  </Button>
                )}
              </CopyButton>
            }
          />
        </Stack>
      )}
    </Paper>
  );
};
