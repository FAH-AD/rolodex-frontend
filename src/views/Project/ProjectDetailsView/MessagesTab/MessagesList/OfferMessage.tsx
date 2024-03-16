import dayjs from "dayjs";

// Routing
import { useNavigate } from "react-router-dom";

// Services
import { useCreateCheckoutMutation } from "@services/checkoutApi";

// Redux
import { useReduxSelector } from "@app/hook";
import { selectUser } from "@slices/authSlice";

// UI Components
import { Button, Stack, Text } from "@mantine/core";

// Icons
import { IconCheck } from "@tabler/icons";

// Interfaces
import { Project, ProjectMessage } from "@interfaces/project";

// Props
type Props = {
  message: ProjectMessage;
  project: Project;
};

export const OfferMessage = ({ message, project }: Props) => {
  const user = useReduxSelector(selectUser);
  const navigate = useNavigate();
  const [createCheckout, { isLoading: isCreatingCheckout }] = useCreateCheckoutMutation();

  const handleAcceptOffer = async () => {
    try {
      if (!project.offer) return;

      const checkout = await createCheckout({
        offerId: project.offer.id,
        amount: project.offer.amount,
      }).unwrap();

      navigate(`/checkout/${checkout.id}`);
    } catch {}
  };

  return (
    <Stack spacing={2} align={message.userId === user?.id ? "flex-end" : "flex-start"}>
      <Text weight={700} size="md">
        {message.user.name}
      </Text>
      <Text
        px={10}
        py={5}
        sx={(theme) => ({
          backgroundColor: theme.colors.green[8],
          border: `3px solid ${theme.colors.green[3]}`,
          color: theme.white,
          borderRadius: theme.radius.xl,
          width: "fit-content",
        })}
        align={message.userId === user?.id ? "right" : "left"}
      >
        {message.message}
      </Text>
      {user?.role === "client" && !project.offer?.acceptedAt && (
        <Button
          mt={4}
          size="xs"
          color="green"
          variant="subtle"
          leftIcon={<IconCheck size={16} />}
          onClick={handleAcceptOffer}
          loading={isCreatingCheckout}
        >
          Accept & Start
        </Button>
      )}
      <Text color="dimmed" size="sm">
        {dayjs(message.createdAt).format("hh:mm a")}
      </Text>
    </Stack>
  );
};
