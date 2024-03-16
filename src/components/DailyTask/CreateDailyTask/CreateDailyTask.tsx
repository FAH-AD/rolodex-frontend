import React from "react";
import dayjs from "dayjs";

// Services
import { useCreateDailyTaskMutation, useUpdateDailyTaskMutation } from "@services/dailyTaskApi";

// UI Components
import { Button, Input, TextInput } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { TextEditor } from "@ui/TextEditor";

// UI Utils
import { useForm, zodResolver } from "@mantine/form";
import { closeModal } from "@mantine/modals";

// Icons
import { IconCalendar, IconFileDescription } from "@tabler/icons";

// Validation
import { CreateDailyTaskInputs, initialValues } from "./validation/CreateDailyTaskInputs";
import { createDailyTaskSchema } from "./validation/createDailyTaskSchema";

// Interfaces
import { DailyTask } from "@interfaces/dailyTask";

// Props
type CreateDailyTaskProps = {
  userId: number;
  task?: DailyTask;
};

export const CreateDailyTask: React.FC<CreateDailyTaskProps> = ({ userId, task }) => {
  // Mutations
  const [createDailyTask, { isLoading: isCreatingTask }] = useCreateDailyTaskMutation();
  const [updateDailyTask, { isLoading: isUpdatingTask }] = useUpdateDailyTaskMutation();

  // Form
  const form = useForm<CreateDailyTaskInputs>({
    initialValues: task || initialValues,
    validate: zodResolver(createDailyTaskSchema),
  });

  const onCreateTaskSubmit = async (values: CreateDailyTaskInputs) => {
    try {
      if (task) {
        await updateDailyTask({
          id: task.id,
          userId,
          ...values,
        }).unwrap();
      } else {
        await createDailyTask({
          userId,
          ...values,
        }).unwrap();
      }
      closeModal("createDailyTask");
    } catch {}
  };

  return (
    <form onSubmit={form.onSubmit(onCreateTaskSubmit)}>
      <TextInput
        label="Name"
        placeholder="Task name"
        withAsterisk
        icon={<IconFileDescription size={18} />}
        {...form.getInputProps("name")}
      />
      <Input.Wrapper label="Description" mt="md">
        <TextEditor
          placeholder="Task description (optional)"
          {...form.getInputProps("description")}
        />
      </Input.Wrapper>
      <DatePicker
        label="Due date"
        placeholder="Task due date (optional)"
        mt="md"
        icon={<IconCalendar size={18} />}
        minDate={new Date()}
        {...form.getInputProps("dueDate")}
        value={form.values.dueDate ? dayjs(form.values.dueDate).toDate() : null}
        onChange={(date) => {
          if (date) {
            form.setFieldValue("dueDate", dayjs(date).toISOString());
          }
        }}
      />
      <Button type="submit" mt="lg" loading={isCreatingTask || isUpdatingTask}>
        {task ? "Update" : "Create"}
      </Button>
    </form>
  );
};
