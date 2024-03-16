import React from "react";

// Services
import { useUpdateEcommerceChecklistItemMutation } from "@services/ecommerceChecklistApi";

// UI Components
import { Button, Input, NumberInput } from "@mantine/core";
import { TextEditor } from "@ui/TextEditor";

// UI Utils
import { showNotification } from "@mantine/notifications";
import { closeModal } from "@mantine/modals";

// Icons
import { IconCircleCheck } from "@tabler/icons";

// Interfaces
import { EcommerceChecklistItem } from "@interfaces/ecommerceChecklist";
import { useForm, zodResolver } from "@mantine/form";

// Validation
import { Inputs } from "./validation/Inputs";
import { schema } from "./validation/schema";

// Props
type EditItemProps = {
  item: EcommerceChecklistItem;
};

export const EditItem: React.FC<EditItemProps> = ({ item }) => {
  const [updateEcommerceChecklistItem, { isLoading }] = useUpdateEcommerceChecklistItemMutation();

  const form = useForm<Inputs>({
    initialValues: item,
    validate: zodResolver(schema),
  });

  const onSubmit = async (values: Inputs) => {
    try {
      await updateEcommerceChecklistItem({
        ...values,
        id: item.id,
      }).unwrap();
      showNotification({
        title: "Success",
        message: "Item updated successfully",
        color: "green",
        icon: <IconCircleCheck />,
      });
      closeModal("editEcommerceChecklistItem");
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
        Update
      </Button>
    </form>
  );
};
