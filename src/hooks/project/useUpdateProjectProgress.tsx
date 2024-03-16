// Services
import { useUpdateProjectProgressMutation } from "@services/projectApi";

// Mantine
import { Text } from "@mantine/core";
import { openConfirmModal } from "@mantine/modals";

// Interfaces
import { ProjectProgressName } from "@interfaces/project";

// Props
type UseUpdateProjectStatusProps = {
  projectId: number;
};

const statusColors: { [key in ProjectProgressName]?: string } = {
  started: "green",
  follow_upped: "orange",
  archived: "red",
};

export const useUpdateProjectProgress = ({ projectId }: UseUpdateProjectStatusProps) => {
  const [mutateProjectProgress, { isLoading }] = useUpdateProjectProgressMutation();

  const updateProjectProgress = (
    newProgress: ProjectProgressName,
    oldProgress: ProjectProgressName,
    action: string
  ) => {
    openConfirmModal({
      title: (
        <Text>
          Are you sure you want to{" "}
          <Text
            weight={700}
            color={statusColors[newProgress] || "indigo"}
            style={{ display: "inline-block" }}
          >
            {action}
          </Text>{" "}
          this project?
        </Text>
      ),
      centered: true,
      labels: { confirm: "Yes", cancel: "No" },
      confirmProps: { loading: isLoading },
      cancelProps: { loading: isLoading },
      onConfirm: async () => {
        try {
          await mutateProjectProgress({
            id: projectId,
            progress: newProgress,
            oldProgress,
          }).unwrap();
        } catch {}
      },
    });
  };

  return { updateProjectProgress, isLoading };
};
