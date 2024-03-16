import React from "react";

// Services
import { useGetUsersByRoleQuery } from "@services/userApi";

// UI Components
import {
  Button,
  Grid,
  Group,
  Loader,
  LoadingOverlay,
  Text,
} from "@mantine/core";

// UI Utils
import { openModal } from "@mantine/modals";

// Icons
import { IconPlus } from "@tabler/icons";

// Components
import { DailyTaskCollapsible } from "@components/DailyTask/DailyTaskCollapsible";

// Lazy Components
const CreateDailyTask = React.lazy(() =>
  import("@components/DailyTask/CreateDailyTask").then((module) => ({
    default: module.CreateDailyTask,
  }))
);

export const ListAllUsersDailyTasksResult = () => {
  const { data: team, isLoading } = useGetUsersByRoleQuery([
    "admin",
    "manager",
    "sales",
    "developer",
  ]);

  const handleCreateTask = (userId: number) => () => {
    openModal({
      key: "createDailyTask",
      title: "Create Task",
      children: (
        <React.Suspense fallback={<LoadingOverlay visible />}>
          <CreateDailyTask userId={userId} />
        </React.Suspense>
      ),
    });
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Grid mt="md" gutter="md">
      {team?.users.map((user, i) => (
        <Grid.Col md={6} lg={4} key={i}>
          <Group position="apart">
            <Text
              sx={(theme) => ({
                color: theme.colorScheme === "dark" ? theme.white : theme.black,
              })}
            >
              {user.name}
            </Text>
            <Button
              variant="subtle"
              size="xs"
              onClick={handleCreateTask(user.id)}
            >
              <IconPlus />
            </Button>
          </Group>
          <DailyTaskCollapsible user={user} />
        </Grid.Col>
      ))}
    </Grid>
  );
};
