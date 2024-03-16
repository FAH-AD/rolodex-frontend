import dayjs from "dayjs";

// Redux
import { useReduxSelector } from "@app/hook";
import { selectIsClient } from "@slices/authSlice";

// UI Components
import { Badge, Group, Paper, Stack, Text } from "@mantine/core";

// Components
import { Actions } from "./Actions";
import { StatusBadge } from "@components/Project/StatusBadge/StatusBadge";
import { ProjectLinks } from "@components/Project/ProjectLinks/ProjectLinks";

// Hooks
import { useVerifyRole } from "@hooks/auth/useVerifyRole";

// Interfaces
import { Project } from "@interfaces/project";

// Props
type Props = {
  project: Project;
};

export const ProjectInfo = ({ project }: Props) => {
  const { verifyRole } = useVerifyRole();
  const isClient = useReduxSelector(selectIsClient);

  const getProgressLabel = () => {
    if (project.progress === "submitted") return "New";
    return project.progresses[project.progresses.length - 1].name.toUpperCase();
  };

  return (
    <Paper p="md" shadow="xs" withBorder>
      <Group mb="md" position="apart">
        <Text weight="bold">Project Details</Text>
        {verifyRole("admin") && <Actions project={project} />}
      </Group>
      <Group spacing={4} mt="md">
        {verifyRole("admin", "manager", "sales", "client") && (
          <Badge color="green">
            <Text>${project.budget || 0}</Text>
          </Badge>
        )}
        <Badge color="blue" ml="md">
          <Text>{project.deliveryInDays} day delivery</Text>
        </Badge>
      </Group>
      <Stack spacing={0} mt="md">
        {project.progresses.map((progress, i) => (
          <Group spacing="xs" key={i}>
            <Text size="sm" weight={700}>
              {progress.name}:
            </Text>
            <Text size="sm">{dayjs(progress.createdAt).format("MMM DD YYYY, hh:mm a")}</Text>
          </Group>
        ))}
      </Stack>
      <Group spacing="sm" mt="md">
        <Text>Progress:</Text>
        <Badge color="violet" variant="filled">
          {getProgressLabel()}
        </Badge>
      </Group>
      {!isClient && (
        <Group spacing="sm" mt="xs">
          <Text>Status:</Text>
          <StatusBadge project={project} />
        </Group>
      )}
      <Group spacing="sm" mt="xs">
        <Text>Links:</Text>
        <ProjectLinks project={project} />
      </Group>
    </Paper>
  );
};
