import React from "react";

// Services
import { useCreateEcommerceChecklistItemMutation } from "@services/ecommerceChecklistApi";

// UI Components
import { Button, Input, NumberInput } from "@mantine/core";
import { TextEditor } from "@ui/TextEditor";

// UI Utils
import { closeModal } from "@mantine/modals";
import { useForm, zodResolver } from "@mantine/form";
import { showNotification } from "@mantine/notifications";

// Icons
import { IconCircleCheck } from "@tabler/icons";

// Validation
import { Inputs, initialValues } from "./validation/Inputs";
import { schema } from "./validation/schema";

// Props
type CreateItemProps = {
  checklistId: number;
};

export const CreateItem: React.FC<CreateItemProps> = ({ checklistId }) => {
  const [createEcommerceChecklistItem, { isLoading }] = useCreateEcommerceChecklistItemMutation();

  const form = useForm<Inputs>({
    initialValues,
    validate: zodResolver(schema),
  });

  const onSubmit = async (values: Inputs) => {
    try {
      await createEcommerceChecklistItem({
        ...values,
        checklistId,
      }).unwrap();
      showNotification({
        title: "Success",
        message: "Item created successfully",
        color: "green",
        icon: <IconCircleCheck />,
      });
      closeModal("createEcommerceChecklistItem");
    } catch {}
  };

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <NumberInput
        label="Order Index"
        placeholder="Item's order index"
        withAsterisk
        {...form.getInputProps("orderIndex")}
      />
      <Input.Wrapper label="Name" mt="md" withAsterisk>
        <TextEditor placeholder="Item name" controls={[["link"]]} {...form.getInputProps("name")} />
      </Input.Wrapper>
      <Input.Wrapper label="Description" mt="md">
        <TextEditor placeholder="Item description" {...form.getInputProps("description")} />
      </Input.Wrapper>
      <Button mt="lg" type="submit" loading={isLoading}>
        Create
      </Button>
    </form>
  );
};
