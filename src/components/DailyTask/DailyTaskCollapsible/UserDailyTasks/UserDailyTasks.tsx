import React from "react";

// Services
import { useGetDailyTasksByUserIdQuery } from "@services/dailyTaskApi";

// Redux
import { useReduxSelector } from "@app/hook";
import { selectStartDate, selectEndDate } from "@slices/dailyTaskSlice";

// UI Components
import { Divider, LoadingOverlay, Paper, Text } from "@mantine/core";

// Components
import { UserDailyTaskItem } from "./UserDailyTaskItem";

// Interfaces
import { User } from "@interfaces/auth";

// Props
type UserDailyTasksProps = {
  user: User;
};

export const UserDailyTasks: React.FC<UserDailyTasksProps> = ({ user }) => {
  const startDate = useReduxSelector(selectStartDate);
  const endDate = useReduxSelector(selectEndDate);

  const {
    data: dailyTasks,
    isLoading,
    isFetching,
  } = useGetDailyTasksByUserIdQuery({
    userId: user.id,
    startDate,
    endDate,
  });

  return (
    <Paper withBorder p="sm" style={{ position: "relative" }}>
      <LoadingOverlay visible={isLoading || isFetching} />
      {dailyTasks?.length === 0 && (
        <Text color="dimmed" size="sm">
          No tasks found for this user
        </Text>
      )}
      {dailyTasks?.map((task, i) => (
        <React.Fragment key={i}>
          <UserDailyTaskItem userId={user.id} task={task} />
          {i !== dailyTasks.length - 1 && <Divider my="sm" />}
        </React.Fragment>
      ))}
    </Paper>
  );
};
