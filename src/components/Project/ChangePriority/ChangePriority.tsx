// Services
import { useUpdateProjectPriorityMutation } from "@services/projectApi";

// Mantine
import { Button, LoadingOverlay, Select } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { closeAllModals } from "@mantine/modals";

// Icons
import { IconCircleCheck } from "@tabler/icons";

// Validation
import { ChangePriorityValues, changePrioritySchema } from "./changePriorityValidation";

// Interfaces
import { Project } from "@interfaces/project";

// Props
type Props = {
  project: Project;
};

export const ChangePriority = ({ project }: Props) => {
  const [updateProjectPriority, { isLoading }] = useUpdateProjectPriorityMutation();

  const form = useForm<ChangePriorityValues>({
    initialValues: {
      priority: project.priority,
    },
    validate: zodResolver(changePrioritySchema),
  });

  const handleSubmit = async (values: ChangePriorityValues) => {
    try {
      await updateProjectPriority({
        id: project.id,
        priority: values.priority,
      }).unwrap();

      showNotification({
        title: "Success",
        message: "Project priority has been updated",
        color: "teal",
        icon: <IconCircleCheck />,
      });

      closeAllModals();
    } catch {}
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <LoadingOverlay visible={isLoading} />
      <Select
        label="Status"
        data={[
          {
            label: "Low",
            value: "low",
          },
          {
            label: "Normal",
            value: "normal",
          },
          {
            label: "High",
            value: "high",
          },
          {
            label: "Urgent",
            value: "urgent",
          },
        ]}
        searchable
        {...form.getInputProps("priority")}
      />
      <Button type="submit" mt="lg">
        Save
      </Button>
    </form>
  );
};
