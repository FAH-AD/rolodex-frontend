import { createRef, useEffect, useState } from "react";
import dayjs from "dayjs";

// Services
import { useGetProjectMessagesQuery } from "@services/projectMessageApi";

// UI Components
import { Group, LoadingOverlay, Stack, Text } from "@mantine/core";

// Icons
import { IconShieldLock } from "@tabler/icons";

// Components
import { TextMessage } from "./TextMessage";
import { OfferMessage } from "./OfferMessage";
import { AttachementMessage } from "./AttachementMessage";

// Interfaces
import { Socket } from "socket.io-client";
import { Project, ProjectMessage } from "@interfaces/project";

// Props
type Props = {
  project: Project;
  socket: Socket;
};

export const MessagesList = ({ project, socket }: Props) => {
  // Queries
  const { chatMessages, isLoading, isFetching } = useGetProjectMessagesQuery(project.id, {
    selectFromResult: ({ data, ...rest }) => ({
      chatMessages: data?.messages || [],
      ...rest,
    }),
  });

  // State
  const bottomMessageRef = createRef<HTMLDivElement>();
  const [messages, setMessages] = useState<ProjectMessage[]>([]);

  useEffect(() => {
    socket.on("projectChatMessage", (newMessage: ProjectMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });
  }, []);

  useEffect(() => {
    if (bottomMessageRef.current) {
      bottomMessageRef.current.scrollIntoView();
    }
  }, [bottomMessageRef]);

  useEffect(() => {
    if (chatMessages) {
      setMessages(chatMessages);
    }
  }, [chatMessages.length]);

  return (
    <Stack style={{ position: "relative", height: "100%" }}>
      <LoadingOverlay visible={isLoading || isFetching} />
      <Group position="center" spacing="xs">
        <Text color="dimmed" size="sm">
          Messages in this chat are private and secure
        </Text>
        <IconShieldLock size={18} />
      </Group>
      {messages.map((message, i) => {
        const hasTenMinutesPassed =
          dayjs(message.createdAt).diff(messages[i - 1]?.createdAt, "minute") >= 10;

        return (
          <div key={i}>
            {hasTenMinutesPassed || i === 0 ? (
              <Text color="dimmed" size="sm" align="center">
                {dayjs(message.createdAt).format("DD MMM YYYY - hh:mm a")}
              </Text>
            ) : null}
            {message.type === "text" && <TextMessage message={message} />}
            {message.type === "offer" && <OfferMessage message={message} project={project} />}
            {message.type === "attachement" && <AttachementMessage message={message} />}
          </div>
        );
      })}
      <div ref={bottomMessageRef} />
    </Stack>
  );
};
