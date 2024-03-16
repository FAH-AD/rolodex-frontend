import dayjs from "dayjs";

// UI Components
import { Text, Group } from "@mantine/core";

// Interfaces
import { Project } from "@interfaces/project";

// Props
type Props = {
  project: Project;
};

export const ProjectTimeline = ({ project }: Props) => {
  return (
    <>
      {project.progresses.map((progress, i) => (
        <Group spacing="xs" key={i}>
          <Text size="sm" weight={700}>
            {progress.name}:
          </Text>
          <Text size="sm">{dayjs(progress.createdAt).format("MMM DD YYYY, hh:mm a")}</Text>
        </Group>
      ))}
      {project.progress === "started" && (
        <Group
          spacing="xs"
          style={{
            color:
              dayjs(project.estimatedDeliveryDate).diff(dayjs(), "day") <= 1 ? "red" : undefined,
          }}
        >
          <Text size="sm" weight={700}>
            Estimated Delivery:
          </Text>
          <Text size="sm">{dayjs(project.estimatedDeliveryDate).from(dayjs())}</Text>
        </Group>
      )}
    </>
  );
};
