import dayjs from "dayjs";

// Routing
import { Link } from "react-router-dom";

// UI Components
import { Card, Group, Text, SimpleGrid, Badge } from "@mantine/core";

// Icons
import { IconClock } from "@tabler/icons";

// Components
import { ProjectTimeline } from "./ProjectTimeline";
import { Managers } from "./Managers";
import { Actions } from "./Actions";

// Hooks
import { useVerifyRole } from "@hooks/auth/useVerifyRole";

// Interfaces
import { Project } from "@interfaces/project";

// Props
type Props = {
  project: Project;
};

export const ProjectCard = ({ project }: Props) => {
  const { verifyRole } = useVerifyRole();

  const getProgressLabel = () => {
    if (project.progress === "submitted") return "New";
    return project.progress.charAt(0).toUpperCase() + project.progress.slice(1);
  };

  return (
    <Card withBorder style={{ width: "100%" }}>
      {project.progress === "submitted" && (
        <Group spacing="xs" mb="sm">
          <IconClock />
          <Text size="sm">
            {dayjs(project.progresses[0].createdAt).from(dayjs())}
          </Text>
        </Group>
      )}
      <SimpleGrid cols={2}>
        <div>
          <Text
            component={Link}
            to={`/dashboard/projects/${project.id}`}
            size="xl"
            weight="bold"
            sx={{
              lineBreak: "anywhere",
              "&:hover": {
                textDecoration: "underline",
              },
            }}
          >
            #ECOM{project.id} - {project.title}
          </Text>
          <Group spacing="xs" mt="md">
            {verifyRole("admin", "manager", "sales", "client") && (
              <Badge color="green">
                <Text>${project.budget || 0}</Text>
              </Badge>
            )}
            <Badge color="cyan">
              <Text>{project.deliveryInDays} day delivery</Text>
            </Badge>
          </Group>
        </div>
        <div>
          <ProjectTimeline project={project} />
          <Group spacing="xs" mt="md">
            <Text size="lg" weight="bold">
              Progress:
            </Text>
            <Badge variant="filled" color="violet">
              {getProgressLabel()}
            </Badge>
          </Group>
        </div>
      </SimpleGrid>
      <SimpleGrid mt="md" cols={2}>
        <Managers project={project} />
        <Actions projectId={project.id} progress={project.progress} />
      </SimpleGrid>
    </Card>
  );
};
