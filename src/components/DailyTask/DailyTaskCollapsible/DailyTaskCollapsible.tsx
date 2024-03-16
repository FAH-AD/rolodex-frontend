// UI Components
import { Collapse, Group, Paper, Text } from "@mantine/core";

// UI Utils
import { useDisclosure } from "@mantine/hooks";

// Icons
import { IconChevronDown } from "@tabler/icons";

// Components
import { UserDailyTasks } from "./UserDailyTasks";

// Interfaces
import { User } from "@interfaces/auth";

// Props
type DailyTaskCollapsibleProps = {
  user: User;
};

export const DailyTaskCollapsible: React.FC<DailyTaskCollapsibleProps> = ({ user }) => {
  const [isCollapsibleOpen, collapsibleHandlers] = useDisclosure(false);

  return (
    <>
      <Paper
        withBorder
        p="sm"
        mt="sm"
        onClick={collapsibleHandlers.toggle}
        style={{ cursor: "pointer" }}
      >
        <Group position="apart">
          <Text size="sm">Click here to toggle the tasks of {user.name}</Text>
          <IconChevronDown
            style={{
              transform: isCollapsibleOpen ? "rotate(180deg)" : "rotate(0deg)",
              transition: "all .4s",
            }}
          />
        </Group>
      </Paper>
      <Collapse transitionDuration={400} mt={0} in={isCollapsibleOpen}>
        <UserDailyTasks user={user} />
      </Collapse>
    </>
  );
};
