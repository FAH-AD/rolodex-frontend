import React from "react";

// Services
import { useCreateProjectOfferMutation } from "@services/projectOfferApi";

// UI Components
import { Button, LoadingOverlay, NumberInput } from "@mantine/core";

// UI Utils
import { showNotification } from "@mantine/notifications";
import { useForm, zodResolver } from "@mantine/form";
import { closeAllModals } from "@mantine/modals";

// Icons
import { IconCalendar, IconCircleCheck, IconCurrencyDollar } from "@tabler/icons";

// Validation
import { CreateOfferInputs } from "./validation/CreateOfferInputs";
import { createOfferSchema } from "./validation/createOfferSchema";

// Interfaces
import { Project } from "@interfaces/project";

// Props
type CreateOfferProps = {
  project: Project;
  onSuccess?: (offer: CreateOfferInputs) => void;
};

export const CreateOffer: React.FC<CreateOfferProps> = ({ project, onSuccess }) => {
  const [createOffer, { isLoading }] = useCreateProjectOfferMutation();

  const form = useForm<CreateOfferInputs>({
    initialValues: { amount: 29, deliveryInDays: 1 },
    validate: zodResolver(createOfferSchema),
  });

  const onSubmit = async (values: CreateOfferInputs) => {
    try {
      await createOffer({ projectId: project.id, ...values }).unwrap();
      showNotification({
        title: "Success",
        message: "Project offer sent successfully",
        color: "green",
        icon: <IconCircleCheck />,
      });
      closeAllModals();
      onSuccess?.(values);
    } catch {}
  };

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <LoadingOverlay visible={isLoading} />
      <NumberInput
        label="Offer Amount"
        placeholder="Enter your offer amount for the client"
        withAsterisk
        icon={<IconCurrencyDollar size={18} />}
        min={1}
        {...form.getInputProps("amount")}
      />
      <NumberInput
        label="Delivery in Days"
        placeholder="Enter the number of days you will deliver the project"
        withAsterisk
        mt="md"
        icon={<IconCalendar size={18} />}
        min={1}
        {...form.getInputProps("deliveryInDays")}
      />
      <Button type="submit" mt="lg" loading={isLoading}>
        Send Offer
      </Button>
    </form>
  );
};
