// Routing
import { useNavigate } from "react-router-dom";

// Services
import { useCreateEcommerceChecklistMutation } from "@services/ecommerceChecklistApi";

// UI Components
import { Button, ColorInput, NumberInput, Paper, Select, TextInput } from "@mantine/core";

// UI Utils
import { useForm, zodResolver } from "@mantine/form";
import { showNotification } from "@mantine/notifications";

// Icons
import { IconArrowsSort, IconCategory, IconCircleCheck, IconFileDescription } from "@tabler/icons";

// Components
import { PageWrapper } from "@components/PageWrapper";

// Validation
import { Inputs, initialValues } from "./validation/Inputs";
import { schema } from "./validation/schema";

// Data
import { categories } from "../categories";

export const CreateEcommerceChecklistView = () => {
  const navigate = useNavigate();
  const [createEcommerceChecklist, { isLoading }] = useCreateEcommerceChecklistMutation();

  const form = useForm<Inputs>({
    initialValues,
    validate: zodResolver(schema),
  });

  const onSubmit = async (values: Inputs) => {
    try {
      await createEcommerceChecklist(values).unwrap();
      showNotification({
        title: "Success",
        message: "Ecommerce checklist created successfully",
        color: "green",
        icon: <IconCircleCheck />,
      });
      navigate("/dashboard/ecommerce-checklists");
    } catch {}
  };

  return (
    <PageWrapper
      title="New Ecommerce Checklist"
      breadcrumbs={[
        {
          label: "Ecommerce Checklists",
          link: "/dashboard/ecommerce-checklists",
        },
        {
          label: "Create",
          link: "/dashboard/ecommerce-checklists/create",
        },
      ]}
    >
      <Paper p="md" mt="md" withBorder>
        <form onSubmit={form.onSubmit(onSubmit)}>
          <NumberInput
            label="Order Index"
            placeholder="Ecommerce checklist order index"
            withAsterisk
            icon={<IconArrowsSort size={18} />}
            {...form.getInputProps("orderIndex")}
          />
          <TextInput
            label="Name"
            placeholder="Ecommerce checklist name"
            mt="md"
            withAsterisk
            icon={<IconFileDescription size={18} />}
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
            icon={<IconCategory size={18} />}
            {...form.getInputProps("category")}
          />
          <Button mt="lg" type="submit" loading={isLoading}>
            Create
          </Button>
        </form>
      </Paper>
    </PageWrapper>
  );
};
