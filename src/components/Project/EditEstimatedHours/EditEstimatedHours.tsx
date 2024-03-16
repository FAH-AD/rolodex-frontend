// Services
import { useUpdateProjectEstimatedHoursMutation } from "@services/projectApi";

// Mantine
import { Button, NumberInput } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { closeModal } from "@mantine/modals";

// Icons
import { IconCircleCheck } from "@tabler/icons";

// Validation
import { EditEstimatedHoursValues, editEstimatedHoursSchema } from "./editEstimatedHoursValidation";

// Interfaces
import { Project } from "@interfaces/project";

// Props
type Props = {
  project: Project;
};

export const EditEstimatedHours = ({ project }: Props) => {
  const [updateProjectEstimatedHours, { isLoading }] = useUpdateProjectEstimatedHoursMutation();

  const form = useForm<EditEstimatedHoursValues>({
    initialValues: {
      estimatedHours: project.estimatedHours,
    },
    validate: zodResolver(editEstimatedHoursSchema),
  });

  const handleSubmit = async (values: EditEstimatedHoursValues) => {
    try {
      await updateProjectEstimatedHours({
        id: project.id,
        estimatedHours: values.estimatedHours,
      }).unwrap();

      showNotification({
        title: "Success",
        message: "Estimated hours updated successfully",
        color: "green",
        icon: <IconCircleCheck />,
      });

      closeModal("editEstimatedHours");
    } catch (error) {}
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <NumberInput
        label="Estimated Hours"
        placeholder="Estimated hours for the project"
        {...form.getInputProps("estimatedHours")}
      />
      <Button type="submit" mt="lg" loading={isLoading}>
        Save
      </Button>
    </form>
  );
};
