import dayjs from "dayjs";

// Mantine
import { Anchor, Avatar, Group, Paper, Stack, Text } from "@mantine/core";

// Components
import { Actions } from "./Actions";

// Hooks
import { useVerifyRole } from "@hooks/auth/useVerifyRole";

// Interfaces
import { Project } from "@interfaces/project";

// Props
type Props = {
  project: Project;
};

export const ClientInfo = ({ project }: Props) => {
  const { verifyRole } = useVerifyRole();

  let emailInfo = null;
  const now = new Date();
  const emailTime = project.client?.lastEmailTime;
  if (emailTime) {
    const emailTimeObj = new Date(emailTime);
    const timeDifference = now.getTime() - emailTimeObj.getTime();
    const hoursDifference = Math.floor(timeDifference / (1000 * 60 * 60));
    emailInfo = `Last Email Sent: ${hoursDifference} hours ago`;
  }
  else {
    emailInfo = `No Email sent yet`;
  }
  return (
    <Paper p="md" shadow="xs" withBorder>
      <Group position="apart">
        <Text weight="bold">Client Details</Text>
        {verifyRole("admin") && <Actions project={project} />}
      </Group>
      <Stack mt="md">
        <Group spacing="xs">
          <Avatar src="" radius="xl">
            {`${project.client.name.charAt(0) + project.client.name.charAt(1)}`.toUpperCase()}
          </Avatar>
          <Text size="sm">{project.client.name}</Text>
        </Group>
        <div>
          <Text size="sm">{project.client.email}</Text>
          {project.client.stores.length ? (
            <Anchor size="sm" component="a" target="_blank" href={project.client.stores[0].url}>
              {project.client.stores[0].url}
            </Anchor>
          ) : (
            <Text size="sm" color="dimmed">
              Client has not added any stores yet
            </Text>
          )}
          {project.client.lastOnline ? (
            <Text size="sm">
              Last online: {dayjs(project.client.lastOnline).format("DD MMM YYYY, hh:mm a")}
            </Text>
          ) : (
            <Text size="sm" color="dimmed">
              Client has not logged in yet
            </Text>
          )}
          <Text size="sm" color="dimmed">{emailInfo}</Text>
        </div>
      </Stack>
    </Paper>
  );
};
