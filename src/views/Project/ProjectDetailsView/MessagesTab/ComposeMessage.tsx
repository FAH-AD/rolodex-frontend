import { FormEvent, useRef, useState } from "react";
import type {} from "redux-thunk/extend-redux";

// Redux
import { useReduxDispatch, useReduxSelector } from "@app/hook";
import { selectUser } from "@slices/authSlice";

// Services
import { projectMessageApi } from "@services/projectMessageApi";

// UI Components
import { ActionIcon, Button, Group, Indicator, Text, Textarea, Flex } from "@mantine/core";

// Hooks
import { useVerifyRole } from "@hooks/auth/useVerifyRole";
import useUploadFileToS3 from "@hooks/aws/useUploadFileToS3";

// Icons
import { IconSend, IconTrash } from "@tabler/icons";

// Components
import { AttachmentButton } from "./AttachmentButton";

// Websocket
import { Socket } from "socket.io-client";

// Interfaces
import { Project } from "@interfaces/project";

// Props
type ComposeMessageProps = {
  project: Project;
  socket: Socket;
};

export const ComposeMessage = ({ project, socket }: ComposeMessageProps) => {
  const dispatch = useReduxDispatch();

  // State
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const resetRef = useRef<() => void>(null);

  // Hooks
  const { verifyRole } = useVerifyRole();
  const { uploadFileToS3, isLoading: isUploadingFile } = useUploadFileToS3();

  // Redux
  const user = useReduxSelector(selectUser);

  // Handlers
  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();

    try {
      if ((!message && !file) || !user) return;

      if (message) {
        socket.emit("sendProjectChatMessage", {
          userId: user.id,
          projectId: project.id,
          projectTitle: project.title,
          message: message.replaceAll("\n", "<br>"),
          user,
          type: "text",
        });
        setMessage("");
      }

      if (file) {
        const uploadFileResult = await uploadFileToS3(file, file.type, {
          maxSize: 10 * 1024 * 1024,
        });

        if (uploadFileResult) {
          socket.emit("sendProjectChatMessage", {
            userId: user.id,
            projectId: project.id,
            projectTitle: project.title,
            message: uploadFileResult.s3URL,
            user,
            type: "attachement",
          });
        }

        clearFile();
      }

      dispatch(
        projectMessageApi.util.updateQueryData("getProjectMessages", project.id, (prevData) => {
          prevData.messages.push({
            id: prevData.messages.length + 1,
            projectId: project.id,
            userId: user.id,
            type: file ? "attachement" : "text",
            message: message.replaceAll("\n", "<br>"),
            user,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        })
      );
    } catch {}
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLFormElement>) => {
    const items = event.clipboardData?.items;
    if (!items) return;

    for (const item of items) {
      if (item.type.indexOf("image") !== -1) {
        const file = item.getAsFile();
        if (file) {
          setFile(file);
          event.preventDefault();
          return;
        }
      }
    }
  };

  const clearFile = () => {
    setFile(null);
    resetRef.current?.();
  };

  return (
    <form onSubmit={handleSendMessage} onPaste={handlePaste}>
      <Flex align="center" justify="space-between" gap="sm">
        {verifyRole("admin", "manager", "sales") && !project.offer ? (
          <Indicator processing offset={5}>
            <AttachmentButton
              project={project}
              socket={socket}
              setFile={setFile}
              fileResetRef={resetRef}
              showSendOffer
            />
          </Indicator>
        ) : (
          <AttachmentButton
            project={project}
            socket={socket}
            setFile={setFile}
            fileResetRef={resetRef}
            showSendOffer
          />
        )}
        <Textarea
          placeholder="Your message goes here..."
          size="md"
          radius="md"
          style={{ flexGrow: 1, resize: "none" }}
          value={message}
          onChange={(e) => setMessage(e.currentTarget.value)}
          onKeyDown={(e) => {
            // if it is a shift + enter key press then don't submit the form and add a new line
            if (e.key === "Enter" && e.shiftKey) {
              e.preventDefault();
              setMessage((prev) => prev + "\n");
              return;
            } else if (e.key === "Enter") {
              e.preventDefault();
              handleSendMessage(e);
            }
          }}
        />
        <Button
          disabled={!message && !file}
          radius={27}
          style={{ flex: "none", height: 54 }}
          loading={isUploadingFile}
          type="submit"
        >
          <IconSend size={20} />
        </Button>
      </Flex>
      {file && (
        <Group align="end">
          <Text size="sm" mt="xs">
            Picked file: {file.name}
          </Text>
          <ActionIcon size="sm" color="red">
            <IconTrash onClick={clearFile} />
          </ActionIcon>
        </Group>
      )}
    </form>
  );
};
