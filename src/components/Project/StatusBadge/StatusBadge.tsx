import { Suspense, lazy } from "react";

// Mantine
import { Badge, LoadingOverlay } from "@mantine/core";
import { openModal } from "@mantine/modals";

// Interfaces
import { Project } from "@interfaces/project";

// Props
type Props = {
  project: Project;
};

// Lazy Components
const ChangeProjectStatus = lazy(
  () => import("@components/Project/ChangeStatus")
);

export const StatusBadge = ({ project }: Props) => {
  const projectStatus = project.status;

  const handleChangeStatus = () => {
    openModal({
      title: `Change Status for #${project.id}`,
      children: (
        <Suspense fallback={<LoadingOverlay visible />}>
          <ChangeProjectStatus project={project} />
        </Suspense>
      ),
    });
  };

  if (!projectStatus) return <>-</>;

  return (
    <Badge
      onClick={handleChangeStatus}
      styles={(theme) => ({
        root: {
          backgroundColor: projectStatus.color,
          color: theme.fn.darken(
            projectStatus.color,
            projectStatus.color === theme.white ? 0.2 : 0.5
          ),
          "&:hover": {
            backgroundColor: theme.fn.lighten(projectStatus.color, 0.2),
            cursor: "pointer",
          },
        },
      })}
    >
      {projectStatus.name}
    </Badge>
  );
};
