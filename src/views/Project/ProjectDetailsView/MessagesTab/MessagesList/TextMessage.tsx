import dayjs from "dayjs";
import linkifyHtml from "linkify-html";

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

export const TextMessage = ({ message }: Props) => {
  const user = useReduxSelector(selectUser);

  return (
    <Stack spacing={2} align={message.userId === user?.id ? "flex-end" : "flex-start"}>
      <Text weight={700} size="md">
        {message.user.name}
      </Text>
      <Text
        px={10}
        py={5}
        dangerouslySetInnerHTML={{
          __html: linkifyHtml(message.message, {
            target: {
              url: "_blank",
            },
          }),
        }}
        sx={(theme) => ({
          backgroundColor:
            message.userId === user?.id ? theme.colors.blue[5] : theme.colors.gray[1],
          color: message.userId === user?.id ? theme.white : theme.colors.gray[9],
          borderRadius: theme.radius.md,
          width: "fit-content",
        })}
        align={message.userId === user?.id ? "right" : "left"}
      />
      <Text color="dimmed" size="sm">
        {dayjs(message.createdAt).format("hh:mm a")}
      </Text>
    </Stack>
  );
};
