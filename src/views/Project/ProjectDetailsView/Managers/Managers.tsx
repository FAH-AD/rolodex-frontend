import { lazy, Suspense } from "react";

// UI Components
import {
  Avatar,
  Button,
  Group,
  LoadingOverlay,
  Menu,
  Paper,
  Stack,
  Text,
  ThemeIcon,
  Tooltip,
} from "@mantine/core";

// UI Utils
import { openModal } from "@mantine/modals";

// Hooks
import { useVerifyRole } from "@hooks/auth/useVerifyRole";

// Icons
import {
  IconStar,
  IconDots,
  IconUserCircle,
  IconUserPlus,
} from "@tabler/icons";

// Interfaces
import { Project } from "@interfaces/project";

// Lazy Components
const ChangePrimaryManager = lazy(
  () => import("@components/Project/ChangePrimaryManager")
);
const AddTeamMember = lazy(() => import("@components/Project/AddTeamMember"));

// Props
type ManagersProps = {
  project: Project;
};

export const Managers: React.FC<ManagersProps> = ({ project }) => {
  const { verifyRole } = useVerifyRole();

  const handleChangePrimaryManager = () => {
    openModal({
      key: "changePrimaryManager",
      title: "Change Primary Manager",
      children: (
        <Suspense fallback={<LoadingOverlay visible />}>
          <ChangePrimaryManager projectId={project.id} />
        </Suspense>
      ),
    });
  };

  const handleAddTeamMember = () => {
    openModal({
      key: "addTeamMember",
      title: "Add Team Member",
      children: (
        <Suspense fallback={<LoadingOverlay visible />}>
          <AddTeamMember project={project} />
        </Suspense>
      ),
    });
  };

  return (
    <Paper p="md" shadow="xs" withBorder>
      <Group position="apart">
        <Text weight="bold">Team</Text>
        {verifyRole("admin") && (
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
              <Menu.Label>Team</Menu.Label>
              <Menu.Item
                onClick={handleChangePrimaryManager}
                icon={<IconUserCircle size={18} />}
              >
                Change primary manager
              </Menu.Item>
              <Menu.Item
                onClick={handleAddTeamMember}
                icon={<IconUserPlus size={18} />}
              >
                Add team member
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        )}
      </Group>
      <Stack mt="md" spacing="sm">
        {project.managers.map((manager, i) => (
          <Group spacing="xs" key={i}>
            <Avatar src={manager.user.image} color="violet" radius="xl">
              {`${
                manager.user.name.charAt(0) + manager.user.name.charAt(1)
              }`.toUpperCase()}
            </Avatar>
            <Text>{manager.user.name}</Text>
            {manager.isPrimary && (
              <Tooltip label="Primary manager" withArrow>
                <ThemeIcon color="violet" radius="xl" size="sm">
                  <IconStar size={14} />
                </ThemeIcon>
              </Tooltip>
            )}
          </Group>
        ))}
      </Stack>
    </Paper>
  );
};
