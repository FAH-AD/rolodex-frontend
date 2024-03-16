import React from "react";

// Services
import { useUpdateDailyTaskMutation, useDeleteDailyTaskMutation } from "@services/dailyTaskApi";

// UI Components
import { Button, Group, Loader, LoadingOverlay } from "@mantine/core";

// UI Utils
import { openConfirmModal, openModal } from "@mantine/modals";

// Icons
import {
  IconCheck,
  IconEdit,
  IconPlayerPause,
  IconPlayerPlay,
  IconTrash,
  IconX,
} from "@tabler/icons";

// Interfaces
import { DailyTask, DailyTaskStatus } from "@interfaces/dailyTask";

// Lazy Components
const CreateDailyTask = React.lazy(() =>
  import("@components/DailyTask/CreateDailyTask").then((module) => ({
    default: module.CreateDailyTask,
  }))
);

// Props
type ActionsProps = {
  userId: number;
  task: DailyTask;
};

export const Actions: React.FC<ActionsProps> = ({ userId, task }) => {
  const [updateDailyTask, { isLoading: isUpdating }] = useUpdateDailyTaskMutation();
  const [deleteDailyTask, { isLoading: isDeleting }] = useDeleteDailyTaskMutation();

  const handleEdit = () => {
    openModal({
      key: "createDailyTask",
      title: "Edit Task",
      children: (
        <React.Suspense fallback={<LoadingOverlay visible />}>
          <CreateDailyTask userId={userId} task={task} />
        </React.Suspense>
      ),
    });
  };

  const handleUpdate = (status: DailyTaskStatus) => async () => {
    try {
      await updateDailyTask({
        id: task.id,
        userId,
        status,
      });
    } catch {}
  };

  const handleDelete = () => {
    openConfirmModal({
      title: "Are you sure you want to delete this task?",
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red", loading: isDeleting },
      onConfirm: async () => {
        try {
          await deleteDailyTask({ id: task.id, userId });
        } catch {}
      },
    });
  };

  if (isUpdating) {
    return <Loader size="sm" />;
  }

  return (
    <Group noWrap align="center" spacing={2}>
      <Button color="gray" variant="subtle" size="xs" p={4} onClick={handleEdit}>
        <IconEdit size={18} />
      </Button>
      {task.status === "pending" && (
        <Button variant="subtle" size="xs" p={4} onClick={handleUpdate("in_progress")}>
          <IconPlayerPlay size={18} />
        </Button>
      )}
      {task.status === "in_progress" && (
        <Button color="orange" variant="subtle" size="xs" p={4} onClick={handleUpdate("pending")}>
          <IconPlayerPause size={18} />
        </Button>
      )}
      {task.status === "in_progress" && (
        <Button color="green" variant="subtle" size="xs" p={4} onClick={handleUpdate("done")}>
          <IconCheck size={18} />
        </Button>
      )}
      {task.status === "done" && (
        <Button color="orange" variant="subtle" size="xs" p={4} onClick={handleUpdate("pending")}>
          <IconX size={18} />
        </Button>
      )}
      <Button color="red" variant="subtle" size="xs" p={4} onClick={handleDelete}>
        <IconTrash size={18} />
      </Button>
    </Group>
  );
};
