import { useEffect } from "react";

// UI Components
import { Paper, Stack } from "@mantine/core";

// Components
import { MessagesList } from "./MessagesList";
import { ComposeMessage } from "./ComposeMessage";

// Websocket
import { io } from "socket.io-client";

// Interfaces
import { Project } from "@interfaces/project";

// Socket connection
const socket = io(import.meta.env.VITE_WEBSOCKET_URL);

// Props
type Props = {
  project: Project;
};

export const MessagesTab = ({ project }: Props) => {
  useEffect(() => {
    socket.emit("joinProjectChat", project.id);

    return () => {
      socket.emit("leaveProjectChat", project.id);
      socket.removeAllListeners();
    };
  }, []);

  return (
    <Stack spacing={0}>
      <Paper
        withBorder
        radius={0}
        p="sm"
        style={{ height: 420, overflow: "auto", position: "relative" }}
      >
        <MessagesList project={project} socket={socket} />
      </Paper>
      <Paper withBorder p="sm" radius={0}>
        <ComposeMessage project={project} socket={socket} />
      </Paper>
    </Stack>
  );
};
