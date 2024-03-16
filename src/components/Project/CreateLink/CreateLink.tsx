// Services
import { useCreateProjectLinkMutation } from "@services/projectLinkApi";

// Mantine
import { Button, Select, TextInput } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { closeAllModals } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";

// Icons
import { IconCircleCheck } from "@tabler/icons";

// Validation
import { CreateLinkValues, createLinkSchema } from "./createLinkValidation";

// Props
type Props = {
  projectId: number;
};

export const CreateLink = ({ projectId }: Props) => {
  const [createProjectLink, { isLoading }] = useCreateProjectLinkMutation();

  const form = useForm<CreateLinkValues>({
    initialValues: {
      name: "",
      url: "",
      type: "googleDrive",
    },
    validate: zodResolver(createLinkSchema),
  });

  const handleSubmit = async (values: CreateLinkValues) => {
    try {
      await createProjectLink({
        projectId,
        ...values,
      }).unwrap();

      showNotification({
        title: "Success",
        message: "Link created successfully",
        color: "teal",
        icon: <IconCircleCheck />,
      });

      closeAllModals();
    } catch {}
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <TextInput
        label="Link Name"
        placeholder="Please enter a name for the link"
        withAsterisk
        {...form.getInputProps("name")}
      />
      <TextInput
        label="Link URL"
        placeholder="URL for the link"
        mt="md"
        withAsterisk
        {...form.getInputProps("url")}
      />
      <Select
        label="Link Type"
        data={[
          { label: "Google Drive", value: "googleDrive" },
          { label: "Figma", value: "figma" },
          { label: "Other", value: "other" },
        ]}
        mt="md"
        {...form.getInputProps("type")}
      />
      <Button type="submit" mt="lg" loading={isLoading}>
        Create Link
      </Button>
    </form>
  );
};
