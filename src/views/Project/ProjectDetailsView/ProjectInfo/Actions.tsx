import { Suspense, lazy } from "react";

// UI Components
import { Button, LoadingOverlay, Menu } from "@mantine/core";

// UI Utils
import { openModal } from "@mantine/modals";

// Hooks
import { useUpdateProjectProgress } from "@hooks/project/useUpdateProjectProgress";

// Icons
import {
  IconDots,
  IconEdit,
  IconCheck,
  IconPlayerPlay,
  IconArchive,
  IconEye,
  IconCalendarPlus,
} from "@tabler/icons";

// Interfaces
import { Project, ProjectProgressName } from "@interfaces/project";

// Lazy Imports
const ExtendDelivery = lazy(() => import("@components/Project/ExtendDelivery"));
const EditEstimatedHours = lazy(() => import("@components/Project/EditEstimatedHours"));

// Props
type Props = {
  project: Project;
};

export const Actions = ({ project }: Props) => {
  const { updateProjectProgress } = useUpdateProjectProgress({ projectId: project.id });

  const handleUpdateProjectProgress = (progress: ProjectProgressName, action: string) => () => {
    updateProjectProgress(progress, project.progress, action);
  };

  const handleExtendDelivery = () => {
    openModal({
      key: "extendProjectDelivery",
      title: "Extend Delivery",
      children: (
        <Suspense fallback={<LoadingOverlay visible />}>
          <ExtendDelivery projectId={project.id} {...project} />
        </Suspense>
      ),
    });
  };

  const handleEditEstimatedHours = () => {
    openModal({
      key: "editEstimatedHours",
      title: "Update Estimated Hours",
      children: (
        <Suspense fallback={<LoadingOverlay visible />}>
          <EditEstimatedHours project={project} />
        </Suspense>
      ),
    });
  };

  return (
    <Menu
      position="bottom-end"
      withArrow
      styles={{
        item: {
          fontSize: 14,
        },
      }}
    >
      <Menu.Target>
        <Button size="xs" variant="subtle">
          <IconDots />
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item icon={<IconEdit size={18} />} onClick={handleEditEstimatedHours}>
          Edit estimated hours
        </Menu.Item>
        <Menu.Divider />
        <Menu.Label>Project</Menu.Label>
        {project.progress === "submitted" && (
          <>
            <Menu.Item
              onClick={handleUpdateProjectProgress("started", "start")}
              icon={<IconPlayerPlay size={18} />}
              color="green"
            >
              Start
            </Menu.Item>
            <Menu.Item
              onClick={handleUpdateProjectProgress("follow_upped", "follow up")}
              icon={<IconEye size={18} />}
              color="orange"
            >
              Follow Up
            </Menu.Item>
            <Menu.Item
              onClick={handleUpdateProjectProgress("archived", "archive")}
              icon={<IconArchive size={18} />}
              color="red"
            >
              Archive
            </Menu.Item>
          </>
        )}
        {project.progress === "started" && (
          <>
            <Menu.Item
              onClick={handleUpdateProjectProgress("delivered", "deliver")}
              icon={<IconCheck size={18} />}
              color="green"
            >
              Deliver
            </Menu.Item>
            <Menu.Item
              icon={<IconCalendarPlus size={18} />}
              color="red"
              onClick={handleExtendDelivery}
            >
              Extend delivery
            </Menu.Item>
          </>
        )}
      </Menu.Dropdown>
    </Menu>
  );
};
