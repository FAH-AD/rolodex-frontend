// Services
import { useUpdateProjectTaskMutation } from "@services/projectTaskApi";

// Mantine
import { Button, Input, TextInput } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { closeModal } from "@mantine/modals";

// UI Components
import { TextEditor } from "@ui/TextEditor";

// Icons
import { IconCircleCheck } from "@tabler/icons";

// Validation
import { EditTaskValues, editTaskSchema } from "./editTaskValidation";

// Interfaces
import { ProjectTask } from "@interfaces/project";

// Props
type Props = {
  projectId: number;
  task: ProjectTask;
};

export const EditTask = ({ projectId, task }: Props) => {
  const [updateProjectTask, { isLoading }] = useUpdateProjectTaskMutation();

  const form = useForm<EditTaskValues>({
    initialValues: task,
    validate: zodResolver(editTaskSchema),
  });

  const handleSubmit = async (values: EditTaskValues) => {
    try {
      await updateProjectTask({
        projectId,
        id: task.id,
        ...values,
      }).unwrap();

      showNotification({
        title: "Success",
        message: "Project task updated successfully",
        color: "teal",
        icon: <IconCircleCheck />,
      });

      closeModal("editProjectTask");
    } catch {}
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <TextInput
        label="Title"
        placeholder="Enter task title"
        withAsterisk
        {...form.getInputProps("title")}
      />
      <Input.Wrapper label="Description" mt="md" error={form.errors.description}>
        <TextEditor placeholder="Task description" {...form.getInputProps("description")} />
      </Input.Wrapper>
      <Button mt="lg" type="submit" loading={isLoading}>
        Update
      </Button>
    </form>
  );
};
