import dayjs from "dayjs";

// Redux
import { useReduxSelector } from "@app/hook";
import { selectUser } from "@slices/authSlice";

// UI Components
import { Stack, Text } from "@mantine/core";

// Interfaces
import { ProjectMessage } from "@interfaces/project";

// Props
type Props = {
  message: ProjectMessage;
};

export const AttachementMessage = ({ message }: Props) => {
  const user = useReduxSelector(selectUser);

  return (
    <Stack spacing={2} align={message.userId === user?.id ? "flex-end" : "flex-start"}>
      <Text weight={700} size="md">
        {message.user.name}
      </Text>
      <a href={message.message} target="_blank" rel="noopener noreferrer">
        <img
          src={message.message}
          alt="Attachment"
          style={{
            maxWidth: "500px",
            width: "100%",
            borderRadius: "8px",
            display: "block",
          }}
        />
      </a>
      <Text color="dimmed" size="sm">
        {dayjs(message.createdAt).format("hh:mm a")}
      </Text>
    </Stack>
  );
};
