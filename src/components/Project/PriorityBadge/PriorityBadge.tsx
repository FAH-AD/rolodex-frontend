import { Suspense, lazy } from "react";

// Mantine
import { LoadingOverlay, Text } from "@mantine/core";
import { upperFirst } from "@mantine/hooks";
import { openModal } from "@mantine/modals";

// Interfaces
import { Project, ProjectPriority } from "@interfaces/project";

// Props
type Props = {
  project: Project;
};

// Lazy Components
const ChangePriority = lazy(() => import("@components/Project/ChangePriority"));

const priorityColors: { [key in ProjectPriority]: string } = {
  low: "green",
  normal: "blue",
  high: "yellow",
  urgent: "red",
};

export const PriorityBadge = ({ project }: Props) => {
  const handleChangePriortiy = () => {
    openModal({
      title: `Change Priority for #${project.id}`,
      children: (
        <Suspense fallback={<LoadingOverlay visible />}>
          <ChangePriority project={project} />
        </Suspense>
      ),
    });
  };

  return (
    <Text
      color={priorityColors[project.priority]}
      onClick={handleChangePriortiy}
      sx={(theme) => ({
        cursor: "pointer",
        textAlign: "center",
        borderRadius: theme.radius.sm,
        "&:hover": {
          color: theme.colors[priorityColors[project.priority]][6],
          backgroundColor: theme.colors[priorityColors[project.priority]][0],
          border: `1px solid ${theme.colors[priorityColors[project.priority]][5]}`,
        },
      })}
    >
      {upperFirst(project.priority)}
    </Text>
  );
};
