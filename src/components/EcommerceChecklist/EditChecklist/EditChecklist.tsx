import React from "react";

// Services
import { useUpdateEcommerceChecklistMutation } from "@services/ecommerceChecklistApi";

// UI Components
import { Button, ColorInput, NumberInput, Select, TextInput } from "@mantine/core";

// UI Utils
import { useForm, zodResolver } from "@mantine/form";
import { closeModal } from "@mantine/modals";

// Icons
import { IconCircleCheck } from "@tabler/icons";

// Validation
import { Inputs } from "./validation/Inputs";
import { schema } from "./validation/schema";

// Interfaces
import { EcommerceChecklist } from "@interfaces/ecommerceChecklist";

// Data
import { categories } from "@views/EcommerceChecklist/categories";
import { showNotification } from "@mantine/notifications";

// Props
type EditChecklistProps = {
  checklist: EcommerceChecklist;
};

export const EditChecklist: React.FC<EditChecklistProps> = ({ checklist }) => {
  const [updateEcommerceChecklist, { isLoading }] = useUpdateEcommerceChecklistMutation();

  const form = useForm<Inputs>({
    initialValues: checklist,
    validate: zodResolver(schema),
  });

  const onSubmit = async (values: Inputs) => {
    try {
      await updateEcommerceChecklist({
        ...values,
        id: checklist.id,
      }).unwrap();
      showNotification({
        title: "Success",
        message: "Ecommerce checklist updated successfully",
        color: "green",
        icon: <IconCircleCheck />,
      });
      closeModal("editEcommerceChecklist");
    } catch {}
  };

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <NumberInput label="Order Index" {...form.getInputProps("orderIndex")} />
      <TextInput
        label="Name"
        placeholder="Ecommerce checklist name"
        mt="md"
        withAsterisk
        {...form.getInputProps("name")}
      />
      <ColorInput
        label="Color"
        placeholder="Ecommerce checklist color"
        mt="md"
        withAsterisk
        {...form.getInputProps("color")}
      />
      <Select
        label="Category"
        data={categories.map((category) => ({ label: category, value: category }))}
        mt="md"
        nothingFound="No categories found"
        searchable
        withAsterisk
        {...form.getInputProps("category")}
      />
      <Button type="submit" mt="lg" loading={isLoading}>
        Update
      </Button>
    </form>
  );
};
