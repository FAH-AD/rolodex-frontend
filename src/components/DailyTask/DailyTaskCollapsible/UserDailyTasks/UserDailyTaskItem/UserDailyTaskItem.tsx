// UI Components
import { Badge, Group, Text } from "@mantine/core";

// Components
import { Actions } from "./Actions";

// Interfaces
import { DailyTask } from "@interfaces/dailyTask";

// Props
type UserDailyTaskItemProps = {
  userId: number;
  task: DailyTask;
};

export const UserDailyTaskItem: React.FC<UserDailyTaskItemProps> = ({ userId, task }) => {
  const getBadgeColor = () => {
    if (task.status === "done") {
      return "green";
    } else if (task.status === "in_progress") {
      return "yellow";
    } else {
      return "gray";
    }
  };

  return (
    <Group noWrap position="apart">
      <Group spacing="xs">
        <Badge variant="filled" size="xs" px={7} py={0} color={getBadgeColor()} />
        <Text
          style={{
            wordBreak: "break-all",
            textDecoration: task.status === "done" ? "line-through" : "none",
          }}
        >
          {task.name}
        </Text>
      </Group>
      <Actions userId={userId} task={task} />
    </Group>
  );
};
