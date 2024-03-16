import { Suspense, lazy } from "react";

// Mantine
import { ActionIcon, Group, LoadingOverlay, Tooltip } from "@mantine/core";
import { openModal } from "@mantine/modals";

// Icons
import { IconPlus, IconWorldWww } from "@tabler/icons";

// Components
import GoogleDriveActionIcon from "@components/SocialIcons/GoogleDriveActionIcon";
import FigmaActionIcon from "@components/SocialIcons/FigmaActionIcon";

// Interfaces
import { Project } from "@interfaces/project";

// Lazy Components
const CreateLink = lazy(() => import("@components/Project/CreateLink"));

// Props
type Props = {
  project: Project;
};

const linkTypeToIcon = {
  googleDrive: <GoogleDriveActionIcon />,
  figma: <FigmaActionIcon />,
  other: (
    <ActionIcon size="xs" radius="xl" color="gray" variant="filled">
      <IconWorldWww />
    </ActionIcon>
  ),
};

export const ProjectLinks = ({ project }: Props) => {
  const handleCreateLink = () => {
    openModal({
      title: `Create Link for #${project.id}`,
      children: (
        <Suspense fallback={<LoadingOverlay visible />}>
          <CreateLink projectId={project.id} />
        </Suspense>
      ),
    });
  };

  return project.links.length ? (
    <Group spacing="xs">
      {project.links.map((link) => (
        <Tooltip key={link.id} label={link.name} position="bottom">
          <a href={link.url} target="_blank">
            {linkTypeToIcon[link.type]}
          </a>
        </Tooltip>
      ))}
      <ActionIcon
        size={12}
        radius="xl"
        color="violet"
        variant="filled"
        onClick={handleCreateLink}
      >
        <IconPlus />
      </ActionIcon>
    </Group>
  ) : (
    <ActionIcon
      size={12}
      radius="xl"
      color="violet"
      variant="filled"
      onClick={handleCreateLink}
    >
      <IconPlus />
    </ActionIcon>
  );
};
