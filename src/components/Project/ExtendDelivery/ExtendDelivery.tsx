import React from "react";

// Services
import { useUpdateProjectEstimatedDeliveryMutation } from "@services/projectApi";

// UI Components
import { Button } from "@mantine/core";
import { DatePicker } from "@mantine/dates";

// UI Utils
import { showNotification } from "@mantine/notifications";
import { useForm, zodResolver } from "@mantine/form";
import { closeModal } from "@mantine/modals";

// Icons
import { IconCircleCheck } from "@tabler/icons";

// Validation
import { Inputs } from "./validation/Inputs";
import { schema } from "./validation/schema";

// Props
type ExtendDeliveryProps = {
  projectId: number;
  estimatedDeliveryDate: string;
};

export const ExtendDelivery: React.FC<ExtendDeliveryProps> = ({
  projectId,
  estimatedDeliveryDate,
}) => {
  const [updateProjectEstimatedDelivery, { isLoading }] =
    useUpdateProjectEstimatedDeliveryMutation();

  const form = useForm<Inputs>({
    initialValues: {
      estimatedDeliveryDate: new Date(estimatedDeliveryDate),
    },
    validate: zodResolver(schema),
  });

  const onSubmit = async (values: Inputs) => {
    try {
      await updateProjectEstimatedDelivery({
        ...values,
        id: projectId,
      }).unwrap();
      showNotification({
        title: "Success",
        message: "Project estimated delivery updated",
        color: "green",
        icon: <IconCircleCheck />,
      });
      closeModal("extendProjectDelivery");
    } catch {}
  };

  return (
    <form onSubmit={form.onSubmit(onSubmit, (errors) => console.log(errors))}>
      <DatePicker
        label="Estimated Delivery Date"
        clearable={false}
        minDate={new Date()}
        {...form.getInputProps("estimatedDeliveryDate")}
      />
      <Button mt="lg" type="submit" loading={isLoading}>
        Update
      </Button>
    </form>
  );
};
