// UI Components
import { Avatar, Group, Tooltip } from "@mantine/core";

// Interfaces
import { Project } from "@interfaces/project";

// Props
type Props = {
  project: Project;
};

export const Managers = ({ project }: Props) => {
  return (
    <Group mt="md" spacing="xs">
      {project.managers.map((manager, i) => (
        <Tooltip
          withArrow
          withinPortal
          color="dark"
          position="bottom"
          label={manager.user.name}
          key={i}
        >
          <Avatar src={manager.user.image} color="violet" radius="xl">
            {`${manager.user.name.charAt(0) + manager.user.name.charAt(1)}`.toUpperCase()}
          </Avatar>
        </Tooltip>
      ))}
    </Group>
  );
};
