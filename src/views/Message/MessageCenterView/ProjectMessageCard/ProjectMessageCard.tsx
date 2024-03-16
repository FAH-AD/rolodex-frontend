import dayjs from "dayjs";

// UI Components
import { Avatar, createStyles, Divider, Group, Stack, Text, UnstyledButton } from "@mantine/core";

// Types
import { Project } from "@interfaces/project";

// Styles
const useStyles = createStyles((theme) => ({
  projectCard: {
    width: "100%",
    "&:hover": {
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[0],
    },
  },
  activeProjectCard: {
    backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[0],
  },
}));

// Props
type Props = {
  project: Project;
  selectedProject: Project | null;
  setSelectedProject: (project: Project) => void;
};

export const ProjectMessageCard = ({ project, selectedProject, setSelectedProject }: Props) => {
  const { classes, cx } = useStyles();

  const primaryManager = project.managers.find((p) => p.isPrimary);
  const lastMessage = project.messages[0];

  return (
    <UnstyledButton
      className={cx(
        classes.projectCard,
        selectedProject?.id === project.id && classes.activeProjectCard
      )}
      onClick={() => setSelectedProject(project)}
    >
      <Group p="sm" noWrap>
        <Avatar radius="xl" src={primaryManager?.user.image}>
          {primaryManager
            ? `${primaryManager.user.name.charAt(0).toUpperCase()}${primaryManager.user.name
                .charAt(1)
                .toUpperCase()}`
            : "??"}
        </Avatar>
        <Stack spacing={4}>
          <Text weight={700} lineClamp={1} style={{ wordBreak: "break-all" }}>
            {project.title}
          </Text>
          <Text lineClamp={2} size="xs" color="dimmed" style={{ wordBreak: "break-all" }}>
            {lastMessage?.message || "No messages"}
          </Text>
          <Text size="xs" color="dimmed">
            {lastMessage && dayjs(lastMessage.createdAt).format("HH:mm a")}
          </Text>
        </Stack>
      </Group>
      <Divider />
    </UnstyledButton>
  );
};
