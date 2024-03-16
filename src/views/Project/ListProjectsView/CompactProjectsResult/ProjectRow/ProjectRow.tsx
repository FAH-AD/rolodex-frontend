import { Suspense, lazy, useMemo } from "react";

// Routing
import { Link } from "react-router-dom";

// Redux
import { useReduxSelector } from "@app/hook";
import { selectIsClient } from "@slices/authSlice";

// Mantine
import {
  ActionIcon,
  Anchor,
  Avatar,
  Badge,
  Group,
  LoadingOverlay,
  Text,
  Tooltip,
} from "@mantine/core";
import { openModal } from "@mantine/modals";

// Icons
import { IconPlus, IconBuildingStore } from "@tabler/icons";

// Components
import { StatusBadge } from "@components/Project/StatusBadge/StatusBadge";
import { ProjectLinks } from "@components/Project/ProjectLinks/ProjectLinks";
import { PriorityBadge } from "@components/Project/PriorityBadge/PriorityBadge";

// Date utils
import dayjs from "dayjs";

// Interfaces
import { Project } from "@interfaces/project";

// Lazy Components
const CreateProjectTask = lazy(() => import("@components/Project/CreateTask"));

// Props
type Props = {
  project: Project;
};

export const ProjectRow = ({ project }: Props) => {
  const isClient = useReduxSelector(selectIsClient);

  const handleCreateTask = () => {
    openModal({
      title: `Create Task for #${project.id}`,
      children: (
        <Suspense fallback={<LoadingOverlay visible />}>
          <CreateProjectTask projectId={project.id} />
        </Suspense>
      ),
    });
  };

  const getProgressLabel = () => {
    return project.progresses[project.progresses.length - 1].name.toUpperCase();
  };

  const projectProgress = useMemo(() => {
    const allTasks = project.tasks.length;
    const doneTasks = project.tasks.filter((t) => t.status === "done").length;
    const percentage = allTasks
      ? Number((doneTasks / allTasks) * 100).toFixed(0)
      : 100;

    return {
      percentage,
      count: `${doneTasks}/${allTasks}`,
    };
  }, [project.tasks]);

  return (
    <tr key={project.id}>
      <td>
        <Anchor component={Link} to={`/dashboard/projects/${project.id}`}>
          #{project.id}
        </Anchor>
      </td>
      <td>
        <Anchor component={Link} to={`/dashboard/projects/${project.id}`}>
          {project.title}
        </Anchor>
      </td>
      <td>
        {project.managers.length ? (
          <Group spacing="xs">
            {project.managers.map((manager) => (
              <Tooltip
                withArrow
                withinPortal
                color="dark"
                position="bottom"
                label={manager.user.name}
                key={manager.user.id}
              >
                <Avatar src={manager.user.image} radius="xl" size="md">
                  {`${
                    manager.user.name.charAt(0) + manager.user.name.charAt(1)
                  }`.toUpperCase()}
                </Avatar>
              </Tooltip>
            ))}
          </Group>
        ) : (
          <Text color="dimmed" size="sm">
            No managers found
          </Text>
        )}
      </td>
      <td>
        <Group spacing="sm">
          {projectProgress.count} Tasks
          <ActionIcon
            size="xs"
            radius="xl"
            color="violet"
            variant="light"
            onClick={handleCreateTask}
          >
            <IconPlus />
          </ActionIcon>
        </Group>
        <Text color="violet" weight="bold" size="xs">
          {projectProgress.percentage}% Completed
        </Text>
      </td>
      {!isClient && (
        <td>
          {project.estimatedHours ? `${project.estimatedHours} hrs` : "-"}
        </td>
      )}
      <td>
        {project.estimatedDeliveryDate ? (
          dayjs(project.estimatedDeliveryDate).from(dayjs())
        ) : (
          <Text color="dimmed" size="sm">
            Project is not started yet
          </Text>
        )}
      </td>
      {!isClient && (
        <td>
          <PriorityBadge project={project} />
        </td>
      )}
      <td>
        <Badge>{getProgressLabel()}</Badge>
      </td>
      {!isClient && (
        <td>
          <StatusBadge project={project} />
        </td>
      )}
      <td>{dayjs(project.updatedAt).from(dayjs())}</td>
      <td>
        {project.budget ? <Badge color="green">${project.budget}</Badge> : "-"}
      </td>
      <td>
        <ProjectLinks project={project} />
      </td>
    </tr>
  );
};
