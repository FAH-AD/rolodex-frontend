import { Suspense, lazy } from "react";

// Services
import {
  useUpdateProjectTaskMutation,
  useDeleteProjectTaskMutation,
} from "@services/projectTaskApi";

// UI Components
import { LoadingOverlay, Grid, Loader, Paper } from "@mantine/core";

// UI Utils
import { openConfirmModal, openModal } from "@mantine/modals";

// Icons
import { IconX, IconTrash, IconEdit } from "@tabler/icons";

import { FaRegCircleCheck } from "react-icons/fa6";
import { FiPlay } from "react-icons/fi";
import { TbPlayerPause } from "react-icons/tb";
// Interfaces
import { ProjectTask } from "@interfaces/project";

// Props
type Props = {
  task: ProjectTask;
  projectId: number;
};

// Lazy Component
const EditTask = lazy(() => import("@components/Project/EditTask"));

export const Actions = ({ task, projectId }: Props) => {
  const [updateProjectTask, { isLoading: isUpdating }] =
    useUpdateProjectTaskMutation();
  const [deleteProjectTask] = useDeleteProjectTaskMutation();

  // const handleShowInfo = () => {
  //   openModal({
  //     title: "Task Details",
  //     children: task.description ? (
  //       <div
  //         style={{ width: "100%", overflow: "scroll" }}
  //         dangerouslySetInnerHTML={{ __html: task.description }}
  //       />
  //     ) : (
  //       <Text color="dimmed">No Description</Text>
  //     ),
  //   });
  // };

  const handleStatusToggle = () => {
    updateProjectTask({
      id: task.id,
      projectId,
      status: task.status === "todo" ? "done" : "todo",
    });
  };

  const handleVisibilityToggle = () => {
    updateProjectTask({
      id: task.id,
      projectId,
      visibility: task.visibility === "visible" ? "hidden" : "visible",
    });
  };

  const handleEdit = () => {
    openModal({
      key: "editProjectTask",
      title: "Edit Project Task",
      children: (
        <Suspense fallback={<LoadingOverlay visible />}>
          <EditTask projectId={projectId} task={task} />
        </Suspense>
      ),
    });
  };

  const handleDelete = () => {
    openConfirmModal({
      title: "Delete Project Task",
      children: "Are you sure you want to delete this project task?",
      onConfirm: () => deleteProjectTask({ id: task.id, projectId }),
      labels: { cancel: "Cancel", confirm: "Delete" },
      confirmProps: { color: "red" },
    });
  };

  const iconStyles = {
    cursor: "pointer",
    marginLeft: "7px",
    color: "#5963C1",
  };

  return (
    <Grid>
      <Grid.Col mr="xl" style={{ display: "flex" }}>
        {task && (
          <>
            {/* <span onClick={handleShowInfo} style={iconStyles}>
              <IconInfoCircle size={18} />
            </span> */}
            <Paper onClick={handleEdit} style={iconStyles}>
              <IconEdit size={14} color="#B2B2B2" />
            </Paper>
            {task.visibility === "hidden" ? (
              <Paper onClick={handleVisibilityToggle} style={iconStyles}>
                {isUpdating ? <Loader size={14} /> : <FiPlay size={16} />}
              </Paper>
            ) : (
              <Paper onClick={handleVisibilityToggle} style={iconStyles}>
                {isUpdating ? (
                  <Loader size={14} />
                ) : (
                  <TbPlayerPause size={14} />
                )}
              </Paper>
            )}
            {task.status === "todo" ? (
              <Paper onClick={handleStatusToggle} style={iconStyles}>
                {isUpdating ? (
                  <Loader size={14} />
                ) : (
                  <FaRegCircleCheck size={14} color="green" />
                )}
              </Paper>
            ) : (
              <Paper onClick={handleStatusToggle} style={iconStyles}>
                {isUpdating ? (
                  <Loader size={14} />
                ) : (
                  <IconX size={14} color="red" />
                )}
              </Paper>
            )}
            <Paper onClick={handleDelete} style={iconStyles}>
              {isUpdating ? (
                <Loader size={14} />
              ) : (
                <IconTrash size={14} color="red" />
              )}
            </Paper>
          </>
        )}
      </Grid.Col>
    </Grid>
  );
};
