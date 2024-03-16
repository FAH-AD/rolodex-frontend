import React from "react";

// Redux
import { useReduxSelector } from "@app/hook";
import { selectUser } from "@slices/authSlice";

// UI Components
import {
  Alert,
  Button,
  Grid,
  Group,
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

export const ListMyDailyTasksResult = () => {
  const user = useReduxSelector(selectUser);

  if (!user) {
    return <Alert color="red">Unexpected error (no user)</Alert>;
  }

  const handleCreateTask = () => {
    openModal({
      key: "createDailyTask",
      title: "Create Task",
      children: (
        <React.Suspense fallback={<LoadingOverlay visible />}>
          <CreateDailyTask userId={user.id} />
        </React.Suspense>
      ),
    });
  };

  return (
    <Grid mt="md" gutter="md">
      <Grid.Col>
        <Group position="apart">
          <Text
            sx={(theme) => ({
              color: theme.colorScheme === "dark" ? theme.white : theme.black,
            })}
          >
            {user.name}
          </Text>
          <Button variant="subtle" size="xs" onClick={handleCreateTask}>
            <IconPlus />
          </Button>
        </Group>
        <DailyTaskCollapsible user={user} />
      </Grid.Col>
    </Grid>
  );
};
