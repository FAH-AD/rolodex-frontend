// Services
import { useCreateProjectTaskMutation } from "@services/projectTaskApi";

// UI Components
import { Button, Input, TextInput } from "@mantine/core";
import { TextEditor } from "@ui/TextEditor";

// UI Utils
import { closeModal } from "@mantine/modals";
import { useForm, zodResolver } from "@mantine/form";
import { showNotification } from "@mantine/notifications";

// Icons
import { IconCircleCheck } from "@tabler/icons";

// Validation
import {
  CreateTaskValues,
  createTaskSchema,
  initialValues,
} from "./createTaskValidation";

// Props
type Props = {
  projectId: number;
};

export const CreateTask = ({ projectId }: Props) => {
  const [createProjectTask, { isLoading }] = useCreateProjectTaskMutation();

  const form = useForm<CreateTaskValues>({
    initialValues,
    validate: zodResolver(createTaskSchema),
  });

  const handleSubmit = async (values: CreateTaskValues) => {
    try {
      await createProjectTask({
        projectId,
        ...values,
      }).unwrap();

      showNotification({
        title: "Success",
        message: "Project task created successfully",
        color: "green",
        icon: <IconCircleCheck />,
      });

      closeModal("createProjectTask");
    } catch {}
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <TextInput
        label="Title"
        placeholder="Task title"
        withAsterisk
        {...form.getInputProps("title")}
      />
      <Input.Wrapper
        label="Description"
        mt="md"
        error={form.errors.description}
      >
        <TextEditor
          placeholder="Task description"
          {...form.getInputProps("description")}
        />
      </Input.Wrapper>
      <Button mt="lg" type="submit" loading={isLoading}>
        Create
      </Button>
    </form>
  );
};
